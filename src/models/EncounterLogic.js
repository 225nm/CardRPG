import { EnemyIndex } from "./Enemies/EnemyIndex.js";
import { Observable } from "../events/Observable.js";
import { GameEvent } from "../events/GameEvents.js";

function addRewardToDiscard(reward, discard, events) {
  discard.addCard(reward);
  events.notify(GameEvent.REWARD_ADDED, { card: reward });
}

function drawNextHand(player, deck, discard) {
  if (discard.getPileSize() > 0) {
    deck.reshuffleDiscardPile(discard);
  } else {
    deck.shuffle();
  }

  player.addCardToHand(deck.drawMultiple(3));
}

function spawnEnemy(random) {
  const Enemy = random.pick(Object.values(EnemyIndex));
  return new Enemy();
}

export function recordEnemyDefeat(
  enemy,
  enemiesDefeated,
  events = new Observable(),
) {
  const totalDefeated = enemiesDefeated + 1;
  events.notify(GameEvent.ENEMY_DEFEATED, {
    enemy,
    enemiesDefeated: totalDefeated,
  });
  return totalDefeated;
}

// Adds the chosen reward, deals a fresh hand and returns the next enemy.
export function completeEncounter({
  reward,
  player,
  deck,
  discard,
  random,
  events = new Observable(),
}) {
  addRewardToDiscard(reward, discard, events);
  player.discardHand(discard);
  drawNextHand(player, deck, discard);

  return spawnEnemy(random);
}
