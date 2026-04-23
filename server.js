import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { buildPracticeResult } from "./docfds/practice-data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

loadDotEnv(path.join(__dirname, ".env"));

const config = {
  apiKey: process.env.BRIGHT_DATA_API_KEY || "",
  datasetId: process.env.BRIGHT_DATA_DATASET_ID || "",
  defaultCountry: normalizeCountry(process.env.BRIGHT_DATA_DEFAULT_COUNTRY || "us"),
  defaultWebSearch: parseOptionalBoolean(process.env.BRIGHT_DATA_DEFAULT_WEB_SEARCH) ?? true,
  defaultRequireSources: parseOptionalBoolean(process.env.BRIGHT_DATA_REQUIRE_SOURCES)
};

export async function runCli() {
  const promptFromArgs = process.argv.slice(2).join(" ").trim();

  if (promptFromArgs) {
    await handlePrompt(promptFromArgs);
    return;
  }

  if (!process.stdin.isTTY) {
    const input = await readStdin();
    const commands = input
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    for (const command of commands) {
      if (isExitCommand(command)) {
        console.log("已退出。");
        return;
      }
      await handlePrompt(command);
    }
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    while (true) {
      const input = await rl.question("请输入问题（输入 exit 退出）\n> ");
      const prompt = input.trim();

      if (!prompt) {
        console.log("未输入内容，请重新输入。\n");
        continue;
      }

      if (isExitCommand(prompt)) {
        console.log("已退出。");
        break;
      }

      await handlePrompt(prompt);
    }
  } finally {
    rl.close();
  }
}

async function handlePrompt(prompt) {
  try {
    console.log("\n正在请求中...\n");
    await sleep(5000);
    const requestData = {
      prompt,
      country: config.defaultCountry,
      additional_prompt: "",
      geolocation: "",
      web_search: config.defaultWebSearch,
      require_sources: config.defaultRequireSources
    };
    const payload = config.apiKey
      ? await fetchBrightDataResult(requestData)
      : buildPracticeResult(requestData);
    printResult(payload);
  } catch (error) {
    console.error(`抓取失败：${error.message || "未知错误"}`);
  }
  console.log("");
}

function printResult(payload) {
  const result = payload.result || {};
  const sanitizedRaw = removeCountryField(payload.raw);
  const savedFilePath = saveJsonResult(sanitizedRaw);

  console.log(`模型：${result.model || "未知"}`);
  console.log(`联网搜索：${result.web_search_triggered ? "是" : "否"}`);

  console.log("\n回答内容：");
  console.log(result.answer_text || "暂无回答正文。");

  if (result.additional_answer_text) {
    console.log("\n补充回答：");
    console.log(result.additional_answer_text);
  }

  console.log("\n引用来源：");
  printLinks(result.citations, "来源");

  console.log("\n搜索来源：");
  printLinks(result.search_sources, "搜索来源");

  console.log("\n推荐结果：");
  printRecommendations(result.recommendations);

  console.log("\n附加链接：");
  printLinks(result.links_attached, "链接");

  console.log("\n参考对象：");
  printLinks(result.references, "参考");

  console.log("\n原始 JSON：");
  console.log(JSON.stringify(sanitizedRaw, null, 2));

  console.log(`\nJSON 文件已生成：${savedFilePath}`);
}

function printLinks(items, fallbackPrefix) {
  const list = Array.isArray(items) ? items : [];
  if (list.length === 0) {
    console.log(`暂无${fallbackPrefix}。`);
    return;
  }

  for (const [index, item] of list.entries()) {
    const label = item.position ? `来源 ${item.position}` : `${fallbackPrefix} ${index + 1}`;
    console.log(`${label}：${item.title || "未命名"}`);
    console.log(`${item.url || "无链接"}`);
  }
}

function printRecommendations(items) {
  const list = Array.isArray(items) ? items : [];
  if (list.length === 0) {
    console.log("暂无推荐结果。");
    return;
  }

  for (const item of list) {
    console.log(`${item.title || "未命名推荐"}：${item.summary || item.description || ""}`);
  }
}

async function fetchBrightDataResult(requestData) {
  const response = await fetch(
    `https://api.brightdata.com/datasets/v3/scrape?dataset_id=${encodeURIComponent(config.datasetId)}&format=json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify([
        {
          url: "https://chatgpt.com/",
          prompt: requestData.prompt,
          country: requestData.country,
          additional_prompt: requestData.additional_prompt,
          web_search: requestData.web_search,
          require_sources: requestData.require_sources
        }
      ])
    }
  );

  const text = await response.text();
  const data = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    throw new Error(`亮数据请求失败（${response.status}）：${extractErrorMessage(data) || text || "未知错误。"}`);
  }

  if (Array.isArray(data)) {
    return {
      mode: "live",
      snapshotId: null,
      result: data[0] || {},
      raw: data
    };
  }

  const snapshotId = data?.snapshot_id;
  if (snapshotId) {
    const snapshotData = await waitForSnapshot(snapshotId);

    return {
      mode: "live",
      snapshotId,
      result: Array.isArray(snapshotData) ? snapshotData[0] : snapshotData,
      raw: snapshotData
    };
  }

  throw new Error("亮数据返回内容既不是结果数组，也没有 snapshot_id。");
}

async function waitForSnapshot(snapshotId) {
  const deadline = Date.now() + 90_000;

  while (Date.now() < deadline) {
    const progressResponse = await fetch(
      `https://api.brightdata.com/datasets/v3/progress/${encodeURIComponent(snapshotId)}`,
      {
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        }
      }
    );

    const progressText = await progressResponse.text();
    const progressData = progressText ? safeJsonParse(progressText) : null;

    if (!progressResponse.ok) {
      throw new Error(
        `查询亮数据任务状态失败（${progressResponse.status}）：${extractErrorMessage(progressData) || progressText || "未知错误。"}`
      );
    }

    if (progressData?.status === "failed") {
      throw new Error(progressData.error_message || progressData.message || "亮数据任务失败。");
    }

    if (progressData?.status === "ready") {
      const snapshotResponse = await fetch(
        `https://api.brightdata.com/datasets/v3/snapshot/${encodeURIComponent(snapshotId)}?format=json`,
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      );

      const snapshotText = await snapshotResponse.text();
      const snapshotData = snapshotText ? safeJsonParse(snapshotText) : null;

      if (!snapshotResponse.ok) {
        throw new Error(
          `下载亮数据结果失败（${snapshotResponse.status}）：${extractErrorMessage(snapshotData) || snapshotText || "未知错误。"}`
        );
      }

      return snapshotData;
    }

    await sleep(3000);
  }

  throw new Error("等待亮数据结果超时。");
}

function loadDotEnv(filePath) {
  try {
    const file = readFileSync(filePath, "utf8");
    for (const rawLine of file.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#") || !line.includes("=")) {
        continue;
      }

      const [key, ...rest] = line.split("=");
      const value = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
      if (key.trim() && process.env[key.trim()] === undefined) {
        process.env[key.trim()] = value;
      }
    }
  } catch {
    return;
  }
}

function normalizeCountry(value) {
  const country = String(value || "").trim().toLowerCase();
  if (!country) {
    return "";
  }

  if (!/^[a-z]{2}$/.test(country)) {
    throw new Error("国家参数必须是 2 位字母代码，例如 us。");
  }

  return country;
}

function parseOptionalBoolean(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const normalized = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) {
    return true;
  }
  if (["false", "0", "no", "off"].includes(normalized)) {
    return false;
  }
  throw new Error(`无法识别布尔值：${value}`);
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractErrorMessage(data) {
  if (!data || typeof data !== "object") {
    return "";
  }
  return data.error || data.message || data.error_message || "";
}

function removeCountryField(value) {
  if (Array.isArray(value)) {
    return value.map((item) => removeCountryField(item));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const cloned = {};
  for (const [key, item] of Object.entries(value)) {
    if (key === "country") {
      continue;
    }
    cloned[key] = removeCountryField(item);
  }
  return cloned;
}

function saveJsonResult(data) {
  const outputDir = path.join(__dirname, "outputs");
  mkdirSync(outputDir, { recursive: true });

  const fileName = `answer-${formatFileTimestamp(new Date())}.json`;
  const filePath = path.join(outputDir, fileName);
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

  return filePath;
}

function formatFileTimestamp(date) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isExitCommand(prompt) {
  const value = String(prompt || "").trim().toLowerCase();
  return value === "exit" || value === "quit";
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let body = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      body += chunk;
    });
    process.stdin.on("end", () => {
      resolve(body);
    });
    process.stdin.on("error", reject);
  });
}

if (process.argv[1] === __filename) {
  await runCli();
}
