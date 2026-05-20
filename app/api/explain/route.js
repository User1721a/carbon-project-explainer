import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { question } = await req.json();

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a climate education assistant.

Answer using this exact structure:

1. Short definition
2. Why it matters
3. Example
4. Key risks or credibility concerns

Avoid financial, legal, investment, or certification advice. Keep it educational, clear, and simple.`,
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
    // Fallback response if AI fails
    return Response.json({
      answer: `1. Short definition:
Carbon credits represent one ton of CO₂ either removed from the atmosphere or avoided through a project.

2. Why it matters:
They are used to balance emissions and support climate projects such as reforestation or clean energy.

3. Example:
A company emitting CO₂ may purchase carbon credits from a forest conservation project to offset its emissions.

4. Key risks or credibility concerns:
Not all carbon credits are equally reliable. Issues include poor measurement (MRV), lack of permanence, or projects that would have happened anyway.`,
    });
  }
}