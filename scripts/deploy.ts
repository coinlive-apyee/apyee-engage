import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying to ${network.name} with account: ${deployer.address}`);

  const ApyeeCheckIn = await ethers.getContractFactory("ApyeeCheckIn");
  const checkIn = await ApyeeCheckIn.deploy();
  await checkIn.waitForDeployment();

  const address = await checkIn.getAddress();
  console.log(`ApyeeCheckIn deployed to: ${address}`);
  console.log(`Verify: npx hardhat verify --network ${network.name} ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
