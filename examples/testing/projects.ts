import { MailtrapClient } from "mailtrap"

const TOKEN = "<YOUR-TOKEN-HERE>";
const TEST_INBOX_ID = "<YOUR-TEST-INBOX-ID-HERE>"
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({ token: TOKEN, testInboxId: TEST_INBOX_ID, accountId: ACCOUNT_ID });

const projectsClient = client.testing.projects

projectsClient.getList()
  .then(async (projects) => {
    if (projects) {
      const firstProject = projects[0].id // Grab the first project.
    
      const updatedProject = 
        await projectsClient.update(firstProject, 'test-project') // Update the name of the project.
    
      await projectsClient.delete()
    }
})
  .catch(console.error)
