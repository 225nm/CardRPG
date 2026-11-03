import { Observable } from "../events/Observable.js";
import { GameEvent } from "../events/GameEvents.js";
import { HandFullError } from "./HandFullError.js";

export const TurnOutcome = Object.freeze({
  CONTINUE: "continue",
  ENEMY_DEFEATED: "enemyDefeated",
  PLAYER_DEFEATED: "playerDefeated",
});

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

  // An enemy defeated by the player's card does not get to act, but an
  // enemy can also defeat itself during its own turn (Goblin's special).
  playTurn(card) {
    this.resolve(card);

    if (this.#enemy.isAlive()) {
      this.#enemy.takeTurn(this.#player, this.#rng);
    }
    if (!this.#player.isAlive()) {
      return TurnOutcome.PLAYER_DEFEATED;
    }
    if (!this.#enemy.isAlive()) {
      return TurnOutcome.ENEMY_DEFEATED;
    }

    this.endTurn();
    return TurnOutcome.CONTINUE;
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
          this.#drawSpecialCards(2);
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
      try {
        const replacementCard = this.#player.drawCardFrom(this.#deck);
        this.notify(GameEvent.TURN_CARD_DRAWN, { card: replacementCard });
      } catch (error) {
        this.#reportHandFull(error);
      }
    }
  }

  // Draws one card at a time, so a full hand stops the draw at the card
  // that would not fit.
  #drawSpecialCards(count) {
    try {
      for (let i = 0; i < count && !this.#deck.isDeckEmpty(); i++) {
        this.#player.drawCardFrom(this.#deck);
      }
    } catch (error) {
      this.#reportHandFull(error);
    }
  }

  #reportHandFull(error) {
    if (!(error instanceof HandFullError)) {
      throw error;
    }
    this.notify(GameEvent.HAND_FULL, { maxHandSize: error.getMaxHandSize() });
  }
}
