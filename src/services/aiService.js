export async function analyzeMealCalories(images, description = "") {
  // images: [{base64, mimeType}] — 1 or 2 items
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ images, description }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || `שגיאת שרת ${response.status}`);
  }

  return data.calories || 0;
}
