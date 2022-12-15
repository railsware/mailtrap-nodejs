import { describe, expect, it, beforeAll, afterEach } from "@jest/globals";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { MailtrapClient } from "../index";

describe("MailtrapClient#send", () => {
  let mock: AxiosMockAdapter;

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
        subject: "My Subject",
        text: "My TEXT",
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
          '"subject":"My Subject",' +
          '"text":"My TEXT"' +
          "}"
      );
      expect(result).toEqual(successData);
    });
  });
});
