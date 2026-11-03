import test from "node:test";
import assert from "node:assert";
import { GameCard } from "../src/models/GameCard.js";
import { GameLogic, TurnOutcome } from "../src/models/GameLogic.js";
import { Player } from "../src/models/Player.js";
import { Goblin } from "../src/models/Enemies/Goblin.js";
import { Knight } from "../src/models/Enemies/Knight.js";

const alwaysSpecialRollsSix = { succeeds: () => true, rollD6: () => 6 };
const neverSpecialRollsSix = { succeeds: () => false, rollD6: () => 6 };
const deckWithCards = {
  isDeckEmpty: () => false,
  draw: () => GameCard.attack("2"),
};
const emptyDiscard = { getPileSize: () => 0 };

test("endTurn reshuffles discard pile into deck when deck is empty and discard has cards", () => {
  let reshuffledCalled = false;
  let drawnCalled = false;
  let deckEmpty = true; // ✅ Track deck state for the mock

  const mockDeck = {
    isDeckEmpty: () => deckEmpty,
    reshuffleDiscardPile: (discardPile) => {
      reshuffledCalled = true;
      assert.strictEqual(discardPile, mockDiscard);
      deckEmpty = false; // ✅ Deck is no longer empty after reshuffle
    },
    draw: () => {
      drawnCalled = true;
      return { toString: () => "Ace of Spades" };
    },
  };

  const mockDiscard = {
    getPileSize: () => 5,
  };

  const player = new Player();

  const mockEnemy = {};
  const mockRandom = {};

  const gameLogic = new GameLogic(
    player,
    mockEnemy,
    mockDeck,
    mockDiscard,
    mockRandom,
  );

  gameLogic.endTurn();

  assert.strictEqual(reshuffledCalled, true, "reshuffleDiscardPile should be called when deck is empty");
  assert.strictEqual(drawnCalled, true, "deck.draw should be called after reshuffle");
  const handCards = player.getCards();
  assert.strictEqual(handCards.length, 1, "player should receive the replacement card");
  assert.strictEqual(handCards[0].toString(), "Ace of Spades");
});

test("endTurn does not reshuffle if deck still has cards remaining", () => {
  let reshuffledCalled = false;
  let drawnCalled = false;

  const mockDeck = {
    isDeckEmpty: () => false, // Deck is not empty
    reshuffleDiscardPile: () => {
      reshuffledCalled = true;
    },
    draw: () => {
      drawnCalled = true;
      return { toString: () => "King of Hearts" };
    },
  };

  const mockDiscard = {
    getPileSize: () => 3,
  };

  const gameLogic = new GameLogic(
    new Player(),
    {},
    mockDeck,
    mockDiscard,
    {},
  );

  gameLogic.endTurn();

  assert.strictEqual(reshuffledCalled, false, "reshuffle should not be called if deck has cards");
  assert.strictEqual(drawnCalled, true, "normal draw should still occur");
});

test("BR-2: a Goblin that defeats itself with its special ends the fight in the same turn", () => {
  const player = new Player("Test Hero", 30);
  const goblin = new Goblin();
  goblin.takeDamage(8);
  const noDrawDeck = {
    isDeckEmpty: () => assert.fail("no card should be drawn after the fight ends"),
  };
  const gameLogic = new GameLogic(player, goblin, noDrawDeck, emptyDiscard, alwaysSpecialRollsSix);

  const outcome = gameLogic.playTurn(GameCard.heal("2"));

  assert.strictEqual(outcome, TurnOutcome.ENEMY_DEFEATED);
  assert.strictEqual(goblin.isAlive(), false);
});

test("playTurn does not let an enemy defeated by the player's card act", () => {
  const player = new Player("Test Hero", 30);
  const goblin = new Goblin();
  const randomForPlayerOnly = {
    rollD6: () => 6,
    succeeds: () => assert.fail("a defeated enemy should not take a turn"),
  };
  const gameLogic = new GameLogic(player, goblin, deckWithCards, emptyDiscard, randomForPlayerOnly);

  const outcome = gameLogic.playTurn(GameCard.attack("4"));

  assert.strictEqual(outcome, TurnOutcome.ENEMY_DEFEATED);
  assert.strictEqual(player.getHp(), 30);
});

test("playTurn reports the player defeated when the enemy's attack is lethal", () => {
  const player = new Player("Test Hero", 8);
  const knight = new Knight();
  const gameLogic = new GameLogic(player, knight, deckWithCards, emptyDiscard, alwaysSpecialRollsSix);

  const outcome = gameLogic.playTurn(GameCard.attack("2"));

  assert.strictEqual(outcome, TurnOutcome.PLAYER_DEFEATED);
});

test("playTurn continues and draws a card when both survive", () => {
  const player = new Player("Test Hero", 30);
  const knight = new Knight();
  const gameLogic = new GameLogic(player, knight, deckWithCards, emptyDiscard, neverSpecialRollsSix);

  const outcome = gameLogic.playTurn(GameCard.armour("2"));

  assert.strictEqual(outcome, TurnOutcome.CONTINUE);
  assert.strictEqual(player.getCards().length, 1);
});
