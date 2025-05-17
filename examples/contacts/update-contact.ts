import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"
const CONTACT_ID = "<YOUR-CONTACT-ID-HERE>"; // ID of contact to delete

const client = new MailtrapClient({ 
  token: TOKEN,
  accountId: ACCOUNT_ID 
});

const updateData = {
  name: "John Smith",
  company: "New Corp",
  phone: "+0987654321"
};

client.contacts
  .update(CONTACT_ID, updateData)
  .then(console.log)
  .catch(console.error); 