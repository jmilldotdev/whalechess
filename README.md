# WhaleChess

Whale Chess is a fully on-chain chess game with AI-generated custom pieces. Play chess, collect pieces, build your squad, and climb your way to the top!

## What's Inside

WhaleChess is built with the MUD framework. There are 3 included packages:

- `contracts`: The core logic & contracts of the game, including the chess rules, piece logic, and squad management.
- `client`: A React app frontend using the MUD framework to interface with the contracts.
- `api-svc`: An Express API service to get the custom piece definition from the LLM and create the piece using the contracts.

## Development

Follow the setup for [MUD](https://mud.dev/quickstart).

Create an env file using each of the example env files to know what values you need.

```
pnpm i
pnpm dev
```

Note: you may need to restart the development server once after the contracts compile for the first time.

## Deployed World Contracts

- [Garnet](https://explorer.garnetchain.com/address/0x44eC6b7621019cBC4C39a45CD0f5F738b704dDC1)
- [Base](https://base-sepolia.blockscout.com/address/0xE34670f20eF5b18c3CEc38e03D435D23eEE4d648)
- [Flow](https://evm-testnet.flowscan.io/address/0x80F76DD963D293B5B7B80f6897d4356D16cEC962)
- [Linea](https://sepolia.lineascan.build/address/0x770280127f13a2cf3d7549d0940fdc4c7ff140c6)
- [Polygon](https://amoy.polygonscan.com/address/0x1c70a7f9c77e3652dafe469eafea0d0904ed584d)
- [Mantle](https://sepolia.mantlescan.xyz/address/0xdedb0561e43b857e197de2a22feb163ac38a5f7f)