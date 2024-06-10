import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import BulkAPI from "../../../lib/api/Bulk";
import handleSendingError from "../../../lib/axios-logger";
import MailtrapError from "../../../lib/MailtrapError";

import CONFIG from "../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { BULK_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/Bulk: ", () => {
  let mock: AxiosMockAdapter;
  const bulkAPI = new BulkAPI(axios);

  describe("class Testing(): ", () => {
    describe("init: ", () => {
      it("initalizes with all necessary params.", () => {
        expect(bulkAPI).toHaveProperty("send");
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
        const endpoint = `${BULK_ENDPOINT}/api/send`;
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

        const result = await bulkAPI.send(emailData);

        expect(mock.history.post[0].url).toEqual(endpoint);
        expect(mock.history.post[0].data).toEqual(JSON.stringify(emailData));
        expect(result).toEqual(expectedResponseData);
      });

      it("handles an API error.", async () => {
        const responseData = {
          success: false,
          errors: ["mock-error-1", "mock-error-2"],
        };

        const endpoint = `${BULK_ENDPOINT}/api/send`;

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
          await bulkAPI.send(emailData);
        } catch (error) {
          expect(mock.history.post[0].url).toEqual(endpoint);
          expect(mock.history.post[0].data).toEqual(JSON.stringify(emailData));

          if (error instanceof Error) {
            expect(error.message).toEqual(expectedErrorMessage);
          }
        }
      });

      it("handles an HTTP transport error.", async () => {
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
          await bulkAPI.send(emailData);
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
