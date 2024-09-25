import { MailtrapClient } from "mailtrap"

const TOKEN = "<YOUR-TOKEN-HERE>";
const TEST_INBOX_ID = "<YOUR-TEST-INBOX-ID-HERE>"
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({ token: TOKEN, testInboxId: TEST_INBOX_ID, accountId: ACCOUNT_ID });

const accountsClient = client.general.accounts

accountsClient.getAllAccounts()
  .then(console.log)
  .catch(console.error)
