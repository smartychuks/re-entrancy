const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Attack", function () {
  it("Should empty the balance of the good contract", async function () {
    // Deploy the good contract
    const goodContractFactory = await ethers.getContractFactory("GoodContract");
    const goodContract = await goodContractFactory.deploy();
    await goodContract.deployed();

    // Deploy the bad contract
    const badContractFactory = await ethers.getContractFactory("BadContract");
    const badContract = await badContractFactory.deploy(goodContract.address);
    await badContract.deployed();

    // get test addresses
    const [_, innocentAddress, attackerAddress] = await ethers.getSigners();

    // Make innocent user to deposit 10 ether into goodContract
    let tx = await goodContract.connect(innocentAddress).addBalance({
      value: parseEther("10"),
    })
    await tx.wait();

    // check to see if GoodContract Balance is 10 ETH
    let balanceETH = await ethers.provider.getBalance(goodContract.address);
    expect(balanceETH).to.equal(parseEther("10"));

    // attacker deposits 1 ETH
    tx = await badContract.connect(attackerAddress).attack({
      value: parseEther("1"),
    });
    await tx.wait();

    // check balance of GoodContract to be zero
    balanceETH = await ethers.provider.getBalance(goodContract.address);
    expect(balanceETH).to.equal(BigNumber.from("0"));

    // check BadContract to be 11 ETH
    balanceETH = await ethers.provider.getBalance(badContract.address);
    expect(balanceETH).to.equal(parseEther("11"));
  })
})