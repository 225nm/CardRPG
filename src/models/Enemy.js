import { Observable } from "../events/Observable.js";
import { GameEvent } from "../events/GameEvents.js";
import {
  assertNonEmptyString,
  assertPositiveInteger,
  assertNonNegativeInteger,
  assertProbability,
} from "./validators.js";

// Base class for enemies. Hp = health points. Luck is used for chance to use special attack.
export class Enemy extends Observable {
  #name;
  #maxHp;
  #hp;
  #power;
  #specialName;
  #target;
  #specialTarget;
  #luck;

  constructor(name, maxHp, power, specialName, target, specialTarget, luck) {
    super();
    this.#validateStats(name, maxHp, power, specialName, luck);
    this.#name = name;
    this.#maxHp = maxHp;
    this.#hp = maxHp;
    this.#power = power;
    this.#specialName = specialName;
    this.#target = target;
    this.#specialTarget = specialTarget;
    this.#luck = luck;
  }

  #validateStats(name, maxHp, power, specialName, luck) {
    assertNonEmptyString(name, "name");
    assertPositiveInteger(maxHp, "maxHp");
    assertNonNegativeInteger(power, "power");
    assertNonEmptyString(specialName, "specialName");
    assertProbability(luck, "luck");
  }

  getName() {
    return this.#name;
  }

  getMaxHp() {
    return this.#maxHp;
  }

  getHp() {
    return this.#hp;
  }

  getPower() {
    return this.#power;
  }

  getSpecialName() {
    return this.#specialName;
  }

  getTarget() {
    return this.#target;
  }

  getSpecialTarget() {
    return this.#specialTarget;
  }

  getLuck() {
    return this.#luck;
  }

  isAlive() {
    return this.#hp > 0;
  }

  takeDamage(amount) {
    this.#hp = Math.max(0, this.#hp - amount);
    this.notify(GameEvent.ENEMY_DAMAGED, { enemy: this, amount });
  }

  takeTurn(player, random) {
    if (random.succeeds(this.#luck)) {
      this.special(player);
    } else {
      this.attack(player);
    }
  }

  attack(target) {}

  special() {}
}
