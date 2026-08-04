import { Mistral } from '@mistralai/mistralai';
import { PROMPTS } from '@/lib/prompts';
import { NextRequest } from 'next/server';

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

export async function POST(req: NextRequest) {
    const { instruction } = await req.json();

    try {
        const response = await client.chat.complete({
            model: 'mistral-small-latest',
            messages: [{ role: 'user', content: PROMPTS.bookDetails({ instruction }) }],
            temperature: 0.8,
            responseFormat: { type: 'json_object' }, // forces valid JSON back
        });

        const raw = response.choices[0]?.message?.content;

        // 1. Check type first
        if (typeof raw !== 'string') {
            return Response.json({ error: "Invalid response format" }, { status: 500 });
        }

        // 2. Parse safely since scope is now clear
        const parsed = JSON.parse(raw);

        return Response.json(parsed); // { title, subtitle, description, category }
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'AI generation failed' }, { status: 500 });
    }
}