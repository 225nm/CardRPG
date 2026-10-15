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
import { completeEncounter } from "./src/EncounterLogic.js";

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
      const encounter = await completeEncounter({
        enemy,
        enemiesDefeated,
        player,
        deck,
        discard,
        rewardLogic,
        randomizer,
        rng,
      });
      enemiesDefeated = encounter.enemiesDefeated;
      enemy = encounter.enemy;
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
    function createCombatHandlers(player, enemy, deck, discard, rng, d6) {
      return {
        gameLogic: new GameLogic(player, enemy, deck, discard, rng, d6),
        combatUI: new CombatUI(player, enemy, deck, discard),
      };
    }
  }

  enemy.takeTurn(player, rng);

  if (!player.isAlive()) {
    console.log(`\n 💀 ${player.getName()} has been defeated!`);
    console.log(` You defeated ${enemiesDefeated} enemies`);
    process.exit(0);
  }

  gameLogic.endTurn();
}

startGame();
