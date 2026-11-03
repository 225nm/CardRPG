import test from "node:test";
import assert from "node:assert/strict";
import { GameCard } from "../src/models/GameCard.js";
import { Player } from "../src/models/Player.js";
import { GameLogic } from "../src/models/GameLogic.js";
import { HandFullError } from "../src/errors/HandFullError.js";
import { GameEvent } from "../src/events/GameEvents.js";
import { GameLog } from "../src/views/GameLog.js";
import { Goblin } from "../src/models/Enemies/Goblin.js";

const MAX_HAND_SIZE = 9;

function createPlayerWithCards(cardCount) {
  const player = new Player();
  for (let i = 0; i < cardCount; i++) {
    player.addCardToHand(GameCard.attack("2"));
  }
  return player;
}

function createCountingDeck(cardCount) {
  let remaining = cardCount;
  return {
    isDeckEmpty: () => remaining === 0,
    remainingDeckSize: () => remaining,
    draw: () => {
      remaining--;
      return GameCard.heal("3");
    },
    getRemaining: () => remaining,
  };
}

function recordEvents(subject) {
  const events = [];
  subject.subscribe((eventType, details) => events.push({ eventType, details }));
  return events;
}

test("adding a 10th card to the hand throws HandFullError and keeps 9 cards", () => {
  const player = createPlayerWithCards(MAX_HAND_SIZE);

  assert.throws(() => player.addCardToHand(GameCard.heal("2")), HandFullError);
  assert.equal(player.getHand().getCards().length, MAX_HAND_SIZE);
});

test("adding several cards that would overflow the hand adds none of them", () => {
  const player = createPlayerWithCards(8);

  assert.throws(
    () => player.addCardToHand([GameCard.heal("2"), GameCard.heal("3")]),
    HandFullError,
  );
  assert.equal(player.getHand().getCards().length, 8);
});

test("drawing with a full hand throws before a card leaves the deck", () => {
  const player = createPlayerWithCards(MAX_HAND_SIZE);
  const deck = createCountingDeck(5);

  assert.throws(() => player.drawCardFrom(deck), HandFullError);
  assert.equal(deck.getRemaining(), 5);
});

test("endTurn with a full hand skips the draw and reports the full hand", () => {
  const player = createPlayerWithCards(MAX_HAND_SIZE);
  const deck = createCountingDeck(5);
  const gameLogic = new GameLogic(player, new Goblin(), deck, { getPileSize: () => 0 }, {}, {});
  const events = recordEvents(gameLogic);

  gameLogic.endTurn();

  assert.equal(deck.getRemaining(), 5);
  assert.equal(player.getHand().getCards().length, MAX_HAND_SIZE);
  assert.deepEqual(
    events.map((event) => event.eventType),
    [GameEvent.HAND_FULL],
  );
  assert.equal(events[0].details.maxHandSize, MAX_HAND_SIZE);
});

test("the Clubs draw stops at the card that would be the 10th", () => {
  const player = createPlayerWithCards(8);
  const deck = createCountingDeck(5);
  const gameLogic = new GameLogic(player, new Goblin(), deck, { getPileSize: () => 0 }, {}, {});
  const events = recordEvents(gameLogic);

  gameLogic.resolve(GameCard.drawTwo());

  assert.equal(player.getHand().getCards().length, MAX_HAND_SIZE);
  assert.equal(deck.getRemaining(), 4);
  assert.ok(events.some((event) => event.eventType === GameEvent.HAND_FULL));
});

test("the game log prints a message when the hand is full", () => {
  const player = createPlayerWithCards(MAX_HAND_SIZE);
  const gameLogic = new GameLogic(player, new Goblin(), createCountingDeck(5), { getPileSize: () => 0 }, {}, {});
  new GameLog().observe(gameLogic);

  const originalLog = console.log;
  const output = [];
  console.log = (message) => output.push(message);
  try {
    gameLogic.endTurn();
  } finally {
    console.log = originalLog;
  }

  assert.match(output.join("\n"), /hand is full \(max 9 cards\)/);
});
