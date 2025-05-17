import { MailtrapClient } from "mailtrap";

/**
 * For this example, you need to have ready-to-use sending domain or,
 * a Demo domain that allows sending emails to your own account email.
 * @see https://help.mailtrap.io/article/69-sending-domain-setup
 */

const TOKEN = "<YOUR-TOKEN-HERE>";
const SENDER_EMAIL = "<SENDER@YOURDOMAIN.COM>";
const RECIPIENT_EMAIL = "<RECIPIENT@EMAIL.COM>";
const TEMPLATE_UUID = "<TEMPLATE-UUID>";

const client = new MailtrapClient({ token: TOKEN });

client.batchSend({
  base: {
    from: { name: "Mailtrap Test", email: SENDER_EMAIL },
    template_uuid: TEMPLATE_UUID
  },
  requests: [
    {
      to: [{ email: RECIPIENT_EMAIL }],
      template_variables: {
        user_name: "John Doe",
        company_name: "Example Corp"
      }
    },
    {
      to: [{ email: RECIPIENT_EMAIL }],
      template_variables: {
        user_name: "Jane Smith",
        company_name: "Example Corp"
      }
    }
  ]
})
  .then(console.log)
  .catch(console.error); 
