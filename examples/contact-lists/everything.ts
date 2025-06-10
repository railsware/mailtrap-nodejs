import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({
  token: TOKEN,
  accountId: ACCOUNT_ID,
});

async function contactListsFlow() {
  // Create a new contact list
  await client.contactLists.create({
    name: "Test List",
  });

  // Get all contact lists
  const all = await client.contactLists.getAll();
  console.log("All contact lists:", all);

  // Get a specific contact list
  const one = await client.contactLists.get(all[0].id);
  console.log("One contact list:", one);

  // Update a contact list
  const updated = await client.contactLists.update(all[0].id, {
    name: "Updated Test List",
  });
  console.log("Updated contact list:", updated);

  // Delete a contact list
  await client.contactLists.delete(all[0].id);
}

contactListsFlow();
