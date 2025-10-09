import MailtrapClient from "../../src/lib/MailtrapClient";

const client = new MailtrapClient({
  token: "YOUR_API_TOKEN",
  accountId: 12345, // Your account ID
});

async function sendingDomainsExample() {
  try {
    // Get all sending domains§
    const sendingDomains = await client.sendingDomains.getList();
    console.log("Sending domains:", sendingDomains);

    // Create a new sending domain
    const newDomain = await client.sendingDomains.create({
      domain_name: "example.com",
    });
    console.log("Created domain:", newDomain);

    // Get a specific sending domain by ID
    const domain = await client.sendingDomains.get(newDomain.id);
    console.log("Domain details:", domain);

    // Send setup instructions
    const setupResponse = await client.sendingDomains.sendSetupInstructions(
      newDomain.id,
      "admin@example.com"
    );
    console.log("Setup instructions response:", setupResponse);

    // Delete the sending domain
    await client.sendingDomains.delete(newDomain.id);
    console.log("Domain deleted successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

sendingDomainsExample();
