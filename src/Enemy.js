// Base class for enemies. Hp = health points. Luck is used for chance to use special attack.
export class Enemy {
  constructor(name, maxHp, power, specialName, target, specialTarget, luck) {
    this.name = name
    this.maxHp = maxHp
    this.hp = maxHp
    this.attackPower = power
    this.specialName = specialName
    this.target = target
    this.specialTarget = specialTarget
    this.luck = luck
  }

  getHp() {
    return this.hp
  }

  isAlive() {
    return this.hp > 0
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount)
    console.log(`🗡️ ${this.name} takes ${amount} damage! (HP: ${this.hp}/${this.maxHp})`);
  }

  takeTurn(player, rng) {
    const luckRoll = rng.nextFloat()
    if (luckRoll < this.luck) {
      this.special()
    }
    else {
      this.attack(player)
    }
  }

  attack(target) {

  }

  special(specialTarget) {

  }
}