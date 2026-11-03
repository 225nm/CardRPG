import test from "node:test";
import assert from "node:assert/strict";
import { GameRandom } from "../src/models/GameRandom.js";
import { RewardLogic } from "../src/models/RewardLogic.js";
import { GameCard } from "../src/models/GameCard.js";

const SEED = 42;

function rollMany(random, count) {
  return Array.from({ length: count }, () => random.rollD6());
}

test("rollD6 always returns a whole number from 1 to 6", () => {
  const rolls = rollMany(new GameRandom(SEED), 500);

  assert.ok(rolls.every((roll) => Number.isInteger(roll) && roll >= 1 && roll <= 6));
  assert.equal(new Set(rolls).size, 6, "every face should come up in 500 rolls");
});

test("the same seed gives the same sequence", () => {
  assert.deepEqual(rollMany(new GameRandom(SEED), 20), rollMany(new GameRandom(SEED), 20));
});

test("succeeds is never true at 0 and always true at 1", () => {
  const random = new GameRandom(SEED);

  for (let i = 0; i < 100; i++) {
    assert.equal(random.succeeds(0), false);
    assert.equal(random.succeeds(1), true);
  }
});

test("pick only returns items from the list", () => {
  const random = new GameRandom(SEED);
  const items = ["a", "b", "c"];

  for (let i = 0; i < 50; i++) {
    assert.ok(items.includes(random.pick(items)));
  }
});

test("pickWeighted never picks an item with weight 0", () => {
  const random = new GameRandom(SEED);

  for (let i = 0; i < 100; i++) {
    assert.equal(random.pickWeighted(["never", "always"], [0, 1]), "always");
  }
});

test("RewardLogic picks rewards through the injected random source", () => {
  const rareCard = GameCard.attack("8");
  const alwaysRareFirstCard = {
    pickWeighted: (pools) => pools[2],
    pick: (cards) => cards[0],
  };
  const rewardLogic = new RewardLogic(
    [GameCard.heal("2")],
    [GameCard.heal("5")],
    [rareCard],
    alwaysRareFirstCard,
  );

  assert.deepEqual(rewardLogic.generateRewards(3), [rareCard, rareCard, rareCard]);
});
