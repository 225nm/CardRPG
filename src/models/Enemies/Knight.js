import { Enemy } from "../Enemy.js";
import { GameEvent } from "../../events/GameEvents.js";

const SWORD_SLASH_DAMAGE = 8;

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
    this.notify(GameEvent.ENEMY_ATTACKED, { enemy: this, target });
    target.takeDamage(this.getPower());
  }

  special(target) {
    this.notify(GameEvent.ENEMY_USED_SPECIAL, {
      enemy: this,
      damage: SWORD_SLASH_DAMAGE,
    });
    target.takeDamage(SWORD_SLASH_DAMAGE);
  }
}
