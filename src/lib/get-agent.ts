import CONFIG from "../config";

const { USER_AGENT, MCP_USER_AGENT } = CONFIG.CLIENT_SETTINGS;

/**
 * Checks if the main module filename indicates MCP context.
 * @returns true if main module contains "mailtrap-mcp" and is not in node_modules
 */
function isMainModuleMCP(): boolean {
  const mainFile = require?.main?.filename;

  return !!(
    mainFile &&
    mainFile.includes("mailtrap-mcp") &&
    !mainFile.includes("node_modules")
  );
}

/**
 * Checks if running in MCP runtime context (Claude Desktop).
 * @returns true if main module is from MCP runtime
 */
function isMCPRuntimeContext(): boolean {
  const mainFile = require?.main?.filename;

  return !!(
    mainFile &&
    (mainFile.includes("mcp-runtime") ||
      mainFile.includes("nodeHost.js") ||
      mainFile.includes("Claude.app"))
  );
}

/**
 * Checks if the current working directory indicates MCP context.
 * @returns true if cwd contains "mailtrap-mcp" and is not in node_modules
 */
function isWorkingDirectoryMCP(): boolean {
  try {
    const cwd = process.cwd();
    return cwd.includes("mailtrap-mcp") && !cwd.includes("node_modules");
  } catch {
    return false;
  }
}

/**
 * Checks if the call stack indicates MCP context.
 * @returns true if stack contains "mailtrap-mcp" and is not from node_modules/mailtrap
 */
function isCallStackMCP(): boolean {
  const { stack } = new Error();

  return !!(
    stack &&
    stack.includes("mailtrap-mcp") &&
    !stack.includes("node_modules/mailtrap")
  );
}

/**
 * Gets the appropriate User-Agent string based on the current context.
 * @returns The User-Agent string for the current context
 */
function getDynamicUserAgent(): string {
  const isMailtrapMCPContext =
    isMainModuleMCP() ||
    isWorkingDirectoryMCP() ||
    isCallStackMCP() ||
    isMCPRuntimeContext();

  return isMailtrapMCPContext ? MCP_USER_AGENT : USER_AGENT;
}

export default getDynamicUserAgent;
