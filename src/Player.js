import { Hand } from "DeckLib";

// Player class, hp is an abbreviation for health points.
export class Player {
  #name;
  #maxHp;
  #hp;
  #armour;
  #hand;

  constructor(name = "Player1", maxHp = 30, armour = 0) {
    this.#name = name;
    this.#maxHp = maxHp;
    this.#hp = maxHp;
    this.#armour = armour;
    this.#hand = new Hand();
  }

  getName() {
    return this.#name;
  }

  getMaxHp() {
    return this.#maxHp;
  }

  getHp() {
    return this.#hp;
  }

  isAlive() {
    return this.#hp > 0;
  }

  getArmour() {
    return this.#armour;
  }

  getHand() {
    return this.#hand;
  }

  takeDamage(amount) {
    let unblockedDamage = amount;

    if (this.#armour > 0) {
      const absorbed = Math.min(this.#armour, unblockedDamage);
      this.#armour -= absorbed;
      unblockedDamage -= absorbed;
      console.log(
        `🛡️ Armour absorbed ${absorbed} damage! (Armour left: ${this.#armour})`,
      );
    }
    if (unblockedDamage > 0) {
      this.#hp = Math.max(0, this.#hp - unblockedDamage);
      console.log(
        `💥 ${this.#name} takes ${amount} damage! (HP: ${this.#hp}/${this.#maxHp})`,
      );
    }
  }

  heal(amount) {
    this.#hp = Math.min(this.#maxHp, this.#hp + amount);
    console.log(
      `💚 ${this.#name} heals for ${amount} HP! (HP: ${this.#hp}/${this.#maxHp})`,
    );
  }

  addArmour(amount) {
    this.#armour += amount;
    console.log(
      `🛡️ ${this.#name} gains ${amount} armour! (Total Armour: ${this.#armour})`,
    );
  }

  addCardToHand(cards) {
    if (Array.isArray(cards)) {
      cards.forEach((card) => this.#hand.addCard(card));
    } else {
      this.#hand.addCard(cards);
    }
  }

  playCardByIndex(index, discardPile) {
    const cards = this.#hand.getCards();
    if (index < 0 || index >= cards.length) {
      console.log("❌ Invalid card index!");
      return null;
    }
    const cardToPlay = cards[index];
    this.#hand.playCard(cardToPlay, discardPile);
    console.log(`⚔️ Played ${cardToPlay.toString()} from hand.`);
    return cardToPlay;
  }

  sortHand() {
    this.#hand.sortByValue();
  }

  renderHand() {
    console.log(`\n--- ${this.#name}'s Hand ---`);
    const cards = this.#hand.getCards();
    if (cards.length === 0) {
      console.log("  (Hand is empty)");
      return;
    }

    cards.forEach((card, index) => {
      const suit = card.getSuit();
      const rankWeight = card.getRankWeight();
      let description = "";

      // Assign descriptions based on card suit and effect rules
      switch (suit) {
        case "Spades":
          description = `[Physical Attack: Base ${rankWeight} + d6 roll]`;
          break;
        case "Hearts":
          description = `[Healing: Restores ${rankWeight} HP]`;
          break;
        case "Diamonds":
          description = `[Defense: Grants ${rankWeight} Armour]`;
          break;
        case "Clubs":
          if (rankWeight === 2) {
            description = `[Special: Draw 2 cards]`;
          } else {
            description = `[Special Utility]`;
          }
          break;
        default:
          description = `[Unknown Effect]`;
      }

      console.log(
        `  [${index + 1}] ${card.toString().padEnd(18)} -> ${description}`,
      );
    });
  }
}
