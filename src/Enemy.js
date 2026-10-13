// Base class for enemies. Hp = health points. Luck is used for chance to use special attack.
export class Enemy {
  #name;
  #maxHp;
  #hp;
  #power;
  #specialName;
  #target;
  #specialTarget;
  #luck;

  constructor(name, maxHp, power, specialName, target, specialTarget, luck) {
    this.#name = name;
    this.#maxHp = maxHp;
    this.#hp = maxHp;
    this.#power = power;
    this.#specialName = specialName;
    this.#target = target;
    this.#specialTarget = specialTarget;
    this.#luck = luck;
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
    console.log(
      `🗡️ ${this.#name} takes ${amount} damage! (HP: ${this.#hp}/${this.#maxHp})`,
    );
  }

  takeTurn(player, rng) {
    const luckRoll = rng.nextFloat();
    if (luckRoll < this.#luck) {
      this.special();
    } else {
      this.attack(player);
    }
  }

  attack(target) {}

  special() {}
}
