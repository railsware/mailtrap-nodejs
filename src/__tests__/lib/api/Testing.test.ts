import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import Testing from "../../../lib/api/Testing";
import handleSendingError from "../../../lib/axios-logger";

import CONFIG from "../../../config";
import MailtrapError from "../../../lib/MailtrapError";

const { CLIENT_SETTINGS } = CONFIG;
const { TESTING_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/Testing: ", () => {
  let mock: AxiosMockAdapter;
  const testInboxId = 100;
  const testingAPI = new Testing(axios, testInboxId);

  describe("class Testing(): ", () => {
    describe("init: ", () => {
      it("initalizes with all necessary params.", () => {
        expect(testingAPI).toHaveProperty("send");
        expect(testingAPI).toHaveProperty("projects");
        expect(testingAPI).toHaveProperty("inboxes");
        expect(testingAPI).toHaveProperty("messages");
        expect(testingAPI).toHaveProperty("attachments");
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
        const endpoint = `${TESTING_ENDPOINT}/api/send/${testInboxId}`;
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

        const result = await testingAPI.send(emailData);

        expect(mock.history.post[0].url).toEqual(endpoint);
        expect(mock.history.post[0].data).toEqual(JSON.stringify(emailData));
        expect(result).toEqual(expectedResponseData);
      });

      it("handles an API error.", async () => {
        const responseData = {
          success: false,
          errors: ["mock-error-1", "mock-error-2"],
        };

        const endpoint = `${TESTING_ENDPOINT}/api/send/${testInboxId}`;

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
          await testingAPI.send(emailData);
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
          await testingAPI.send(emailData);
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
