import axios from "axios";

import Contacts from "../../../lib/api/Contacts";

describe("lib/api/Contacts: ", () => {
  const accountId = 100;
  const contactsAPI = new Contacts(axios, accountId);

  describe("class Contacts(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(contactsAPI).toHaveProperty("create");
        expect(contactsAPI).toHaveProperty("get");
        expect(contactsAPI).toHaveProperty("update");
        expect(contactsAPI).toHaveProperty("delete");
      });
    });
  });
});
