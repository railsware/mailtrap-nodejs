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

// Get contact by email
client.contacts
  .get(contactData.email)
  .then(async (response) => {
    console.log("Contact retrieved:", response.data);

    // Create contact
    const createResponse = await client.contacts
      .create(contactData)

    console.log("Contact created:", createResponse.data);
    const contactId = createResponse.data.id;

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
