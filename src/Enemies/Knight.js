import { Enemy } from "../Enemy.js";

export class Knight extends Enemy {
  constructor(
    name = "Knight",
    maxHp = 25,
    power = 5,
    special = "Sword Slash",
    target = "Player",
    specialTarget = "Player",
    luck = 0.2,
  ) {
    super(name, maxHp, power, special, target, specialTarget, luck);
  }

  attack(target) {
    console.log(
      `\n🤺 ${this.getName()} swings his blade at ${target.getName()}!`,
    );
    target.takeDamage(this.getPower());
  }

  special(target) {
    console.log(
      `\n⚡ ${this.getName()} used ${this.getSpecialName()} and dealt 8 damage`,
    );
    target.takeDamage(8);
  }
}
