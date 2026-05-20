import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function vehicleCalculation(question) {
  const q = question.toLowerCase();

  const factors = {
    car: {
      annualEmissionsTons: 4.6,
      label: "average passenger car",
    },
    motorcycle: {
      annualEmissionsTons: 0.8,
      label: "average motorcycle",
    },
  };

  let vehicle = null;

  if (q.includes("motorcycle")) vehicle = "motorcycle";
  if (q.includes("car")) vehicle = "car";

  if (!vehicle) return null;

  const emissions = factors[vehicle].annualEmissionsTons;
  const credits = Math.ceil(emissions);

  return `1. Short definition:
A carbon credit usually represents 1 metric ton of CO₂e reduced, avoided, or removed.

2. Calculation:
For an ${factors[vehicle].label}, this demo uses an estimated annual footprint of about ${emissions} metric tons of CO₂e.

Formula:
${emissions} metric tons CO₂e ÷ 1 metric ton per credit = ${emissions} carbon credits

Rounded practical estimate:
About ${credits} carbon credit${credits > 1 ? "s" : ""} per year.

3. Real-world context:
This is a simplified educational estimate. Actual emissions depend on distance traveled, fuel efficiency, fuel type, maintenance, and driving conditions.

4. Limitations or risks:
Carbon credits are not automatically equivalent in quality. Credibility depends on MRV, additionality, permanence, leakage, and third-party verification. This is not financial, legal, or certification advice.`;
}

export async function POST(req) {
  const { question } = await req.json();

  const calculatedAnswer = vehicleCalculation(question);

  if (calculatedAnswer) {
    return Response.json({
      answer: calculatedAnswer,
    });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a climate and carbon markets expert.

Your goal is to explain carbon-related concepts clearly and practically.

Always structure your answers like this:

1. Short definition
2. Why it matters
3. Example
4. Key risks or credibility concerns

Be precise. Avoid generic statements. Use simple but technically correct language.

Avoid financial, legal, investment, or certification advice. Keep it educational, clear, and simple.
`,
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    return Response.json({
      answer: completion.choices[0].message.content,
    });
  } catch (error) {
    return Response.json({
      answer:
        "The carbon explainer is temporarily unavailable. Please try again shortly.",
    });
  }
}