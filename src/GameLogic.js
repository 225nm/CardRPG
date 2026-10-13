export class GameLogic {
  constructor(player, enemy, deck, discard, rng, d6) {
    this.player = player;
    this.enemy = enemy;
    this.deck = deck;
    this.discard = discard;
    this.rng = rng;
    this.d6 = d6;
  }

  resolve(card) {
    const suit = card.getSuit();
    const rank = card.getRank();
    const rankWeight = card.getRankWeight();

    console.log(`\n✨ Resolving ${card.toString()} (${suit})`);

    switch (suit) {
      case "Spades": {
        const roll = this.d6.roll(this.rng);
        const totalPower = rankWeight + roll;
        console.log(
          `⚔️ Physical Attack! Base ${rankWeight} + d6 Roll ${roll} = ${totalPower} damage!`,
        );
        this.enemy.takeDamage(totalPower);
        break;
      }

      case "Hearts": {
        this.player.heal(rankWeight);
        break;
      }

      case "Diamonds": {
        this.player.addArmour(rankWeight);
        break;
      }

      case "Clubs": {
        if (rankWeight === 2) {
          console.log(`🔮 Special: Draw 2 cards!`);
          if (
            this.deck.remainingDeckSize() < 2 &&
            this.discard.getPileSize() > 0
          ) {
            this.deck.reshuffleDiscardPile(this.discard);
          }
          const drawnCards = this.deck.drawMultiple(2);
          this.player.addCardToHand(drawnCards);
        }
        break;
      }
    }
  }

  endTurn() {
    if (this.deck.isDeckEmpty() && this.discard.getPileSize() > 0) {
      console.log("♻️ Deck is empty! Reshuffling discard pile...");
      this.deck.reshuffleDiscardPile(this.discard);
    }

    if (!this.deck.isDeckEmpty()) {
      const replacementCard = this.deck.draw();
      this.player.addCardToHand(replacementCard);
      console.log(
        `\n 📥 Drew a new card for turn: ${replacementCard.toString()}`,
      );
    }
  }
}
