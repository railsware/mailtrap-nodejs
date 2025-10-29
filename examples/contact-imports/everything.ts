import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>";

const client = new MailtrapClient({
  token: TOKEN,
  accountId: ACCOUNT_ID
});

async function runContactImportsFlow() {
  const importData = {
    contacts: [
      {
        email: "customer1@example.com"
      },
      {
        email: "customer2@example.com"
      }
    ]
  };

  try {
    // Create import
    const response = await client.contactImports.create(importData);
    console.log("Import created:", response);

    // Get import by ID
    const importDetails = await client.contactImports.get(response.id);
    console.log("Import details:", importDetails);
  } catch (error: any) {
    console.error("Error:", error);
  }
}

runContactImportsFlow();
