import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

type RequestBody = {
  ingredient: string;
  dietType: string;
  allergies: string[];
};

export async function POST(req: Request) {
  try {
    const { ingredient, dietType, allergies }: RequestBody = await req.json();

    const prompt = `You are a cooking assistant. Suggest 3 ingredient substitutions for "${ingredient}".

    The user has these dietary requirements:
    - Diet type: ${dietType || "none"}
    - Allergies/intolerances: ${allergies.length > 0 ? allergies.join(", ") : "none"}

    RULES:
    - Never suggest an ingredient the user is allergic to
    - Respect the diet type (e.g. vegetarian users must not get meat substitutes)
    - Keep substitutions practical and easy to find in a supermarket
    - Each substitution should be a single ingredient, not a description

    Return ONLY a valid JSON array, no explanation or markdown:
    ["substitute 1", "substitute 2", "substitute 3"]`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });

    const text = response.choices[0].message.content || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    const substitutions: string[] = Array.isArray(parsed) ? parsed : [];

    return Response.json({ substitutions });
  } catch (err) {
    console.error("Groq error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}