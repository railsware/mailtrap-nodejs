import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import Projects from "../../../../lib/api/resources/Projects";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/Projects: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const projectsAPI = new Projects(axios, accountId);

  describe("class Projects(): ", () => {
    describe("init: ", () => {
      it("initalizes with all necessary params.", () => {
        expect(projectsAPI).toHaveProperty("create");
        expect(projectsAPI).toHaveProperty("delete");
        expect(projectsAPI).toHaveProperty("getById");
        expect(projectsAPI).toHaveProperty("getList");
        expect(projectsAPI).toHaveProperty("update");
      });
    });
  });

  beforeAll(() => {
    /**
     * Init Axios interceptors for handling response.data, errors.
     */
    axios.interceptors.response.use(
      (response) => response.data,
      handleSendingError
    );
    mock = new AxiosMockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  describe("create(): ", () => {
    it("successfully creates project.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/projects`;
      const expectedResponseData = {
        id: 100,
        name: "mock-name",
        share_links: "links",
        inboxes: [],
        permissions: [],
      };
      mock.onPost(endpoint).reply(200, expectedResponseData);

      const projectName = "mock-projectName";
      const result = await projectsAPI.create(projectName);

      const sentData = { project: { name: projectName } };

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(mock.history.post[0].data).toEqual(JSON.stringify(sentData));
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const projectName = "mock-projectName";
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await projectsAPI.create(projectName);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("getList(): ", () => {
    it("successfully gets projects list.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/projects`;
      const expectedResponseData = [
        {
          id: 100,
          name: "mock-name",
          share_links: "links",
          inboxes: [],
          permissions: [],
        },
      ];
      mock.onGet(endpoint).reply(200, expectedResponseData);

      const result = await projectsAPI.getList();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await projectsAPI.getList();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("getById(): ", () => {
    it("successfully gets projects list.", async () => {
      const projectId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/projects/${projectId}`;
      const expectedResponseData = [
        {
          id: 100,
          name: "mock-name",
          share_links: "links",
          inboxes: [],
          permissions: [],
        },
      ];
      mock.onGet(endpoint).reply(200, expectedResponseData);

      const result = await projectsAPI.getById(projectId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const projectId = 1;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await projectsAPI.getById(projectId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("update(): ", () => {
    it("successfully updates project.", async () => {
      const projectId = 1;
      const updatedName = "mock-updatedName";
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/projects/${projectId}`;
      const expectedResponseData = {
        id: 100,
        name: "mock-name",
        share_links: "links",
        inboxes: [],
        permissions: [],
      };
      mock.onPatch(endpoint).reply(200, expectedResponseData);

      const result = await projectsAPI.update(projectId, updatedName);

      const sentData = { project: { name: updatedName } };

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(mock.history.patch[0].data).toEqual(JSON.stringify(sentData));
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const projectId = 1;
      const updatedName = "mock-updatedName";
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await projectsAPI.update(projectId, updatedName);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("delete(): ", () => {
    it("successfully deletes project.", async () => {
      const projectId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/projects/${projectId}`;
      const expectedResponseData = [
        {
          id: 100,
          name: "mock-name",
          share_links: "links",
          inboxes: [],
          permissions: [],
        },
      ];
      mock.onDelete(endpoint).reply(200, expectedResponseData);

      const result = await projectsAPI.delete(projectId);

      expect(mock.history.delete[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const projectId = 1;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await projectsAPI.delete(projectId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
