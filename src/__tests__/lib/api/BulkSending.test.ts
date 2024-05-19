import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import BulkSendingAPI from "../../../lib/api/BulkSending";
import handleSendingError from "../../../lib/axios-logger";
import MailtrapError from "../../../lib/MailtrapError";

import CONFIG from "../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { BULK_SENDING_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/BulkSending: ", () => {
  let mock: AxiosMockAdapter;
  const bulkSendingAPI = new BulkSendingAPI(axios);

  describe("class Testing(): ", () => {
    describe("init: ", () => {
      it("initalizes with all necessary params.", () => {
        expect(bulkSendingAPI).toHaveProperty("send");
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

    describe("send(): ", () => {
      it("successfully sends email.", async () => {
        const endpoint = `${BULK_SENDING_ENDPOINT}/api/send`;
        const expectedResponseData = {
          success: true,
          message_ids: ["0c7fd939-02cf-11ed-88c2-0a58a9feac02"],
        };
        mock.onPost(endpoint).reply(200, expectedResponseData);

        const emailData = {
          from: {
            email: "sender.mock@email.com",
            name: "sender",
          },
          to: [
            {
              email: "recipient.mock@email.com",
              name: "recipient",
            },
          ],
          subject: "mock-subject",
          text: "Mock text",
          html: "<div>Mock text</div>",
        };

        const result = await bulkSendingAPI.send(emailData);

        expect(mock.history.post[0].url).toEqual(endpoint);
        expect(mock.history.post[0].data).toEqual(JSON.stringify(emailData));
        expect(result).toEqual(expectedResponseData);
      });

      it("rejects with api error.", async () => {
        const responseData = {
          success: false,
          errors: ["mock-error-1", "mock-error-2"],
        };

        const endpoint = `${BULK_SENDING_ENDPOINT}/api/send`;

        mock.onPost(endpoint).reply(400, responseData);

        const emailData = {
          from: {
            email: "sender.mock@email.com",
            name: "sender",
          },
          to: [
            {
              email: "recipient.mock@email.com",
              name: "recipient",
            },
          ],
          subject: "mock-subject",
          text: "Mock text",
          html: "<div>Mock text</div>",
        };

        const expectedErrorMessage = responseData.errors.join(",");

        expect.assertions(3);

        try {
          await bulkSendingAPI.send(emailData);
        } catch (error) {
          expect(mock.history.post[0].url).toEqual(endpoint);
          expect(mock.history.post[0].data).toEqual(JSON.stringify(emailData));

          if (error instanceof Error) {
            expect(error.message).toEqual(expectedErrorMessage);
          }
        }
      });

      it("rejects with axios error.", async () => {
        const emailData = {
          from: {
            email: "sender.mock@email.com",
            name: "sender",
          },
          to: [
            {
              email: "recipient.mock@email.com",
              name: "recipient",
            },
          ],
          subject: "mock-subject",
          text: "Mock text",
          html: "<div>Mock text</div>",
        };

        const expectedErrorMessage = "Request failed with status code 404";

        expect.assertions(2);

        try {
          await bulkSendingAPI.send(emailData);
        } catch (error) {
          expect(error).toBeInstanceOf(MailtrapError);

          if (error instanceof MailtrapError) {
            expect(error.message).toEqual(expectedErrorMessage);
          }
        }
      });
    });
  });
});
