import axios from "axios";

import ContactLists from "../../../lib/api/ContactLists";

describe("lib/api/ContactLists: ", () => {
  const accountId = 100;
  const contactListsAPI = new ContactLists(axios, accountId);

  describe("class ContactLists(): ", () => {
    describe("init: ", () => {
      it("initalizes with all necessary params.", () => {
        expect(contactListsAPI).toHaveProperty("create");
        expect(contactListsAPI).toHaveProperty("getAll");
        expect(contactListsAPI).toHaveProperty("get");
        expect(contactListsAPI).toHaveProperty("update");
        expect(contactListsAPI).toHaveProperty("delete");
      });
    });
  });
});
