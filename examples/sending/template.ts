import { MailtrapClient } from "mailtrap"

/**
 * For this example, you need to have ready-to-use sending domain or,
 * a Demo domain that allows sending emails to your own account email.
 * @see https://help.mailtrap.io/article/69-sending-domain-setup
 */

const TOKEN = "<YOUR-TOKEN-HERE>";
const SENDER_EMAIL = "<SENDER@YOURDOMAIN.COM>";
const RECIPIENT_EMAIL = "<RECIPIENT@EMAIL.COM>";

const client = new MailtrapClient({ token: TOKEN });

client
  .send({
    from: { name: "Mailtrap Test", email: SENDER_EMAIL },
    to: [{ email: RECIPIENT_EMAIL }],
    template_uuid: "813e39db-c74a-4830-b037-0e6ba8b1fe88",
    template_variables: {
      user_name: "John Doe",
    }
  })
  .then(console.log)
  .catch(console.error);
