# 亮数据 ChatGPT Scraper 终端 Demo

这个项目是一个纯终端版演示程序，用来体验 Bright Data `ChatGPT Scraper API` 的基础调用流程。

## 这个 demo 做什么

- 在终端输入一个问题
- 程序按 Bright Data 官方文档的方式提交请求
- 如果配置了真实 `BRIGHT_DATA_API_KEY`，就调用真实接口
- 如果没有配置密钥，就进入练习模式，返回本地结构化样例数据

## 亮数据是怎么知道要抓 ChatGPT 的

关键不是本地启动 ChatGPT，也不是你自己开浏览器，而是你调用了 Bright Data 对应的数据集。

当前代码里这个配置决定抓取目标：

```env
BRIGHT_DATA_DATASET_ID=gd_m7aof0k82r803d5bjm
```

这个 `dataset_id` 对应的是 Bright Data 文档里的 `ChatGPT Search` 数据集。

代码位置：

- [`server.js`](/Users/luqingjiedemac/gitcode_obj/liangshuju/server.js)
- [`server.js`](/Users/luqingjiedemac/gitcode_obj/liangshuju/server.js):10

如果后续你要演示别的厂商，核心思路也是一样：切换到对应厂商的 scraper 数据集 ID，并按那个数据集的输入字段发请求。

## 请求方式

当前真实模式已经对齐 Bright Data 官方 `Send your first request` 文档，使用的是同步接口：

```http
POST /datasets/v3/scrape?dataset_id=gd_m7aof0k82r803d5bjm&format=json
```

请求体示例：

```json
[
  {
    "url": "https://chatgpt.com/",
    "prompt": "北京最值得推荐的连锁咖啡品牌有哪些？",
    "country": "us",
    "web_search": true
  }
]
```

如果同步请求超过 1 分钟，Bright Data 可能返回 `snapshot_id`，程序会自动继续查询并下载结果。

## 启动方式

1. 安装依赖

```bash
npm install
```

2. 可选：复制环境变量

```bash
cp .env.example .env
```

3. 启动终端 demo

```bash
npm start
```

也可以直接带问题启动：

```bash
npm start -- "北京最值得推荐的连锁咖啡品牌有哪些？"
```

## 环境变量

见 [`/.env.example`](/Users/luqingjiedemac/gitcode_obj/liangshuju/.env.example)

```env
BRIGHT_DATA_API_KEY=your_bright_data_api_key
BRIGHT_DATA_DATASET_ID=gd_m7aof0k82r803d5bjm
BRIGHT_DATA_DEFAULT_COUNTRY=us
BRIGHT_DATA_DEFAULT_WEB_SEARCH=true
```

## 说明

- 不需要在本地运行 ChatGPT
- 本地程序只是把请求发给 Bright Data 的 ChatGPT Scraper
- 真实返回结构通常包含 `answer_text`、`citations`、`search_sources`、`links_attached`、`recommendations` 等字段


# 完整教程

AI时代，小白也可以轻松合规获取大模型分析数据

https://blog.csdn.net/JHXL_/article/details/160404554
