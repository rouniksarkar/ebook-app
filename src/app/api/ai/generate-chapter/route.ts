import { Mistral } from '@mistralai/mistralai';
import { PROMPTS } from '@/lib/prompts';
import { NextRequest, NextResponse } from 'next/server';

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

export async function POST(req: NextRequest) {
    type FieldType = keyof typeof PROMPTS; // 'bookDetails' | 'chapterTitle' | 'chapterContent'

    // 2. Destructure and type the request body explicitly
    const { fieldType, context } = await req.json() as { fieldType: string; context: any };

    // 3. Use a type guard to safely check and narrow the key
    if (!(fieldType in PROMPTS)) {
        return Response.json({ error: 'Invalid fieldType' }, { status: 400 });
    }
    const promptFn = PROMPTS[fieldType as FieldType];

    try {
        const response = await client.chat.complete({
            model: 'mistral-small-latest',
            messages: [{ role: 'user', content: promptFn(context) }],
            temperature: 0.8,
        });
        return NextResponse.json({ text: response.choices[0]?.message?.content });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
    }
}