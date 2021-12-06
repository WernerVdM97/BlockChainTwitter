import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

// smart contract 0x400c5483Bed216b82f29752f5b00728Bbc7fACfD

const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x400c5483Bed216b82f29752f5b00728Bbc7fACfD";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      
      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
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

const poke = async () => {
  try{
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      let count = await wavePortalContract.getTotalPokes();
      console.log("Retreived total poke count...", count.toNumber());

      const waveTxn = await wavePortalContract.poke();
      console.log("Mining...", waveTxn.hash);

      await waveTxn.wait()
      console.log("Mined:", waveTxn.hash);

      count = await wavePortalContract.getTotalPokes();
      console.log("Retreived total poke count...", count.toNumber())

    }else {
      console.log("Ethereum object doesn't exist!")
    }

  }catch(error){
    console.log(error)
  }

}

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          Poke City!
        </div>
    
        <div className="bio">
          Pressing this button will result in absolutly nothing useful at all! But it's still cool, so press it...
        </div>
    
        <button className="waveButton" onClick={poke}>
          Poke
        </button>

        {//render if no curren Account
        }
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
          Connect your Wallet
          </button>
        )}
      </div>
    </div>
    );
  }

export default App