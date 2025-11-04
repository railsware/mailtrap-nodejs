import axios, { AxiosInstance } from "axios";

import ContactEventsBaseAPI from "../../../lib/api/ContactEvents";

describe("lib/api/ContactEvents: ", () => {
  const axiosInstance: AxiosInstance = axios.create();
  const accountId = 100;
  const api = new ContactEventsBaseAPI(axiosInstance, accountId);

  describe("class ContactEvents(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(api).toHaveProperty("create");
      });
    });
  });
});
