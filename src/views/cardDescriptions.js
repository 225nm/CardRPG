import { CardEffect } from "../models/GameCard.js";

// Player-facing text for card effects, shared by every view that lists cards.
export function describeCardEffect(card) {
  const power = card.getPower();

  switch (card.getEffect()) {
    case CardEffect.ATTACK:
      return `[Physical Attack: Base ${power} + d6 roll]`;
    case CardEffect.HEAL:
      return `[Healing: Restores ${power} HP]`;
    case CardEffect.ARMOUR:
      return `[Defense: Grants ${power} Armour]`;
    case CardEffect.DRAW_CARDS:
      return `[Special: Draw ${power} cards]`;
    default:
      return `[Unknown Effect]`;
  }
}

export function describeCardWithEffect(card, number) {
  return `  [${number}] ${card.toString().padEnd(18)} -> ${describeCardEffect(card)}`;
}
