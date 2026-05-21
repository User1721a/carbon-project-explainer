import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function vehicleCalculation(question, mode) {
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

  if (!vehicle || mode !== "explain") return null;

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

function getSystemPrompt(mode) {
  const sharedRules = `
Do not use the words "nature", "natural", or "environment" unless the user explicitly asks about those terms.
Avoid generic sustainability language.
Be precise, structured, and technically correct.
Do not give financial, legal, investment, or certification advice.
`;

  if (mode === "compare") {
    return `
You are a climate and carbon markets expert.

The user wants a clear comparison between carbon-related concepts, project types, or approaches.

Structure your answer like this:

1. Core difference
2. When each is used
3. Strengths
4. Limitations
5. Decision relevance

${sharedRules}
`;
  }

  if (mode === "explain") {
    return `
You are a climate and carbon markets expert.

Your goal is to explain carbon-related concepts clearly and practically.

Structure your answer like this:

1. Short definition
2. Why it matters
3. Example
4. Key risks or credibility concerns

${sharedRules}
`;
  }

  return `
You are a climate and carbon markets expert.

The user wants decision-relevant assessment, not generic explanation.

Structure your answer like this:

1. What this involves
2. Potential benefits
3. Key risks
4. What determines credibility
5. What to verify before relying on it

${sharedRules}
`;
}

export async function POST(req) {
  const { question, mode = "evaluate" } = await req.json();

  const calculatedAnswer = vehicleCalculation(question, mode);

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
          content: getSystemPrompt(mode),
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