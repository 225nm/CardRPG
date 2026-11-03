import test from "node:test";
import assert from "node:assert/strict";
import { DiscardPile } from "DeckLib";
import { GameCard, CardEffect } from "../src/models/GameCard.js";
import { CardNotImplementedError } from "../src/errors/CardNotImplementedError.js";
import { GameLogic } from "../src/models/GameLogic.js";
import { Player } from "../src/models/Player.js";
import { Goblin } from "../src/models/Enemies/Goblin.js";

test("factory methods create cards with the matching effect and power", () => {
  assert.equal(GameCard.attack("4").getEffect(), CardEffect.ATTACK);
  assert.equal(GameCard.heal("3").getEffect(), CardEffect.HEAL);
  assert.equal(GameCard.armour("5").getEffect(), CardEffect.ARMOUR);
  assert.equal(GameCard.drawTwo().getEffect(), CardEffect.DRAW_CARDS);
  assert.equal(GameCard.attack("4").getPower(), 4);
  assert.equal(GameCard.drawTwo().getPower(), 2);
});

test("factory methods reject ranks DeckLib does not know", () => {
  assert.throws(() => GameCard.heal("1"), TypeError);
});

test("Clubs ranks without a designed effect cannot be created", () => {
  assert.throws(() => new GameCard("Clubs", "3"), CardNotImplementedError);
  assert.throws(() => new GameCard("Clubs", "K"), CardNotImplementedError);
});

test("the effect of a Clubs card depends on its rank, not just its suit", () => {
  assert.equal(new GameCard("Clubs", "2").getEffect(), CardEffect.DRAW_CARDS);
});

test("game cards can be sorted and played from a DeckLib hand", () => {
  const player = new Player();
  player.addCardToHand([GameCard.attack("8"), GameCard.heal("2")]);

  player.sortHand();
  const played = player.playCardByIndex(0, new DiscardPile());

  assert.equal(played.getEffect(), CardEffect.HEAL);
  assert.equal(player.getCards().length, 1);
});

test("resolving a card with an unknown effect throws instead of doing nothing", () => {
  const gameLogic = new GameLogic(new Player(), new Goblin(), {}, {}, {});
  const unknownCard = { getEffect: () => "teleport", getPower: () => 1 };

  assert.throws(() => gameLogic.resolve(unknownCard), TypeError);
});
