"use server";

export async function getPixabayImage(query: string) {
  try {
    const res = await fetch(
      `https://pixabay.com/api/?q=${query}&key=${process.env.PIXABAY_API_KEY}&min_width=1280&min_height=720&image_type=illustration&category=feelings`
    );
    const data = await res.json();
    return data.hits[0]?.largeImageURL || null;
  } catch (error) {
    console.error("Pixabay API Error:", error);
    return null;
  }
}

export async function getDailyPrompt(): Promise<string> {
  try {
    const res = await fetch("https://zenquotes.io/api/random", {
      cache: "no-store", // ensures no caching
    });
    const data: { q: string; a: string }[] = await res.json();
    const quote = data[0];
    return `"${quote.q}" — ${quote.a}`;
  } catch (error) {
    console.error("ZenQuotes API Error:", error);
    return "Take a deep breath and reflect on what matters most today.";
  }
}
