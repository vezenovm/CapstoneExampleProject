pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract ExampleToken is ERC20 {
	using SafeMath for uint256;
	mapping (address => uint) balances;

	string public name = "ExampleToken";
	string public symbol = "ET";
	uint8 public decimals = 2;
	uint256 public rate;
	address public owner;

	constructor() public {
		rate = 10;
		owner = msg.sender;
		balances[owner] = 10000;
	}

	function stabilizeRate() public {
		rate = rate * totalSupply();
	}

	function _transfer(address from, address to, uint256 value) internal {
		_transfer(from, to, value);
	}

	function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
        if (balances[msg.sender] < amount) return false;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        _transfer(msg.sender, receiver, amount);
        return true;
    }

	function buyExampleToken() public payable {
		require(msg.value != 0);

		// uint256 tokensToETC = msg.value.mul(rate);
		// weiRaised = weiRaised.add(msg.value);

		// _mint(_beneficiary, tokensToETC);
		// token.transfer(_beneficiary, tokensToETC);
		// wallet.transfer(msg.value);


		uint256 numTokens = msg.value.mul(rate);
		uint256 nextBalance = address(this).balance.add(msg.value);

		require(nextBalance > address(this).balance);
		_mint(msg.sender, numTokens);
		//owner.transfer(msg.value);
		_transfer(msg.sender, owner, msg.value);

		stabilizeRate();
	}

	function getExTokenBalance(address addr) public view returns(uint) {
		return balances[addr];
	}

}