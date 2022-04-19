import "@nomiclabs/hardhat-ethers";

import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat"; // Optional (for `node <script>`)

async function deploy() {
  
  const NftAirdrop: ContractFactory = await ethers.getContractFactory(
    "NftAirdrop"
  );

  const airDrop: Contract = await NftAirdrop.deploy("0x48392ceA440E9D6e599785d9D6d2344B71c955a6");

  await airDrop.deployed();
  console.log("airDrop deployed to: ", airDrop.address);

  // SAMContract uses gas
//   const SAMContractGas: ContractFactory = await ethers.getContractFactory(
//     "SAMContractGas"
//   );

//   const samContractGas: Contract = await SAMContractGas.deploy(
//     process.env.MULTISIG_PUBKEY, // owner address
//    "0x401E332567c2848Fb7E77b4f5536F587a8A642f2" // White List contract
//   );

//   await samContractGas.deployed();
//   console.log("SAMContractGas deployed to: ", samContractGas.address);
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
