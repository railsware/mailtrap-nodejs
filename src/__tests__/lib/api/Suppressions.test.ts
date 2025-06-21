import axios from "axios";

import SuppressionsBaseAPI from "../../../lib/api/Suppressions";

describe("lib/api/Suppressions: ", () => {
  const accountId = 100;
  const suppressionsAPI = new SuppressionsBaseAPI(axios, accountId);

  describe("class SuppressionsBaseAPI(): ", () => {
    describe("init: ", () => {
      it("initalizes with all necessary params.", () => {
        expect(suppressionsAPI).toHaveProperty("getList");
        expect(suppressionsAPI).toHaveProperty("delete");
      });
    });
  });
});
