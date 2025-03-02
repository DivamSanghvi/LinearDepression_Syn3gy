import { generateText } from "ai";
import { NextResponse } from "next/server";
// import { processUserMessage } from "@/lib/langchain";
import { getPineconeClient } from "@/lib/pinecone-client";
import { createOpenAI } from "@ai-sdk/openai";
import OpenAI from "openai";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const openai = createOpenAI({
  // custom settings, e.g.
  apiKey:
    "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",
  compatibility: "strict", // strict mode, enable when using the OpenAI API
});
export async function POST(req) {
  try {
    // Parse and validate request
    const body = await req.json();
    const messages = body.messages ?? [];

    if (!messages.length) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }
    // Initialize model and vector store
    const model = openai("gpt-3.5-turbo");
    const pc = await getPineconeClient();
    const index = pc.Index("synergy");
    console.log(index);

    const embeddingsModel = new OpenAI({
      apiKey:
        "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",
    });
    console.log(messages[0].content);

    const embeddings = await embeddingsModel.embeddings.create({
      model: "text-embedding-3-small",
      input: messages[0].content,
      dimensions: 1024,
      encoding_format: "float",
    });

    const indexNamespace = index.namespace("ns1");

    const results = await indexNamespace.query({
      vector: embeddings.data[0].embedding,
      topK: 10,
    });
    console.log(results);

    const { text } = await generateText({ model, prompt: messages[0].content });
    console.log("message answer =>", text);
    // console.log("message inquiry =>", inquiry);
    // Convert the stream using the new adapter
    return NextResponse.json({ messages: text });
  } catch (error) {
    console.error("Chat endpoint error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
