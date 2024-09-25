import { MailtrapClient } from "mailtrap"

const TOKEN = "<YOUR-TOKEN-HERE>";
const TEST_INBOX_ID = "<YOUR-TEST-INBOX-ID-HERE>"
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({ token: TOKEN, testInboxId: TEST_INBOX_ID, accountId: ACCOUNT_ID });

const projectsClient = client.testing.projects
const inboxesClient = client.testing.inboxes

projectsClient.getList()
  .then(async (projects) => {
    if (projects && projects.length > 0) {
      const firstProjectId = projects[0].id

      await inboxesClient.create(firstProjectId, 'test-inbox')

      const inboxes = await inboxesClient.getList()

      if (inboxes && inboxes.length > 0) {
        const firstInboxId = inboxes[0].id

        const inboxAttributes = await inboxesClient.getInboxAttributes(firstInboxId)
        await inboxesClient.updateInbox(firstInboxId, {name: 'mock-name', emailUsername: 'mocker'})
        await inboxesClient.cleanInbox(firstInboxId)
        await inboxesClient.markAsRead(firstInboxId)
        await inboxesClient.resetCredentials(firstInboxId)
        await inboxesClient.enableEmailAddress(firstInboxId)
        const response = await inboxesClient.resetEmailAddress(firstInboxId)
        
        console.log(response)
      }
    }
  })
