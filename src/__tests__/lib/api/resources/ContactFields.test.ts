import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import ContactFieldsApi from "../../../../lib/api/resources/ContactFields";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";
import { ContactFieldOptions } from "../../../../types/api/contact-fields";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/ContactFields: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const contactFieldsAPI = new ContactFieldsApi(axios, accountId);

  const createContactFieldRequest: ContactFieldOptions = {
    name: "Phone Number",
    merge_tag: "phone",
    data_type: "text",
  };

  const createContactFieldResponse = {
    data: {
      id: 4134638,
      name: "Phone Number",
      merge_tag: "phone",
      data_type: "text",
      created_at: 1742820600230,
      updated_at: 1742820600230,
    },
  };

  const updateContactFieldRequest: ContactFieldOptions = {
    name: "Mobile Phone",
    merge_tag: "mobile_phone",
    data_type: "text",
  };

  const updateContactFieldResponse = {
    data: {
      id: 4134638,
      name: "Mobile Phone",
      merge_tag: "mobile_phone",
      data_type: "text",
      created_at: 1742820600230,
      updated_at: 1742820600230,
    },
  };

  const getContactFieldResponse = {
    data: {
      id: 4134638,
      name: "Phone Number",
      merge_tag: "phone",
      data_type: "text",
      created_at: 1742820600230,
      updated_at: 1742820600230,
    },
  };

  const getContactFieldsResponse = {
    data: [
      {
        id: 3059351,
        name: "First name",
        merge_tag: "first_name",
        data_type: "text",
        created_at: 1742820600230,
        updated_at: 1742820600230,
      },
      {
        id: 3059352,
        name: "Last name",
        merge_tag: "last_name",
        data_type: "text",
        created_at: 1742820600230,
        updated_at: 1742820600230,
      },
    ],
  };

  describe("class ContactFieldsApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(contactFieldsAPI).toHaveProperty("create");
        expect(contactFieldsAPI).toHaveProperty("get");
        expect(contactFieldsAPI).toHaveProperty("getList");
        expect(contactFieldsAPI).toHaveProperty("update");
        expect(contactFieldsAPI).toHaveProperty("delete");
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

  describe("getList(): ", () => {
    it("successfully gets all contact fields.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/fields`;
      const expectedResponseData = getContactFieldsResponse;

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, expectedResponseData);
      const result = await contactFieldsAPI.getList();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error when getting contact fields.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/fields`;
      const expectedErrorMessage = "Request failed with status code 500";

      expect.assertions(2);

      mock.onGet(endpoint).reply(500, { error: expectedErrorMessage });

      try {
        await contactFieldsAPI.getList();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("get(): ", () => {
    const fieldId = 4134638;

    it("successfully gets a contact field by ID.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/fields/${fieldId}`;
      const expectedResponseData = getContactFieldResponse;

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, expectedResponseData);
      const result = await contactFieldsAPI.get(fieldId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error when getting a contact field.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/fields/${fieldId}`;
      const expectedErrorMessage = "Contact field not found";

      expect.assertions(2);

      mock.onGet(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await contactFieldsAPI.get(fieldId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("create(): ", () => {
    it("successfully creates a contact field.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/fields`;
      const expectedResponseData = createContactFieldResponse;

      expect.assertions(2);

      mock
        .onPost(endpoint, createContactFieldRequest)
        .reply(200, expectedResponseData);
      const result = await contactFieldsAPI.create(createContactFieldRequest);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error when creating a contact field.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/fields`;
      const expectedErrorMessage = "Request failed with status code 422";

      expect.assertions(2);

      mock.onPost(endpoint).reply(422, { error: expectedErrorMessage });

      try {
        await contactFieldsAPI.create(createContactFieldRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("update(): ", () => {
    const fieldId = 4134638;

    it("successfully updates a contact field.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/fields/${fieldId}`;
      const expectedResponseData = updateContactFieldResponse;

      expect.assertions(2);

      mock
        .onPatch(endpoint, updateContactFieldRequest)
        .reply(200, expectedResponseData);
      const result = await contactFieldsAPI.update(
        fieldId,
        updateContactFieldRequest
      );

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("successfully updates a contact field with partial data.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/fields/${fieldId}`;
      const partialUpdateRequest = { name: "Work Phone" };
      const expectedResponseData = {
        data: {
          id: fieldId,
          name: "Work Phone",
          merge_tag: "phone",
          data_type: "text",
          created_at: 1742820600230,
          updated_at: 1742820600230,
        },
      };

      expect.assertions(2);

      mock
        .onPatch(endpoint, partialUpdateRequest)
        .reply(200, expectedResponseData);
      const result = await contactFieldsAPI.update(
        fieldId,
        partialUpdateRequest
      );

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error when updating a contact field.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/fields/${fieldId}`;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      mock.onPatch(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await contactFieldsAPI.update(fieldId, updateContactFieldRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("delete(): ", () => {
    const fieldId = 4134638;

    it("successfully deletes a contact field.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/fields/${fieldId}`;

      expect.assertions(1);

      mock.onDelete(endpoint).reply(204);
      await contactFieldsAPI.delete(fieldId);

      expect(mock.history.delete[0].url).toEqual(endpoint);
    });

    it("fails with error when deleting a contact field.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/fields/${fieldId}`;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      mock.onDelete(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await contactFieldsAPI.delete(fieldId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
