// Call a tool of the remote MCP server directly with JSON-RPC: search tokens by name or ticker.
const query = process.argv[2] ?? "pop";
const res = await fetch("https://popularsui.xyz/api/v1/mcp", {
  method: "POST",
  headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
  body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "search_tokens", arguments: { query } } }),
});
if (!res.ok) throw new Error(`mcp: ${res.status}`);
const answer = await res.json();
for (const part of answer.result?.content ?? []) if (part.type === "text") console.log(part.text);
