import { getSingleKey } from "./InputLogic.js";

export class HandView {
  #player;

  constructor(player) {
    this.#player = player;
  }

  render() {
    console.log(`\n--- ${this.#player.getName()}'s Hand ---`);
    const cards = this.#getCards();
    if (cards.length === 0) {
      console.log("  (Hand is empty)");
      return;
    }

    cards.forEach((card, index) => {
      console.log(
        `  [${index + 1}] ${card.toString().padEnd(18)} -> ${this.#describeEffect(card)}`,
      );
    });
  }

  // Asks until the player picks a card in their hand, and returns its index.
  async readCardChoice() {
    while (true) {
      const key = await getSingleKey(
        "\n Enter the number of the card to play: ",
      );
      // Base 10, -1 to properly represent index
      const cardIndex = parseInt(key.trim(), 10) - 1;

      if (this.#isCardInHand(cardIndex)) {
        return cardIndex;
      }
      console.log(
        "\n❌ Invalid choice! Please enter a valid card number corresponding to your hand.",
      );
    }
  }

  #isCardInHand(cardIndex) {
    const handSize = this.#getCards().length;
    return (
      Number.isInteger(cardIndex) && cardIndex >= 0 && cardIndex < handSize
    );
  }

  #getCards() {
    return this.#player.getHand().getCards();
  }

  #describeEffect(card) {
    const rankWeight = card.getRankWeight();

    switch (card.getSuit()) {
      case "Spades":
        return `[Physical Attack: Base ${rankWeight} + d6 roll]`;
      case "Hearts":
        return `[Healing: Restores ${rankWeight} HP]`;
      case "Diamonds":
        return `[Defense: Grants ${rankWeight} Armour]`;
      case "Clubs":
        return rankWeight === 2
          ? `[Special: Draw 2 cards]`
          : `[Special Utility]`;
      default:
        return `[Unknown Effect]`;
    }
  }
}
