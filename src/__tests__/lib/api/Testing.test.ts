import axios from "axios";

import Testing from "../../../lib/api/Testing";

describe("lib/api/Testing: ", () => {
  const testInboxId = 100;
  const testingAPI = new Testing(axios, testInboxId);

  describe("class Testing(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(testingAPI).toHaveProperty("projects");
        expect(testingAPI).toHaveProperty("inboxes");
        expect(testingAPI).toHaveProperty("messages");
        expect(testingAPI).toHaveProperty("attachments");
      });
    });
  });
});
