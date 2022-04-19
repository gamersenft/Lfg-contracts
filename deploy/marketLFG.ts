import "@nomiclabs/hardhat-ethers";

import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat"; // Optional (for `node <script>`)

async function deploy() {
  
  const SAMContract: ContractFactory = await ethers.getContractFactory(
    "SAMContract"
  );

  const samContract: Contract = await SAMContract.deploy(
    process.env.MULTISIG_PUBKEY, // owner address
     "0xb6c7670bCB763d803f5f40D94DC512d0DE70E0C5",
   "0x401E332567c2848Fb7E77b4f5536F587a8A642f2", // Whitelist contract
   process.env.MULTISIG_PUBKEY, // burn address
    process.env.MULTISIG_PUBKEY // Revenue address
  );

  await samContract.deployed();
  console.log("SAMContract deployed to: ", samContract.address);

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
