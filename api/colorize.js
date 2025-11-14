export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = await req.json();
    const imageData = body?.imageData;
    if (!imageData) return res.status(400).json({ error: "No imageData provided" });

    const MODEL_VERSION = process.env.REPLICATE_MODEL_VERSION || "de2171b2a8604ec18b3d86dc87ccf76ff9120f9b9a0b37e2c12f49e6ab5a0aeb";

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ version: MODEL_VERSION, input: { image: imageData } }),
    });

    const prediction = await response.json();
    return res.status(200).json({ output: prediction });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: String(error) });
  }
};
