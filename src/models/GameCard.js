import { Card } from "DeckLib";
import { CardNotImplementedError } from "../errors/CardNotImplementedError.js";

export const CardEffect = Object.freeze({
  ATTACK: "attack",
  HEAL: "heal",
  ARMOUR: "armour",
  DRAW_CARDS: "drawCards",
});

// GameCard is the only place that knows which card gives which effect.
const SPECIAL_SUIT = "Clubs";

const EFFECTS_BY_SUIT = Object.freeze({
  Spades: CardEffect.ATTACK,
  Hearts: CardEffect.HEAL,
  Diamonds: CardEffect.ARMOUR,
});

// Clubs are special cards whose effect depends on the rank. Add a rank
// here when its effect has been designed.
const SPECIAL_EFFECTS_BY_RANK = Object.freeze({
  2: CardEffect.DRAW_CARDS,
});

// A playing card with a game effect. Extends DeckLib's Card because Hand
// and Card.compareTo only accept Card instances. Create cards through the
// static methods, e.g. GameCard.heal("3"), rather than by suit.
export class GameCard extends Card {
  #effect;

  constructor(suit, rank) {
    super(suit, rank);
    this.#effect = GameCard.#effectOf(suit, rank);
  }

  static #effectOf(suit, rank) {
    if (suit === SPECIAL_SUIT) {
      return GameCard.#specialEffectOf(suit, rank);
    }
    return EFFECTS_BY_SUIT[suit];
  }

  static #specialEffectOf(suit, rank) {
    const effect = SPECIAL_EFFECTS_BY_RANK[rank];
    if (!effect) {
      throw new CardNotImplementedError(suit, rank);
    }
    return effect;
  }

  static attack(rank) {
    return new GameCard("Spades", rank);
  }

  static heal(rank) {
    return new GameCard("Hearts", rank);
  }

  static armour(rank) {
    return new GameCard("Diamonds", rank);
  }

  static drawTwo() {
    return new GameCard(SPECIAL_SUIT, "2");
  }

  getEffect() {
    return this.#effect;
  }

  // Damage, healing, armour or number of cards drawn, depending on the effect.
  getPower() {
    return this.getRankWeight();
  }
}
