// Top tokens by 24 h volume, then the latest trades of the first one.
const API = "https://popularsui.xyz/api/v1";
const get = (path) => fetch(API + path).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status} ${path}`))));

const { tokens } = await get("/tokens?sort=volume&limit=5");
for (const t of tokens) console.log(`${t.symbol.padEnd(10)} ${t.id}`);

const first = tokens[0];
const { trades } = await get(`/tokens/${first.id}/trades?limit=5`);
console.log(`\nLatest trades of $${first.symbol}:`);
for (const tr of trades) console.log(tr);
