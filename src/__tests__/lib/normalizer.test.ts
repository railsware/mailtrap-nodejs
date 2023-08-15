import normalizeCallback from "../../lib/normalizer";

import config from "../../config";

import { SendError, SendResponse } from "../../types/mailtrap";

const { ERRORS } = config;
const { INVALID_MAIL, SENDING_FAILED, NO_DATA_ERROR } = ERRORS;

describe("lib/normalizer: ", () => {
  describe("normalizeCallback(): ", () => {
    it("passes error to callback in case if normalization failed.", () => {
      expect.assertions(3);

      const message = "mock-error";
      const mockError = new Error(message);

      const mockClient = {};
      const callback = (error: Error, data: SendError) => {
        expect(error).toBeInstanceOf(Error);
        expect(data.success).toBeFalsy();
        expect(data.errors[0]).toEqual(message);
      };
      const mailData = {};

      // @ts-ignore
      const cb = normalizeCallback(mockClient, callback);

      cb(mockError, mailData);
    });

    it("passes error to callback in case if mail is invalid.", () => {
      expect.assertions(3);

      const mockClient = {};
      const callback = (error: Error, data: SendError) => {
        expect(error).toBeInstanceOf(Error);
        expect(data.success).toBeFalsy();
        expect(data.errors[0]).toEqual(INVALID_MAIL);
      };
      const mailData = {};

      // @ts-ignore
      const cb = normalizeCallback(mockClient, callback);

      cb(null, mailData);
    });

    it("passes data to callback in case if mail is valid.", () => {
      expect.assertions(2);

      const mockResult = "mock-result";
      const mockClient = {
        send: () => Promise.resolve(mockResult),
      };
      const callback = (error: Error, data: SendResponse) => {
        expect(error).toBeNull();
        expect(data).toBe(mockResult);
      };
      const mailData = {
        text: "mock-text",
        to: {
          address: "mock@mail.com",
          name: "mock-name",
        },
        from: {
          address: "mock@mail.com",
          name: "mock-name",
        },
        subject: "mock-subject",
      };

      // @ts-ignore
      const cb = normalizeCallback(mockClient, callback);

      cb(null, mailData);
    });

    it("passes error to callback in case if client call failed.", () => {
      expect.assertions(3);

      const mockError = "mock-error";
      const mockClient = {
        send: () => Promise.reject(mockError),
      };
      const callback = (error: Error, data: SendError) => {
        expect(error).toBeInstanceOf(Error);
        expect(data.success).toBeFalsy();
        expect(data.errors[0]).toEqual(SENDING_FAILED);
      };
      const mailData = {
        text: "mock-text",
        to: {
          address: "mock@mail.com",
          name: "mock-name",
        },
        from: {
          address: "mock@mail.com",
          name: "mock-name",
        },
        subject: "mock-subject",
      };

      // @ts-ignore
      const cb = normalizeCallback(mockClient, callback);

      cb(null, mailData);
    });

    it("passes error to callback in case if no data.", () => {
      expect.assertions(3);

      const mockClient = {};
      const callback = (error: Error, data: SendError) => {
        expect(error).toBeInstanceOf(Error);
        expect(data.success).toBeFalsy();
        expect(data.errors[0]).toEqual(NO_DATA_ERROR);
      };
      const mailData = null;

      // @ts-ignore
      const cb = normalizeCallback(mockClient, callback);

      // @ts-ignore
      cb(null, mailData);
    });
  });
});
