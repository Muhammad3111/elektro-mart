import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_ENDPOINT = TELEGRAM_BOT_TOKEN
    ? `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    : null;

type TelegramPayload = {
    message?: string;
};

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as TelegramPayload;
        const message = body.message?.trim();

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }
        if (message.length > 4000) {
            return NextResponse.json(
                { error: "Message is too long" },
                { status: 400 }
            );
        }
        if (!TELEGRAM_ENDPOINT || !TELEGRAM_CHAT_ID) {
            return NextResponse.json(
                { error: "Telegram is not configured" },
                { status: 503 }
            );
        }

        const telegramResponse = await fetch(TELEGRAM_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown",
            }),
            cache: "no-store",
        });

        if (!telegramResponse.ok) {
            const error = await telegramResponse
                .json()
                .catch(() => ({ description: "Telegram API error" }));
            return NextResponse.json(
                { error: error.description || "Telegram API error" },
                { status: 502 }
            );
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: "Failed to send notification" },
            { status: 500 }
        );
    }
}
