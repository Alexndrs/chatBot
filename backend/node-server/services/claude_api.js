// No free token with the claude api.

import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API,
});

const main = async () => {
    const stream = await anthropic.messages.create({
        max_tokens: 1024,
        messages: [{ "role": "user", "content": "Hello" }],
        model: "claude-opus-4-20250514",
        stream: true
    });

    for await (const event of stream) {
        if (event.type === 'content_block_delta') {
            process.stdout.write(event.delta.text);
        }
    }

}

main();