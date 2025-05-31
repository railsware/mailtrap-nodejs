import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import ContactListsApi from "../../../../lib/api/resources/ContactLists";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/contacts/ContactLists: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const contactListsAPI = new ContactListsApi(axios, accountId);
  const responseData = [
    {
      id: 26730,
      name: "Customers",
    },
    {
      id: 26731,
      name: "Old Contacts",
    },
  ];

  describe("class ContactListsApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(contactListsAPI).toHaveProperty("list");
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

  describe("list(): ", () => {
    it("successfully gets list of contact lists.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists`;
      const expectedResponseData = responseData;

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, expectedResponseData);
      const result = await contactListsAPI.list();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await contactListsAPI.list();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
