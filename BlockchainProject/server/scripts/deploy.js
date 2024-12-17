const main = async() => {
    const contractFactory = await ethers.getContractFactory('SocialApp');
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    await contract.deployed();
  
    console.log("Contract deployed to: ", contract.address);
  }
  
  const runMain = async() => {
    try {
      await main();
      process.exit(0);
    } catch(error) {
      console.log(error);
      process.exit(1);
    }
  }
  
  runMain();