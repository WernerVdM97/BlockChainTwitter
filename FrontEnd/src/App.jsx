import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/BCtwatter.json';

// smart contract https://rinkeby.etherscan.io/address/0x17052f1EA97D67Bd8e45B128deea2757572316EDF

const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [allTwats, setAllTwats] = useState([])
  const contractAddress = "0x17052f1EA97D67Bd8e45B128deea2757572316ED";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        //console.log("We have the ethereum object", ethereum);
      }
      
      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
        getAllTwats();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const connectWallet = async() => {

    try{
      const{ ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"});

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error){
      console.log(error)
    }

  }

  const getAllTwats = async () => {
    try{

      const { ethereum } = window;
      // check meta mask logged in
      if(ethereum){
        //connect to smart contract
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const twatterContract = new ethers.Contract(contractAddress,contractABI, signer)

        //call smart contract function
        const twats = await twatterContract.getAllTwats();
        //console.log("retrieved twats:",twats);

        //pick out applicable variables
        let twatsCleaned = [];
        //loop through twats returned from smart contract
        twats.forEach(twat => {
          //push applicable content into new cleaned array as a struct
          twatsCleaned.push({
            indentifier: twat.twatID.toNumber(),
            address: twat.twatee,
            timestamp: new Date(twat.timestamp * 1000),
            message: twat.message,
            n_cheers: twat.N_cheers.toNumber()
          });
        });

        //console.log("Cleaned twats",twatsCleaned);
        //update global varaible
        setAllTwats(twatsCleaned);

      }else{
        console.log("Ethereum object doens't exist!");
      }

    }catch (error){
      console.log(error);
    }
  }

  const twatMe = async () => {
    try{
      const { ethereum } = window;
      // check meta mask logged in
      if (ethereum) {
        // connect to smart contract
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const twatterContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await twatterContract.getTotalTwats();
        console.log("Retreived total twat count...", count.toNumber());

        let msg = document.getElementById("twat_msg").value;

        const twatTxn = await twatterContract.twat(msg);
        console.log("Mining...", twatTxn.hash);

        await twatTxn.wait()
        console.log("Mined:", twatTxn.hash);

        count = await twatterContract.getTotalTwats();
        console.log("Retreived total poke count...", count.toNumber())

      }else {
        console.log("Ethereum object doesn't exist!")
      }

    }catch(error){
      console.log(error)
    }

  }

  const cheers = async (twat_num) => {
    try {

      const { ethereum } = window;
      if(ethereum){

        // connect to smart contract
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const twatterContract = new ethers.Contract(contractAddress, contractABI, signer);    

        console.log("Adding a cheers for twat", twat_num);
        const cheersTxn = await twatterContract.cheers(twat_num);
        console.log("Mining...", cheersTxn.hash);
        await cheersTxn.wait();
        console.log("Mined:",cheersTxn.hash);
        getAllTwats();

      }else{
        console.log("Eth object missing!");
      }

    }catch (error){
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
   
    <div className="mainContainer">
      <div className="dataContainer">

          <header className="w3-container w3-center w3-padding-32"> 
          <h1><b>Twat City!</b></h1>
          <p>Welcome to the twatter page of <span className="w3-tag">Spanner</span></p>
          </header>

          <div className="bio">
            Join in on the fun by twatting @ me bro! Every twat gives you a chance at bagging some free Eth! Also, show you support by giving your favourite twat a cheers. Every time you cheers a twat you receive a sweet reward ;)
          </div>
          <br></br>
      
          <br></br>
          <label for="Message">Message:</label>
          <input type = "text" name="twat_msg" id="twat_msg"></input>
          <br></br>
          <button className="twatButton" onClick={twatMe}>Twat at me bro</button>
          <br></br>

          {!currentAccount && (
            <button className="twatButton" onClick={connectWallet}>
            Connect your Wallet
            </button>
          )}

          {allTwats.map((twat, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Twat number: {twat.indentifier}</div>
              <div>Address: {twat.address}</div>
              <div>Time: {twat.timestamp.toString()}</div>
              <div>Message: {twat.message}</div>
              <div>Cheers': {twat.n_cheers}</div>
              <div><button onClick={cheers.bind(this,twat.indentifier)}>cheers!</button></div>
            </div>)
        })}

      </div>
          
    </div>
    );
  }

export default App