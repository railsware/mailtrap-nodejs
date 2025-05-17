/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-console */
import axios, { AxiosError } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { Mail, MailtrapClient } from "../..";
import MailtrapError from "../../lib/MailtrapError";

import CONFIG from "../../config";
import TestingAPI from "../../lib/api/Testing";
import GeneralAPI from "../../lib/api/General";

const { ERRORS, CLIENT_SETTINGS } = CONFIG;
const { TESTING_ENDPOINT, BULK_ENDPOINT, SENDING_ENDPOINT } = CLIENT_SETTINGS;
const { TEST_INBOX_ID_MISSING, ACCOUNT_ID_MISSING, BULK_SANDBOX_INCOMPATIBLE } =
  ERRORS;

describe("lib/mailtrap-client: ", () => {
  let mock: AxiosMockAdapter;

  const goodMail: Mail = {
    from: {
      name: "Mailtrap",
      email: "sender@mailtrap.io",
    },
    to: [
      {
        email: "recipient@mailtrap.io",
      },
    ],
    subject: "My Subject",
    text: "My TEXT",
  };

  describe("send():", () => {
    beforeAll(() => {
      mock = new AxiosMockAdapter(axios);
    });

    afterEach(() => {
      mock.reset();
    });

    it("rejects with Mailtrap error, bulk and sanbox modes are incompatible.", async () => {
      const client = new MailtrapClient({
        token: "MY_API_TOKEN",
        bulk: true,
        sandbox: true,
      });

      try {
        await client.send(goodMail);
      } catch (error) {
        expect(error).toEqual(new MailtrapError(BULK_SANDBOX_INCOMPATIBLE));
      }
    });
    const testInboxId = 100;

    it("successfully sends testing email.", async () => {
      const testingClient = new MailtrapClient({
        token: "MY_API_TOKEN",
        sandbox: true,
        testInboxId,
      });
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

      const result = await testingClient.send(emailData);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(mock.history.post[0].data).toEqual(JSON.stringify(emailData));
      expect(result).toEqual(expectedResponseData);
    });

    it("successfully sends bulk email.", async () => {
      const bulkClient = new MailtrapClient({
        token: "MY_API_TOKEN",
        bulk: true,
      });
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

      const result = await bulkClient.send(emailData);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(mock.history.post[0].data).toEqual(JSON.stringify(emailData));
      expect(result).toEqual(expectedResponseData);
    });

    it("handles an API error.", async () => {
      const testingClient = new MailtrapClient({
        token: "MY_API_TOKEN",
        sandbox: true,
        testInboxId,
      });
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
        await testingClient.send(emailData);
      } catch (error) {
        expect(mock.history.post[0].url).toEqual(endpoint);
        expect(mock.history.post[0].data).toEqual(JSON.stringify(emailData));

        if (error instanceof Error) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });

    it("handles an HTTP transport error.", async () => {
      const testingClient = new MailtrapClient({
        token: "MY_API_TOKEN",
        sandbox: true,
        testInboxId,
      });
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
        await testingClient.send(emailData);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });

    it("sends request to mailtrap api", async () => {
      const successData = {
        success: "true",
        message_ids: ["00000000-00000000-00000000-00000001"],
      };
      const endpoint = `${SENDING_ENDPOINT}/api/send`;

      mock.onPost(endpoint).reply(200, successData);

      const client = new MailtrapClient({ token: "MY_API_TOKEN" });
      const result = await client.send(goodMail);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(mock.history.post[0].headers).toMatchObject({
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: "Bearer MY_API_TOKEN",
        Connection: "keep-alive",
        "User-Agent":
          "mailtrap-nodejs (https://github.com/railsware/mailtrap-nodejs)",
      });
      expect(mock.history.post[0].data).toEqual(
        "{" +
          '"from":{"name":"Mailtrap","email":"sender@mailtrap.io"},' +
          '"to":[{"email":"recipient@mailtrap.io"}],' +
          '"subject":"My Subject",' +
          '"text":"My TEXT"' +
          "}"
      );
      expect(result).toEqual(successData);
    });

    it("sends request to mailtrap api with template", async () => {
      const successData = {
        success: "true",
        message_ids: ["00000000-00000000-00000000-00000001"],
      };

      mock
        .onPost("https://send.api.mailtrap.io/api/send")
        .reply(200, successData);

      const client = new MailtrapClient({ token: "MY_API_TOKEN" });
      const result = await client.send({
        from: {
          name: "Mailtrap",
          email: "sender@mailtrap.io",
        },
        to: [
          {
            email: "recipient@mailtrap.io",
          },
        ],
        template_uuid: "813e39db-c74a-4830-b037-0e6ba8b1fe88",
        template_variables: {
          user_name: "John Doe",
        },
      });

      expect(mock.history.post[0].url).toEqual(
        "https://send.api.mailtrap.io/api/send"
      );
      expect(mock.history.post[0].headers).toMatchObject({
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: "Bearer MY_API_TOKEN",
        Connection: "keep-alive",
        "User-Agent":
          "mailtrap-nodejs (https://github.com/railsware/mailtrap-nodejs)",
      });
      expect(mock.history.post[0].data).toEqual(
        "{" +
          '"from":{"name":"Mailtrap","email":"sender@mailtrap.io"},' +
          '"to":[{"email":"recipient@mailtrap.io"}],' +
          '"template_uuid":"813e39db-c74a-4830-b037-0e6ba8b1fe88",' +
          '"template_variables":{"user_name":"John Doe"}' +
          "}"
      );
      expect(result).toEqual(successData);
    });

    it("throws error returned from the server", async () => {
      mock.onPost("https://send.api.mailtrap.io/api/send").reply(400, {
        success: false,
        errors: ["subject is missing", "message is missing"],
      });

      const client = new MailtrapClient({ token: "MY_API_TOKEN" });

      try {
        await client.send(goodMail);
      } catch (err) {
        expect(err).toBeInstanceOf(MailtrapError);
        if (err instanceof MailtrapError) {
          expect(err.message).toEqual("subject is missing,message is missing");
          // @ts-expect-error ES5 types don't know about cause property
          expect(err.cause).toBeInstanceOf(AxiosError);
        }
      }
    });

    it("wraps other network errors", async () => {
      // don't provide mocks, to generate 404 error
      const client = new MailtrapClient({ token: "MY_API_TOKEN" });

      try {
        await client.send(goodMail);
      } catch (err) {
        expect(err).toBeInstanceOf(MailtrapError);
        if (err instanceof MailtrapError) {
          expect(err.message).toEqual("Request failed with status code 404");
          // @ts-expect-error ES5 types don't know about cause property
          expect(err.cause).toBeInstanceOf(AxiosError);
        }
      }
    });

    it("successfully sends a batch of emails.", async () => {
      const batchClient = new MailtrapClient({
        token: "MY_API_TOKEN",
        bulk: true,
      });
      const endpoint = `${BULK_ENDPOINT}/api/batch`;
      const expectedResponseData = {
        success: true,
        message_ids: ["0c7fd939-02cf-11ed-88c2-0a58a9feac02"],
      };
      mock.onPost(endpoint).reply(200, expectedResponseData);

      const batchData = {
        base: {
          from: {
            email: "sender@mailtrap.io",
            name: "Mailtrap",
          },
          subject: "Batch Subject",
          text: "Batch Text",
        },
        requests: [
          {
            to: [
              {
                email: "recipient1.mock@email.com",
                name: "recipient1",
              },
            ],
          },
          {
            to: [
              {
                email: "recipient2.mock@email.com",
                name: "recipient2",
              },
            ],
          },
        ],
      };

      const result = await batchClient.batchSend(batchData);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(mock.history.post[0].data).toEqual(
        JSON.stringify({
          base: batchData.base,
          requests: batchData.requests.map((req) => ({
            to: req.to,
          })),
        })
      );
      expect(result).toEqual(expectedResponseData);
    });

    describe("batch sending:", () => {
      it("successfully sends a batch of emails in bulk mode", async () => {
        const batchClient = new MailtrapClient({
          token: "MY_API_TOKEN",
          bulk: true,
        });
        const endpoint = `${BULK_ENDPOINT}/api/batch`;
        const expectedResponseData = {
          success: true,
          message_ids: ["0c7fd939-02cf-11ed-88c2-0a58a9feac02"],
        };
        mock.onPost(endpoint).reply(200, expectedResponseData);

        const batchData = {
          base: {
            from: {
              email: "sender@mailtrap.io",
              name: "Mailtrap",
            },
            subject: "Batch Subject",
            text: "Batch Text",
          },
          requests: [
            {
              to: [
                {
                  email: "recipient1.mock@email.com",
                  name: "recipient1",
                },
              ],
            },
            {
              to: [
                {
                  email: "recipient2.mock@email.com",
                  name: "recipient2",
                },
              ],
            },
          ],
        };

        const result = await batchClient.batchSend(batchData);

        expect(mock.history.post[0].url).toEqual(endpoint);
        expect(mock.history.post[0].data).toEqual(
          JSON.stringify({
            base: batchData.base,
            requests: batchData.requests.map((req) => ({
              to: req.to,
            })),
          })
        );
        expect(result).toEqual(expectedResponseData);
      });

      it("successfully sends a batch of emails in sandbox mode", async () => {
        const batchClient = new MailtrapClient({
          token: "MY_API_TOKEN",
          sandbox: true,
          testInboxId: 100,
        });
        const endpoint = `${TESTING_ENDPOINT}/api/batch/100`;
        const expectedResponseData = {
          success: true,
          message_ids: ["0c7fd939-02cf-11ed-88c2-0a58a9feac02"],
        };
        mock.onPost(endpoint).reply(200, expectedResponseData);

        const batchData = {
          base: {
            from: {
              email: "sender@mailtrap.io",
              name: "Mailtrap",
            },
            subject: "Batch Subject",
            text: "Batch Text",
          },
          requests: [
            {
              to: [
                {
                  email: "recipient1.mock@email.com",
                  name: "recipient1",
                },
              ],
            },
            {
              to: [
                {
                  email: "recipient2.mock@email.com",
                  name: "recipient2",
                },
              ],
            },
          ],
        };

        const result = await batchClient.batchSend(batchData);

        expect(mock.history.post[0].url).toEqual(endpoint);
        expect(mock.history.post[0].data).toEqual(
          JSON.stringify({
            base: batchData.base,
            requests: batchData.requests.map((req) => ({
              to: req.to,
            })),
          })
        );
        expect(result).toEqual(expectedResponseData);
      });

      it("successfully sends a batch of emails with template", async () => {
        const batchClient = new MailtrapClient({
          token: "MY_API_TOKEN",
          bulk: true,
        });
        const endpoint = `${BULK_ENDPOINT}/api/batch`;
        const expectedResponseData = {
          success: true,
          message_ids: ["0c7fd939-02cf-11ed-88c2-0a58a9feac02"],
        };
        mock.onPost(endpoint).reply(200, expectedResponseData);

        const batchData = {
          base: {
            from: {
              email: "sender@mailtrap.io",
              name: "Mailtrap",
            },
            template_uuid: "813e39db-c74a-4830-b037-0e6ba8b1fe88",
            template_variables: {
              company_name: "Mailtrap",
            },
          },
          requests: [
            {
              to: [
                {
                  email: "recipient1.mock@email.com",
                  name: "recipient1",
                },
              ],
            },
            {
              to: [
                {
                  email: "recipient2.mock@email.com",
                  name: "recipient2",
                },
              ],
            },
          ],
        };

        const result = await batchClient.batchSend(batchData);

        expect(mock.history.post[0].url).toEqual(endpoint);
        expect(mock.history.post[0].data).toEqual(
          JSON.stringify({
            base: batchData.base,
            requests: batchData.requests.map((req) => ({
              to: req.to,
            })),
          })
        );
        expect(result).toEqual(expectedResponseData);
      });

      it("successfully sends a batch of transactional emails", async () => {
        const batchClient = new MailtrapClient({
          token: "MY_API_TOKEN",
        });
        const endpoint = `${SENDING_ENDPOINT}/api/batch`;
        const expectedResponseData = {
          success: true,
          message_ids: ["0c7fd939-02cf-11ed-88c2-0a58a9feac02"],
        };
        mock.onPost(endpoint).reply(200, expectedResponseData);

        const batchData = {
          base: {
            from: {
              email: "sender@mailtrap.io",
              name: "Mailtrap",
            },
            subject: "Transactional Batch Subject",
            text: "Transactional Batch Text",
          },
          requests: [
            {
              to: [
                {
                  email: "recipient1.mock@email.com",
                  name: "recipient1",
                },
              ],
            },
            {
              to: [
                {
                  email: "recipient2.mock@email.com",
                  name: "recipient2",
                },
              ],
            },
          ],
        };

        const result = await batchClient.batchSend(batchData);

        expect(mock.history.post[0].url).toEqual(endpoint);
        expect(mock.history.post[0].data).toEqual(
          JSON.stringify({
            base: batchData.base,
            requests: batchData.requests.map((req) => ({
              to: req.to,
            })),
          })
        );
        expect(result).toEqual(expectedResponseData);
      });

      it("handles API errors for batch sending", async () => {
        const batchClient = new MailtrapClient({
          token: "MY_API_TOKEN",
          bulk: true,
        });
        const endpoint = `${BULK_ENDPOINT}/api/batch`;
        const responseData = {
          success: false,
          errors: ["from is required", "subject is required"],
        };
        mock.onPost(endpoint).reply(400, responseData);

        const batchData = {
          base: {
            from: {
              email: "sender@mailtrap.io",
              name: "Mailtrap",
            },
            subject: "Batch Subject",
            text: "Batch Text",
          },
          requests: [
            {
              to: [
                {
                  email: "recipient1.mock@email.com",
                  name: "recipient1",
                },
              ],
            },
          ],
        };

        try {
          await batchClient.batchSend(batchData);
        } catch (error) {
          expect(error).toBeInstanceOf(MailtrapError);
          if (error instanceof MailtrapError) {
            expect(error.message).toEqual(
              "from is required,subject is required"
            );
          }
        }
      });

      it("handles HTTP transport errors for batch sending", async () => {
        const batchClient = new MailtrapClient({
          token: "MY_API_TOKEN",
          bulk: true,
        });
        const batchData = {
          base: {
            from: {
              email: "sender@mailtrap.io",
              name: "Mailtrap",
            },
            subject: "Batch Subject",
            text: "Batch Text",
          },
          requests: [
            {
              to: [
                {
                  email: "recipient1.mock@email.com",
                  name: "recipient1",
                },
              ],
            },
          ],
        };

        try {
          await batchClient.batchSend(batchData);
        } catch (error) {
          expect(error).toBeInstanceOf(MailtrapError);
          if (error instanceof MailtrapError) {
            expect(error.message).toEqual(
              "Request failed with status code 404"
            );
          }
        }
      });
    });
  });

  describe("get testing(): ", () => {
    it("rejects with Mailtrap error, when `testInboxId` is missing.", () => {
      const client = new MailtrapClient({
        token: "MY_API_TOKEN",
      });

      expect.assertions(1);

      try {
        client.testing;
      } catch (error) {
        expect(error).toEqual(new MailtrapError(TEST_INBOX_ID_MISSING));
      }
    });

    it("rejects with Mailtrap error, when `accountId` is missing.", () => {
      const client = new MailtrapClient({
        token: "MY_API_TOKEN",
        testInboxId: 5,
      });

      expect.assertions(1);

      try {
        client.testing;
      } catch (error) {
        expect(error).toEqual(new MailtrapError(ACCOUNT_ID_MISSING));
      }
    });

    it("returns testing API object, console warn is called twice.", () => {
      const client = new MailtrapClient({
        token: "MY_API_TOKEN",
        sandbox: true,
        testInboxId: 10,
        accountId: 10,
      });
      expect.assertions(1);

      const testingClient = client.testing;
      expect(testingClient).toBeInstanceOf(TestingAPI);
    });

    describe("get general(): ", () => {
      it("returns testing API object, console warn is called twice.", () => {
        const client = new MailtrapClient({
          token: "MY_API_TOKEN",
        });
        expect.assertions(1);

        const generalClient = client.general;
        expect(generalClient).toBeInstanceOf(GeneralAPI);
      });
    });
  });
});
