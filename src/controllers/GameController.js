import { Deck, DiscardPile, Shuffler } from "DeckLib";
import { RandomGenerator, Dice, Randomizer } from "dice-rng-toolkit";
import { Player } from "../models/Player.js";
import { EnemyIndex } from "../models/Enemies/EnemyIndex.js";
import { CombatUI } from "../views/CombatUI.js";
import { starterDeck } from "../models/starterDeck.js";
import { GameLogic, TurnOutcome } from "../models/GameLogic.js";
import { CommonCards, UncommonCards, RareCards } from "../models/Loot.js";
import { RewardLogic } from "../models/RewardLogic.js";
import {
  recordEnemyDefeat,
  completeEncounter,
} from "../models/EncounterLogic.js";
import { Observable } from "../events/Observable.js";
import { HandView } from "../views/HandView.js";
import { RewardView } from "../views/RewardView.js";

const STARTING_HAND_SIZE = 3;
const REWARD_CHOICES = 3;

export class GameController {
  #gameLog;
  #rng = new RandomGenerator();
  #randomizer = new Randomizer();
  #d6 = new Dice();
  #player = new Player("Player1", 30);
  #deck = new Deck(starterDeck, new Shuffler());
  #discard = new DiscardPile();
  #rewardLogic = new RewardLogic(CommonCards, UncommonCards, RareCards);
  #handView = new HandView(this.#player);
  #rewardView = new RewardView();
  #encounterEvents = new Observable();
  #enemiesDefeated = 0;
  #enemy;
  #gameLogic;
  #combatUI;

  constructor(gameLog) {
    this.#gameLog = gameLog;
    this.#gameLog.observe(this.#player);
    this.#gameLog.observe(this.#encounterEvents);
    this.#startFight(new EnemyIndex.Goblin());
  }

  async run() {
    this.#gameLog.showWelcome();
    this.#dealStartingHand();

    while (this.#player.isAlive()) {
      await this.#playRound();
    }

    this.#gameLog.showGameOver(this.#player, this.#enemiesDefeated);
  }

  async #playRound() {
    this.#renderBoard();
    const cardIndex = await this.#handView.readCardChoice();
    this.#gameLog.showTurnDivider();

    const card = this.#player.playCardByIndex(cardIndex, this.#discard);
    const outcome = this.#gameLogic.playTurn(card);

    if (outcome === TurnOutcome.ENEMY_DEFEATED) {
      await this.#finishEncounter();
    }
  }

  #dealStartingHand() {
    this.#deck.shuffle();
    this.#player.addCardToHand(this.#deck.drawMultiple(STARTING_HAND_SIZE));
  }

  #renderBoard() {
    this.#player.sortHand();
    this.#combatUI.render();
    this.#handView.render();
  }

  async #finishEncounter() {
    this.#enemiesDefeated = recordEnemyDefeat(
      this.#enemy,
      this.#enemiesDefeated,
      this.#encounterEvents,
    );

    const rewards = this.#rewardLogic.generateRewards(REWARD_CHOICES);
    const reward = await this.#rewardView.chooseReward(rewards);

    const nextEnemy = completeEncounter({
      reward,
      player: this.#player,
      deck: this.#deck,
      discard: this.#discard,
      randomizer: this.#randomizer,
      rng: this.#rng,
      events: this.#encounterEvents,
    });
    this.#startFight(nextEnemy);
  }

  #startFight(enemy) {
    this.#enemy = enemy;
    this.#gameLogic = new GameLogic(
      this.#player,
      enemy,
      this.#deck,
      this.#discard,
      this.#rng,
      this.#d6,
    );
    this.#combatUI = new CombatUI(this.#player, enemy, this.#deck, this.#discard);
    this.#gameLog.observe(enemy);
    this.#gameLog.observe(this.#gameLogic);
  }
}
