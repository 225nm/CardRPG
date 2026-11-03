import { Enemy } from "../Enemy.js";
import { GameEvent } from "../GameEvents.js";

const STUMBLE_SELF_DAMAGE = 2;

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
    this.notify(GameEvent.ENEMY_ATTACKED, { enemy: this, target });
    target.takeDamage(this.getPower());
  }

  special() {
    this.notify(GameEvent.ENEMY_USED_SPECIAL, {
      enemy: this,
      damage: STUMBLE_SELF_DAMAGE,
    });
    this.takeDamage(STUMBLE_SELF_DAMAGE);
  }
}
