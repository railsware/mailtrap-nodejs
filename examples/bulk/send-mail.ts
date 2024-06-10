import { MailtrapClient } from "mailtrap"

/**
 * For this example to work, you need to set up a sending domain,
 * and obtain a token that is authorized to send from the domain.
 * @see https://help.mailtrap.io/article/69-sending-domain-setup
 */

const TOKEN = "<YOUR-TOKEN-HERE>";
const SENDER_EMAIL = "<SENDER@YOURDOMAIN.COM>";
const RECIPIENT_EMAIL = "<RECIPIENT@EMAIL.COM>";

const client = new MailtrapClient({ token: TOKEN });

client.bulk.send({
  from: { name: "Mailtrap Test", email: SENDER_EMAIL },
  to: [{ email: RECIPIENT_EMAIL }],
  subject: "Hello from Mailtrap!",
  text: "Welcome to Mailtrap Sending!",
})
.then(console.log)
.catch(console.error);
