// deployed to 0x4C209Dd5303E58Ad3cb11607097EeD46d17eE202 on rinkeyby

const main = async () => {

    // init twat contract and deploy

    const twatContractFactory = await hre.ethers.getContractFactory('BCtwatter');
    const twatContract = await twatContractFactory.deploy(
        {value: hre.ethers.utils.parseEther('0.001'), }
    );
    await twatContract.deployed();

    console.log('Twat Contract Address;',twatContract.address);

    let contractBalance = await hre.ethers.provider.getBalance(twatContract.address);
    console.log('Contract Eth:', hre.ethers.utils.formatEther(contractBalance));

    let twatCount;
    twatCount = await twatContract.getTotalTwats();
    console.log("Number of twats:", twatCount.toNumber());


    // add twats
    const [_, randomPerson] = await hre.ethers.getSigners();
    //console.log(randomPerson)

    let twatTxn = await twatContract.connect(_).twat('The first twat is here!');
    await twatTxn.wait();

    let cheersTxn = await twatContract.connect(_).cheers(0);
    await cheersTxn.wait()

    contractBalance = await hre.ethers.provider.getBalance(twatContract.address);
    console.log('Contract Eth:', hre.ethers.utils.formatEther(contractBalance));

    //twatTxn = await twatContract.connect(_).twat('The second twat live!');
    //await twatTxn.wait()

    let allTwats = await twatContract.getAllTwats();
    console.log("all twats:", allTwats);

};

const runMain = async () => {
    try{
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();