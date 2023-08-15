import adaptMail from "../../adapters/mail";

import config from "../../config";
import { adaptSingleRecipient } from "../../adapters/recipients";

const { ERRORS } = config;
const { SUBJECT_REQUIRED, FROM_REQUIRED } = ERRORS;

describe("adapters/mail: ", () => {
  describe("adaptMail(): ", () => {
    it("returns object with error `subject is required`.", () => {
      const data = {};

      const expectedResult = { success: false, errors: [SUBJECT_REQUIRED] };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns object with error `from is required`.", () => {
      const data = {
        subject: "mock-subject",
      };

      const expectedResult = { success: false, errors: [FROM_REQUIRED] };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns `mail` object with basic info.", () => {
      const data = {
        subject: "mock-subject",
        from: "mock-from",
      };

      const expectedResult = {
        subject: data.subject,
        from: adaptSingleRecipient(data.from),
        to: [],
        cc: [],
        bcc: [],
      };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns `mail` object with basic info + headers.", () => {
      const data = {
        subject: "mock-subject",
        from: "mock-from",
        headers: {
          mockKey: "mock-value",
        },
      };

      const expectedResult = {
        subject: data.subject,
        from: adaptSingleRecipient(data.from),
        to: [],
        cc: [],
        bcc: [],
        headers: data.headers,
      };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns `mail` object with basic info + headers + text.", () => {
      const data = {
        subject: "mock-subject",
        from: "mock-from",
        headers: {
          mockKey: "mock-value",
        },
        text: "mock-text",
      };

      const expectedResult = {
        subject: data.subject,
        from: adaptSingleRecipient(data.from),
        to: [],
        cc: [],
        bcc: [],
        headers: data.headers,
        text: data.text,
      };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns `mail` object with basic info + headers + text + html.", () => {
      const data = {
        subject: "mock-subject",
        from: "mock-from",
        headers: {
          mockKey: "mock-value",
        },
        text: "mock-text",
        html: "mock-html",
      };

      const expectedResult = {
        subject: data.subject,
        from: adaptSingleRecipient(data.from),
        to: [],
        cc: [],
        bcc: [],
        headers: data.headers,
        text: data.text,
        html: data.html,
      };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns `mail` object with basic info + headers + text + html + attachments.", () => {
      const data = {
        subject: "mock-subject",
        from: "mock-from",
        headers: {
          mockKey: "mock-value",
        },
        text: "mock-text",
        html: "mock-html",
        attachments: [{ filename: "mock-filename", content: "mock-content" }],
      };

      const expectedResult = {
        subject: data.subject,
        from: adaptSingleRecipient(data.from),
        to: [],
        cc: [],
        bcc: [],
        headers: data.headers,
        text: data.text,
        html: data.html,
        attachments: data.attachments,
      };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns `mail` object with basic info + headers + text + html + attachments + category.", () => {
      const data = {
        subject: "mock-subject",
        from: "mock-from",
        headers: {
          mockKey: "mock-value",
        },
        text: "mock-text",
        html: "mock-html",
        attachments: [{ filename: "mock-filename", content: "mock-content" }],
        category: "mock-category",
      };

      const expectedResult = {
        subject: data.subject,
        from: adaptSingleRecipient(data.from),
        to: [],
        cc: [],
        bcc: [],
        headers: data.headers,
        text: data.text,
        html: data.html,
        attachments: data.attachments,
        category: data.category,
      };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns `mail` object with basic info + headers + text + html + attachments + category + custom variables.", () => {
      const data = {
        subject: "mock-subject",
        from: "mock-from",
        headers: {
          mockKey: "mock-value",
        },
        text: "mock-text",
        html: "mock-html",
        attachments: [{ filename: "mock-filename", content: "mock-content" }],
        category: "mock-category",
        customVariables: {
          user_id: "mock-user_id",
        },
      };

      const expectedResult = {
        subject: data.subject,
        from: adaptSingleRecipient(data.from),
        to: [],
        cc: [],
        bcc: [],
        headers: data.headers,
        text: data.text,
        html: data.html,
        attachments: data.attachments,
        category: data.category,
        custom_variables: data.customVariables,
      };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });
  });
});
