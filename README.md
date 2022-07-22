# Trisolaris Interface

An open source interface for Trisolaris -- a community-driven decentralized exchange for Aurora and Ethereum assets with fast settlement, low transaction fees, and a democratic distribution -- powered by Aurora.

- Website: [https://www.trisolaris.io/](https://www.trisolaris.io/)
- Telegram: [TrisolarisLabs](https://t.me/TrisolarisLabs)
- Discord: [TrisolarisLabs](discord.gg/my6GtSTmmX)
- Twitter: [@trisolarislabs](https://twitter.com/trisolarislabs)

## Accessing the Trisolaris Interface

Visit [https://www.trisolaris.io/](https://www.trisolaris.io/).

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Generating Token Exports

The [Tokens Repo](https://github.com/trisolaris-labs/tokens)'s master branch is added as a [submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules). This repo references the tokens in the Tokens repo (and their associated metadata). Items defined in `dev/generate_tokens/base_tokens_map.js` take precedence over the imported tokens, and will override the imported metadata.

Run this command when there's an update to the master branch or if you want to update/rebuild the tokens list. There's no harm in running this command multiple times.

```bash
yarn build-tokens
```

### Tests

```bash
yarn test
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to your JSON-RPC provider

### Deploying to production

1. Create PR that includes `npm version patch`
2. Merge PR to `main` branch
3. Deploy to Staging
4. Deploy to Prod

Note: If a feature is going directly to prod, please make a PR that includes `npm version patch` as its final diff. Deploy to production after this PR has been merged to `main` branch

## Attribution

This code was adapted from this Uniswap repo: [uniswap-interface](https://github.com/Uniswap/uniswap-interface).
