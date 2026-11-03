import { Observable } from "../events/Observable.js";
import { GameEvent } from "../events/GameEvents.js";
import { HandFullError } from "../errors/HandFullError.js";
import { CardEffect } from "./GameCard.js";

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
  #random;

  constructor(player, enemy, deck, discard, random) {
    super();
    this.#player = player;
    this.#enemy = enemy;
    this.#deck = deck;
    this.#discard = discard;
    this.#random = random;
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
      this.#enemy.takeTurn(this.#player, this.#random);
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
    const power = card.getPower();
    this.notify(GameEvent.CARD_RESOLVING, { card });

    switch (card.getEffect()) {
      case CardEffect.ATTACK:
        this.#attackEnemy(power);
        break;
      case CardEffect.HEAL:
        this.#player.heal(power);
        break;
      case CardEffect.ARMOUR:
        this.#player.addArmour(power);
        break;
      case CardEffect.DRAW_CARDS:
        this.#drawBonusCards(power);
        break;
      default:
        throw new TypeError(`Unknown card effect: ${card.getEffect()}`);
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

  #attackEnemy(basePower) {
    const roll = this.#random.rollD6();
    const totalPower = basePower + roll;
    this.notify(GameEvent.PHYSICAL_ATTACK_ROLLED, {
      basePower,
      roll,
      totalPower,
    });
    this.#enemy.takeDamage(totalPower);
  }

  #drawBonusCards(count) {
    this.notify(GameEvent.DRAW_SPECIAL_TRIGGERED, { amount: count });
    if (
      this.#deck.remainingDeckSize() < count &&
      this.#discard.getPileSize() > 0
    ) {
      this.#deck.reshuffleDiscardPile(this.#discard);
    }
    this.#drawSpecialCards(count);
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
