import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/BCtwatter.json';

// smart contract https://rinkeby.etherscan.io/address/0x4C209Dd5303E58Ad3cb11607097EeD46d17eE202

const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [allTwats, setAllTwats] = useState([])
  const contractAddress = "0x4C209Dd5303E58Ad3cb11607097EeD46d17eE202";
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
            identifier: twat.twatID.toNumber(),
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

        if(msg !== "")
        {
          const twatTxn = await twatterContract.twat(msg, {gasLimit: 300000});
          console.log("Mining...", twatTxn.hash);

          await twatTxn.wait()
          console.log("Mined:", twatTxn.hash);
        }else{
          alert("Please enter a message!");
        }



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
        const cheersTxn = await twatterContract.cheers(twat_num, {gasLimit:300000});
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

    //event listener for new twats to refresh UI
    let twatterContract;

    // code for updating existing array with only new Twat. Doesnt work though.
    const onNewTwat = (index, from, timestamp, message, n_cheers) => {
      console.log('New twat detected', index, from, timestamp, message, n_cheers);
      setAllTwats(prevState => [
        ...prevState,
        {
          identifier: index,
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
          n_cheers: n_cheers,
        },
      ]);
    };

    //Instead fetch all twats incase a new twat is made
    if (window.ethereum){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      twatterContract = new ethers.Contract(contractAddress, contractABI, signer);
      twatterContract.on('TwatReceived', getAllTwats);
    }

    return () => {
      if(twatterContract){
        twatterContract.off('TwatReceived', getAllTwats);
      }
    };

  }, [])
  
  return (

    <div className="w3-row-padding w3-content">

      <div className="w3-light-grey w3-padding-64 w3-margin-bottom w3-center">
        <header> 
          <h1><b>Welcom to Twatter!</b></h1>
          <p>
            This is the twatter page of Werner,
            <br></br>
            be sure to connect to the Rinkeby network in order to load twats!
          </p>
        </header>
      </div>


      <div className="w3-twothird">
        <div className="w3-container w3-light-grey">
        <br></br>
        <div className="w3-justify">
          Join in on the fun by twatting @ me! Every twat gives you a chance at bagging some free Eth! Also, show you support by giving your favourite twat a cheers. Every time you cheers a twat you receive a sweet reward.
          Fair warning though, there is a spam filter so please refrain from twatting more often than every minute...
        </div>
        <br></br>

        {!currentAccount && (
          <button className="connectWalletButton" onClick={connectWallet}>
          Connect your Wallet
          </button>
        )}
        </div>
        <br></br>
        <div className="w3-container w3-light-grey">        
          {allTwats.map((twat, index) => {
          return (
            <div key={index} className="twatCard">
              <div>Twat number: {twat.identifier}</div>
              <div>Address: {twat.address}</div>
              <div>Time: {twat.timestamp.toString()}</div>
              <div>New Twat: {twat.message}</div>
              <div>Cheers': {twat.n_cheers}</div>
              <div><button className="cheersButton" onClick={cheers.bind(this,twat.identifier)}><i className="Cheers">cheers!</i></button></div>
            </div>)
          })}
        </div>
      </div>

      {currentAccount && (
      <div className="w3-third">
        <div className="w3-container w3-light-grey">
          <h3>Message:</h3>
          <textarea name="twat_msg" id="twat_msg" maxLength="116"></textarea>
          <button className="twatButton" onClick={twatMe}>Twat at me</button>
        </div>
      </div>
      )}

      

    </div>
    );
  }

export default App