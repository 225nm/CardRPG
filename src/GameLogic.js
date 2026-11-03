import { Observable } from "./Observable.js";
import { GameEvent } from "./GameEvents.js";

export class GameLogic extends Observable {
  #player;
  #enemy;
  #deck;
  #discard;
  #rng;
  #d6;

  constructor(player, enemy, deck, discard, rng, d6) {
    super();
    this.#player = player;
    this.#enemy = enemy;
    this.#deck = deck;
    this.#discard = discard;
    this.#rng = rng;
    this.#d6 = d6;
  }

  getPlayer() {
    return this.#player;
  }

  getEnemy() {
    return this.#enemy;
  }

  resolve(card) {
    const suit = card.getSuit();
    const rank = card.getRank();
    const rankWeight = card.getRankWeight();

    this.notify(GameEvent.CARD_RESOLVING, { card });

    switch (suit) {
      case "Spades": {
        const roll = this.#d6.roll(this.#rng);
        const totalPower = rankWeight + roll;
        this.notify(GameEvent.PHYSICAL_ATTACK_ROLLED, {
          basePower: rankWeight,
          roll,
          totalPower,
        });
        this.#enemy.takeDamage(totalPower);
        break;
      }

      case "Hearts": {
        this.#player.heal(rankWeight);
        break;
      }

      case "Diamonds": {
        this.#player.addArmour(rankWeight);
        break;
      }

      case "Clubs": {
        if (rankWeight === 2) {
          this.notify(GameEvent.DRAW_SPECIAL_TRIGGERED, { amount: 2 });
          if (
            this.#deck.remainingDeckSize() < 2 &&
            this.#discard.getPileSize() > 0
          ) {
            this.#deck.reshuffleDiscardPile(this.#discard);
          }
          const drawnCards = this.#deck.drawMultiple(2);
          this.#player.addCardToHand(drawnCards);
        }
        break;
      }
    }
  }

  endTurn() {
    if (this.#deck.isDeckEmpty() && this.#discard.getPileSize() > 0) {
      this.notify(GameEvent.EMPTY_DECK_RESHUFFLED);
      this.#deck.reshuffleDiscardPile(this.#discard);
    }

    if (!this.#deck.isDeckEmpty()) {
      const replacementCard = this.#deck.draw();
      this.#player.addCardToHand(replacementCard);
      this.notify(GameEvent.TURN_CARD_DRAWN, { card: replacementCard });
    }
  }
}
