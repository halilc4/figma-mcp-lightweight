import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendCommandToFigma, joinChannel } from "../utils/websocket";

/**
 * Register execution tools to the MCP server
 * This module contains the generic code execution tool for running arbitrary Figma Plugin API code
 * @param server - The MCP server instance
 */
export function registerExecutionTools(server: McpServer): void {
  // Join channel tool - required before any other commands
  server.tool(
    "join_channel",
    "Join a Figma channel to establish communication. Must be called before execute_code.",
    {
      channel: z.string().min(1).describe("Channel name from Figma plugin"),
    },
    async ({ channel }) => {
      try {
        await joinChannel(channel);
        return {
          content: [{
            type: "text",
            text: `Joined channel: ${channel}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Failed to join channel: ${error instanceof Error ? error.message : String(error)}`
          }]
        };
      }
    }
  );

  server.tool(
    "execute_code",
    "Execute arbitrary Figma Plugin API code. Returns serialized result or error. Use for complex operations not covered by existing tools.",
    {
      code: z.string().min(1).describe(
        "JavaScript code to execute. Has access to 'figma' global object. Supports async/await. Return only JSON-serializable data."
      ),
    },
    async ({ code }) => {
      try {
        const result = await sendCommandToFigma("execute_code", { code });

        // Check if execution failed
        if (result && typeof result === 'object' && 'success' in result) {
          if (!result.success) {
            return {
              content: [{
                type: "text",
                text: `Execution failed:\n${result.error.type}: ${result.error.message}\n\nStack:\n${result.error.stack}`
              }]
            };
          }

          // Success - parse result string back to display nicely
          const parsed = JSON.parse(result.result);
          return {
            content: [{
              type: "text",
              text: JSON.stringify(parsed, null, 2)
            }]
          };
        }

        // Fallback - return as-is
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`
          }]
        };
      }
    }
  );
}
