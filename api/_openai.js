// Minimal OpenAI API helper for serverless Vercel/Node
import fetch from "node-fetch";

export async function callOpenAI({
  prompt,
  apiKey,
  model = "gpt-4",
  temperature = 0.2,
}) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature,
      max_tokens: 16,
    }),
  });
  if (!res.ok) throw new Error("OpenAI API error");
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim();
}
