// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalPokes;

    constructor(){
        console.log("whassup loser");
    }

    function poke() public{
        totalPokes += 1;
        console.log("%s has poked us!", msg.sender);
    }

    function getTotalPokes() public view returns (uint256){
        console.log("A total of %s pokes have been given", totalPokes);
        return totalPokes;
    }
}
