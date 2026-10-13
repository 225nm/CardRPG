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
    console.log(`\n👹 ${this.name} swings a rusty blade at ${target.name}!`);
    target.takeDamage(this.attackPower);
  }

  special() {
    console.log(`\n⚡ ${this.name} ${this.specialName} and takes 2 damage`);
    this.takeDamage(2)
  }
}
