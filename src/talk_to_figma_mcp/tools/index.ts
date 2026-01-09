import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerExecutionTools } from "./execution-tools";

/**
 * Register all Figma tools to the MCP server
 * @param server - The MCP server instance
 */
export function registerTools(server: McpServer): void {
  registerExecutionTools(server);
}
