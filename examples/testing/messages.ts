import { MailtrapClient } from "mailtrap"

const TOKEN = "<YOUR-TOKEN-HERE>";
const TEST_INBOX_ID = "<YOUR-TEST-INBOX-ID-HERE>"
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({ token: TOKEN, testInboxId: TEST_INBOX_ID, accountId: ACCOUNT_ID });

const inboxesClient = client.testing.inboxes
const messagesClient = client.testing.messages

inboxesClient.getList()
  .then(async (inboxes) => {
    if (inboxes && inboxes.length > 0) {
      const firstInboxId = inboxes[0].id 

      const messages = await messagesClient.get(firstInboxId)

      if (messages && messages.length > 0) {
        const firstMessageId = messages[0].id

        await messagesClient.get(firstInboxId)
        await messagesClient.getHtmlAnalysis(firstInboxId, firstMessageId)
        await messagesClient.getHtmlMessage(firstInboxId, firstMessageId)
        await messagesClient.getTextMessage(firstInboxId, firstMessageId)
        await messagesClient.getMailHeaders(firstInboxId, firstMessageId)
        await messagesClient.getMessageAsEml(firstInboxId, firstMessageId)
        await messagesClient.getMessageHtmlSource(firstInboxId, firstMessageId)
        await messagesClient.getRawMessage(firstInboxId, firstMessageId)
        await messagesClient.getSpamScore(firstInboxId, firstMessageId)
        await messagesClient.showEmailMessage(firstInboxId, firstMessageId)
        await messagesClient.updateMessage(firstInboxId, firstMessageId, {
          isRead: false
        })
        await messagesClient.forward(firstInboxId, firstMessageId, 'mock@mail.com')
        const response = await messagesClient.deleteMessage(firstInboxId, firstMessageId)

        console.log(response)
      }
    }
  })
