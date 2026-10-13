import test from "node:test";
import assert from "node:assert";
import { Goblin } from "../src/Enemies/Goblin.js";

test("Goblin special method reduces HP by 2", () => {
  const goblin = new Goblin();
  
  // Verify initial health
  assert.strictEqual(goblin.getHp(), 10);

  // Invoke special directly
  goblin.special();

  // Verify health dropped by 2
  assert.strictEqual(goblin.getHp(), 8);
});

test("Goblin takeTurn triggers special when luck roll is below threshold", () => {
  const goblin = new Goblin("Goblin", 10, 3, "stumbles", "Player", "Goblin", 0.1);

  // Mock RNG that returns 0.05 (which is < 0.1 luck threshold, triggering special)
  const mockRng = {
    nextFloat: () => 0.05,
  };

  const initialHp = goblin.getHp();
  goblin.takeTurn({}, mockRng);

  // Special causes goblin to take 2 self-damage
  assert.strictEqual(goblin.getHp(), initialHp - 2);
});

test("Goblin takeTurn triggers attack when luck roll is above threshold", () => {
  const goblin = new Goblin("Goblin", 10, 3, "stumbles", "Player", "Goblin", 0.1);

  // Mock RNG that returns 0.5 (which is >= 0.1, triggering attack instead)
  const mockRng = {
    nextFloat: () => 0.5,
  };

  let attackCalled = false;
  goblin.attack = (target) => {
    attackCalled = true;
  };

  const initialHp = goblin.getHp();
  goblin.takeTurn({ name: "DummyPlayer" }, mockRng);

  // HP should remain unchanged (no special self-damage) and attack should be called
  assert.strictEqual(goblin.getHp(), initialHp);
  assert.strictEqual(attackCalled, true);
});