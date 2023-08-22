import encodeMailBuffers from "../../lib/mail-buffer-encoder";

describe("lib/mail-buffer-encoder: ", () => {
  describe("encodeMailBuffers(): ", () => {
    it("leaves `mail` object as is if `text` is not an instance of Buffer.", () => {
      const mail = {
        text: "mock-text",
        subject: "mock-subject",
        from: {
          name: "mock-name",
          email: "mock-email",
        },
        to: [
          {
            name: "mock-name",
            email: "mock-email",
          },
        ],
      };

      const result = encodeMailBuffers(mail);

      expect(result).toEqual(mail);
    });

    it("decodes `text` from `mail` object if it's an instance of Buffer.", () => {
      const message = "mock-message";
      const mail = {
        text: Buffer.from(message),
        subject: "mock-subject",
        from: {
          name: "mock-name",
          email: "mock-email",
        },
        to: [
          {
            name: "mock-name",
            email: "mock-email",
          },
        ],
      };

      const result = encodeMailBuffers(mail);
      const expectedResult = {
        ...mail,
        text: message,
      };

      expect(result).toEqual(expectedResult);
    });

    it("leaves `mail` object as is if `html` is not an instance of Buffer.", () => {
      const mail = {
        html: "mock-html",
        subject: "mock-subject",
        from: {
          name: "mock-name",
          email: "mock-email",
        },
        to: [
          {
            name: "mock-name",
            email: "mock-email",
          },
        ],
      };

      const result = encodeMailBuffers(mail);

      expect(result).toEqual(mail);
    });

    it("decodes `html` from `mail` object if it's an instance of Buffer.", () => {
      const message = "mock-message";
      const mail = {
        html: Buffer.from(message),
        subject: "mock-subject",
        from: {
          name: "mock-name",
          email: "mock-email",
        },
        to: [
          {
            name: "mock-name",
            email: "mock-email",
          },
        ],
      };

      const result = encodeMailBuffers(mail);
      const expectedResult = {
        ...mail,
        html: message,
      };

      expect(result).toEqual(expectedResult);
    });

    it("leaves `mail` object as is if `attachments.content` is string.", () => {
      const mail = {
        text: "mock-text",
        subject: "mock-subject",
        from: {
          name: "mock-name",
          email: "mock-email",
        },
        to: [
          {
            name: "mock-name",
            email: "mock-email",
          },
        ],
        attachments: [
          {
            content: "mock-content",
            filename: "mock-filename",
          },
        ],
      };

      const result = encodeMailBuffers(mail);

      expect(result).toEqual(mail);
    });

    it("converts `attachments.content` to base54 string if content is instance of Buffer.", () => {
      const content = "mock-content";
      const bufferFromContent = Buffer.from(content);
      const mail = {
        text: "mock-text",
        subject: "mock-subject",
        from: {
          name: "mock-name",
          email: "mock-email",
        },
        to: [
          {
            name: "mock-name",
            email: "mock-email",
          },
        ],
        attachments: [
          {
            content: bufferFromContent,
            filename: "mock-filename",
          },
        ],
      };

      const result = encodeMailBuffers(mail);
      const expectedResult = {
        ...mail,
        attachments: [
          {
            content: bufferFromContent.toString("base64"),
            filename: mail.attachments[0].filename,
          },
        ],
      };

      expect(result).toEqual(expectedResult);
    });
  });
});
