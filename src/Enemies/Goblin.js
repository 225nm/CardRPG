import { Enemy } from "../Enemy.js";

export class Goblin extends Enemy {
  constructor(
    name = "Goblin",
    maxHp = 10,
    power = 3,
    special = "stumbles",
    target = "Player",
    specialTarget = "Goblin",
    luck = 0.1,
  ) {
    super(name, maxHp, power, special, target, specialTarget, luck);
  }

  attack(target) {
    console.log(`\n👹 ${this.getName()} swings a rusty blade at ${target.getName()}!`);
    target.takeDamage(this.getAttackPower());
  }

  special() {
    console.log(`\n⚡ ${this.getName()} ${this.getSpecialName()} and takes 2 damage`);
    this.takeDamage(2);
  }
}
