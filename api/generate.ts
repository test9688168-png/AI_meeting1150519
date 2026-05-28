import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTIONS = `你是一位專業的會議記錄助理。請根據使用者提供的會議逐字稿，整理出結構化的會議紀錄。
請務必遵守以下輸出格式要求：

1. **會議主題與時間**：擷取會議的主題與時間。
2. **與會者**：列出參與會議的人員。
3. **會議重點總結**：用 3 到 5 個重點總結會議內容。
4. **Action Items (待辦事項)**：明確列出接下來的待辦事項與負責人。
5. **英文翻譯版**：將上述 1~4 點的內容完整翻譯成專業的英文。

請以 Markdown 格式輸出，所有繁體中文部分必須使用**繁體中文**回覆，不要包含任何額外的問候語或結語。`;

export default async function handler(req: any, res: any) {
  // Handle CORS and preflight requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transcript, provider } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    if (!provider) {
      return res.status(400).json({ error: "Provider is required" });
    }

    if (provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: transcript,
        config: {
          systemInstruction: SYSTEM_INSTRUCTIONS,
        },
      });

      return res.status(200).json({ result: response.text });
    } else if (provider === 'nvidia') {
      const apiKey = process.env.NVIDIA_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "NVIDIA_API_KEY is not configured on the server" });
      }

      const nvidiaResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-mini-4b-instruct",
          messages: [
            { role: "system", content: SYSTEM_INSTRUCTIONS },
            { role: "user", content: transcript }
          ]
        })
      });

      if (!nvidiaResponse.ok) {
        const errorText = await nvidiaResponse.text();
        throw new Error(`NVIDIA API responded with status ${nvidiaResponse.status}: ${errorText}`);
      }

      const data = await nvidiaResponse.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error("No text content returned from NVIDIA API");
      }

      return res.status(200).json({ result: text });
    } else {
      return res.status(400).json({ error: `Unsupported provider: ${provider}` });
    }
  } catch (error: any) {
    console.error("API generate error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
