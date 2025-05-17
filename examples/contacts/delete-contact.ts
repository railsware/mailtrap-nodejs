import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"
const CONTACT_ID = "<YOUR-CONTACT-ID-HERE>"; // ID of contact to delete

const client = new MailtrapClient({ 
  token: TOKEN,
  accountId: ACCOUNT_ID 
});

client.contacts
  .delete(CONTACT_ID)
  .then(console.log)
  .catch(console.error); 