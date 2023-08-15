import mailtrapTransport from "../../lib/transporter";

import config from "../../config";

import packageData from "../../../package.json";

const { TRANSPORT_NAME } = config;

const { version } = packageData;

describe("lib/transport: ", () => {
  describe("class MailtrapTransport: ", () => {
    it("returns function on export.", () => {
      const expectedValue = "function";

      expect(typeof mailtrapTransport).toBe(expectedValue);
    });

    it("creates object when options are passed.", () => {
      const options = {
        token: "mock-token",
      };

      const instance = mailtrapTransport(options);
      const expectedValue = "object";

      expect(typeof instance).toBe(expectedValue);
    });

    it("creates object `name`, `version` and `send` props.", () => {
      const options = {
        token: "mock-token",
      };

      const instance = mailtrapTransport(options);
      const expectedValue = "function";

      expect(instance.name).toBe(TRANSPORT_NAME);
      expect(instance.version).toBe(version);
      expect(typeof instance.send).toBe(expectedValue);
    });
  });

  describe("send(): ", () => {
    it("checks if data passed to `transport.send` method passed to callback.", () => {
      expect.assertions(2);

      const options = {
        token: "mock-token",
      };
      const transport = mailtrapTransport(options);

      const message = {
        text: "negative",
        to: {
          address: "narekgilmour@gmail.com",
          name: "mock",
        },
        from: {
          address: "anything@freelance.mailtrap.link",
          name: "Narek",
        },
        subject: "test-subject",
      };
      const initialError = "mock-value-error";
      const initalData = "mock-value-error";

      const normalizeCallback = (error: any, data: any) => {
        expect(error).toEqual(initialError);
        expect(data).toEqual(initalData);
      };

      // @ts-ignore
      message.normalize = () => normalizeCallback(initialError, initalData);

      const callback = () => {};

      // @ts-ignore
      transport.send(message, callback);
    });
  });
});
