# POPULAR on Sui: integration kit

[POPULAR](https://popularsui.xyz) is a memecoin launchpad and launchpad aggregator on Sui mainnet. Tokens launch on bonding curves and graduate into Cetus pools whose LP position is burned; tokens from other Sui launchpads trade in the same chart. Every rule lives in Move contracts on Sui; the website only builds transactions for the visitor's wallet to sign.

This repository collects what you need to build on POPULAR: the public API description, the MCP server card, runnable examples and the DefiLlama TVL adapter. The contracts themselves are not in this repository; their package ids, types and events are documented in the [integrators guide](https://popularsui.xyz/data/integrators).

- Website: https://popularsui.xyz
- How it works: https://popularsui.xyz/how-it-works
- Open data and live API: https://popularsui.xyz/data ([markdown](https://popularsui.xyz/data.md))
- Integrators guide (launch feed, stream, unsigned transactions, packages, events, curve math): https://popularsui.xyz/data/integrators ([markdown](https://popularsui.xyz/data/integrators.md))
- X: https://x.com/popular_sui · Telegram: https://t.me/popular_signals

## What is here

| Path | What it is |
| --- | --- |
| [`spec/openapi.json`](spec/openapi.json) | OpenAPI 3.1 description of the stable read API (`/api/v1`). Live copy: https://popularsui.xyz/api/v1/spec.json |
| [`spec/mcp-server-card.json`](spec/mcp-server-card.json) | Card of the remote MCP server. Live copy: https://popularsui.xyz/.well-known/mcp/server-card.json |
| [`examples/`](examples) | Node scripts: tokens and trades, the launch feed, the live stream, an unsigned buy signed by your own key, an MCP call |
| [`defillama/index.js`](defillama/index.js) | The TVL adapter for [DefiLlama](https://defillama.com), read straight from chain |
| [`brand/`](brand) | Logo |

The files in `spec/` are snapshots; the live URLs above are the source of truth.

## Quick start

No account and no key are needed to start: without a key the API allows 30 requests a minute per address. A wallet signature gets a free key with higher limits ([how](https://popularsui.xyz/data.md)).

```sh
# The newest launches
curl -s "https://popularsui.xyz/api/v1/launches?limit=5"

# Tokens ranked by 24 h volume
curl -s "https://popularsui.xyz/api/v1/tokens?sort=volume&limit=10"

# Live launches and trades (Server-Sent Events)
curl -N https://popularsui.xyz/api/v1/stream
```

Run the examples (Node 20 or later):

```sh
cd examples
node tokens.mjs                 # top tokens, then one token's latest trades
node launches.mjs               # follow the launch feed with its cursor
node stream.mjs                 # print launches and trades as they happen
node mcp.mjs pop                # search tokens through the MCP server
npm install && SUI_KEY=suiprivkey1... node buy.mjs <token id> 0.1   # build, show, sign and send a buy
```

## API at a glance

| Endpoint | What it returns |
| --- | --- |
| `GET /api/v1/tokens` | Tokens with price, market cap, 24 h volume, holders and status |
| `GET /api/v1/tokens/{id}` and `/trades`, `/candles`, `/holders` | One token, its trades, OHLC candles and holders |
| `GET /api/v1/trades/recent` | The latest trades across all tokens |
| `GET /api/v1/wallets/{address}` | A wallet's positions, PnL and open orders |
| `GET /api/v1/launches` | Every token launched on POPULAR, with a stable cursor |
| `GET /api/v1/stream` | Launches and trades as Server-Sent Events |
| `POST /api/v1/tx/buy`, `/sell`, `/order`, `/launch` | An unsigned transaction with a summary and a dry run, for the user's own wallet to sign |
| `POST /api/v1/mcp` | Remote MCP server (streamable HTTP) |

Units: token amounts are integer strings in 10^-6 token, SUI amounts integer strings in MIST, times Unix ms. Full field lists and limits are in the OpenAPI description.

POPULAR never signs and never holds keys. Show the user the summary of an unsigned transaction before their wallet signs it.

## MCP server

`https://popularsui.xyz/api/v1/mcp` is a remote Model Context Protocol server (streamable HTTP, no sign-in) with tools to search tokens, read prices, trades, candles, holders and wallets, quote trades and build unsigned transactions. Add it to any MCP client as a remote HTTP server:

```json
{
  "mcpServers": {
    "popular": { "type": "http", "url": "https://popularsui.xyz/api/v1/mcp" }
  }
}
```

## Data license

Data from the API and the open data archive is CC BY 4.0: credit "Data: POPULAR (popularsui.xyz)". The code in this repository is MIT ([LICENSE](LICENSE)).

## Risk

Most memecoins go to zero. Nothing here is financial advice. Read the [risk disclosure](https://popularsui.xyz/risk) before trading.
