import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import AccountAccesses from "../../../../lib/api/resources/AccountAccesses";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/AccountAccesses: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const accountAccessesAPI = new AccountAccesses(axios, accountId);
  const responseData = {
    id: "mock-id",
    message_id: "mock-message_id",
    filename: "mock-filename",
    attachment_type: "mock-attachment_type",
    content_type: "mock-content_type",
    content_id: "mock-content_id",
    transfer_encoding: "mock-transfer_encoding",
    attachment_size: 999,
    created_at: "mock-created_at",
    updated_at: "mock-updated_at",
    attachment_human_size: "mock-attachment_human_size",
    download_path: "mock-download_path",
  };
  const accountAccessId = 100;

  describe("class AccountAccesses(): ", () => {
    describe("init: ", () => {
      it("initalizes with all necessary params.", () => {
        expect(accountAccessesAPI).toHaveProperty(
          "listUserAndInviteAccountAccesses"
        );
        expect(accountAccessesAPI).toHaveProperty("removeAccountAccess");
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

  describe("listUserAndInviteAccountAccesses(): ", () => {
    it("successfully gets list of user and invite account accesses.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/account_accesses`;
      const expectedResponseData = [responseData];

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, expectedResponseData);
      const result =
        await accountAccessesAPI.listUserAndInviteAccountAccesses();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("successfully gets list of user and invite account accesses with filters.", async () => {
      const filters = {
        domainUuids: ["mock-domainUuids"],
        inboxIds: ["mock-inboxIds"],
        projectIds: ["mock-projectIds"],
      };

      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/account_accesses`;
      const expectedResponseData = [responseData];

      expect.assertions(3);

      mock.onGet(endpoint).reply(200, expectedResponseData);

      const result = await accountAccessesAPI.listUserAndInviteAccountAccesses(
        filters
      );
      const expectedParams = {
        domain_uuids: filters.domainUuids,
        inbox_ids: filters.inboxIds,
        project_ids: filters.projectIds,
      };

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(mock.history.get[0].params).toEqual(expectedParams);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await accountAccessesAPI.listUserAndInviteAccountAccesses();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("removeAccountAccess(): ", () => {
    it("removes account access.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/account_accesses/${accountAccessId}`;

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, responseData);
      const result = await accountAccessesAPI.removeAccountAccess(
        accountAccessId
      );

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await accountAccessesAPI.removeAccountAccess(accountAccessId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
