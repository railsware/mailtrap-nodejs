import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import ContactsApi from "../../../../lib/api/resources/Contacts";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/Contacts: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const contactsAPI = new ContactsApi(axios, accountId);

  const createContactRequest = {
    contact: {
      email: "john.smith@example.com",
      fields: {
        first_name: "John",
        last_name: "Smith",
      },
      list_ids: [1, 2, 3],
    },
  };

  const createContactResponse = {
    data: {
      id: "018dd5e3-f6d2-7c00-8f9b-e5c3f2d8a132",
      status: "subscribed",
      email: "john.smith@example.com",
      fields: {
        first_name: "John",
        last_name: "Smith",
      },
      list_ids: [1, 2, 3],
      created_at: 1742820600230,
      updated_at: 1742820600230,
    },
  };

  const updateContactRequest = {
    contact: {
      email: "customer1@example.com",
      fields: {
        first_name: "John",
        last_name: "Smith",
        zip_code: "11111",
      },
      list_ids_included: [1, 2, 3],
      list_ids_excluded: [4, 5, 6],
      unsubscribed: false,
    },
  };

  const updateContactResponse = {
    data: {
      id: "01972696-84ef-783b-8a87-48067db2d16b",
      email: "john.smith111@example.com",
      created_at: 1748699088076,
      updated_at: 1748700400794,
      list_ids: [],
      status: "subscribed",
      fields: {
        first_name: "Johnny",
        last_name: "Smith",
      },
    },
  };

  describe("class ContactsApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(contactsAPI).toHaveProperty("create");
        expect(contactsAPI).toHaveProperty("update");
        expect(contactsAPI).toHaveProperty("delete");
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
    it("successfully creates a contact.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts`;
      const expectedResponseData = createContactResponse;

      expect.assertions(2);

      mock
        .onPost(endpoint, createContactRequest)
        .reply(200, expectedResponseData);
      const result = await contactsAPI.create(createContactRequest.contact);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts`;
      const expectedErrorMessage = "Request failed with status code 400";

      expect.assertions(2);

      mock.onPost(endpoint).reply(400, { error: expectedErrorMessage });

      try {
        await contactsAPI.create(createContactRequest.contact);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("update(): ", () => {
    const contactId = "018dd5e3-f6d2-7c00-8f9b-e5c3f2d8a132";

    it("successfully updates a contact.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/${contactId}`;
      const expectedResponseData = updateContactResponse;

      expect.assertions(2);

      mock
        .onPatch(endpoint, updateContactRequest)
        .reply(200, expectedResponseData);
      const result = await contactsAPI.update(
        contactId,
        updateContactRequest.contact
      );

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/${contactId}`;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      mock.onPatch(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await contactsAPI.update(contactId, updateContactRequest.contact);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("delete(): ", () => {
    const contactId = "018dd5e3-f6d2-7c00-8f9b-e5c3f2d8a132";

    it("successfully deletes a contact.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/${contactId}`;
      const expectedResponseData = {
        data: {
          id: contactId,
          status: "unsubscribed",
          email: "john.smith@example.com",
          fields: {
            first_name: "John",
            last_name: "Smith",
          },
          list_ids: [],
          created_at: 1740659901189,
          updated_at: 1742903266889,
        },
      };

      expect.assertions(2);

      mock.onDelete(endpoint).reply(200, expectedResponseData);
      const result = await contactsAPI.delete(contactId);

      expect(mock.history.delete[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/${contactId}`;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      mock.onDelete(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await contactsAPI.delete(contactId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("list(): ", () => {
    const contactListsResponse = [
      {
        id: 26730,
        name: "Customers",
      },
      {
        id: 26731,
        name: "Old Contacts",
      },
    ];

    it("successfully gets list of contact lists.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists`;
      const expectedResponseData = contactListsResponse;

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, expectedResponseData);
      const result = await contactsAPI.list();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error when API returns 403.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists`;
      const expectedErrorMessage = "Request failed with status code 403";

      expect.assertions(2);

      mock.onGet(endpoint).reply(403, {
        response: {
          status: 403,
          statusText: "Forbidden",
        },
      });

      try {
        await contactsAPI.list();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
