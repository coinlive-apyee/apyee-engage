import { ethers } from "hardhat";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";

async function main() {
  const [signer] = await ethers.getSigners();
  const checkIn = await ethers.getContractAt("ApyeeCheckIn", CONTRACT_ADDRESS, signer);

  // 오늘 체크인 여부 확인
  const already = await checkIn.hasCheckedInToday(signer.address);
  console.log(`${signer.address} - 오늘 체크인 여부: ${already}`);
  if (already) {
    return;
  }

  // 체크인 실행
  const tx = await checkIn.checkIn();
  await tx.wait();

  const count = await checkIn.userCheckInCount(signer.address);
  const total = await checkIn.totalCheckIns();
  console.log(`체크인 완료! TX: ${tx.hash}`);
  console.log(`누적 체크인: ${count} | 전체 체크인: ${total}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
