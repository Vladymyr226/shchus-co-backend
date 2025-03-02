import { Request, Response } from "express";
import textToSpeech from '@google-cloud/text-to-speech';

const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS || '{}');

const client = new textToSpeech.TextToSpeechClient({
    credentials: credentials
});

export async function synthesize(req: Request, res: Response) {
    const { text, languageCode, voiceName } = req.body;

    // Валидация входных данных
    if (!text || !languageCode || !voiceName) {
        return res.status(400).json({
            error: 'Missing required fields: text, languageCode, and voiceName are required'
        });
    }

    const request = {
        input: { text },
        voice: { languageCode, name: voiceName },
        audioConfig: { audioEncoding: 'MP3' as const },
    };

    try {
        const [response] = await client.synthesizeSpeech(request);
        const audioContent = response.audioContent;

        if (!audioContent) {
            throw new Error('No audio content received');
        }

        res.set('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(audioContent));
    } catch (error) {
        console.error('Error synthesizing speech:', error);
        res.status(500).json({
            error: 'Error synthesizing speech',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

export async function listVoices(req: Request, res: Response) {
    try {
        const [response] = await client.listVoices();

        const voices = response.voices?.map(voice => ({
            name: voice.name,
            languages: voice.languageCodes,
            gender: voice.ssmlGender
        })) ?? [];

        return res.status(200).json({
            success: true,
            data: {
                voices
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch voices',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
