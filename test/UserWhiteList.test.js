const {assert, expect} = require("chai");
const hre = require("hardhat");
const {web3} = require("hardhat");
const UserWhiteListArt = hre.artifacts.require("UserWhiteList");

describe("UserWhiteList", function () {
  let UserWhiteList = null;
  let accounts = ["", ""],
    owner,
    operator;

  before("Deploy contract", async function () {
    try {
      [accounts[0], accounts[1], owner, operator] = await web3.eth.getAccounts();
      UserWhiteList = await UserWhiteListArt.new(owner);
    } catch (err) {
      console.log(err);
    }
  });

  it("test whitelist feature", async function () {
    let isWhitelisted = await UserWhiteList.userWhiteLists(accounts[1]);
    assert.equal(isWhitelisted, false);

    let isOperator = await UserWhiteList.operators(operator);
    assert.equal(isOperator, false);

    await expect(UserWhiteList.setUserWhitelist([accounts[1]], [true], {from: operator})).to.be.revertedWith(
      "Invalid operator or owner"
    );

    await UserWhiteList.setOperator(operator, true, {from: owner});
    isOperator = await UserWhiteList.operators(operator);
    assert.equal(isOperator, true);

    await UserWhiteList.setUserWhitelist([accounts[1]], [true], {from: operator});
    isWhitelisted = await UserWhiteList.userWhiteLists(accounts[1]);
    assert.equal(isWhitelisted, true);
  });
});
