import { describe, expect, it, beforeAll, afterEach } from "@jest/globals";
import axios, { AxiosError } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { Mail, MailtrapClient } from "../index";
import MailtrapError from "../lib/MailtrapError";

describe("MailtrapClient#send", () => {
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

  describe("mail", () => {
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

      expect(mock.history.post[0].baseURL).toEqual(
        "https://send.api.mailtrap.io"
      );
      expect(mock.history.post[0].url).toEqual("/api/send");
      expect(mock.history.post[0].headers).toEqual({
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: "Bearer MY_API_TOKEN",
        Connection: "keep-alive",
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
  });

  describe("template", () => {
    it("sends request to mailtrap api", async () => {
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

      expect(mock.history.post[0].baseURL).toEqual(
        "https://send.api.mailtrap.io"
      );
      expect(mock.history.post[0].url).toEqual("/api/send");
      expect(mock.history.post[0].headers).toEqual({
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: "Bearer MY_API_TOKEN",
        Connection: "keep-alive",
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
  });

  describe("server error", () => {
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
          expect(err.message).toEqual("subject is missing, message is missing");
          // @ts-expect-error ES5 types don't know about cause property
          expect(err.cause).toBeInstanceOf(AxiosError);
        }
      }
    });
  });

  describe("network error", () => {
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
});
