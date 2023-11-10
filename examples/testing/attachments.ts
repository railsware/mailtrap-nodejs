import { MailtrapClient } from "../../src"

const TOKEN = "<YOUR-TOKEN-HERE>";
const TEST_INBOX_ID = "<YOUR-TEST-INBOX-ID-HERE>"
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({ token: TOKEN, testInboxId: TEST_INBOX_ID, accountId: ACCOUNT_ID });

const inboxesClient = client.testing.inboxes
const messagesClient = client.testing.messages
const attachmentsClient = client.testing.attachments

inboxesClient.getList()
  .then(async (inboxes) => {
    if (inboxes && inboxes.length > 0) {
      const firstInboxId = inboxes[0].id 
      
      const messages = await messagesClient.get(firstInboxId)
      
      if (messages && messages.length > 0) {
        const firstMessageId = messages[0].id

        await attachmentsClient.getList(firstMessageId, firstInboxId)
        const attachment = await attachmentsClient.get(559735926, firstMessageId, firstInboxId)

        console.log(attachment)
      }
    }
  })
