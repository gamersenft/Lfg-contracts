import "@nomiclabs/hardhat-ethers";

import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat"; // Optional (for `node <script>`)

async function deploy() {
  // LFG token contract
  const LFGToken: ContractFactory = await ethers.getContractFactory("LFGToken");
  const lfgToken: Contract = await LFGToken.deploy(
    "LFG Token",
    "LFG",
    "1000000000000000000000000000",
    process.env.MULTISIG_PUBKEY
  );
  await lfgToken.deployed();
  console.log("LFGToken deployed to: ", lfgToken.address);

  // LFGNFT contract
  const LFGNFT: ContractFactory = await ethers.getContractFactory("LFGNFT");
  const lfgNft: Contract = await LFGNFT.deploy(process.env.MULTISIG_PUBKEY);
  await lfgNft.deployed();
  console.log("LFGNFT deployed to: ", lfgNft.address);

  // LFGNFT1155 contract
  const LFGNFT1155: ContractFactory = await ethers.getContractFactory(
    "LFGNFT1155"
  );
  const lfgNft1155: Contract = await LFGNFT1155.deploy(
    process.env.MULTISIG_PUBKEY,
    ""
  );
  await lfgNft1155.deployed();
  console.log("LFGNFT1155 deployed to: ", lfgNft1155.address);

  // Nft whitelist contract
  const NftWhiteList: ContractFactory = await ethers.getContractFactory(
    "NftWhiteList"
  );
  const nftWhiteList: Contract = await NftWhiteList.deploy(
    process.env.MULTISIG_PUBKEY
  );
  await nftWhiteList.deployed();
  console.log("NftWhiteList deployed to: ", nftWhiteList.address);

  // SAMContract uses token
  const SAMContract: ContractFactory = await ethers.getContractFactory(
    "SAMContract"
  );

  const samContract: Contract = await SAMContract.deploy(
    process.env.MULTISIG_PUBKEY, // owner address
     lfgToken.address,
    nftWhiteList.address, // Whitelist contract
    "0xf197c5bC13383ef49511303065d39b33DC063f72", // burn address
    process.env.MULTISIG_PUBKEY // Revenue address
  );

  await samContract.deployed();
  console.log("SAMContract deployed to: ", samContract.address);

  // SAMContract uses gas
  const SAMContractGas: ContractFactory = await ethers.getContractFactory(
    "SAMContractGas"
  );

  const samContractGas: Contract = await SAMContractGas.deploy(
    process.env.MULTISIG_PUBKEY, // owner address
    nftWhiteList.address // White List contract
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
