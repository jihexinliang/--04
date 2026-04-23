const practiceCases = {
  saas: {
    url: "https://chatgpt.com/",
    prompt: "2026 年最适合中小企业使用的 AI 客服平台有哪些？",
    answer_text:
      "从部署速度、知识库训练能力、多渠道接入和自动化流程来看，适合中小企业的 AI 客服平台通常包括 Zendesk AI、Intercom 和 Freshworks。选择时建议重点评估知识库管理、工单协同、CRM 集成以及多语言支持。",
    answer_html:
      "<p>从部署速度、知识库训练能力、多渠道接入和自动化流程来看，适合中小企业的 AI 客服平台通常包括 Zendesk AI、Intercom 和 Freshworks。选择时建议重点评估知识库管理、工单协同、CRM 集成以及多语言支持。</p>",
    answer_text_markdown:
      "从部署速度、知识库训练能力、多渠道接入和自动化流程来看，适合中小企业的 AI 客服平台通常包括 **Zendesk AI**、**Intercom** 和 **Freshworks**。选择时建议重点评估知识库管理、工单协同、CRM 集成以及多语言支持。",
    model: "gpt-4o",
    country: "us",
    web_search_triggered: true,
    citations: [
      {
        title: "Zendesk AI customer service overview",
        url: "https://www.zendesk.com/service/ai/",
        position: 1
      },
      {
        title: "Intercom AI customer service",
        url: "https://www.intercom.com/ai",
        position: 2
      },
      {
        title: "Freshworks customer service software",
        url: "https://www.freshworks.com/customer-service-software/",
        position: 3
      }
    ],
    links_attached: [
      {
        title: "Zendesk AI",
        url: "https://www.zendesk.com/service/ai/"
      },
      {
        title: "Intercom AI",
        url: "https://www.intercom.com/ai"
      },
      {
        title: "Freshworks",
        url: "https://www.freshworks.com/customer-service-software/"
      }
    ],
    recommendations: [
      {
        title: "Zendesk AI",
        summary: "适合工单流程成熟、需要客服自动化的企业。"
      },
      {
        title: "Intercom",
        summary: "适合 SaaS 企业和对话式客户成功场景。"
      },
      {
        title: "Freshworks",
        summary: "适合预算敏感但希望快速上线的中小企业。"
      }
    ],
    search_sources: [
      {
        title: "Zendesk AI customer service overview",
        url: "https://www.zendesk.com/service/ai/"
      },
      {
        title: "Intercom AI customer service",
        url: "https://www.intercom.com/ai"
      }
    ],
    references: [],
    prompt_sent_at: new Date().toISOString()
  },
  coffee: {
    url: "https://chatgpt.com/",
    prompt: "北京最值得推荐的连锁咖啡品牌有哪些？",
    answer_text:
      "在北京的连锁咖啡推荐场景中，回答通常会综合品牌覆盖、价格带、门店体验和稳定性。较常出现的品牌包括星巴克、瑞幸咖啡和 Manner Coffee，不同品牌在空间体验、性价比和精品属性上各有侧重。",
    answer_html:
      "<p>在北京的连锁咖啡推荐场景中，回答通常会综合品牌覆盖、价格带、门店体验和稳定性。较常出现的品牌包括星巴克、瑞幸咖啡和 Manner Coffee，不同品牌在空间体验、性价比和精品属性上各有侧重。</p>",
    answer_text_markdown:
      "在北京的连锁咖啡推荐场景中，回答通常会综合品牌覆盖、价格带、门店体验和稳定性。较常出现的品牌包括 **星巴克**、**瑞幸咖啡** 和 **Manner Coffee**，不同品牌在空间体验、性价比和精品属性上各有侧重。",
    model: "gpt-4o",
    country: "cn",
    web_search_triggered: true,
    citations: [
      {
        title: "星巴克中国官网",
        url: "https://www.starbucks.com.cn/",
        position: 1
      },
      {
        title: "瑞幸咖啡官网",
        url: "https://www.luckincoffee.com/",
        position: 2
      },
      {
        title: "Manner Coffee 官网",
        url: "https://mannercoffee.com/",
        position: 3
      }
    ],
    links_attached: [
      {
        title: "星巴克中国",
        url: "https://www.starbucks.com.cn/"
      },
      {
        title: "瑞幸咖啡",
        url: "https://www.luckincoffee.com/"
      },
      {
        title: "Manner Coffee",
        url: "https://mannercoffee.com/"
      }
    ],
    recommendations: [
      {
        title: "星巴克",
        summary: "门店网络广，空间体验稳定，适合商务与社交场景。"
      },
      {
        title: "瑞幸咖啡",
        summary: "数字化能力强，价格带更灵活，适合高频消费。"
      },
      {
        title: "Manner Coffee",
        summary: "更强调精品咖啡和性价比，适合城市白领用户。"
      }
    ],
    search_sources: [
      {
        title: "星巴克中国官网",
        url: "https://www.starbucks.com.cn/"
      },
      {
        title: "瑞幸咖啡官网",
        url: "https://www.luckincoffee.com/"
      }
    ],
    references: [],
    prompt_sent_at: new Date().toISOString()
  },
  hotel: {
    url: "https://chatgpt.com/",
    prompt: "上海高端亲子酒店推荐，适合周末短住的有哪些？",
    answer_text:
      "在上海高端亲子酒店推荐场景中，回答一般会关注地理位置、家庭房型、儿童设施和周边休闲资源。较常被提及的酒店往往具备儿童乐园、泳池、亲子主题活动和较强的周末度假属性。",
    answer_html:
      "<p>在上海高端亲子酒店推荐场景中，回答一般会关注地理位置、家庭房型、儿童设施和周边休闲资源。较常被提及的酒店往往具备儿童乐园、泳池、亲子主题活动和较强的周末度假属性。</p>",
    answer_text_markdown:
      "在上海高端亲子酒店推荐场景中，回答一般会关注地理位置、家庭房型、儿童设施和周边休闲资源。较常被提及的酒店往往具备儿童乐园、泳池、亲子主题活动和较强的周末度假属性。",
    model: "gpt-4o",
    country: "cn",
    web_search_triggered: true,
    citations: [
      {
        title: "上海迪士尼度假区酒店",
        url: "https://www.shanghaidisneyresort.com/",
        position: 1
      },
      {
        title: "上海佘山世茂洲际酒店",
        url: "https://www.ihg.com/",
        position: 2
      },
      {
        title: "上海宝格丽酒店",
        url: "https://www.bulgarihotels.com/",
        position: 3
      }
    ],
    links_attached: [
      {
        title: "上海迪士尼度假区",
        url: "https://www.shanghaidisneyresort.com/"
      },
      {
        title: "IHG Hotels",
        url: "https://www.ihg.com/"
      },
      {
        title: "Bulgari Hotels",
        url: "https://www.bulgarihotels.com/"
      }
    ],
    recommendations: [
      {
        title: "上海迪士尼乐园酒店",
        summary: "适合偏主题体验和儿童娱乐需求的家庭。"
      },
      {
        title: "上海佘山世茂洲际酒店",
        summary: "适合周末短住和度假型亲子出行。"
      },
      {
        title: "上海宝格丽酒店",
        summary: "适合高端城市度假和精品家庭体验。"
      }
    ],
    search_sources: [
      {
        title: "上海迪士尼度假区酒店",
        url: "https://www.shanghaidisneyresort.com/"
      },
      {
        title: "上海佘山世茂洲际酒店",
        url: "https://www.ihg.com/"
      }
    ],
    references: [],
    prompt_sent_at: new Date().toISOString()
  }
};

export function buildPracticeResult(requestData) {
  const matchedCase = selectPracticeCase(requestData.prompt);
  const result = JSON.parse(JSON.stringify(matchedCase));
  result.prompt = requestData.prompt;
  result.country = requestData.country || result.country;
  result.prompt_sent_at = new Date().toISOString();
  result.web_search = requestData.web_search;
  result.web_search_triggered = requestData.web_search;
  result.require_sources = requestData.require_sources;

  if (requestData.additional_prompt) {
    result.additional_prompt = requestData.additional_prompt;
  }

  return {
    mode: "practice",
    snapshotId: null,
    result,
    raw: [result]
  };
}

function selectPracticeCase(prompt) {
  const text = String(prompt || "").toLowerCase();
  if (text.includes("咖啡")) {
    return practiceCases.coffee;
  }
  if (text.includes("酒店") || text.includes("亲子")) {
    return practiceCases.hotel;
  }
  return practiceCases.saas;
}
