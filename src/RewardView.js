import { getSingleKey } from "./InputLogic.js";

export class RewardView {
  // AI assisted choice reward function.
  async chooseReward(rewards) {
    console.log("\n🎁 Choose one reward to add to your deck:");

    rewards.forEach((card, index) => {
      console.log(`${index + 1}. ${card.toString()}`);
    });

    while (true) {
      const input = await getSingleKey("\nChoose 1, 2, or 3: ");
      const choice = Number.parseInt(input.trim(), 10);

      if (Number.isInteger(choice) && choice >= 1 && choice <= rewards.length) {
        const selectedCard = rewards[choice - 1];

        console.log(`\nYou chose: ${selectedCard.toString()}`);
        return selectedCard;
      }

      console.log("Invalid choice. Please enter 1, 2, or 3.");
    }
  }
}
