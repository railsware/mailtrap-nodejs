// import { MailtrapClient } from "mailtrap";
import { MailtrapClient } from "../../src";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({ 
  token: TOKEN,
  accountId: ACCOUNT_ID 
});

const contactData = {
  email: "john.smith@example.com",
  fields: {
    first_name: "John",
    last_name: "Smith"
  },
  list_ids: [1, 2, 3]
};

client.contacts
  .create(contactData)
  .then(console.log)
  .catch(console.error); 
