import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

// Initialize the client with your token and account ID
const client = new MailtrapClient({
  token: TOKEN,
  accountId: ACCOUNT_ID, // Your account ID
});

// Example usage of ContactFields API
async function contactFieldsExample() {
  try {
    // Get all contact fields
    const fields = await client.contactFields.getList();
    console.log("All contact fields:", fields);

    // Use the first field from the list for operations
    const firstField = (fields as any)[0];
    if (!firstField) {
      console.log("No contact fields found");
      return;
    }

    // Get a specific contact field
    const field = await client.contactFields.get(firstField.id);
    console.log("Retrieved field:", field);

    // Update a contact field
    const updatedField = await client.contactFields.update(firstField.id, {
      name: "Updated First Name",
    });
    console.log("Updated field:", updatedField);

    // Delete a contact field
    await client.contactFields.delete(firstField.id);
    console.log("Field deleted successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the example
contactFieldsExample();
