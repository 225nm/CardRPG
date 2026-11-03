import { Hand } from "DeckLib";
import { Observable } from "../events/Observable.js";
import { GameEvent } from "../events/GameEvents.js";
import { HandFullError } from "./HandFullError.js";

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
    const cards = this.#hand.getCards();
    // TODO fix redundant validation
    if (index < 0 || index >= cards.length) {
      this.notify(GameEvent.INVALID_CARD_INDEX);
      return null;
    }
    const cardToPlay = cards[index];
    this.#hand.playCard(cardToPlay, discardPile);
    this.notify(GameEvent.CARD_PLAYED, { card: cardToPlay });
    return cardToPlay;
  }

  sortHand() {
    this.#hand.sortByValue();
  }
}
