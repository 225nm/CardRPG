export class HandView {
  #player;

  constructor(player) {
    this.#player = player;
  }

  render() {
    console.log(`\n--- ${this.#player.getName()}'s Hand ---`);
    const cards = this.#player.getHand().getCards();
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
        return rankWeight === 2 ? `[Special: Draw 2 cards]` : `[Special Utility]`;
      default:
        return `[Unknown Effect]`;
    }
  }
}
