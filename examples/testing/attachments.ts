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

        const attachments = await attachmentsClient.getList(firstMessageId, firstInboxId)

        if (attachments && attachments.length > 0) {
          const firstAttachment = attachments[0].id
          const attachmentData = await attachmentsClient.get(firstInboxId, firstMessageId, firstAttachment)
  
          console.log(attachmentData)
        }
      }
    }
  })
