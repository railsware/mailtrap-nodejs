import { MailtrapClient } from "../../src"

const TOKEN = "<YOUR-TOKEN-HERE>";
const TEST_INBOX_ID = "<YOUR-TEST-INBOX-ID-HERE>"
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({ token: TOKEN, testInboxId: TEST_INBOX_ID, accountId: ACCOUNT_ID });

const accountAccessesClient = client.general.accountAccesses

accountAccessesClient.listUserAndInviteAccountAccesses()
  .then((result) => {
    const firstResult = result[0]
    
    return accountAccessesClient.removeAccountAccess(firstResult.id)
  })
  .catch(console.error)

