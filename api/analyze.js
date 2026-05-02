export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY לא מוגדר בסביבת השרת" });
  }

  const { imageBase64, mimeType = "image/jpeg" } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: "חסר imageBase64 בבקשה" });
  }

  try {
    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { inlineData: { mimeType, data: imageBase64 } },
                {
                  text: "כמה קלוריות בערך יש במאכל שבתמונה? החזר אך ורק מספר שלם שמייצג את סך הקלוריות. ללא הסברים, רק מספר.",
                },
              ],
            },
          ],
        }),
      }
    );

    if (!geminiRes.ok) {
      const errData = await geminiRes.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `Gemini HTTP ${geminiRes.status}`;
      console.error("Gemini error:", errMsg);
      return res.status(502).json({ error: errMsg });
    }

    const data = await geminiRes.json();

    const candidate = data.candidates?.[0];
    if (!candidate) {
      const reason = data.promptFeedback?.blockReason || "תגובה ריקה מגמיני";
      return res.status(502).json({ error: reason });
    }

    const text = candidate.content?.parts?.[0]?.text || "";
    const calories = parseInt(text.replace(/[^0-9]/g, ""));

    if (isNaN(calories) || calories === 0) {
      return res.status(200).json({ calories: 0, error: "לא זוהה מאכל בתמונה" });
    }

    return res.status(200).json({ calories });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: err.message || "שגיאת שרת פנימית" });
  }
}
