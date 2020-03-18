const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const json = require("./../build/contracts/ExampleToken.json");

let accounts;
let exampleToken;
let owner;
const interface = json["abi"];
const bytecode = json["bytecode"];

const ExampleToken = artifacts.require("ExampleToken");
var deployed;

contract("ExampleToken", accounts => {
  it("should put 10000 ExampleToken in the first account", () =>
    ExampleToken.deployed()
      .then(function(instance) {
        deployed = instance;
        return deployed.getExTokenBalance(accounts[0]);
      })
      .then(function(balance) {
        assert.equal(
          balance.valueOf(),
          10000,
          "10000 wasn't in the deploying account"
        );
      }));

  it("can exchange token for ETC", () => {
    let meta;

    // Get intial balances of first and second account
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    let accountOneStartingBalance;
    let accountTwoStartingBalance;
    let accountOneEndingBalance;
    let accountTwoEndingBalance;

    let accountOneStartingEthBalance;
    let accountTwoStartingEthBalance;
    let accountOneEndingEthBalance;
    let accountTwoEndingEthBalance;

    let startingRate;
    let endingRate;

    const amount = 10;

    ExampleToken.deployed()
      .then(function(instance) {
        meta = instance;
        return meta.getBalance.call(accountOne);
      })
      .then(function(balance) {
        accountOneStartingBalance = balance.toNumber();
        return meta.getBalance.call(accountTwo);
      })
      .then(function(balance) {
        accountTwoStartingBalance = balance.toNumber();
        return meta.rate.call();
      })
      .then(function(rate) {
        startingRate = rate.toNumber();
        return web3.eth.getBalance(accountOne);
      })
      .then(function(ethBalance) {
        accountOneStartingEthBalance = ethBalance;
        return meta.buyExampleToken({
          from: accountTwo,
          value: web3.utils.toWei("3", "ether")
        });
      })
      .then(() => deployed.getBalance.call(accountOne))
      .then(function(balance) {
        accountOneEndingBalance = balance.toNumber();
        return meta.getBalance.call(accountTwo);
      })
      .then(function(balance) {
        accountTwoEndingBalance = balance.toNumber();
        return web3.eth.getBalance(accountOne);
      })
      .then(function(ethBalance) {
        accountOneEndingEthBalance = ethBalance;
        return meta.rate.call();
      })
      .then(function(rate) {
        endingRate = rate.toNumber();

        assert.equal(
          accountTwoEndingBalance,
          accountTwoStartingBalance + startingRate,
          "ExampleToken amount was correctly sent to the receiver"
        );

        assert.equal(
          accountOneEndingEthBalance,
          accountTwoStartingEthBalance + web3.utils.toWei("3", "ether"),
          "Correct amount of ether was transferred to the contract owner"
        );
      });
  });
});

// beforeEach(async () => {
//   accounts = await web3.eth.getAccounts();
//   console.log(accounts);
//   owner = accounts[0];
//   exampleToken = await new web3.eth.Contract(interface)
//     .deploy({ data: bytecode })
//     .send({ from: owner, gas: "4000000" });
// });

// describe("ExampleToken", () => {
//   it("deploys a contract", async () => {
//     const exampleTokenOwner = exampleToken.methods.owner.call();
//     console.log("Owner: " + owner);
//     console.log("Example Token Owner From Call: " + exampleTokenOwner);
//     assert.equal(
//       owner,
//       exampleTokenOwner,
//       "The owner is the one who launches the smart contract."
//     );
//   });

//   it("can exchange token for ETC", async () => {
//     buyer = accounts[1];

//     startingRate = await exampleToken.methods.rate.call();

//     startingContractBalance = await web3.eth.getBalance(owner);

//     assert.equal(
//     	startingContractBalance,
//     	web3.utils.toWei("0", "ether"),
//     	"The contract owner balance starts at 0/"
//     );

//     await exampleToken.methods
//       .buyExampleToken()
//       .send({ from: buyer, value: web3.utils.toWei("3", "ether") });

//     endingContractBalance = await web3.eth.getBalance(owner);

//     assert.equal(
//       endingContractBalance,
//       web3.utils.toWei("3", "ether"),
//       "The correct amount is transferred to the contract owner."
//     );

//     endingRate = await exampleToken.methods.rate.call();
//     endingSupply = await exampleToken.methods.totalSupply().call();

//     assert.equal(
//       endingRate,
//       startingRate * endingSupply,
//       "The new exchange rate for the example token is correctly reflected."
//     );
//   });
// });
