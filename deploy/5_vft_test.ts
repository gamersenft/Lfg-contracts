import "@nomiclabs/hardhat-ethers";

import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat"; // Optional (for `node <script>`)

async function deploy() {
  const subscibeId = 433;
  const VRFv2Consumer: ContractFactory = await ethers.getContractFactory(
    "VRFv2Consumer"
  );
  const vRFv2Consumer: Contract = await VRFv2Consumer.deploy(subscibeId);
  await vRFv2Consumer.deployed();
  console.log("vRFv2Consumer deployed to: ", vRFv2Consumer.address);
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
