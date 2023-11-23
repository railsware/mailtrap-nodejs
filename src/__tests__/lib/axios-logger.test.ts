import { AxiosError } from "axios";
import axiosLogger from "../../lib/axios-logger";
import MailtrapError from "../../lib/MailtrapError";

describe("lib/axios-logger: ", () => {
  describe("handleSendingError(): ", () => {
    it("re-throws error if it's not axios error.", () => {
      const unknownError = new Error("mock-error");

      expect.assertions(1);

      try {
        axiosLogger(unknownError);
      } catch (error) {
        expect(error).toBe(unknownError);
      }
    });

    it("should throw error with given message, if error is axios one.", () => {
      const unknownError = new AxiosError("mock-error");

      expect.assertions(2);

      try {
        axiosLogger(unknownError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toBe(unknownError.message);
        }
      }
    });

    it("should throw MailtrapError with given message, if error is axios one.", () => {
      const response = {};
      // @ts-ignore
      const unknownError = new AxiosError("message", "400", {}, response);

      expect.assertions(2);

      try {
        axiosLogger(unknownError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toBe(unknownError.message);
        }
      }
    });
  });
});
