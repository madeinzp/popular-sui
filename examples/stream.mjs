// Launches and trades as Server-Sent Events. A ": ping" comment arrives every 15 s.
const res = await fetch("https://popularsui.xyz/api/v1/stream", { headers: { accept: "text/event-stream" } });
if (!res.ok) throw new Error(`stream: ${res.status}`);

const decoder = new TextDecoder();
let buffer = "";
for await (const chunk of res.body) {
  buffer += decoder.decode(chunk, { stream: true });
  let end;
  while ((end = buffer.indexOf("\n\n")) >= 0) {
    const block = buffer.slice(0, end);
    buffer = buffer.slice(end + 2);
    const event = /^event: (.*)$/m.exec(block)?.[1];
    const data = /^data: (.*)$/m.exec(block)?.[1];
    if (!event || !data) continue;
    const d = JSON.parse(data);
    if (event === "launch") console.log("launch", `$${d.symbol}`, d.id);
    else if (event === "trade") console.log("trade ", d.is_buy ? "buy " : "sell", d.id, `${Number(d.sui) / 1e9} SUI`);
  }
}
