import axios from "axios";

import General from "../../../lib/api/General";

describe("lib/api/General: ", () => {
  const testInboxId = 100;
  const generalAPI = new General(axios, testInboxId);

  describe("class General(): ", () => {
    describe("init: ", () => {
      it("initalizes with all necessary params.", () => {
        expect(generalAPI).toHaveProperty("accountAccesses");
        expect(generalAPI).toHaveProperty("accounts");
        expect(generalAPI).toHaveProperty("permissions");
      });
    });
  });
});
