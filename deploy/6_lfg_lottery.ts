import "@nomiclabs/hardhat-ethers";

import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat"; // Optional (for `node <script>`)

async function deploy() {
  const subscibeId = 433;
  const LFGLotteryArt: ContractFactory = await ethers.getContractFactory(
    "LFGLottery"
  );
  const LFGLottery: Contract = await LFGLotteryArt.deploy(
    "0x3ca3822163D049364E67bE19a0D3B2F03B7e99b5", // owner
    "0x53c54E27DEc0Fa40ac02B032c6766Ce8E04A2A70", // LFG token
    "0x3ca3822163D049364E67bE19a0D3B2F03B7e99b5", // reward holder
    433, // VRF subscribtion ID
    "0x6A2AAd07396B36Fe02a22b33cf443582f682c82f", // _vrfCoordinator
    "0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314" // _keyHash
  );
  await LFGLottery.deployed();
  console.log("LFGLottery deployed to: ", LFGLottery.address);
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
