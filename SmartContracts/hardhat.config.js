require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks:{
    rinkeby:{
      url: 'https://eth-rinkeby.alchemyapi.io/v2/qw6g5TIyvapNXP15C0qn6Dpn11gIMOek',
      accounts:['b95d73546c1d132fff4627ca82fd4fdbd6c9164590c12d70450c5b19a66e4771'],
    }
  }
};
