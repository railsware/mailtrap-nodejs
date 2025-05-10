import { MailtrapClient } from "mailtrap";

/**
 * For this example to work, you need to set up a sending domain,
 * and obtain a token that is authorized to send from the domain.
 */

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = 123; // Replace with your actual account ID

const client = new MailtrapClient({ token: TOKEN, accountId: ACCOUNT_ID });

// List all contacts
client
  .contacts
  .list()
  .then(console.log)
  .catch(console.error);

// List all contact lists
client
  .contactLists
  .list()
  .then(console.log)
  .catch(console.error); 