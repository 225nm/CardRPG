import { getSingleKey } from "./InputLogic.js";
import { describeCardWithEffect } from "./cardDescriptions.js";

export class RewardView {
  // AI assisted choice reward function.
  async chooseReward(rewards) {
    this.#showRewards(rewards);

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

  #showRewards(rewards) {
    console.log("\n🎁 Choose one reward to add to your deck:");
    rewards.forEach((card, index) => {
      console.log(describeCardWithEffect(card, index + 1));
    });
  }
}
