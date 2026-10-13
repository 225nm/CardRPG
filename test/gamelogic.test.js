import test from "node:test";
import assert from "node:assert";
import { GameLogic } from "../src/GameLogic.js";

test("endTurn reshuffles discard pile into deck when deck is empty and discard has cards", () => {
  let reshuffledCalled = false;
  let drawnCalled = false;
  let cardAddedToHand = false;
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

  const mockPlayer = {
    addCardToHand: (card) => {
      cardAddedToHand = true;
      assert.strictEqual(card.toString(), "Ace of Spades");
    },
  };

  const mockEnemy = {};
  const mockRng = {};
  const mockD6 = {};

  const gameLogic = new GameLogic(
    mockPlayer,
    mockEnemy,
    mockDeck,
    mockDiscard,
    mockRng,
    mockD6,
  );

  gameLogic.endTurn();

  assert.strictEqual(reshuffledCalled, true, "reshuffleDiscardPile should be called when deck is empty");
  assert.strictEqual(drawnCalled, true, "deck.draw should be called after reshuffle");
  assert.strictEqual(cardAddedToHand, true, "player should receive the replacement card");
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

  const mockPlayer = {
    addCardToHand: () => {},
  };

  const gameLogic = new GameLogic(
    mockPlayer,
    {},
    mockDeck,
    mockDiscard,
    {},
    {},
  );

  gameLogic.endTurn();

  assert.strictEqual(reshuffledCalled, false, "reshuffle should not be called if deck has cards");
  assert.strictEqual(drawnCalled, true, "normal draw should still occur");
});