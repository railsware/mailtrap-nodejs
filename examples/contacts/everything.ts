import { MailtrapClient } from "mailtrap";

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
};

// Create contact
client.contacts
  .create(contactData)
  .then(async (response) => {
    console.log("Contact created:", response.data);
    const contactId = response.data.id;

    // Update contact
    const updateResponse = await client.contacts
      .update(contactId, {
        fields: {
          first_name: "Johnny",
          last_name: "Smith",
        }
      })
    console.log("Contact updated:", updateResponse.data);
    // Delete contact
    await client.contacts
      .delete(contactId)
    console.log("Contact deleted");
  })
  .catch(error => {
    console.error("Error in contact lifecycle:", error);
  }); 

// List contacts
client.contacts.list()
  .then(response => {
    console.log("Contact list:", response.data);
  })
  .catch(error => {
    console.error("Error in contact list:", error);
  });
