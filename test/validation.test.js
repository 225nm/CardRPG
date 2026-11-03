import test from "node:test";
import assert from "node:assert/strict";
import { DiscardPile } from "DeckLib";
import { GameCard } from "../src/models/GameCard.js";
import { Player } from "../src/models/Player.js";
import { Goblin } from "../src/models/Enemies/Goblin.js";
import { Knight } from "../src/models/Enemies/Knight.js";

test("default players and enemies pass validation", () => {
  assert.doesNotThrow(() => new Player());
  assert.doesNotThrow(() => new Goblin());
  assert.doesNotThrow(() => new Knight());
});

test("Player rejects an empty or missing name", () => {
  assert.throws(() => new Player(""), TypeError);
  assert.throws(() => new Player(42), TypeError);
});

test("Player rejects max HP that is not a positive integer", () => {
  assert.throws(() => new Player("Hero", 0), RangeError);
  assert.throws(() => new Player("Hero", -5), RangeError);
  assert.throws(() => new Player("Hero", NaN), RangeError);
  assert.throws(() => new Player("Hero", 2.5), RangeError);
});

test("Player rejects negative armour", () => {
  assert.throws(() => new Player("Hero", 30, -1), RangeError);
});

test("Enemy rejects invalid stats", () => {
  assert.throws(() => new Goblin("", 10, 3, "stumbles", "Player", "Goblin", 0.1), TypeError);
  assert.throws(() => new Goblin("Goblin", 0, 3, "stumbles", "Player", "Goblin", 0.1), RangeError);
  assert.throws(() => new Goblin("Goblin", 10, -1, "stumbles", "Player", "Goblin", 0.1), RangeError);
  assert.throws(() => new Goblin("Goblin", 10, 3, "", "Player", "Goblin", 0.1), TypeError);
});

test("Enemy rejects luck outside the range 0 to 1", () => {
  assert.throws(() => new Goblin("Goblin", 10, 3, "stumbles", "Player", "Goblin", 1.5), RangeError);
  assert.throws(() => new Goblin("Goblin", 10, 3, "stumbles", "Player", "Goblin", -0.1), RangeError);
});

test("playCardByIndex throws for an index outside the hand and leaves the hand unchanged", () => {
  const player = new Player();
  player.addCardToHand([GameCard.heal("2"), GameCard.attack("3")]);
  const discard = new DiscardPile();

  assert.throws(() => player.playCardByIndex(2, discard), RangeError);
  assert.throws(() => player.playCardByIndex(-1, discard), RangeError);
  assert.throws(() => player.playCardByIndex(undefined, discard), RangeError);
  assert.equal(player.getHand().getCards().length, 2);
  assert.equal(discard.getPileSize(), 0);
});

test("playCardByIndex plays a valid card into the discard pile", () => {
  const player = new Player();
  const card = GameCard.heal("2");
  player.addCardToHand(card);
  const discard = new DiscardPile();

  assert.equal(player.playCardByIndex(0, discard), card);
  assert.equal(player.getHand().getCards().length, 0);
  assert.equal(discard.getPileSize(), 1);
});
