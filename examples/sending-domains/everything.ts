import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>";

const client = new MailtrapClient({
  token: TOKEN,
  accountId: ACCOUNT_ID,
});

async function sendingDomainsFlow() {
  // Get all sending domains
  const all = await client.sendingDomains.getList();
  console.log("All sending domains:", all);

  // Get a specific sending domain
  const one = await client.sendingDomains.get(all[0].id);
  console.log("One sending domain:", one);

  // Send setup instructions
  const setupResponse = await client.sendingDomains.sendSetupInstructions(
    all[0].id,
    "admin@example.com"
  );
  console.log("Setup instructions sent:", setupResponse);

  // Create a new sending domain
  const created = await client.sendingDomains.create({
    domain_name: "example.com",
  });
  console.log("Created sending domain:", created);

  // Delete a sending domain
  await client.sendingDomains.delete(created.id);
  console.log("Sending domain deleted");
}

sendingDomainsFlow();
