import test from "node:test";
import assert from "node:assert";
import { Goblin } from "../src/models/Enemies/Goblin.js";

test("Goblin special method reduces HP by 2", () => {
  const goblin = new Goblin();
  
  // Verify initial health
  assert.strictEqual(goblin.getHp(), 10);

  // Invoke special directly
  goblin.special();

  // Verify health dropped by 2
  assert.strictEqual(goblin.getHp(), 8);
});

test("Goblin takeTurn triggers special when the luck check succeeds", () => {
  const goblin = new Goblin("Goblin", 10, 3, "stumbles", "Player", "Goblin", 0.1);
  let checkedProbability;
  const luckySpecial = {
    succeeds: (probability) => {
      checkedProbability = probability;
      return true;
    },
  };

  const initialHp = goblin.getHp();
  goblin.takeTurn({}, luckySpecial);

  assert.strictEqual(checkedProbability, 0.1, "the luck stat is the special's chance");

  // Special causes goblin to take 2 self-damage
  assert.strictEqual(goblin.getHp(), initialHp - 2);
});

test("Goblin takeTurn triggers attack when the luck check fails", () => {
  const goblin = new Goblin("Goblin", 10, 3, "stumbles", "Player", "Goblin", 0.1);
  const unluckySpecial = { succeeds: () => false };

  let attackCalled = false;
  goblin.attack = (target) => {
    attackCalled = true;
  };

  const initialHp = goblin.getHp();
  goblin.takeTurn({ name: "DummyPlayer" }, unluckySpecial);

  // HP should remain unchanged (no special self-damage) and attack should be called
  assert.strictEqual(goblin.getHp(), initialHp);
  assert.strictEqual(attackCalled, true);
});

test("Goblin is defeated when its special self-damage takes it to 0 HP", () => {
  const goblin = new Goblin();
  goblin.takeDamage(8);
  const luckySpecial = { succeeds: () => true };

  goblin.takeTurn({}, luckySpecial);

  assert.strictEqual(goblin.getHp(), 0);
  assert.strictEqual(goblin.isAlive(), false);
});

test("Goblin self-damage does not take HP below 0", () => {
  const goblin = new Goblin();
  goblin.takeDamage(9);

  goblin.special();

  assert.strictEqual(goblin.getHp(), 0);
  assert.strictEqual(goblin.isAlive(), false);
});