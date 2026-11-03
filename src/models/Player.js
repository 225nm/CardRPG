import { Hand } from "DeckLib";
import { Observable } from "../events/Observable.js";
import { GameEvent } from "../events/GameEvents.js";
import { HandFullError } from "../errors/HandFullError.js";
import {
  assertNonEmptyString,
  assertPositiveInteger,
  assertNonNegativeInteger,
} from "./validators.js";

const MAX_HAND_SIZE = 9;

// Player class, hp is an abbreviation for health points.
export class Player extends Observable {
  #name;
  #maxHp;
  #hp;
  #armour;
  #hand;

  constructor(name = "Player1", maxHp = 30, armour = 0) {
    super();
    this.#validateStats(name, maxHp, armour);
    this.#name = name;
    this.#maxHp = maxHp;
    this.#hp = maxHp;
    this.#armour = armour;
    this.#hand = new Hand();
  }

  #validateStats(name, maxHp, armour) {
    assertNonEmptyString(name, "name");
    assertPositiveInteger(maxHp, "maxHp");
    assertNonNegativeInteger(armour, "armour");
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

  // A copy, so callers can read the hand but not change it.
  getCards() {
    return this.#hand.getCards();
  }

  takeDamage(amount) {
    let unblockedDamage = amount;

    if (this.#armour > 0) {
      const absorbed = Math.min(this.#armour, unblockedDamage);
      this.#armour -= absorbed;
      unblockedDamage -= absorbed;
      this.notify(GameEvent.ARMOUR_ABSORBED, { player: this, absorbed });
    }
    if (unblockedDamage > 0) {
      this.#hp = Math.max(0, this.#hp - unblockedDamage);
      this.notify(GameEvent.PLAYER_DAMAGED, {
        player: this,
        amount: unblockedDamage,
      });
    }
  }

  heal(amount) {
    this.#hp = Math.min(this.#maxHp, this.#hp + amount);
    this.notify(GameEvent.PLAYER_HEALED, { player: this, amount });
  }

  addArmour(amount) {
    this.#armour += amount;
    this.notify(GameEvent.ARMOUR_GAINED, { player: this, amount });
  }

  addCardToHand(cards) {
    const newCards = Array.isArray(cards) ? cards : [cards];
    this.#ensureRoomInHand(newCards.length);
    newCards.forEach((card) => this.#hand.addCard(card));
  }

  // Checks the hand size before drawing, so a card that would not fit
  // is never taken from the deck.
  drawCardFrom(deck) {
    this.#ensureRoomInHand(1);
    const card = deck.draw();
    this.#hand.addCard(card);
    return card;
  }

  #ensureRoomInHand(cardCount) {
    if (this.#hand.getHandSize() + cardCount > MAX_HAND_SIZE) {
      throw new HandFullError(MAX_HAND_SIZE);
    }
  }

  playCardByIndex(index, discardPile) {
    this.#assertCardIndexInHand(index);
    const cardToPlay = this.#hand.getCards()[index];
    this.#hand.playCard(cardToPlay, discardPile);
    this.notify(GameEvent.CARD_PLAYED, { card: cardToPlay });
    return cardToPlay;
  }

  // HandView validates the player's input; reaching this throw means a
  // caller passed an index without validating it first.
  #assertCardIndexInHand(index) {
    const handSize = this.#hand.getHandSize();
    if (!Number.isInteger(index) || index < 0 || index >= handSize) {
      throw new RangeError(
        `Card index must be between 0 and ${handSize - 1}, got ${index}`,
      );
    }
  }

  discardHand(discardPile) {
    for (const card of this.#hand.getCards()) {
      this.#hand.playCard(card, discardPile);
    }
  }

  sortHand() {
    this.#hand.sortByValue();
  }
}
