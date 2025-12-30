
import { GoogleGenAI } from "@google/genai";
import { HexagramData, DivinationResult } from '../types';

export const getGeminiInterpretation = async (
  question: string, 
  result: DivinationResult
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    作为一位精通《易经》的国学大师，请根据以下占卜结果，为用户解答疑惑。
    
    用户问题：${question}
    
    占卜结果：
    主卦：${result.originalHex.name}卦 (${result.originalHex.judgment})
    象曰：${result.originalHex.image}
    变爻：${result.changingLines.length > 0 ? `第${result.changingLines.join(',')}爻` : '无变爻'}
    ${result.changedHex ? `变卦：${result.changedHex.name}卦 (${result.changedHex.judgment})` : ''}
    
    请从以下几个维度进行深度解析：
    1. 卦象解析：当前所处局势的本质。
    2. 哲学指引：从易经智慧出发，给予行动建议。
    3. 针对性回答：直接回应用户的问题。
    
    要求：语言优美，包含古籍引用，同时浅显易懂。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });
    return response.text || "AI 暂时无法解析，请稍后再试。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "解析过程中发生错误，请检查网络或稍后重试。";
  }
};

export const getDailyInsight = async (): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = "请从《易经》六十四卦中随机选取一卦，为今日的学习生活提供一段50字左右的智慧语录。";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "自强不息，厚德载物。";
  } catch {
    return "天行健，君子以自强不息。";
  }
};
