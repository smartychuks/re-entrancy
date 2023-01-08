// SPDX-Lincense-Identifier: MIT
pragma solidity ^0.8.4;

contract GoodContract {

    mapping(address => uint) public balances;

    // function to deposit Eth
    function addBalance() public payable {
        balances[msg.sender] += msg.value;
    }

    // function to withdraw ETH
    function withdraw() public {
        require(balances[msg.sender] > 0);
        (bool sent, ) = msg.sender.call{value: balances[smg.sender]}("");
        require(sent, "Failed to send ether");
        balances[msg.sender] = 0;
    }
}