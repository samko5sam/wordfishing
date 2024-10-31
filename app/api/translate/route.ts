import { NextRequest, NextResponse } from 'next/server';
import TextTranslationClient from '@azure-rest/ai-translation-text';
import { auth } from '@clerk/nextjs/server';

const AZURE_TRANSLATE_API_KEY = process.env.AZURE_TRANSLATE_API_KEY;
const AZURE_TRANSLATE_API_REGION = process.env.AZURE_TRANSLATE_API_REGION;
const AZURE_TRANSLATE_API_ENDPOINT = process.env.AZURE_TRANSLATE_API_ENDPOINT;

if (!AZURE_TRANSLATE_API_KEY || !AZURE_TRANSLATE_API_REGION || !AZURE_TRANSLATE_API_ENDPOINT) {
  throw new Error("Azure Translate API credentials are missing.");
}

const translationClient = TextTranslationClient(AZURE_TRANSLATE_API_ENDPOINT, {
  key: AZURE_TRANSLATE_API_KEY,
  region: AZURE_TRANSLATE_API_REGION
});

export async function GET() {
  try {
    const langResponse = await translationClient.path('/languages').get();
    const languages = langResponse.body;

    return NextResponse.json(languages);
  } catch (error) {
    console.error('Error calling Azure Translate API:', error);
    return NextResponse.json({ error: 'Error calling Azure Translate API' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if the user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, to, from } = (await request.json()) as { text: string; to: string; from?: string };
    const translateResponse = await translationClient.path('/translate').post({
      body: [{ text }],
      queryParameters: { to, from },
    });

    return NextResponse.json(translateResponse.body);
  } catch (error) {
    console.error('Error calling Azure Translate API:', error);
    return NextResponse.json({ error: 'Error calling Azure Translate API' }, { status: 500 });
  }
}
