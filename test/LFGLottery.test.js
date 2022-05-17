const {assert, expect} = require("chai");
const hre = require("hardhat");
const {web3} = require("hardhat");
const LFGTokenArt = hre.artifacts.require("LFGToken");
const LFGLotteryArt = hre.artifacts.require("LFGLottery");
const BN = require("bn.js");

describe("NftDistribute", function () {
  let LFGToken = null;
  let LFGLottery = null;
  let accounts = ["", "", "", ""],
    owner;

  const airDropNftAmount = 1;

  before("Deploy contract", async function () {
    try {
      [accounts[0], accounts[1], accounts[2], accounts[3], owner] = await web3.eth.getAccounts();
      LFGToken = await LFGTokenArt.new("LFG Token", "LFG", "1000000000000000000000000000", owner);

      LFGLottery = await LFGLotteryArt.new(
        owner,
        LFGToken.address,
        owner,
        1,
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000",
        "0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314"
      );
    } catch (err) {
      console.log(err);
    }
  });

  it("test reward tickets", async function () {
    await expect(LFGLottery.rewardTicket(accounts[1], accounts[2], {from: accounts[0]})).to.be.revertedWith(
      "Invalid operator for LFGLottery"
    );

    await LFGLottery.setOperator(accounts[0], true, {from: owner});

    await LFGToken.approve(LFGLottery.address, "100000000000000000000000", {
      from: owner,
    });

    await LFGLottery.rewardTicket(accounts[1], accounts[2], {from: accounts[0]});
  });
});
