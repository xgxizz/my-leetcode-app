
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getCodeReview = async (problemTitle: string, code: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        你是一个资深的算法面试官。
        题目是：${problemTitle}。
        这是用户写的代码：
        \`\`\`
        ${code}
        \`\`\`
        请提供以下内容的简短中文反馈：
        1. 代码的正确性分析。
        2. 时间和空间复杂度。
        3. 改进建议（如果有更优解）。
        
        请使用简洁的 Markdown 格式。
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "暂时无法获取 AI 反馈，请检查网络或 API Key。";
  }
};

export const getProblemHints = async (problemTitle: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        请为 LeetCode 题目 "${problemTitle}" 提供 3 条循序渐进的解题提示。
        第一条提示最基础，第三条提示最接近核心算法。
        请使用中文，Markdown 格式。
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "无法获取提示。";
  }
};

export const getSimilarProblems = async (problemTitle: string, tags: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        针对 LeetCode 题目 "${problemTitle}" (标签: ${tags.join(', ')})，推荐 3-4 道逻辑相似或考察点相近的 LeetCode 题目。
        请提供题目名称、难度（简单/中等/困难）以及一句话推荐理由。
        请使用中文，Markdown 列表格式。
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "无法获取类似题目。";
  }
};
