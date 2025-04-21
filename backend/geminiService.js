require("dotenv").config();

async function getGeminiReply(userMessage) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: `You are Wanderbot, a helpful travel assistant. The user said: "${userMessage}"`,
          },
        ],
      },
    ],
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Gemini API Error:", JSON.stringify(data, null, 2));
      return "Sorry, Wanderbot couldn’t think of a reply right now.";
    }
  } catch (err) {
    console.error("Gemini fetch failed:", err.message);
    return "Wanderbot is having trouble thinking.";
  }
}

module.exports = getGeminiReply;
