import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import Permissions from "../../../../lib/api/resources/Permissions";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/Permissions: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const permissionsAPI = new Permissions(axios, accountId);
  const responseData = [
    {
      resourceId: "3281",
      resourceType: "account",
    },
    {
      resourceId: "3809",
      resourceType: "inbox",
    },
  ];
  const accountAccessId = 100;

  describe("class Permissions(): ", () => {
    describe("init: ", () => {
      it("initalizes with all necessary params.", () => {
        expect(permissionsAPI).toHaveProperty("getResources");
        expect(permissionsAPI).toHaveProperty("manageUserOrToken");
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

  describe("manageUserOrToken(): ", () => {
    it("successfully manages user or token with access level and destroy.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/account_accesses/${accountAccessId}/permissions/bulk`;
      const expectedResponseData = [responseData];
      const permissions = [
        {
          resourceId: "3281",
          resourceType: "account",
          accessLevel: "viewer",
        },
        {
          resourceId: "3809",
          resourceType: "inbox",
          _destroy: "true",
        },
      ];

      expect.assertions(2);

      mock.onPut(endpoint).reply(200, expectedResponseData);
      const result = await permissionsAPI.manageUserOrToken(
        accountAccessId,
        permissions
      );

      expect(mock.history.put[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("successfully manages user or token without access level and destroy.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/account_accesses/${accountAccessId}/permissions/bulk`;
      const expectedResponseData = [responseData];
      const permissions = [
        {
          resourceId: "3281",
          resourceType: "account",
        },
        {
          resourceId: "3809",
          resourceType: "inbox",
        },
      ];

      expect.assertions(2);

      mock.onPut(endpoint).reply(200, expectedResponseData);
      const result = await permissionsAPI.manageUserOrToken(
        accountAccessId,
        permissions
      );

      expect(mock.history.put[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";
      const permissions = [
        {
          resourceId: "3281",
          resourceType: "account",
        },
        {
          resourceId: "3809",
          resourceType: "inbox",
        },
      ];

      expect.assertions(2);

      try {
        await permissionsAPI.manageUserOrToken(accountAccessId, permissions);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("getResources(): ", () => {
    it("successfully gets resources.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/account_accesses`;

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, responseData);
      const result = await permissionsAPI.getResources();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await permissionsAPI.getResources();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
