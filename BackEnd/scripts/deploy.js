// deploy smart contract to local host
// deployed to 0x400c5483Bed216b82f29752f5b00728Bbc7fACfD

const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
  
    console.log('Deploying contracts with account: ', deployer.address);
    console.log('Account balance: ', accountBalance.toString());

    const Token = await hre.ethers.getContractFactory('WavePortal');
    const portal = await Token.deploy();
    await portal.deployed();
  
    console.log('WavePortal smart contract address: ', portal.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  runMain();