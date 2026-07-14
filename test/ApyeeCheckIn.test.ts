import { expect } from "chai";
import { ethers } from "hardhat";
import { ApyeeCheckIn } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("ApyeeCheckIn", function () {
  let checkIn: ApyeeCheckIn;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("ApyeeCheckIn");
    checkIn = (await factory.deploy()) as unknown as ApyeeCheckIn;
  });

  describe("checkIn", function () {
    it("should allow a user to check in", async function () {
      await expect(checkIn.connect(user1).checkIn())
        .to.emit(checkIn, "CheckedIn")
        .withArgs(user1.address, await getCurrentDay());

      expect(await checkIn.hasCheckedInToday(user1.address)).to.be.true;
      expect(await checkIn.userCheckInCount(user1.address)).to.equal(1);
      expect(await checkIn.totalCheckIns()).to.equal(1);
    });

    it("should reject duplicate check-in on the same day", async function () {
      await checkIn.connect(user1).checkIn();
      await expect(checkIn.connect(user1).checkIn()).to.be.revertedWith("Already checked in today");
    });

    it("should allow check-in on the next day", async function () {
      await checkIn.connect(user1).checkIn();

      // Advance 1 day
      await time.increase(86400);

      await expect(checkIn.connect(user1).checkIn()).to.not.be.reverted;
      expect(await checkIn.userCheckInCount(user1.address)).to.equal(2);
      expect(await checkIn.totalCheckIns()).to.equal(2);
    });

    it("should allow multiple users to check in on the same day", async function () {
      await checkIn.connect(user1).checkIn();
      await checkIn.connect(user2).checkIn();

      expect(await checkIn.totalCheckIns()).to.equal(2);
      expect(await checkIn.hasCheckedInToday(user1.address)).to.be.true;
      expect(await checkIn.hasCheckedInToday(user2.address)).to.be.true;
    });
  });

  describe("view functions", function () {
    it("should return false for users who have not checked in", async function () {
      expect(await checkIn.hasCheckedInToday(user1.address)).to.be.false;
    });

    it("should query historical check-in by day", async function () {
      const day = await getCurrentDay();
      await checkIn.connect(user1).checkIn();

      expect(await checkIn.hasCheckedIn(user1.address, day)).to.be.true;
      expect(await checkIn.hasCheckedIn(user1.address, day + 1n)).to.be.false;
    });
  });

  async function getCurrentDay(): Promise<bigint> {
    const latest = await time.latest();
    return BigInt(latest) / 86400n;
  }
});
