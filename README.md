# Lfg-contracts

## LFGNFT
The LFG NFT contract.

## SAMContract
The SAM(Social Aggregator Marketplace) contract. Support add NFT to marketplace for sale or auction. The auction support normal auction and dutch auction.

## Environment Setup

### please check nodejs version by `node -v` and update it to 16.14.0
### install yarn: `npm install yarn -g`
### install hardhat: `npm install --save-dev hardhat`
### add env MUMBAI_PRIVKEY: `export MUMBAI_PRIVKEY="xxxxxxxxxxx"`
### Complile the contract `npx hardhat compile`

## Start LFG Lottery as a automated service
1. Deploy the LFG lottery contract.
2. Register the lottery contract to the ChainLink VRF2 service.
3. Register the lottery contract to the ChainLink keeper serice.
4. Add allowance to the lottery contract from the reward holder.
5. Add operator to the lottery contract.
6. Reward tickets or buy tickets to make the players larger than 3.