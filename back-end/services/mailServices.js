import Mailgun from "mailgun-js";

const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain:process.env.MAILGUN_DOMAIN,
});

