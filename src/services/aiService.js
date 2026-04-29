export async function analyzeMealCalories(imageBase64, mimeType = "image/jpeg") {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64, mimeType }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || `שגיאת שרת ${response.status}`);
  }

  return data.calories || 0;
}
