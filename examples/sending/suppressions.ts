import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>";

const client = new MailtrapClient({
  token: TOKEN,
  accountId: ACCOUNT_ID
});

async function suppressionsFlow() {
  // Get suppressions (up to 1000 per request)
  const suppressions = await client.suppressions.getList();
  console.log("Suppressions (up to 1000):", suppressions);

  // Get suppressions filtered by email
  const filteredSuppressions = await client.suppressions.getList({email: "test@example.com"});
  console.log("Filtered suppressions:", filteredSuppressions);

  // Delete a suppression by ID (if any exist)
  if (suppressions.length > 0) {
    const suppressionToDelete = suppressions[0];
    await client.suppressions.delete(suppressionToDelete.id);
    console.log(`Suppression ${suppressionToDelete.id} deleted successfully`);
  } else {
    console.log("No suppressions found to delete");
  }
}

suppressionsFlow().catch(console.error);
