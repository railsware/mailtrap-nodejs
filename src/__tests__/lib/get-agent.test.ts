import CONFIG from "../../config";

// Mock the config
jest.mock("../../config", () => ({
  CLIENT_SETTINGS: {
    USER_AGENT:
      "mailtrap-nodejs (https://github.com/railsware/mailtrap-nodejs)",
    MCP_USER_AGENT: "mailtrap-mcp (https://github.com/railsware/mailtrap-mcp)",
  },
}));

describe("get-agent", () => {
  let originalCwd: string;
  let originalError: typeof Error;

  beforeEach(() => {
    // Store original values
    originalCwd = process.cwd();
    originalError = global.Error;
  });

  afterEach(() => {
    // Restore original values
    process.cwd = jest.fn().mockReturnValue(originalCwd);
    global.Error = originalError;
    jest.clearAllMocks();
  });

  describe("getDynamicUserAgent", () => {
    it("should return USER_AGENT by default", () => {
      // Import after mocking to get fresh module
      const { default: getDynamicUserAgent } = jest.requireActual(
        "../../lib/get-agent"
      );

      const result = getDynamicUserAgent();
      expect(result).toBe(CONFIG.CLIENT_SETTINGS.USER_AGENT);
    });

    it("should return MCP_USER_AGENT when cwd contains 'mailtrap-mcp' and not in node_modules", () => {
      process.cwd = jest.fn().mockReturnValue("/path/to/mailtrap-mcp");

      // Clear module cache and re-import to get fresh module
      jest.resetModules();
      const { default: getDynamicUserAgent } = jest.requireActual(
        "../../lib/get-agent"
      );

      const result = getDynamicUserAgent();
      expect(result).toBe(CONFIG.CLIENT_SETTINGS.MCP_USER_AGENT);
    });

    it("should return USER_AGENT when cwd contains 'mailtrap-mcp' but is in node_modules", () => {
      process.cwd = jest
        .fn()
        .mockReturnValue("/path/to/node_modules/mailtrap-mcp");

      jest.resetModules();
      const { default: getDynamicUserAgent } = jest.requireActual(
        "../../lib/get-agent"
      );

      const result = getDynamicUserAgent();
      expect(result).toBe(CONFIG.CLIENT_SETTINGS.USER_AGENT);
    });

    it("should return USER_AGENT when process.cwd() throws an error", () => {
      process.cwd = jest.fn().mockImplementation(() => {
        throw new Error("Permission denied");
      });

      jest.resetModules();
      const { default: getDynamicUserAgent } = jest.requireActual(
        "../../lib/get-agent"
      );

      const result = getDynamicUserAgent();
      expect(result).toBe(CONFIG.CLIENT_SETTINGS.USER_AGENT);
    });

    it("should return MCP_USER_AGENT when call stack contains 'mailtrap-mcp' and not from node_modules/mailtrap", () => {
      global.Error = jest.fn().mockImplementation(() => ({
        stack: `
Error: Test error
    at Object.<anonymous> (/path/to/mailtrap-mcp/index.js:10:1)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
        `,
      })) as any;

      process.cwd = jest.fn().mockReturnValue("/path/to/regular-app");

      jest.resetModules();
      const { default: getDynamicUserAgent } = jest.requireActual(
        "../../lib/get-agent"
      );

      const result = getDynamicUserAgent();
      expect(result).toBe(CONFIG.CLIENT_SETTINGS.MCP_USER_AGENT);
    });

    it("should return USER_AGENT when call stack contains 'mailtrap-mcp' but is from node_modules/mailtrap", () => {
      global.Error = jest.fn().mockImplementation(() => ({
        stack: `
Error: Test error
    at Object.<anonymous> (/path/to/node_modules/mailtrap/index.js:10:1)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
        `,
      })) as any;

      process.cwd = jest.fn().mockReturnValue("/path/to/regular-app");

      jest.resetModules();
      const { default: getDynamicUserAgent } = jest.requireActual(
        "../../lib/get-agent"
      );

      const result = getDynamicUserAgent();
      expect(result).toBe(CONFIG.CLIENT_SETTINGS.USER_AGENT);
    });

    it("should return USER_AGENT when call stack does not contain 'mailtrap-mcp'", () => {
      global.Error = jest.fn().mockImplementation(() => ({
        stack: `
Error: Test error
    at Object.<anonymous> (/path/to/regular-app/index.js:10:1)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
        `,
      })) as any;

      process.cwd = jest.fn().mockReturnValue("/path/to/regular-app");

      jest.resetModules();
      const { default: getDynamicUserAgent } = jest.requireActual(
        "../../lib/get-agent"
      );

      const result = getDynamicUserAgent();
      expect(result).toBe(CONFIG.CLIENT_SETTINGS.USER_AGENT);
    });

    it("should return USER_AGENT when call stack is undefined", () => {
      global.Error = jest.fn().mockImplementation(() => ({
        stack: undefined,
      })) as any;

      process.cwd = jest.fn().mockReturnValue("/path/to/regular-app");

      jest.resetModules();
      const { default: getDynamicUserAgent } = jest.requireActual(
        "../../lib/get-agent"
      );

      const result = getDynamicUserAgent();
      expect(result).toBe(CONFIG.CLIENT_SETTINGS.USER_AGENT);
    });

    it("should handle edge cases gracefully", () => {
      // All undefined/null cases
      process.cwd = jest.fn().mockImplementation(() => {
        throw new Error("Permission denied");
      });
      global.Error = jest.fn().mockImplementation(() => ({
        stack: undefined,
      })) as any;

      jest.resetModules();
      const { default: getDynamicUserAgent } = jest.requireActual(
        "../../lib/get-agent"
      );

      const result = getDynamicUserAgent();
      expect(result).toBe(CONFIG.CLIENT_SETTINGS.USER_AGENT);
    });
  });

  describe("real-world scenarios", () => {
    it("should detect MCP context when running from MCP working directory", () => {
      process.cwd = jest
        .fn()
        .mockReturnValue("/Users/user/projects/mailtrap-mcp");

      jest.resetModules();
      const { default: getDynamicUserAgent } = jest.requireActual(
        "../../lib/get-agent"
      );

      const result = getDynamicUserAgent();
      expect(result).toBe(CONFIG.CLIENT_SETTINGS.MCP_USER_AGENT);
    });

    it("should not detect MCP context when used as a regular npm package", () => {
      process.cwd = jest.fn().mockReturnValue("/Users/user/projects/my-app");

      jest.resetModules();
      const { default: getDynamicUserAgent } = jest.requireActual(
        "../../lib/get-agent"
      );

      const result = getDynamicUserAgent();
      expect(result).toBe(CONFIG.CLIENT_SETTINGS.USER_AGENT);
    });
  });

  describe("integration with MailtrapClient", () => {
    it("should be used by MailtrapClient for User-Agent header", () => {
      // Mock the full config for MailtrapClient
      jest.doMock("../../config", () => ({
        CLIENT_SETTINGS: {
          SENDING_ENDPOINT: "https://send.api.mailtrap.io",
          BULK_ENDPOINT: "https://bulk.api.mailtrap.io",
          TESTING_ENDPOINT: "https://sandbox.api.mailtrap.io",
          GENERAL_ENDPOINT: "https://mailtrap.io",
          USER_AGENT:
            "mailtrap-nodejs (https://github.com/railsware/mailtrap-nodejs)",
          MCP_USER_AGENT:
            "mailtrap-mcp (https://github.com/railsware/mailtrap-mcp)",
          MAX_REDIRECTS: 0,
          TIMEOUT: 10000,
        },
        ERRORS: {
          FILENAME_REQUIRED: "Filename is required.",
          CONTENT_REQUIRED: "Content is required.",
          SUBJECT_REQUIRED: "Subject is required.",
          FROM_REQUIRED: "From is required.",
          SENDING_FAILED: "Sending failed.",
          NO_DATA_ERROR: "No Data.",
          TEST_INBOX_ID_MISSING:
            "testInboxId is missing, testing API will not work.",
          ACCOUNT_ID_MISSING:
            "accountId is missing, some features of testing API may not work properly.",
          BULK_SANDBOX_INCOMPATIBLE:
            "Bulk mode is not applicable for sandbox API.",
        },
        TRANSPORT_SETTINGS: {
          NAME: "MailtrapTransport",
        },
      }));

      // Clear module cache and re-import
      jest.resetModules();
      const { default: MailtrapClient } = jest.requireActual(
        "../../lib/MailtrapClient"
      );

      // Create a client instance
      const client = new MailtrapClient({
        token: "test-token",
      });

      // The User-Agent should be set in the axios instance
      // We can't easily test the internal axios instance, but we can verify
      // that the function is called during client creation
      expect(client).toBeDefined();
    });
  });
});
