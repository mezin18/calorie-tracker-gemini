export async function analyzeMealCalories(imageBase64) {
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
                    mimeType: "image/jpeg",
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

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "0";
    const calories = parseInt(text.replace(/[^0-9]/g, ""));
    return isNaN(calories) ? 0 : calories;
  } catch (err) {
    console.error("Gemini Error:", err);
    return 0;
  }
}
