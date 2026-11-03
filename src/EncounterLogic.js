import { EnemyIndex } from "./Enemies/EnemyIndex.js";
import { Observable } from "./Observable.js";
import { GameEvent } from "./GameEvents.js";

function announceEnemyDefeat(enemy, enemiesDefeated, events) {
  enemiesDefeated++;
  events.notify(GameEvent.ENEMY_DEFEATED, { enemy, enemiesDefeated });
  return enemiesDefeated;
}

async function addRewardToDiscard(rewardLogic, rewardView, discard, events) {
  const rewards = rewardLogic.generateRewards(3);
  const selectedReward = await rewardView.chooseReward(rewards);
  discard.addCard(selectedReward);
  events.notify(GameEvent.REWARD_ADDED, { card: selectedReward });
}

function discardRemainingHand(player, discard) {
  const hand = player.getHand();
  const remainingHand = [...hand.getCards()];

  for (const card of remainingHand) {
    hand.removeCard(card);
    discard.addCard(card);
  }
}

function drawNextHand(player, deck, discard) {
  if (discard.getPileSize() > 0) {
    deck.reshuffleDiscardPile(discard);
  } else {
    deck.shuffle();
  }

  player.addCardToHand(deck.drawMultiple(3));
}

function spawnEnemy(randomizer, rng) {
  const Enemy = randomizer.pick(Object.values(EnemyIndex), rng);
  return new Enemy();
}

export async function completeEncounter({
  enemy,
  enemiesDefeated,
  player,
  deck,
  discard,
  rewardLogic,
  rewardView,
  randomizer,
  rng,
  events = new Observable(),
}) {
  enemiesDefeated = announceEnemyDefeat(enemy, enemiesDefeated, events);
  await addRewardToDiscard(rewardLogic, rewardView, discard, events);
  discardRemainingHand(player, discard);
  drawNextHand(player, deck, discard);

  return {
    enemiesDefeated,
    enemy: spawnEnemy(randomizer, rng),
  };
}
