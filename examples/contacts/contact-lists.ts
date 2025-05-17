import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({ 
  token: TOKEN,
  accountId: ACCOUNT_ID 
});

// List all contact lists
client.contactLists
  .list()
  .then(response => {
    console.log("Contact lists:", response.data);
  })
  .catch(error => {
    console.error("Error fetching contact lists:", error);
  });
