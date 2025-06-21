import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>";

const client = new MailtrapClient({
  token: TOKEN,
  accountId: ACCOUNT_ID
});

async function suppressionsFlow() {
  // Get all suppressions
  const allSuppressions = await client.suppressions.getList();
  console.log("All suppressions:", allSuppressions);

  // Get suppressions filtered by email
  const filteredSuppressions = await client.suppressions.getList("test@example.com");
  console.log("Filtered suppressions:", filteredSuppressions);

  // Delete a suppression by ID (if any exist)
  if (allSuppressions.length > 0) {
    const suppressionToDelete = allSuppressions[0];
    await client.suppressions.delete(suppressionToDelete.id);
    console.log(`Suppression ${suppressionToDelete.id} deleted successfully`);
  } else {
    console.log("No suppressions found to delete");
  }
}

suppressionsFlow().catch(console.error);
