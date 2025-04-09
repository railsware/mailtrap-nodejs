import adaptRecipients, {
  adaptSingleRecipient,
  adaptReplyToRecipient,
} from "../../adapters/recipients";

describe("adapters/recipients: ", () => {
  describe("adaptSingleRecipient(): ", () => {
    it("builds object containing recipient email if recipient is string.", () => {
      const recipient = "mock-recipient";

      const expectedResult = {
        email: recipient,
      };
      const result = adaptSingleRecipient(recipient);

      expect(result).toEqual(expectedResult);
    });

    it("builds object containing name, email keys if recipient is Nodemailer address.", () => {
      const recipient = {
        name: "mock-name",
        address: "mock-email",
      };

      const expectedResult = {
        name: recipient.name,
        email: recipient.address,
      };
      const result = adaptSingleRecipient(recipient);

      expect(result).toEqual(expectedResult);
    });
  });

  describe("adaptRecipients(): ", () => {
    it("returns empty array if recipients is invalid.", () => {
      const recipients = undefined;

      const expectedResult: any = [];
      const result = adaptRecipients(recipients);

      expect(result).toEqual(expectedResult);
    });

    it("wraps adapted recipient into array if it's not an array.", () => {
      const recipients = {
        name: "mock-name",
        address: "mock-email",
      };

      const expectedResult = [
        {
          name: recipients.name,
          email: recipients.address,
        },
      ];
      const result = adaptRecipients(recipients);

      expect(result).toEqual(expectedResult);
    });

    it("returns adapted recipients array.", () => {
      const recipients = [
        {
          name: "mock-name-1",
          address: "mock-email-1",
        },
        {
          name: "mock-name-2",
          address: "mock-email-2",
        },
      ];

      const expectedResult = [
        {
          name: recipients[0].name,
          email: recipients[0].address,
        },
        {
          name: recipients[1].name,
          email: recipients[1].address,
        },
      ];
      const result = adaptRecipients(recipients);

      expect(result).toEqual(expectedResult);
    });
  });

  describe("adaptReplyToRecipient(): ", () => {
    it("returns undefined if recipients is invalid.", () => {
      const recipients = undefined;

      const expectedResult = undefined;
      const result = adaptReplyToRecipient(recipients);

      expect(result).toEqual(expectedResult);
    });

    it("returns undefined if recipients is empty array.", () => {
      const recipients: any = [];

      const expectedResult = undefined;
      const result = adaptReplyToRecipient(recipients);

      expect(result).toEqual(expectedResult);
    });

    it("returns adapted recipients if it's not an array.", () => {
      const recipients = {
        name: "mock-name",
        address: "mock-email",
      };

      const expectedResult = {
        name: recipients.name,
        email: recipients.address,
      };
      const result = adaptReplyToRecipient(recipients);

      expect(result).toEqual(expectedResult);
    });

    it("returns first adapted recipient if it's an array.", () => {
      const recipients = [
        {
          name: "mock-name-1",
          address: "mock-email-1",
        },
        {
          name: "mock-name-2",
          address: "mock-email-2",
        },
      ];

      const expectedResult = {
        name: recipients[0].name,
        email: recipients[0].address,
      };
      const result = adaptReplyToRecipient(recipients);

      expect(result).toEqual(expectedResult);
    });
  });
});
