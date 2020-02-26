const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

// it's a good practice to some how denote that this the solcTruffleJSON file
const json = require("./../build/contracts/ExampleToken.json");

let accounts;
let exampleToken;
let manager;
const interface = json["abi"];
const bytecode = json["bytecode"];
/*
If you wanted to not keep the unit test idempotent then you could use a single deploy on the contract in
tests unit tests that point to new smart contracts is actually preferable for testing because you have clean contract state
beforeAll(async () => {
  
  
})
*/

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  manager = accounts[0];
  exampleToken = await new web3.eth.Contract(interface)
    .deploy({ data: bytecode })
    .send({ from: manager, gas: "4000000" });
});

describe("ExampleToken", () => {

  /*
  Good to check that the 
  
  */
  it("deploys a contract", async () => {
    
    // just a note this would now be owner
    const exampleTokenManager = await exampleToken.methods.wallet.call();
    assert.equal(
      manager,
      exampleTokenManager,
      "The manager is the one who launches the smart contract."
    );
  });

  it("can exchange token for ETC", async () => {
    buyer = accounts[1];
    // this can probably be simplified to just rate.call()
    startingRate = await exampleToken.rate.call();
    // NOTE the methods might have changed due to the upstream refactor
    await exampleToken.methods
      .buyExampleToken(buyer)
      .send({ value: web3.utils.toWei("3", "ether") });

    // weiraised replaced with balance
    weiRaisedByContract = await exampleToken.weiRaised.call();

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
