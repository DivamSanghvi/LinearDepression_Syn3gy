import { Pinecone } from "@pinecone-database/pinecone";
// Initialize index and ready to be accessed.
async function initPineconeClient() {
  const pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  return pineconeClient;
}

export async function getPineconeClient() {
  const pineconeClientInstance = await initPineconeClient();
  return pineconeClientInstance;
}
