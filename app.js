import { Deck, DiscardPile, Shuffler } from "DeckLib";
import { Player } from "./src/Player.js";
import { EnemyIndex } from "./src/Enemies/EnemyIndex.js";
import { CombatUI } from "./src/CombatUI.js";
import { RandomGenerator, Dice, Randomizer } from "dice-rng-toolkit";
import { starterDeck } from "./src/starterDeck.js";
import { GameLogic } from "./src/GameLogic.js";
import { CommonCards, UncommonCards, RareCards } from "./src/Loot.js";
import { RewardLogic } from "./src/RewardLogic.js";
import { getSingleKey } from "./src/InputLogic.js";

function createCombatHandlers(player, enemy, deck, discard, rng, d6) {
  return {
    gameLogic: new GameLogic(player, enemy, deck, discard, rng, d6),
    combatUI: new CombatUI(player, enemy, deck, discard),
  };
}

function announceEnemyDefeat(enemy, enemiesDefeated) {
  enemiesDefeated++;
  console.log(`\n${enemy.getName()} has been defeated!`);
  console.log(`You have defeated ${enemiesDefeated} enemies`);
  return enemiesDefeated;
}

async function addRewardToDeck(rewardLogic, discard) {
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

async function startGame() {
  // Initialize random handlers
  const rng = new RandomGenerator();
  const randomizer = new Randomizer();
  const shuffler = new Shuffler();

  // Initialize dice logic
  const d6 = new Dice();

  // Initialize player and deck handlers
  const player = new Player("Player1", 30);
  const deck = new Deck(starterDeck, shuffler);
  const discard = new DiscardPile();
  let enemiesDefeated = 0;

  // Initialize enemy
  let enemy = new EnemyIndex.Goblin();

  let { gameLogic, combatUI } = createCombatHandlers(
    player,
    enemy,
    deck,
    discard,
    rng,
    d6,
  );
  const rewardLogic = new RewardLogic(CommonCards, UncommonCards, RareCards);

  console.log("=== Welcome to CardRPG, press q at any time to exit ===");
  deck.shuffle();

  // Initialize starting hand
  player.addCardToHand(deck.drawMultiple(3));

  let playing = true;

  while (playing) {
    player.sortHand();

    combatUI.render();
    player.renderHand();

    const handCards = player.getHand().getCards();

    const rawInput = await getSingleKey(
      "\n Enter the number of the card to play: ",
    );
    const trimmedInput = rawInput.trim().toLowerCase();

    if (trimmedInput === "q") {
      console.log("\nExiting game. Thanks for playing!");
      playing = false;
      process.exit(0);
    }
    // Base 10, -1 to properly represent index
    const choice = parseInt(trimmedInput, 10) - 1;

    if (isNaN(choice) || choice < 0 || choice >= handCards.length) {
      console.log(
        "\n❌ Invalid choice! Please enter a valid card number corresponding to your hand.",
      );
      continue;
    }
    console.log("\n" + "=".repeat(40));

    const playedCard = player.playCardByIndex(choice, discard);
    gameLogic.resolve(playedCard);

    if (!enemy.isAlive()) {
      enemiesDefeated = announceEnemyDefeat(enemy, enemiesDefeated);
      await addRewardToDeck(rewardLogic, discard);
      discardRemainingHand(player, discard);
      drawNextHand(player, deck, discard);

      enemy = spawnEnemy(randomizer, rng);
      ({ gameLogic, combatUI } = createCombatHandlers(
        player,
        enemy,
        deck,
        discard,
        rng,
        d6,
      ));

      continue;
    }

    enemy.takeTurn(player, rng);

    if (!player.isAlive()) {
      console.log(`\n 💀 ${player.getName()} has been defeated!`);
      console.log(` You defeated ${enemiesDefeated} enemies`);
      process.exit(0);
    }

    gameLogic.endTurn();
  }
}

startGame();
