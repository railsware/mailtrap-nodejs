import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>";

const client = new MailtrapClient({
  token: TOKEN,
  accountId: ACCOUNT_ID,
});

async function createContactEvent() {
  try {
    const email = `john.smith+${Date.now()}@example.com`;
    let contactId: string;
    // Try to get existing first
    try {
      const existing = await client.contacts.get(email);
      contactId = existing.data.id;
    } catch (_getErr) {
      // Not found, create minimal contact
      try {
        const created = await client.contacts.create({ email });
        contactId = created.data.id;
      } catch (err: any) {
        const cause = err?.cause || err;
        const status = cause?.response?.status;
        if (status === 409) {
          const existing = await client.contacts.get(email);
          contactId = existing.data.id;
        } else {
          throw err;
        }
      }
    }

    const payload = {
      name: "purchase_completed",
      params: {
        order_id: 12345,
        amount: 49.99,
        currency: "USD",
        coupon_used: false,
      },
    };

    const event = await client.contactEvents.create(contactId, payload);
    console.log("Contact event created:", JSON.stringify(event, null, 2));
  } catch (error) {
    console.error(
      "Error creating contact event:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

createContactEvent();


