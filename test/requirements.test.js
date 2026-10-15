import test from "node:test";
import assert from "node:assert/strict";
import { Card } from "DeckLib";
import { CombatUI } from "../src/CombatUI.js";
import { EnemyIndex } from "../src/Enemies/EnemyIndex.js";
import { completeEncounter } from "../src/EncounterLogic.js";
import { GameLogic } from "../src/GameLogic.js";
import { Player } from "../src/Player.js";

function captureConsoleOutput(run) {
  const originalLog = console.log;
  const output = [];
  console.log = (...values) => output.push(values.join(" "));

  try {
    run();
  } finally {
    console.log = originalLog;
  }

  return output.join("\n");
}

async function captureAsyncConsoleOutput(run) {
  const originalLog = console.log;
  console.log = () => {};

  try {
    return await run();
  } finally {
    console.log = originalLog;
  }
}

test("defeating an enemy adds the selected reward to the discard pile", async () => {
  const reward = new Card("Spades", "8");
  const discardedCards = [];
  const handCards = [{ name: "remaining card" }];
  const hand = {
    getCards: () => [...handCards],
    removeCard: (card) => handCards.splice(handCards.indexOf(card), 1),
  };
  const dealtHand = [];
  const player = {
    getHand: () => hand,
    addCardToHand: (cards) => dealtHand.push(...cards),
  };
  const discard = {
    addCard: (card) => discardedCards.push(card),
    getPileSize: () => discardedCards.length,
  };
  let reshuffled = false;
  const deck = {
    reshuffleDiscardPile: (pile) => {
      assert.strictEqual(pile, discard);
      reshuffled = true;
    },
    shuffle: () => assert.fail("Expected the discard pile to be reshuffled"),
    drawMultiple: (amount) => Array.from({ length: amount }, () => "new card"),
  };
  const rewardLogic = {
    generateRewards: (amount) => {
      assert.equal(amount, 3);
      return [reward];
    },
    chooseReward: async (rewards) => rewards[0],
  };
  const randomizer = {
    pick: (enemies) => enemies[0],
  };

  const result = await captureAsyncConsoleOutput(() =>
    completeEncounter({
      enemy: new EnemyIndex.Goblin(),
      enemiesDefeated: 0,
      player,
      deck,
      discard,
      rewardLogic,
      randomizer,
      rng: {},
    }),
  );

  assert.equal(result.enemiesDefeated, 1);
  assert.ok(discardedCards.includes(reward));
  assert.ok(discardedCards.some((card) => card.name === "remaining card"));
  assert.equal(handCards.length, 0);
  assert.equal(dealtHand.length, 3);
  assert.equal(reshuffled, true);
  assert.ok(Object.values(EnemyIndex).some((Enemy) => result.enemy instanceof Enemy));
});

test("the enemy index provides multiple distinct enemies", () => {
  const enemies = Object.values(EnemyIndex).map((Enemy) => new Enemy());

  assert.ok(enemies.length > 1);
  assert.equal(
    new Set(enemies.map((enemy) => enemy.getName())).size,
    enemies.length,
  );
  assert.ok(enemies.every((enemy) => enemy.isAlive()));
});

test("combat display presents player, enemy, health, and deck information", () => {
  const player = new Player("Test Hero", 30, 4);
  const enemy = new EnemyIndex.Goblin();
  const output = captureConsoleOutput(() =>
    new CombatUI(
      player,
      enemy,
      { remainingDeckSize: () => 7 },
      { getPileSize: () => 2 },
    ).render(),
  );

  assert.match(output, /HERO: Test Hero/);
  assert.match(output, /ENEMY: Goblin/);
  assert.match(output, /HP: 30\/30\s+Armour: 4/);
  assert.match(output, /HP: 10\/10/);
  assert.match(output, /Deck: 7/);
  assert.match(output, /Discard: 2/);
});

test("cards apply different effects based on their suits", () => {
  const player = new Player("Test Hero", 20);
  captureConsoleOutput(() => player.takeDamage(5));
  const enemy = new EnemyIndex.Goblin();
  const discard = { getPileSize: () => 0 };
  const drawnCards = [new Card("Hearts", "2"), new Card("Diamonds", "3")];
  let cardsDrawn = 0;
  const deck = {
    remainingDeckSize: () => 5,
    drawMultiple: (amount) => {
      cardsDrawn = amount;
      return drawnCards;
    },
  };
  const d6 = { roll: () => 1 };
  const gameLogic = new GameLogic(player, enemy, deck, discard, {}, d6);

  captureConsoleOutput(() => gameLogic.resolve(new Card("Hearts", "3")));
  assert.equal(player.getHp(), 18);

  captureConsoleOutput(() => gameLogic.resolve(new Card("Diamonds", "4")));
  assert.equal(player.getArmour(), 4);

  const enemyHp = enemy.getHp();
  captureConsoleOutput(() => gameLogic.resolve(new Card("Spades", "2")));
  assert.equal(enemy.getHp(), enemyHp - 3);

  captureConsoleOutput(() => gameLogic.resolve(new Card("Clubs", "2")));
  assert.equal(cardsDrawn, 2);
  assert.deepEqual(player.getHand().getCards(), drawnCards);
});
