// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract BCtwatter{

    uint256 totalTwats;

    // emit event header
    event TwatReceived(address indexed from, uint256 timestamp, string message);
    
    // struct containing variables of a twat
    struct Twat{
        uint twatID; //ID of twat
        address twatee; //person who twats 
        string message; //message of twat
        uint256 timestamp; //time of twat
        uint256 N_cheers; //number of times the twat has been cheers'ed
    }

    // array of all twats (in the form of a struct) ever twatted
    Twat[] twats;

    constructor(){
        console.log("Contract called");
    }

    //twat function
    function twat(string memory _message) public {
        console.log("%s twatted: %s", msg.sender, _message);

        // save twat to array
        twats.push(Twat(totalTwats, msg.sender, _message, block.timestamp, 0));

        // emit an event when someone twats to signal update to UI
        emit TwatReceived(msg.sender, block.timestamp, _message);
        
        //update twat counter (ID variable)
        totalTwats +=1;

    }

    // increase number of cheers' of a twat
    function cheers(uint256 twatIndex) public {
        twats[twatIndex].N_cheers += 1;
    }

    function getAllTwats() public view returns (Twat[] memory){
        return twats;
    }

    function getTotalTwats() public view returns (uint256) {
        return totalTwats;
    }

}

