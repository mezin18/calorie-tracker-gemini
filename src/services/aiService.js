export async function analyzeMealCalories(imageBase64, mimeType = "image/jpeg") {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    alert("חסר VITE_GEMINI_API_KEY — הגדר אותו בהגדרות Vercel או בקובץ .env");
    return 0;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: imageBase64,
                  },
                },
                {
                  text: "כמה קלוריות בערך יש במאכל שבתמונה? החזר אך ורק מספר שלם שמייצג את סך הקלוריות. ללא הסברים, רק מספר.",
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `HTTP ${response.status}`;
      console.error("Gemini API Error:", errMsg);
      throw new Error(errMsg);
    }

    const data = await response.json();

    const candidate = data.candidates?.[0];
    if (!candidate) {
      const reason = data.promptFeedback?.blockReason || "תגובה ריקה מה-API";
      throw new Error(reason);
    }

    const text = candidate.content?.parts?.[0]?.text || "";
    const calories = parseInt(text.replace(/[^0-9]/g, ""));
    return isNaN(calories) ? 0 : calories;
  } catch (err) {
    console.error("Gemini Error:", err?.message || err);
    return 0;
  }
}
