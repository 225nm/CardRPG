import { EnemyIndex } from "./Enemies/EnemyIndex.js";

function announceEnemyDefeat(enemy, enemiesDefeated) {
  enemiesDefeated++;
  console.log(`\n${enemy.getName()} has been defeated!`);
  console.log(`You have defeated ${enemiesDefeated} enemies`);
  return enemiesDefeated;
}

async function addRewardToDiscard(rewardLogic, discard) {
  const rewards = rewardLogic.generateRewards(3);
  const selectedReward = await rewardLogic.chooseReward(rewards);
  console.log("REWARDS:" + rewards);
  console.log(selectedReward);
  discard.addCard(selectedReward);
  console.log(`\n✨ Added ${selectedReward.toString()} to your deck!`);
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
  randomizer,
  rng,
}) {
  enemiesDefeated = announceEnemyDefeat(enemy, enemiesDefeated);
  await addRewardToDiscard(rewardLogic, discard);
  discardRemainingHand(player, discard);
  drawNextHand(player, deck, discard);

  return {
    enemiesDefeated,
    enemy: spawnEnemy(randomizer, rng),
  };
}
