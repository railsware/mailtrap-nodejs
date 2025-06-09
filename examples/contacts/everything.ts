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

// Create contact first
client.contacts
  .create(contactData)
  .then(async (createResponse) => {
    console.log("Contact created:", createResponse.data);
    const contactId = createResponse.data.id;

    // Get contact by email
    const getResponse = await client.contacts.get(contactData.email);
    console.log("Contact retrieved:", getResponse.data);

    // Update contact
    const updateResponse = await client.contacts
      .update(contactId, {
        email: contactData.email,
        fields: {
          first_name: "Johnny",
          last_name: "Smith",
        }
      })
    console.log("Contact updated:", updateResponse.data);

    // Delete contact
    await client.contacts.delete(contactId);
    console.log("Contact deleted");
  })
  .catch(error => {
    console.error("Error in contact lifecycle:", error);
  });
