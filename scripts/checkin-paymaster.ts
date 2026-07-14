import "dotenv/config";
import { SmartAccount, AAWrapProvider, SendTransactionMode } from "@particle-network/aa";
import { ethers } from "ethers";

const { DEPLOYER_PRIVATE_KEY, CONTRACT_ADDRESS, PARTICLE_PROJECT_ID, PARTICLE_SERVER_KEY, PARTICLE_APP_ID } =
  process.env;

// ApyeeCheckIn ABI (checkIn 관련만)
const CHECKIN_ABI = [
  "function checkIn() external",
  "function hasCheckedInToday(address user) external view returns (bool)",
  "function userCheckInCount(address user) external view returns (uint256)",
  "function totalCheckIns() external view returns (uint256)",
];

// opBNB Mainnet
const CHAIN_ID = 204;
const RPC_URL = "https://opbnb-mainnet-rpc.bnbchain.org";

async function main() {
  // EOA signer 생성
  const ethersProvider = new ethers.JsonRpcProvider(RPC_URL);
  const ownerSigner = new ethers.Wallet(DEPLOYER_PRIVATE_KEY!, ethersProvider);
  console.log(`EOA 주소: ${ownerSigner.address}`);

  // EIP-1193 provider 래핑
  const eip1193Provider = {
    request: async (args: { method: string; params: any[] }) => {
      if (args.method === "eth_accounts" || args.method === "eth_requestAccounts") {
        return [ownerSigner.address];
      }
      if (args.method === "personal_sign") {
        return ownerSigner.signMessage(ethers.getBytes(args.params[0]));
      }
      if (args.method === "eth_sendTransaction") {
        const tx = await ownerSigner.sendTransaction(args.params[0]);
        return tx.hash;
      }
      return ethersProvider.send(args.method, args.params ?? []);
    },
  };

  // Smart Account 생성
  const smartAccount = new SmartAccount(eip1193Provider as any, {
    projectId: PARTICLE_PROJECT_ID!,
    clientKey: PARTICLE_SERVER_KEY!,
    appId: PARTICLE_APP_ID!,
    aaOptions: {
      accountContracts: {
        SIMPLE: [{ version: "2.0.0", chainIds: [CHAIN_ID] }],
      },
    },
  });

  // Gasless 모드로 provider 래핑
  const aaProvider = new AAWrapProvider(smartAccount, SendTransactionMode.Gasless);
  const wrappedProvider = new ethers.BrowserProvider(aaProvider as any, "any");
  const signer = await wrappedProvider.getSigner();

  const smartAccountAddress = await signer.getAddress();
  console.log(`Smart Account 주소: ${smartAccountAddress}`);

  // 컨트랙트 연결
  const checkIn = new ethers.Contract(CONTRACT_ADDRESS!, CHECKIN_ABI, signer);

  // 오늘 체크인 여부 확인 (view 함수는 직접 RPC로 조회)
  const readContract = new ethers.Contract(CONTRACT_ADDRESS!, CHECKIN_ABI, ethersProvider);
  const already = await readContract.hasCheckedInToday(smartAccountAddress);
  console.log(`오늘 체크인 여부: ${already}`);

  if (already) {
    console.log("이미 체크인 완료");
    return;
  }

  // Paymaster 대납 체크인 실행
  console.log("체크인 TX 전송 중 (Paymaster 대납)...");
  const tx = await checkIn.checkIn();
  console.log(`TX Hash: ${tx.hash}`);

  const receipt = await tx.wait();
  console.log(`체크인 완료! Block: ${receipt.blockNumber}`);

  const count = await readContract.userCheckInCount(smartAccountAddress);
  const total = await readContract.totalCheckIns();
  console.log(`누적 체크인: ${count} | 전체 체크인: ${total}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
