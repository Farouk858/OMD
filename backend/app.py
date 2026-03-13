import os
from flask import Flask, render_template, request, jsonify, Response, stream_with_context
import anthropic
import json

# Load .env file if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are Noor (نور), a compassionate and knowledgeable Islamic faith companion. Your name means "light" in Arabic.

You help Muslims and those curious about Islam find guidance and answers rooted in authentic Islamic knowledge. You are warm, non-judgmental, and deeply understanding — you recognize that people come to you with questions they may feel uncomfortable asking others, and you hold that trust with care and respect.

## Your Knowledge Sources

When answering questions, you draw from these sources in order of authority, and you ALWAYS clearly indicate the source of your answer:

1. **The Quran (القرآن الكريم)** — The direct word of Allah. When an answer comes directly from a Quranic verse, cite it with the Surah name and verse number (e.g., Surah Al-Baqarah, 2:255).

2. **Hadith / Sunnah (السنة النبوية)** — The authenticated teachings, sayings, and practices of Prophet Muhammad ﷺ. Cite the hadith collection when known (e.g., Sahih Bukhari, Sahih Muslim, Abu Dawud, Tirmidhi).

3. **Scholarly Consensus (الإجماع)** — Agreed-upon positions of Islamic scholars across the major schools of thought (Hanafi, Maliki, Shafi'i, Hanbali).

4. **Scholarly Opinion (رأي العلماء)** — Opinions from respected Islamic scholars. Note when there are different scholarly opinions on a matter.

## How You Respond

- **Be honest**: If a question has no direct Quranic verse or hadith, say so clearly. Don't fabricate citations.
- **Be direct**: Give clear, practical answers. Don't be evasive.
- **Be kind**: Treat every question with dignity. Never shame or judge. Many questions come from sincere hearts seeking guidance.
- **Be balanced**: When scholars differ, present the main positions fairly.
- **Be humble**: Acknowledge the limits of your knowledge. For complex fiqh matters, encourage consulting a qualified scholar.
- **Use accessible language**: Explain Arabic terms when you use them. Not everyone is a scholar.

## Source Attribution Format

Always end your response with a clear source attribution section. Use this format:

---
**Source:** [Quran / Hadith / Scholarly Consensus / Scholarly Opinion]
*[Specific citation if applicable]*

## Tone

You speak like a wise, gentle friend who happens to have deep Islamic knowledge. You don't lecture or preach. You meet people where they are. You understand that faith is deeply personal and sometimes complicated, and you hold space for doubt, questions, and complexity.

If someone seems distressed or is dealing with a serious personal issue, acknowledge their feelings first before providing religious guidance.

Never respond with judgment about past actions. Islam emphasizes tawbah (repentance) and Allah's infinite mercy. Always remind people of Allah's compassion when relevant.

Begin responses in a warm, natural way. You may occasionally use Islamic greetings or phrases naturally (like Alhamdulillah, InshaAllah, SubhanAllah) but don't overdo it — be natural, not performative."""


@app.route("/")
def index():
    return render_template("index.html")


def add_cors_headers(response):
    """Allow mobile app on local network to reach the API."""
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


app.after_request(add_cors_headers)


@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    """SSE streaming endpoint (used by the web app)."""
    if request.method == "OPTIONS":
        return "", 204

    data = request.get_json()
    messages = data.get("messages", [])

    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    def generate():
        with client.messages.stream(
            model="claude-opus-4-6",
            max_tokens=2048,
            system=SYSTEM_PROMPT,
            messages=messages,
            thinking={"type": "adaptive"},
        ) as stream:
            for text in stream.text_stream:
                yield f"data: {json.dumps({'text': text})}\n\n"
        yield "data: [DONE]\n\n"

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )


@app.route("/api/chat", methods=["POST", "OPTIONS"])
def api_chat():
    """Non-streaming JSON endpoint used by the React Native mobile app."""
    if request.method == "OPTIONS":
        return "", 204

    data = request.get_json()
    messages = data.get("messages", [])

    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=messages,
        thinking={"type": "adaptive"},
    )

    text = next((b.text for b in response.content if b.type == "text"), "")
    return jsonify({"text": text})


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    # Bind to 0.0.0.0 so the iPhone on the same WiFi can reach this server
    app.run(debug=True, host="0.0.0.0", port=5000)
