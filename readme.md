# Figma MCP - Lightweight Full Access

A minimal MCP server providing full Figma Plugin API access through a single `execute_code` tool.

> **Fork Notice**: This is a lightweight fork of [claude-talk-to-figma-mcp](https://github.com/arinspunk/claude-talk-to-figma-mcp) by Xúlio Zé, which is based on [cursor-talk-to-figma-mcp](https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp) by Sonny Lazuardi.

## Why This Fork?

The original MCP has 40+ specialized tools. This version has **2 tools**:

| Tool | Purpose |
|------|---------|
| `join_channel` | Connect to Figma plugin |
| `execute_code` | Run any Figma Plugin API code |

### Benefits

- **Context-efficient**: Minimal tool definitions = more context for your actual work
- **Full access**: Execute any valid Figma Plugin API code
- **No limitations**: Not restricted to predefined operations
- **Simpler maintenance**: Less code to maintain

## Setup

### 1. Configure Claude Desktop

Add to your Claude Desktop config (`claude_desktop_config.json`):

**Option A: Via npm (recommended)**
```json
{
  "mcpServers": {
    "FigmaMCP": {
      "command": "bunx",
      "args": ["figma-mcp-lightweight@latest"]
    }
  }
}
```

**Option B: From source**
```bash
git clone https://github.com/halilc4/figma-mcp-lightweight.git
cd figma-mcp-lightweight
bun install
bun run build
```

```json
{
  "mcpServers": {
    "FigmaMCP": {
      "command": "bun",
      "args": ["run", "/path/to/figma-mcp-lightweight/dist/talk_to_figma_mcp/server.js"]
    }
  }
}
```

### 2. Setup Figma Plugin

Import `src/claude_mcp_plugin/manifest.json` in Figma:
Menu > Plugins > Development > Import plugin from manifest

### 3. Connect

1. Start WebSocket server: `bun socket`
2. Open plugin in Figma, copy channel ID
3. In Claude: "Connect to Figma channel {channel-ID}"

## Usage

Once connected, Claude can execute any Figma Plugin API code:

```javascript
// Create a frame
const frame = figma.createFrame();
frame.resize(400, 300);
frame.name = "My Frame";

// Access selection
const selected = figma.currentPage.selection;

// Modify nodes
node.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
```

See [Figma Plugin API docs](https://www.figma.com/plugin-docs/) for full reference.

## Architecture

```
Claude Desktop <-> MCP Server <-> WebSocket Server <-> Figma Plugin
```

## License

MIT License - see [LICENSE](LICENSE)

## Credits

- [Sonny Lazuardi](https://github.com/sonnylazuardi) - Original implementation
- [Xúlio Zé](https://github.com/arinspunk) - Claude adaptation
- [Igor Halilovic](https://github.com/halilc4) - Lightweight fork
