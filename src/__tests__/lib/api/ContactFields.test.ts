import axios from "axios";

import ContactFields from "../../../lib/api/ContactFields";

describe("lib/api/ContactFields: ", () => {
  const accountId = 100;
  const contactFieldsAPI = new ContactFields(axios, accountId);

  describe("class ContactFields(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(contactFieldsAPI).toHaveProperty("create");
        expect(contactFieldsAPI).toHaveProperty("get");
        expect(contactFieldsAPI).toHaveProperty("getList");
        expect(contactFieldsAPI).toHaveProperty("update");
        expect(contactFieldsAPI).toHaveProperty("delete");
      });
    });
  });
});
