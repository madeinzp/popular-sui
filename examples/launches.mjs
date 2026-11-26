// Follow the launch feed: keep the `next` cursor of every answer and ask again with it.
const API = "https://popularsui.xyz/api/v1/launches";
let cursor = null;

for (;;) {
  const url = cursor ? `${API}?after=${encodeURIComponent(cursor)}` : `${API}?limit=5`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const { launches, next } = await res.json();
  for (const l of launches) console.log(new Date(l.created_ms).toISOString(), l.venue.padEnd(8), `$${l.symbol}`, `https://popularsui.xyz/token/${l.id}`);
  if (next) cursor = next;
  await new Promise((r) => setTimeout(r, 10_000)); // every 10 s stays well inside the rate limits
}
