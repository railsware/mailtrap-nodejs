import axios from "axios";

import Contacts from "../../../lib/api/Contacts";

describe("lib/api/Contacts: ", () => {
  const testInboxId = 100;
  const contactsAPI = new Contacts(axios, testInboxId);

  describe("class Contacts(): ", () => {
    describe("init: ", () => {
      it("initalizes with all necessary params.", () => {
        expect(contactsAPI).toHaveProperty("contacts");
        expect(contactsAPI).toHaveProperty("contactLists");
      });
    });
  });
});
