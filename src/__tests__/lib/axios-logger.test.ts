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

    it("extracts single error string from response data", () => {
      const responseData = { error: "Not Found" };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "404",
        { headers: {} } as any,
        {
          data: responseData,
          status: 404,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 404,
        statusText: "Not Found",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe("Not Found");
        }
      }
    });

    it("extracts array of error strings from response data", () => {
      const responseData = {
        success: false,
        errors: [
          "'subject' is required",
          "must specify either text or html body",
        ],
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "400",
        { headers: {} } as any,
        {
          data: responseData,
          status: 400,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe(
            "'subject' is required,must specify either text or html body"
          );
        }
      }
    });

    it("extracts errors from array of error objects with nested errors", () => {
      const responseData = {
        errors: [
          {
            email: "invalid-email-1",
            errors: {
              email: ["is invalid", "is required"],
            },
          },
          {
            email: "invalid-email-2",
            errors: {
              base: ["Contact limit exceeded"],
            },
          },
        ],
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "422",
        { headers: {} } as any,
        {
          data: responseData,
          status: 422,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe(
            "invalid-email-1: email: is invalid, is required | invalid-email-2: Contact limit exceeded"
          );
        }
      }
    });

    it("extracts errors from array of error objects with direct base field", () => {
      const responseData = {
        errors: [
          {
            base: ["contacts are required"],
          },
        ],
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "422",
        { headers: {} } as any,
        {
          data: responseData,
          status: 422,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe("contacts are required");
        }
      }
    });

    it("extracts errors from object with name property", () => {
      const responseData = {
        errors: {
          name: ["can't be blank", "is too short"],
        },
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "422",
        { headers: {} } as any,
        {
          data: responseData,
          status: 422,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe("can't be blank, is too short");
        }
      }
    });

    it("extracts errors from object with base property", () => {
      const responseData = {
        errors: {
          base: ["Something went wrong"],
        },
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "422",
        { headers: {} } as any,
        {
          data: responseData,
          status: 422,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe("Something went wrong");
        }
      }
    });

    it("extracts errors from object with field-specific errors", () => {
      const responseData = {
        errors: {
          email: ["is invalid", "top level domain is too short"],
        },
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "422",
        { headers: {} } as any,
        {
          data: responseData,
          status: 422,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe(
            "email: is invalid, top level domain is too short"
          );
        }
      }
    });

    it("handles error object with multiple field errors", () => {
      const responseData = {
        errors: {
          email: ["is invalid"],
          phone: ["can't be blank"],
        },
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "422",
        { headers: {} } as any,
        {
          data: responseData,
          status: 422,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      };

      expect.assertions(3);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toContain("email: is invalid");
          expect(error.message).toContain("phone: can't be blank");
        }
      }
    });

    it("falls back to default message when response data is invalid", () => {
      const responseData = null;
      // @ts-ignore
      const axiosError = new AxiosError(
        "Network error",
        "500",
        { headers: {} } as any,
        {
          data: responseData,
          status: 500,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe("Network error");
        }
      }
    });

    it("preserves cause property with original axios error", () => {
      const responseData = { error: "Not Found" };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "404",
        { headers: {} } as any,
        {
          data: responseData,
          status: 404,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 404,
        statusText: "Not Found",
        headers: {},
        config: {} as any,
      };

      expect.assertions(3);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          // @ts-expect-error ES5 types don't know about cause property
          expect(error.cause).toBe(axiosError);
          expect(error.message).toBe("Not Found");
        }
      }
    });
  });
});
