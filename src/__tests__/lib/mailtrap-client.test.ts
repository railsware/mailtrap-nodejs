/* eslint-disable no-console */
import axios, { AxiosError } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { Mail, MailtrapClient } from "../..";
import MailtrapError from "../../lib/MailtrapError";

import CONFIG from "../../config";

const { ERRORS } = CONFIG;
const { TEST_INBOX_ID_MISSING, ACCOUNT_ID_MISSING } = ERRORS;

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

  beforeAll(() => {
    mock = new AxiosMockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  describe("send():", () => {
    it("sends request to mailtrap api", async () => {
      const successData = {
        success: "true",
        message_ids: ["00000000-00000000-00000000-00000001"],
      };

      mock
        .onPost("https://send.api.mailtrap.io/api/send")
        .reply(200, successData);

      const client = new MailtrapClient({ token: "MY_API_TOKEN" });
      const result = await client.send(goodMail);

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
  });

  describe("get testing(): ", () => {
    it("returns testing API object, console warn is called twice.", () => {
      const originalWarn = console.warn;
      const mockLogger = jest.fn();
      console.warn = mockLogger;
      const client = new MailtrapClient({ token: "MY_API_TOKEN" });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const testingAPI = client.testing;

      expect.assertions(3);

      expect(mockLogger).toBeCalledTimes(2);
      expect(mockLogger).toBeCalledWith(TEST_INBOX_ID_MISSING);
      expect(mockLogger).toBeCalledWith(ACCOUNT_ID_MISSING);

      console.warn = originalWarn;
    });

    it("return testing API object, without calling console warn.", () => {
      const originalWarn = console.warn;
      const mockLogger = jest.fn();
      console.warn = mockLogger;
      const testInboxId = 1;
      const accountId = 1;
      const client = new MailtrapClient({
        token: "MY_API_TOKEN",
        testInboxId,
        accountId,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const testingAPI = client.testing;

      expect.assertions(1);

      expect(mockLogger).toBeCalledTimes(0);

      console.warn = originalWarn;
    });
  });
});
