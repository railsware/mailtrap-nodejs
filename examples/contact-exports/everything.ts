import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>";

const client = new MailtrapClient({
  token: TOKEN,
  accountId: Number(ACCOUNT_ID),
});

async function createContactExport() {
  try {
    // Get contact lists and use first one if available
    const lists = await client.contactLists.getList();
    const listId = Array.isArray(lists) && lists.length > 0 ? lists[0].id : undefined;

    // Create filters array per API docs:
    // - Use list_id filter with array of list IDs if list available
    // - Add subscription_status filter to export only subscribed contacts
    const filters = listId
      ? [
          { name: "list_id", operator: "equal" as const, value: [listId] },
          { name: "subscription_status", operator: "equal" as const, value: "subscribed" },
        ]
      : [
          { name: "subscription_status", operator: "equal" as const, value: "subscribed" },
        ];

    const created = await client.contactExports.create({ filters });
    console.log("Export created:", JSON.stringify(created, null, 2));

    // Fetch export to check status and get download URL when finished
    const fetched = await client.contactExports.get(created.id);
    console.log("Export fetched:", JSON.stringify(fetched, null, 2));
  } catch (error) {
    console.error(
      "Error creating contact export:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

createContactExport();


