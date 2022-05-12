import "@nomiclabs/hardhat-ethers";

import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat"; // Optional (for `node <script>`)

if (!process.env.MULTISIG_PUBKEY)
  throw new Error("MULTISIG_PUBKEY missing from .env file");

async function deploy() {
  // Nft whitelist contract
  const NftWhiteList: ContractFactory = await ethers.getContractFactory(
    "NftWhiteList"
  );
  const nftWhiteList: Contract = await NftWhiteList.deploy(
    process.env.MULTISIG_PUBKEY
  );
  await nftWhiteList.deployed();
  console.log("NftWhiteList deployed to: ", nftWhiteList.address);

  // SAM config contract
  const SAMConfigContract: ContractFactory = await ethers.getContractFactory(
    "SAMConfig"
  );
  const samConfigContract: Contract = await SAMConfigContract.deploy(
    process.env.MULTISIG_PUBKEY,
    "0x293d51C81bF5F40a1910c1cf8a886aF95FfC2dA0", // Revenue address
    "0xAB8691073fEcD08CE138C6c46edb207c1d2B697d" // Burn address
  );
  await samConfigContract.deployed();
  console.log("SAMConfigContract deployed to: ", samConfigContract.address);

  // SAMContract (NFT Social Aggregator Marketplace) uses LFG token
  const SAMContract: ContractFactory = await ethers.getContractFactory(
    "SAMContract"
  );

  const samContract: Contract = await SAMContract.deploy(
    process.env.MULTISIG_PUBKEY, // owner address
    "0xF93f6b686f4A6557151455189a9173735D668154", // lfgToken.address
    nftWhiteList.address, // NFT Whitelist contract
    samConfigContract.address // SAMConfig address
  );

  await samContract.deployed();
  console.log("SAMContract deployed to: ", samContract.address);

  // SAMContract (NFT Social Aggregator Marketplace) uses gas
  const SAMContractGas: ContractFactory = await ethers.getContractFactory(
    "SAMContractGas"
  );

  const samContractGas: Contract = await SAMContractGas.deploy(
    process.env.MULTISIG_PUBKEY, // owner address
    nftWhiteList.address, // White List contract
    samConfigContract.address // SAMConfig address
  );

  await samContractGas.deployed();
  console.log("SAMContractGas deployed to: ", samContractGas.address);
}

async function main(): Promise<void> {
  await deploy();
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
