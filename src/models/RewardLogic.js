// Chance of each rarity per reward, e.g. 0.6 = 60%.
const COMMON_WEIGHT = 0.6;
const UNCOMMON_WEIGHT = 0.3;
const RARE_WEIGHT = 0.1;

export class RewardLogic {
  #commonCards;
  #uncommonCards;
  #rareCards;
  #random;

  constructor(commonCards, uncommonCards, rareCards, random) {
    this.#commonCards = commonCards;
    this.#uncommonCards = uncommonCards;
    this.#rareCards = rareCards;
    this.#random = random;
  }

  generateRewards(amount = 3) {
    return Array.from({ length: amount }, () => this.#pickReward());
  }

  #pickReward() {
    const pool = this.#pickRarityPool();
    return this.#random.pick(pool);
  }

  #pickRarityPool() {
    return this.#random.pickWeighted(
      [this.#commonCards, this.#uncommonCards, this.#rareCards],
      [COMMON_WEIGHT, UNCOMMON_WEIGHT, RARE_WEIGHT],
    );
  }
}
