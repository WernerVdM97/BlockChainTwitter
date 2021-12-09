// deployed to 0xB482994f7a1955F5D7c4913d1b40921393ffe70F on rinkeyby

const main = async () => {

    // init twat contract and deploy

    const twatContractFactory = await hre.ethers.getContractFactory('BCtwatter');
    const twatContract = await twatContractFactory.deploy();
    await twatContract.deployed();

    console.log('Twat Contract Address;',twatContract.address);

    let twatCount;
    twatCount = await twatContract.getTotalTwats();
    console.log("Number of twats:", twatCount.toNumber());


    // add twats
    const [_, randomPerson] = await hre.ethers.getSigners();
    //console.log(randomPerson)

    let twatTxn = await twatContract.connect(_).twat('The first twat is here!');
    await twatTxn.wait();

    twatTxn = await twatContract.connect(_).twat('The second twat live!');
    await twatTxn.wait()

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