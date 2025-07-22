import axios from "axios";

import TemplatesBaseAPI from "../../../lib/api/Templates";

describe("lib/api/Templates: ", () => {
  const accountId = 100;
  const templatesAPI = new TemplatesBaseAPI(axios, accountId);

  describe("class TemplatesBaseAPI(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(templatesAPI).toHaveProperty("create");
        expect(templatesAPI).toHaveProperty("getList");
        expect(templatesAPI).toHaveProperty("get");
        expect(templatesAPI).toHaveProperty("update");
        expect(templatesAPI).toHaveProperty("delete");
      });
    });
  });
});
