// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

contract buttarCoin {
    address public minter;
    mapping(address => uint) private balance;
    mapping(string => address) public person;

    constructor() {
        minter = msg.sender;
    }

    event Sent(address from, address to, uint amount);

    function setMinterName(string memory name) public onlyOwner {
        person[name] = msg.sender;
    }

    function registerPerson(string memory name, address addr) public onlyOwner {
        person[name] = addr;
    }

    function mint(string memory receiver, uint amount) public onlyOwner {
        balance[person[receiver]] += amount;
    }

    error insufficientBalance(uint requested, uint availble);

    function send(string memory receiver, uint amount) public {
        if (amount > balance[msg.sender])
            revert insufficientBalance({
                requested: amount,
                availble: balance[msg.sender]
            });

        balance[msg.sender] -= amount;
        balance[person[receiver]] += amount;

        emit Sent(msg.sender, person[receiver], amount);
    }

    function getBalance(string memory name) public view returns (uint) {
        return balance[person[name]];
    }

    modifier onlyOwner() {
        require(minter == msg.sender);
        _;
    }
}
