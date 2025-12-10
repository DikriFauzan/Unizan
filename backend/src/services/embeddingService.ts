import axios from "axios";

export async function getEmbedding(text: string) {
  // Try Aries embeddings endpoint first
  try {
    const ARIES_EMB = process.env.ARIES_URL ? `${process.env.ARIES_URL}/embed` : null;
    if (ARIES_EMB) {
      const r = await axios.post(ARIES_EMB, { text }, { timeout: 30000 });
      return r.data.embedding; // assume array of floats
    }
  } catch (e) {
    console.warn("Aries embed failed:", e.message);
  }

  // Fallback: call OpenAI embeddings (developer must implement openai client)
  try {
    const r = await axios.post((process.env.OPENAI_PROXY_URL || "http://localhost:8000/internal/openai/embed"), { text }, { timeout: 30000 });
    return r.data.embedding;
  } catch (e) {
    throw new Error("Embedding failed: " + e.message);
  }
}
