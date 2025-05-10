import { MailtrapClient } from "mailtrap";

/**
 * For this example to work, you need to set up a sending domain,
 * and obtain a token that is authorized to send from the domain.
 */

const TOKEN = "<YOUR-TOKEN-HERE>";
const SENDER_EMAIL = "<SENDER@YOURDOMAIN.COM>";
const RECIPIENT_EMAIL_1 = "<RECIPIENT1@EMAIL.COM>";
const RECIPIENT_EMAIL_2 = "<RECIPIENT2@EMAIL.COM>";

const client = new MailtrapClient({ token: TOKEN, bulk: true });

const batchData = [
  {
    from: { name: "Mailtrap Test", email: SENDER_EMAIL },
    to: [{ email: RECIPIENT_EMAIL_1 }],
    subject: "Batch Email 1",
    text: "This is the first email in the batch.",
  },
  {
    from: { name: "Mailtrap Test", email: SENDER_EMAIL },
    to: [{ email: RECIPIENT_EMAIL_2 }],
    subject: "Batch Email 2",
    text: "This is the second email in the batch.",
  },
];

client
  .batchSend(batchData)
  .then(console.log)
  .catch(console.error); 