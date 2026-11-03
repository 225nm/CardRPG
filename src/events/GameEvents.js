// Event types the models notify their observers about. Kept in one place so
// the models and the views never depend on matching string literals.
export const GameEvent = Object.freeze({
  ARMOUR_ABSORBED: "armourAbsorbed",
  PLAYER_DAMAGED: "playerDamaged",
  PLAYER_HEALED: "playerHealed",
  ARMOUR_GAINED: "armourGained",
  CARD_PLAYED: "cardPlayed",
  INVALID_CARD_INDEX: "invalidCardIndex",
  ENEMY_DAMAGED: "enemyDamaged",
  ENEMY_ATTACKED: "enemyAttacked",
  ENEMY_USED_SPECIAL: "enemyUsedSpecial",
  CARD_RESOLVING: "cardResolving",
  PHYSICAL_ATTACK_ROLLED: "physicalAttackRolled",
  DRAW_SPECIAL_TRIGGERED: "drawSpecialTriggered",
  EMPTY_DECK_RESHUFFLED: "emptyDeckReshuffled",
  TURN_CARD_DRAWN: "turnCardDrawn",
  HAND_FULL: "handFull",
  ENEMY_DEFEATED: "enemyDefeated",
  REWARD_ADDED: "rewardAdded",
});
