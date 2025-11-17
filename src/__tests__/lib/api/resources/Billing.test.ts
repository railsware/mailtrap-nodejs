import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import Billing from "../../../../lib/api/resources/Billing";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/Billing: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const billingAPI = new Billing(axios, accountId);
  const responseData = {
    billing: {
      cycle_start: "2024-01-01T00:00:00Z",
      cycle_end: "2024-01-31T23:59:59Z",
    },
    sending: {
      plan: {
        name: "Pro",
      },
      usage: {
        sent_messages_count: {
          current: 1000,
          limit: 10000,
        },
      },
    },
    testing: {
      plan: {
        name: "Pro",
      },
      usage: {
        sent_messages_count: {
          current: 500,
          limit: 5000,
        },
        forwarded_messages_count: {
          current: 200,
          limit: 2000,
        },
      },
    },
  };

  describe("class Billing(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(billingAPI).toHaveProperty("getCurrentBillingCycleUsage");
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

  describe("getCurrentBillingCycleUsage(): ", () => {
    it("successfully gets billing cycle usage.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/billing/usage`;

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, responseData);
      const result = await billingAPI.getCurrentBillingCycleUsage();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error when accountId is invalid.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/billing/usage`;
      const expectedErrorMessage = "Account not found";
      const statusCode = 404;

      expect.assertions(3);

      mock.onGet(endpoint).reply(statusCode, { error: expectedErrorMessage });

      try {
        await billingAPI.getCurrentBillingCycleUsage();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
          // Verify status code is accessible via cause property
          // @ts-expect-error ES5 types don't know about cause property
          expect(error.cause?.response?.status).toEqual(statusCode);
        }
      }
    });

    it("fails with error when billing endpoint returns 403 Forbidden.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/billing/usage`;
      const expectedErrorMessage = "Access denied";
      const statusCode = 403;

      expect.assertions(3);

      mock.onGet(endpoint).reply(statusCode, { error: expectedErrorMessage });

      try {
        await billingAPI.getCurrentBillingCycleUsage();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
          // Verify status code is accessible via cause property
          // @ts-expect-error ES5 types don't know about cause property
          expect(error.cause?.response?.status).toEqual(statusCode);
        }
      }
    });

    it("fails with error when no error body is provided.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/billing/usage`;
      const expectedErrorMessage = "Request failed with status code 500";
      const statusCode = 500;

      expect.assertions(3);

      mock.onGet(endpoint).reply(statusCode);

      try {
        await billingAPI.getCurrentBillingCycleUsage();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
          // Verify status code is accessible via cause property
          // @ts-expect-error ES5 types don't know about cause property
          expect(error.cause?.response?.status).toEqual(statusCode);
        }
      }
    });
  });
});
