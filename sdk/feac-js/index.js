export class FEAC {
  constructor({ apiKey, baseUrl }) {
    this.key = apiKey;
    this.base = baseUrl || "http://localhost:8000/v1";
  }

  async status() {
    const r = await fetch("http://localhost:9004/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: this.key })
    });
    return r.json();
  }

  async chat(msg, type = "CHAT") {
    const r = await fetch(this.base + "/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.key,
        "x-cost-type": type
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: msg }]
      })
    });
    return r.json();
  }
}
