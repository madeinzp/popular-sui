# DefiLlama adapter

`index.js` is the POPULAR TVL adapter in the format of [DefiLlama-Adapters](https://github.com/DefiLlama/DefiLlama-Adapters) (`projects/popular/index.js` there). It reads everything from Sui:

- quote coins (SUI, USDC and others) held by bonding curves that have not graduated yet;
- cash in the lending vaults and collateral locked in open loans;
- `borrowed`: principal lent out by the lending vaults;
- `staking`: POP, the project's own token, when it sits in the lending contracts (it is never counted as TVL).

Graduated tokens trade in Cetus pools whose LP position is burned; that liquidity is counted under Cetus. Launched tokens themselves are not counted.

Run it inside a checkout of DefiLlama-Adapters: `node test.js projects/popular/index.js`.
