import { GameEvent } from "../events/GameEvents.js";
import { Goblin } from "../models/Enemies/Goblin.js";
import { Knight } from "../models/Enemies/Knight.js";

const ATTACK_LINES = new Map([
  [
    Goblin,
    (goblin, target) =>
      `\n👹 ${goblin.getName()} swings a rusty blade at ${target.getName()}!`,
  ],
  [
    Knight,
    (knight, target) =>
      `\n🤺 ${knight.getName()} swings his blade at ${target.getName()}!`,
  ],
]);

const SPECIAL_LINES = new Map([
  [
    Goblin,
    (goblin, damage) =>
      `\n⚡ ${goblin.getName()} ${goblin.getSpecialName()} and takes ${damage} damage`,
  ],
  [
    Knight,
    (knight, damage) =>
      `\n⚡ ${knight.getName()} used ${knight.getSpecialName()} and dealt ${damage} damage`,
  ],
]);

function describeAttack(enemy, target) {
  const describe =
    ATTACK_LINES.get(enemy.constructor) ??
    (() => `\n${enemy.getName()} attacks ${target.getName()}!`);
  return describe(enemy, target);
}

function describeSpecial(enemy, damage) {
  const describe =
    SPECIAL_LINES.get(enemy.constructor) ??
    (() => `\n⚡ ${enemy.getName()} used ${enemy.getSpecialName()}`);
  return describe(enemy, damage);
}

const EVENT_MESSAGES = {
  [GameEvent.ARMOUR_ABSORBED]: ({ player, absorbed }) =>
    `🛡️  Armour absorbed ${absorbed} damage! (Armour left: ${player.getArmour()})`,
  [GameEvent.PLAYER_DAMAGED]: ({ player, amount }) =>
    `💥 ${player.getName()} takes ${amount} damage! (HP: ${player.getHp()}/${player.getMaxHp()})`,
  [GameEvent.PLAYER_HEALED]: ({ player, amount }) =>
    `💚 ${player.getName()} heals for ${amount} HP! (HP: ${player.getHp()}/${player.getMaxHp()})`,
  [GameEvent.ARMOUR_GAINED]: ({ player, amount }) =>
    `🛡️  ${player.getName()} gains ${amount} armour! (Total Armour: ${player.getArmour()})`,
  [GameEvent.CARD_PLAYED]: ({ card }) =>
    `⚔️  Played ${card.toString()} from hand.`,
  [GameEvent.ENEMY_DAMAGED]: ({ enemy, amount }) =>
    `🗡️ ${enemy.getName()} takes ${amount} damage! (HP: ${enemy.getHp()}/${enemy.getMaxHp()})`,
  [GameEvent.ENEMY_ATTACKED]: ({ enemy, target }) =>
    describeAttack(enemy, target),
  [GameEvent.ENEMY_USED_SPECIAL]: ({ enemy, damage }) =>
    describeSpecial(enemy, damage),
  [GameEvent.CARD_RESOLVING]: ({ card }) =>
    `\n✨ Resolving ${card.toString()} (${card.getSuit()})`,
  [GameEvent.PHYSICAL_ATTACK_ROLLED]: ({ basePower, roll, totalPower }) =>
    `⚔️ Physical Attack! Base ${basePower} + d6 Roll ${roll} = ${totalPower} damage!`,
  [GameEvent.DRAW_SPECIAL_TRIGGERED]: ({ amount }) =>
    `🔮 Special: Draw ${amount} cards!`,
  [GameEvent.EMPTY_DECK_RESHUFFLED]: () =>
    "♻️ Deck is empty! Reshuffling discard pile...",
  [GameEvent.TURN_CARD_DRAWN]: ({ card }) =>
    `\n 📥 Drew a new card for turn: ${card.toString()}`,
  [GameEvent.HAND_FULL]: ({ maxHandSize }) =>
    `\n✋ Your hand is full (max ${maxHandSize} cards). The card stays in the deck.`,
  [GameEvent.ENEMY_DEFEATED]: ({ enemy, enemiesDefeated }) =>
    `\n${enemy.getName()} has been defeated!\nYou have defeated ${enemiesDefeated} enemies`,
  [GameEvent.REWARD_ADDED]: ({ card }) =>
    `\n✨ Added ${card.toString()} to your deck!`,
};

// Observer that writes the game's text output to the console.
export class GameLog {
  observe(subject) {
    subject.subscribe((eventType, details) => this.#print(eventType, details));
  }

  showWelcome() {
    console.log("=== Welcome to CardRPG, press q at any time to exit ===");
  }

  showGoodbye() {
    console.log("\nExiting game. Thanks for playing!");
  }

  showTurnDivider() {
    console.log("\n" + "=".repeat(40));
  }

  showGameOver(player, enemiesDefeated) {
    console.log(`\n 💀 ${player.getName()} has been defeated!`);
    console.log(` You defeated ${enemiesDefeated} enemies`);
  }

  #print(eventType, details) {
    const formatMessage = EVENT_MESSAGES[eventType];
    if (formatMessage) {
      console.log(formatMessage(details));
    }
  }
}
