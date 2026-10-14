import { Randomizer, RandomGenerator } from "dice-rng-toolkit";

export class RewardLogic {
  #CommonCards;
  #UncommonCards;
  #RareCards;

  constructor(CommonCards = [], UncommonCards = [], RareCards = []) {
    this.#CommonCards = CommonCards;
    this.#UncommonCards = UncommonCards;
    this.#RareCards = RareCards;
  }

  generateRewards(amount = 3) {
    const randomizer = new Randomizer();
    const rng = new RandomGenerator();
    const rewardPool = [
      this.#CommonCards,
      this.#UncommonCards,
      this.#RareCards,
    ];
    const rewards = [];

    // Odds of a card of that specific rarity appearing. e.g. 0.6 = 60%
    const cWeight = 0.6;
    const uWeight = 0.3;
    const rWeight = 0.1;

    // Selects cards randomly from the correct pool based on the random roll from rng.nextFloat (0-1)
    for (let i = 0; i < amount; i++) {
      let roll = rng.nextFloat();
      let Pool = this.#CommonCards;
      if (roll < cWeight) {
        Pool = this.#CommonCards;
      } else if (roll < cWeight + uWeight) {
        Pool = this.#UncommonCards;
      } else if (roll < cWeight + uWeight + rWeight) {
        Pool = this.#RareCards;
      }

      const card = randomizer.pick(Pool, rng);
      rewards.push(card);
    }
    return rewards;
  }
}
