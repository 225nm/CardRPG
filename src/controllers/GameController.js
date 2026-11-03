import { Deck, DiscardPile, Shuffler } from "DeckLib";
import { RandomGenerator, Dice, Randomizer } from "dice-rng-toolkit";
import { Player } from "../models/Player.js";
import { EnemyIndex } from "../models/Enemies/EnemyIndex.js";
import { CombatUI } from "../views/CombatUI.js";
import { starterDeck } from "../models/starterDeck.js";
import { GameLogic, TurnOutcome } from "../models/GameLogic.js";
import { CommonCards, UncommonCards, RareCards } from "../models/Loot.js";
import { RewardLogic } from "../models/RewardLogic.js";
import { getSingleKey } from "../views/InputLogic.js";
import { completeEncounter } from "../models/EncounterLogic.js";
import { Observable } from "../events/Observable.js";
import { HandView } from "../views/HandView.js";
import { RewardView } from "../views/RewardView.js";

const STARTING_HAND_SIZE = 3;

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
    const cardIndex = await this.#readCardChoice();
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

  async #readCardChoice() {
    while (true) {
      const key = await getSingleKey("\n Enter the number of the card to play: ");
      // Base 10, -1 to properly represent index
      const cardIndex = parseInt(key.trim(), 10) - 1;

      if (this.#isCardInHand(cardIndex)) {
        return cardIndex;
      }
      this.#gameLog.showInvalidCardChoice();
    }
  }

  #isCardInHand(cardIndex) {
    const handSize = this.#player.getHand().getCards().length;
    return Number.isInteger(cardIndex) && cardIndex >= 0 && cardIndex < handSize;
  }

  async #finishEncounter() {
    const encounter = await completeEncounter({
      enemy: this.#enemy,
      enemiesDefeated: this.#enemiesDefeated,
      player: this.#player,
      deck: this.#deck,
      discard: this.#discard,
      rewardLogic: this.#rewardLogic,
      rewardView: this.#rewardView,
      randomizer: this.#randomizer,
      rng: this.#rng,
      events: this.#encounterEvents,
    });

    this.#enemiesDefeated = encounter.enemiesDefeated;
    this.#startFight(encounter.enemy);
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
