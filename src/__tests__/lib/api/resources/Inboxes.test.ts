import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import Inboxes from "../../../../lib/api/resources/Inboxes";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/Inboxes: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const inboxesAPI = new Inboxes(axios, accountId);
  const responseData = {
    id: 10,
    name: "mock-name",
    username: "mock-username",
    password: "mock-password",
    max_size: 10,
    status: "mock-status",
    email_username: "mock-email_username",
    email_username_enabled: false,
    sent_messages_count: 10,
    forwarded_messages_count: 10,
    used: false,
    forward_from_email_address: "mock-forward_from_email_address",
    project_id: 10,
    domain: "mock-domain",
    pop3_domain: "mock-pop3_domain",
    email_domain: "mock-email_domain",
    smtp_ports: [],
    pop3_ports: [],
    emails_count: 10,
    emails_unread_count: 10,
    last_message_sent_at: null,
    max_message_size: 10,
    permissions: [],
  };

  describe("class Inboxes(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(inboxesAPI).toHaveProperty("cleanInbox");
        expect(inboxesAPI).toHaveProperty("create");
        expect(inboxesAPI).toHaveProperty("delete");
        expect(inboxesAPI).toHaveProperty("enableEmailAddress");
        expect(inboxesAPI).toHaveProperty("getInboxAttributes");
        expect(inboxesAPI).toHaveProperty("getList");
        expect(inboxesAPI).toHaveProperty("markAsRead");
        expect(inboxesAPI).toHaveProperty("resetCredentials");
        expect(inboxesAPI).toHaveProperty("resetEmailAddress");
        expect(inboxesAPI).toHaveProperty("updateInbox");
      });
    });
  });

  beforeAll(() => {
    /**
     * Init Axios interceptors for handling response.data, errors.
     */
    axios.interceptors.response.use(
      (response) => response.data,
      handleSendingError
    );
    mock = new AxiosMockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  describe("create(): ", () => {
    it("successfully creates project.", async () => {
      const projectId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/projects/${projectId}/inboxes`;

      mock.onPost(endpoint).reply(200, responseData);
      const inboxName = "mock-inboxName";
      const result = await inboxesAPI.create(projectId, inboxName);

      const sentData = { inbox: { name: inboxName } };

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(mock.history.post[0].data).toEqual(JSON.stringify(sentData));
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const projectId = 1;
      const inboxName = "mock-inboxName";
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await inboxesAPI.create(projectId, inboxName);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });

    describe("updateInbox(): ", () => {
      it("succesfully updates inbox.", async () => {
        const inboxId = 1;
        const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${inboxId}`;

        mock.onPatch(endpoint).reply(200, responseData);
        const name = "mock-inboxName";
        const emailUsername = "mock@email.com";
        const result = await inboxesAPI.updateInbox(inboxId, {
          name,
          emailUsername,
        });

        const sentData = {
          inbox: {
            name,
            email_username: emailUsername,
          },
        };

        expect(mock.history.patch[0].url).toEqual(endpoint);
        expect(mock.history.patch[0].data).toEqual(JSON.stringify(sentData));
        expect(result).toEqual(responseData);
      });

      it("fails with error", async () => {
        const inboxId = 1;
        const expectedErrorMessage = "Request failed with status code 404";

        const name = "mock-inboxName";
        const emailUsername = "mock@email.com";

        expect.assertions(2);

        try {
          await inboxesAPI.updateInbox(inboxId, {
            name,
            emailUsername,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(MailtrapError);

          if (error instanceof MailtrapError) {
            expect(error.message).toEqual(expectedErrorMessage);
          }
        }
      });
    });

    describe("getInboxAttributes(): ", () => {
      it("succesfully gets inbox attributes.", async () => {
        const inboxId = 1;
        const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${inboxId}`;

        mock.onGet(endpoint).reply(200, responseData);

        const result = await inboxesAPI.getInboxAttributes(inboxId);

        expect(mock.history.get[0].url).toEqual(endpoint);
        expect(result).toEqual(responseData);
      });

      it("fails with error", async () => {
        const inboxId = 1;
        const expectedErrorMessage = "Request failed with status code 404";

        expect.assertions(2);

        try {
          await inboxesAPI.getInboxAttributes(inboxId);
        } catch (error) {
          expect(error).toBeInstanceOf(MailtrapError);

          if (error instanceof MailtrapError) {
            expect(error.message).toEqual(expectedErrorMessage);
          }
        }
      });
    });
  });

  describe("delete(): ", () => {
    it("succesfully deletes inbox.", async () => {
      const inboxId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${inboxId}`;

      mock.onDelete(endpoint).reply(200, responseData);

      const result = await inboxesAPI.delete(inboxId);

      expect(mock.history.delete[0].url).toEqual(endpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error", async () => {
      const inboxId = 1;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await inboxesAPI.delete(inboxId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("cleanInbox(): ", () => {
    it("succesfully cleans inbox.", async () => {
      const inboxId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${inboxId}/clean`;

      mock.onPatch(endpoint).reply(200, responseData);

      const result = await inboxesAPI.cleanInbox(inboxId);

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(mock.history.patch[0].data).toBeUndefined();
      expect(result).toEqual(responseData);
    });

    it("fails with error", async () => {
      const inboxId = 1;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await inboxesAPI.cleanInbox(inboxId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("markAsRead(): ", () => {
    it("succesfully marks inbox as read.", async () => {
      const inboxId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${inboxId}/all_read`;

      mock.onPatch(endpoint).reply(200, responseData);

      const result = await inboxesAPI.markAsRead(inboxId);

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(mock.history.patch[0].data).toBeUndefined();
      expect(result).toEqual(responseData);
    });

    it("fails with error", async () => {
      const inboxId = 1;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await inboxesAPI.markAsRead(inboxId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("resetCredentials(): ", () => {
    it("succesfully resets credentials.", async () => {
      const inboxId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${inboxId}/reset_credentials`;

      mock.onPatch(endpoint).reply(200, responseData);

      const result = await inboxesAPI.resetCredentials(inboxId);

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(mock.history.patch[0].data).toBeUndefined();
      expect(result).toEqual(responseData);
    });

    it("fails with error", async () => {
      const inboxId = 1;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await inboxesAPI.resetCredentials(inboxId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("enableEmailAddress(): ", () => {
    it("succesfully toggles email availability.", async () => {
      const inboxId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${inboxId}/toggle_email_username`;

      mock.onPatch(endpoint).reply(200, responseData);

      const result = await inboxesAPI.enableEmailAddress(inboxId);

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(mock.history.patch[0].data).toBeUndefined();
      expect(result).toEqual(responseData);
    });

    it("fails with error", async () => {
      const inboxId = 1;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await inboxesAPI.enableEmailAddress(inboxId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("resetEmailAddress(): ", () => {
    it("succesfully resets email address.", async () => {
      const inboxId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${inboxId}/reset_email_username`;

      mock.onPatch(endpoint).reply(200, responseData);

      const result = await inboxesAPI.resetEmailAddress(inboxId);

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(mock.history.patch[0].data).toBeUndefined();
      expect(result).toEqual(responseData);
    });

    it("fails with error", async () => {
      const inboxId = 1;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await inboxesAPI.resetEmailAddress(inboxId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("getList(): ", () => {
    it("succesfully gets inbox list.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes`;

      const expectedResponseData = [responseData];

      mock.onGet(endpoint).reply(200, expectedResponseData);

      const result = await inboxesAPI.getList();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await inboxesAPI.getList();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
