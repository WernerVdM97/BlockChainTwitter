// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract BCtwatter{

    uint256 totalTwats;
    uint256 private seed;
    mapping(address => uint256) public lastTwattedAt;
    mapping(address => uint256) public lastCheersedAt;

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

    constructor() payable {
        console.log("Contract called");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    //twat function
    function twat(string memory _message) public {
        
        //prevent spam
        require(
            lastTwattedAt[msg.sender] + 15 minutes < block.timestamp,
            "Yo man please wait 15 min before you can twat again."
        );
        lastTwattedAt[msg.sender] = block.timestamp;


        console.log("%s twatted: %s", msg.sender, _message);

        // save twat to array
        twats.push(Twat(totalTwats, msg.sender, _message, block.timestamp, 0));

        // emit an event when someone twats to signal update to UI
        emit TwatReceived(msg.sender, block.timestamp, _message);
        
        //update twat counter (ID variable)
        totalTwats +=1;

        // given a 10% percent chance to win ether when posting a twat. 
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);

        if (seed <= 10){
            console.log("Winner winner chicken dinner: %s", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance, "No mo' moola :("
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Falied to pay reward..?");
        }

    }

    // increase number of cheers' of a twat
    function cheers(uint256 twatIndex) public {
        
        // prevent spam
        require(
            lastCheersedAt[msg.sender] + 5 minutes < block.timestamp,
            "Yo man please wait 5 min before you can cheers again."
        );

        lastCheersedAt[msg.sender] = block.timestamp;
        
        twats[twatIndex].N_cheers += 1;
        
        //give reward for cheersing
        uint256 award = 0.00001 ether;

        require(
            award <= address(this).balance,
            "no more moola left, sadge."
        );
        (bool success, ) = (msg.sender).call{value: award}("");
        require(success, "Failed to distribute award.");

    }

    function getAllTwats() public view returns (Twat[] memory){
        return twats;
    }

    function getTotalTwats() public view returns (uint256) {
        return totalTwats;
    }

}

