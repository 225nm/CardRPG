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
import { Observable } from "./src/Observable.js";
import { GameLog } from "./src/GameLog.js";
import { HandView } from "./src/HandView.js";
import { RewardView } from "./src/RewardView.js";

function createCombatHandlers({ player, enemy, deck, discard, rng, d6, gameLog }) {
  const gameLogic = new GameLogic(player, enemy, deck, discard, rng, d6);
  gameLog.observe(enemy);
  gameLog.observe(gameLogic);

  return {
    gameLogic,
    combatUI: new CombatUI(player, enemy, deck, discard),
  };
}

async function startGame() {
  // Initialize random handlers
  const rng = new RandomGenerator();
  const randomizer = new Randomizer();
  const shuffler = new Shuffler();

  // Initialize dice logic
  const d6 = new Dice();

  // Initialize views
  const gameLog = new GameLog();
  const rewardView = new RewardView();
  const encounterEvents = new Observable();
  gameLog.observe(encounterEvents);

  // Initialize player and deck handlers
  const player = new Player("Player1", 30);
  const handView = new HandView(player);
  gameLog.observe(player);
  const deck = new Deck(starterDeck, shuffler);
  const discard = new DiscardPile();
  let enemiesDefeated = 0;

  // Initialize enemy
  let enemy = new EnemyIndex.Goblin();

  let { gameLogic, combatUI } = createCombatHandlers({
    player,
    enemy,
    deck,
    discard,
    rng,
    d6,
    gameLog,
  });
  const rewardLogic = new RewardLogic(CommonCards, UncommonCards, RareCards);

  gameLog.showWelcome();
  deck.shuffle();

  // Initialize starting hand
  player.addCardToHand(deck.drawMultiple(3));

  let playing = true;

  while (playing) {
    player.sortHand();

    combatUI.render();
    handView.render();

    const handCards = player.getHand().getCards();

    const rawInput = await getSingleKey(
      "\n Enter the number of the card to play: ",
    );
    const trimmedInput = rawInput.trim().toLowerCase();

    if (trimmedInput === "q") {
      gameLog.showGoodbye();
      playing = false;
      process.exit(0);
    }
    // Base 10, -1 to properly represent index
    const choice = parseInt(trimmedInput, 10) - 1;

    if (isNaN(choice) || choice < 0 || choice >= handCards.length) {
      gameLog.showInvalidCardChoice();
      continue;
    }
    gameLog.showTurnDivider();

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
        rewardView,
        randomizer,
        rng,
        events: encounterEvents,
      });
      enemiesDefeated = encounter.enemiesDefeated;
      enemy = encounter.enemy;
      ({ gameLogic, combatUI } = createCombatHandlers({
        player,
        enemy,
        deck,
        discard,
        rng,
        d6,
        gameLog,
      }));

      continue;
    }

    enemy.takeTurn(player, rng);

    if (!player.isAlive()) {
      gameLog.showGameOver(player, enemiesDefeated);
      process.exit(0);
    }

    gameLogic.endTurn();
  }
}

startGame();
