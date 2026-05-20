import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import type { SmartAssistInput } from "../validators/lesson-plan.validator.js";

interface AIRecommendation {
  contents: string;
  relatedTopics: string[];
  tags: string[];
}

const SYSTEM_PROMPT = `Você é um Assistente Pedagógico especialista em planejamento de aulas.
Sua função é sugerir conteúdos complementares, tópicos relacionados e tags para planos de aula.

Responda SEMPRE em formato JSON válido com a seguinte estrutura:
{
  "contents": "Lista detalhada de conteúdos complementares sugeridos, separados por ponto e vírgula",
  "relatedTopics": ["tópico 1", "tópico 2", "tópico 3", "tópico 4", "tópico 5"],
  "tags": ["tag1", "tag2", "tag3"]
}

Regras:
- Sugira conteúdos que enriqueçam a aula e sejam pedagogicamente relevantes.
- Os tópicos relacionados devem expandir o tema central da aula.
- As tags devem ser curtas (1-2 palavras) e refletir os temas principais.
- Sempre retorne exatamente 3 tags.
- Responda SOMENTE com o JSON, sem texto adicional.`;

function buildUserPrompt(input: SmartAssistInput): string {
  return `Gere recomendações para o seguinte plano de aula:
- Título da Aula: ${input.title}
- Disciplina: ${input.discipline}
- Ementa/Resumo: ${input.summary}`;
}

async function callOpenAI(prompt: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.AI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0].message.content;
}

async function callGoogle(prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.AI_MODEL}:generateContent?key=${env.AI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Google AI API error (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as {
    candidates: { content: { parts: { text: string }[] } }[];
  };
  return data.candidates[0].content.parts[0].text;
}

async function callAnthropic(prompt: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.AI_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: env.AI_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as {
    content: { text: string }[];
  };
  return data.content[0].text;
}

export async function getAIRecommendations(
  input: SmartAssistInput
): Promise<AIRecommendation> {
  const userPrompt = buildUserPrompt(input);
  const startTime = Date.now();

  try {
    let rawResponse: string;
    switch (env.AI_PROVIDER) {
      case "google":
        rawResponse = await callGoogle(userPrompt);
        break;
      case "anthropic":
        rawResponse = await callAnthropic(userPrompt);
        break;
      default:
        rawResponse = await callOpenAI(userPrompt);
    }

    const latency = ((Date.now() - startTime) / 1000).toFixed(2);

    logger.info("AI Request completed", {
      title: input.title,
      discipline: input.discipline,
      provider: env.AI_PROVIDER,
      model: env.AI_MODEL,
      latency: `${latency}s`,
      responseLength: rawResponse.length,
    });

    const parsed = JSON.parse(rawResponse) as AIRecommendation;

    if (!parsed.contents || !parsed.relatedTopics || !parsed.tags) {
      throw new Error("AI response missing required fields");
    }

    return {
      contents: parsed.contents,
      relatedTopics: parsed.relatedTopics.slice(0, 5),
      tags: parsed.tags.slice(0, 3),
    };
  } catch (error) {
    const latency = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.error("AI Request failed", {
      title: input.title,
      discipline: input.discipline,
      provider: env.AI_PROVIDER,
      latency: `${latency}s`,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
}
