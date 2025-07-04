import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import Accounts from "../../../../lib/api/resources/Accounts";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/Accounts: ", () => {
  let mock: AxiosMockAdapter;

  const accountsAPI = new Accounts(axios);
  const responseData = {
    id: 100,
    name: "mock-name",
    access_levels: [1],
  };

  describe("class Accounts(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(accountsAPI).toHaveProperty("getAllAccounts");
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

  describe("removeAccountAccess(): ", () => {
    it("successfully removes account access.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts`;

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, responseData);
      const result = await accountsAPI.getAllAccounts();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await accountsAPI.getAllAccounts();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
