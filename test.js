// // Replace <OPENROUTER_API_KEY> with your actual API key
// // Replace <YOUR_SITE_URL> and <YOUR_SITE_NAME> with your site info (optional)

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

async function getChatResponse() {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization":  `Bearer ${process.env.OPEN_ROUTER_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Expert coding agent",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1-0528:free"
,
        messages: [
          {
            role: "user",
            content: "What is the meaning of life?"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Chat Response:", data);
    
    // Example: Accessing the generated message text
    if (data.choices && data.choices.length > 0) {
      console.log("AI says:", data.choices[0].message.content);
    }

  } catch (error) {
    console.error("Error fetching chat response:", error);
  }
}


async function askGemini(promptText) {
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content[0].text;
    }
    return null;
  } catch (err) {
    console.error("Gemini API error:", err);
  }
}

// Example usage
(async () => {
  const openRouterAnswer = await askOpenRouter("What is the meaning of life?");
  console.log("OpenRouter says:", openRouterAnswer);

  const geminiAnswer = await askGemini("Explain how AI works in a few words");
  console.log("Gemini says:", geminiAnswer);
})();
