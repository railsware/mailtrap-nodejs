import axios from "axios";

import ContactImports from "../../../lib/api/ContactImports";

describe("lib/api/ContactImports: ", () => {
  const accountId = 100;
  const contactImportsAPI = new ContactImports(axios, accountId);

  describe("class ContactImports(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(contactImportsAPI).toHaveProperty("create");
        expect(contactImportsAPI).toHaveProperty("get");
      });
    });
  });
});
