export class FeacClient {
    constructor(opts = {}) {
        this.baseUrl = opts.baseUrl || "http://localhost:8000";
        this.key = opts.apiKey;
    }
    
    async chat(msg) {
        const res = await fetch(`${this.baseUrl}/v1/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': this.key },
            body: JSON.stringify({ messages: [{role: 'user', content: msg}] })
        });
        return res.json();
    }
}
