import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import ContactEventsApi from "../../../../lib/api/resources/ContactEvents";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/ContactEvents: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const contactEventsAPI = new ContactEventsApi(axios, accountId);

  const contactIdentifier = "john.smith@example.com";
  const payload = {
    name: "purchase_completed",
    params: {
      order_id: 12345,
      amount: 49.99,
      currency: "USD",
      coupon_used: false,
    },
  };

  const successResponse = {
    contact_id: "019a4a05-5924-7d93-86ce-f79293418083",
    contact_email: contactIdentifier,
    name: payload.name,
    params: payload.params,
  };

  describe("class ContactEventsApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(contactEventsAPI).toHaveProperty("create");
      });
    });
  });

  beforeAll(() => {
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
    it("successfully creates a contact event.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/${contactIdentifier}/events`;
      const expectedResponseData = successResponse;

      expect.assertions(2);

      mock.onPost(endpoint, payload).reply(200, expectedResponseData);
      const result = await contactEventsAPI.create(contactIdentifier, payload);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error when accountId is invalid.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/${contactIdentifier}/events`;
      const expectedErrorMessage = "Account not found";

      expect.assertions(2);

      mock.onPost(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await contactEventsAPI.create(contactIdentifier, payload);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });

    it("fails with error when payload is invalid.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/${contactIdentifier}/events`;
      const expectedErrorMessage = "Invalid event name";

      expect.assertions(2);

      mock.onPost(endpoint).reply(422, { error: expectedErrorMessage });

      try {
        await contactEventsAPI.create(contactIdentifier, payload);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
