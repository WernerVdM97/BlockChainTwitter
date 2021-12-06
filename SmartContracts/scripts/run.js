// javascript scipt to deploy smart contract to local HRE

const main = async() => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();

    console.log("Contract deployed to:", waveContract.address);
    console.log("Owner of contract:", owner.address)

    let pokeCount;
    pokeCount = await waveContract.getTotalPokes();

    let transx = await waveContract.poke();
    await transx.wait();

    pokeCount - await waveContract.getTotalPokes();
};

const runMain = async() => {

    try{
        await main();
        process.exit(0);
    }catch (error) {
        console.log(error);
        process.exit(1);
    }

};

runMain();