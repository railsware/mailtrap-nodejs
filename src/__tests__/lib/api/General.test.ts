import axios from "axios";

import General from "../../../lib/api/General";

describe("lib/api/General: ", () => {
  const testAccountId = 100;

  describe("class General(): ", () => {
    describe("constructor with accountId: ", () => {
      const generalAPI = new General(axios, testAccountId);

      it("initializes with all necessary properties when accountId is provided.", () => {
        expect(generalAPI).toHaveProperty("accountAccesses");
        expect(generalAPI).toHaveProperty("accounts");
        expect(generalAPI).toHaveProperty("permissions");
      });

      it("instantiates account-specific APIs immediately when accountId is provided.", () => {
        expect(generalAPI.accountAccesses).toBeDefined();
        expect(generalAPI.permissions).toBeDefined();
        expect(generalAPI.accounts).toBeDefined();
      });
    });

    describe("constructor without accountId: ", () => {
      const generalAPI = new General(axios);

      it("initializes with accounts property when accountId is not provided.", () => {
        expect(generalAPI).toHaveProperty("accounts");
        expect(generalAPI.accounts).toBeDefined();
      });

      it("allows access to accounts API for account discovery.", () => {
        expect(generalAPI.accounts).toBeDefined();
        expect(typeof generalAPI.accounts.getAllAccounts).toBe("function");
      });
    });

    describe("lazy instantiation: ", () => {
      const generalAPI = new General(axios);

      it("throws error when accessing accountAccesses without accountId.", () => {
        expect(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          generalAPI.accountAccesses;
        }).toThrow(
          "Account ID is required for this operation. Please provide accountId when creating GeneralAPI instance."
        );
      });

      it("throws error when accessing permissions without accountId.", () => {
        expect(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          generalAPI.permissions;
        }).toThrow(
          "Account ID is required for this operation. Please provide accountId when creating GeneralAPI instance."
        );
      });
    });

    describe("account discovery functionality: ", () => {
      const generalAPI = new General(axios);

      it("provides accounts API for listing all accounts.", () => {
        expect(generalAPI.accounts).toBeDefined();
        expect(typeof generalAPI.accounts.getAllAccounts).toBe("function");
      });

      it("does not require accountId for account discovery.", () => {
        // This should not throw an error
        expect(generalAPI.accounts).toBeDefined();
      });
    });

    describe("backward compatibility: ", () => {
      const generalAPI = new General(axios, testAccountId);

      it("maintains existing API surface for account-specific operations.", () => {
        expect(generalAPI.accountAccesses).toBeDefined();
        expect(generalAPI.permissions).toBeDefined();
        expect(typeof generalAPI.accountAccesses.listAccountAccesses).toBe(
          "function"
        );
        expect(typeof generalAPI.permissions.getResources).toBe("function");
      });
    });

    describe("lazy instantiation with accountId: ", () => {
      it("instantiates accountAccesses lazily when accountId is provided but not accessed during construction.", () => {
        const generalAPI = new General(axios, testAccountId);
        // Force lazy instantiation by accessing the getter
        const { accountAccesses } = generalAPI;
        expect(accountAccesses).toBeDefined();
        expect(typeof accountAccesses.listAccountAccesses).toBe("function");
      });

      it("instantiates permissions lazily when accountId is provided but not accessed during construction.", () => {
        const generalAPI = new General(axios, testAccountId);
        // Force lazy instantiation by accessing the getter
        const { permissions } = generalAPI;
        expect(permissions).toBeDefined();
        expect(typeof permissions.getResources).toBe("function");
      });

      it("covers checkAccountIdPresence return path when accountId is valid.", () => {
        const generalAPI = new General(axios, testAccountId);
        // This should not throw and should return the accountId
        expect(generalAPI.accountAccesses).toBeDefined();
        expect(generalAPI.permissions).toBeDefined();
      });
    });

    describe("lazy instantiation edge case: ", () => {
      it("covers lazy instantiation path when accountId is provided but instances are null.", () => {
        // Create a GeneralAPI instance with accountId
        const generalAPI = new General(axios, testAccountId);

        // Manually set instances to null to force lazy instantiation
        // This simulates the case where accountId is provided but instances weren't created
        (generalAPI as any).accountAccessesInstance = null;
        (generalAPI as any).permissionsInstance = null;

        // Now accessing the getters should trigger lazy instantiation
        const { accountAccesses } = generalAPI;
        const { permissions } = generalAPI;

        expect(accountAccesses).toBeDefined();
        expect(permissions).toBeDefined();
        expect(typeof accountAccesses.listAccountAccesses).toBe("function");
        expect(typeof permissions.getResources).toBe("function");
      });
    });

    describe("edge cases: ", () => {
      it("handles undefined accountId parameter.", () => {
        const generalAPI = new General(axios, undefined);
        expect(generalAPI.accounts).toBeDefined();
        expect(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          generalAPI.accountAccesses;
        }).toThrow();
      });

      it("handles null accountId parameter.", () => {
        const generalAPI = new General(axios, null as any);
        expect(generalAPI.accounts).toBeDefined();
        expect(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          generalAPI.accountAccesses;
        }).toThrow();
      });
    });
  });
});
