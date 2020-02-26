const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const json = require("./../build/contracts/ExampleToken.json");

let accounts;
let exampleToken;
let manager;
const interface = json["abi"];
const bytecode = json["bytecode"];

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  manager = accounts[0];
  exampleToken = await new web3.eth.Contract(interface)
    .deploy({ data: bytecode })
    .send({ from: manager, gas: "4000000" });
});

describe("ExampleToken", () => {
  it("deploys a contract", async () => {
    const exampleTokenManager = await exampleToken.methods.wallet.call();
    assert.equal(
      manager,
      exampleTokenManager,
      "The manager is the one who launches the smart contract."
    );
  });

  it("can exchange token for ETC", async () => {
    buyer = accounts[1];

    startingRate = await exampleToken.methods.rate.call();

    await exampleToken.methods
      .buyExampleToken(buyer)
      .send({ value: web3.utils.toWei("3", "ether") });

    weiRaisedByContract = await exampleToken.methods.weiRaised.call();

    assert.equal(
      weiRaisedByContract,
      web3.utils.toWei("3", "ether"),
      "The correct amount is transferred to the wallet manager."
    );

    endingRate = await exampleToken.methods.rate.call();
    endingSupply = await exampleToken.methods.totalSupply().call();

    assert.equal(
      endingRate,
      startingRate * endingSupply,
      "The new exchange rate for the example token is correctly reflected."
    );
  });
});
