import mailgun from "mailgun-js";

const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain:process.env.MAILGUN_DOMAIN,
});

export const sendEmail = async (to, subject, htmlContent) =>{
    const data = {
        from:"StiveBlog <noreplay@yourdomain.com>",
        to,
        subject,
        html: htmlContent 
    };

    try {
        const response = await mg.messages().send(data);
        console.log('email inviata con successo', response)
    } catch (error) {
        console.error('errore invio email', error);
        throw error;

    }
}