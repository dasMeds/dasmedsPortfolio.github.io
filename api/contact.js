const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return response.status(405).json({ error: 'Method not allowed.' });
    }

    const body = request.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return response.status(400).json({ error: 'A valid JSON request body is required.' });
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (
        !name ||
        name.length > 100 ||
        !EMAIL_PATTERN.test(email) ||
        email.length > 254 ||
        !message ||
        message.length > MAX_MESSAGE_LENGTH
    ) {
        return response.status(400).json({ error: 'Enter a valid name, email, and message.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_EMAIL;
    if (!apiKey || !recipient) {
        console.error('Contact endpoint is missing RESEND_API_KEY or CONTACT_EMAIL.');
        return response.status(500).json({ error: 'Contact form is not configured.' });
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: process.env.CONTACT_FROM || 'Portfolio Contact <onboarding@resend.dev>',
            to: [recipient],
            reply_to: email,
            subject: 'New portfolio contact message',
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`
        })
    });

    if (!resendResponse.ok) {
        const errorDetails = await resendResponse.text();
        console.error('Resend rejected the contact message.', {
            status: resendResponse.status,
            details: errorDetails
        });
        return response.status(502).json({ error: 'The message could not be delivered.' });
    }

    return response.status(200).json({ message: 'Message sent.' });
}
