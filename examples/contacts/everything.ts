import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = 123; // Your account ID

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
          company: "New Corp"
        }
      })
    console.log("Contact updated:", updateResponse.data);
    // Delete contact
    await client.general.contacts
      .delete(contactId)
    console.log("Contact deleted");
  })
  .catch(error => {
    console.error("Error in contact lifecycle:", error);
  }); 