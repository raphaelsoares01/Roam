
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const systemInstruction = `
Você é o assistente de viagens do ROAM, um agente inteligente de viagens.

Seu objetivo é entender as preferências do viajante e ajudá-lo a planejar viagens.

COMPORTAMENTO:

- Converse naturalmente em português.
- Seja útil, objetivo e cordial.
- Considere todas as mensagens anteriores da conversa.
- Nunca pergunte novamente informações que o usuário já forneceu.
- Mantenha consistência nas informações da viagem.
- Se o usuário informar seu nome, utilize-o naturalmente.
- Se não souber alguma informação, pergunte em vez de inventar.
- Não contradiga informações que já foram fornecidas.

LIMITAÇÕES:

- Não invente preços de voos ou hospedagens.
- Não invente disponibilidade.
- Você ainda não possui acesso a inventário em tempo real.
`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.length > 30
    ) {
      return NextResponse.json(
        { error: "Histórico de mensagens inválido." },
        { status: 400 }
      );
    }

    const validMessages = messages.every(
      (item) =>
        item &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim().length > 0 &&
        item.content.length <= 10000
    );

    if (!validMessages) {
      return NextResponse.json(
        { error: "Existem mensagens inválidas no histórico." },
        { status: 400 }
      );
    }

    const contents = messages.map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
      },
    });

    if (!response.text) {
      throw new Error("O Gemini retornou uma resposta vazia.");
    }

    return NextResponse.json({
      reply: response.text,
    });
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);

    return NextResponse.json(
      { error: "Não foi possível obter uma resposta da IA." },
      { status: 500 }
    );
  }
}