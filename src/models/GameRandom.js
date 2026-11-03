import { RandomGenerator, Randomizer, Dice } from "dice-rng-toolkit";

const DIE_SIDES = 6;

// Adapter over dice-rng-toolkit. The game asks for game-level randomness,
// and only this class knows that the toolkit needs its generator passed
// into every call. Pass a seed to replay the same random sequence.
export class GameRandom {
  #generator;
  #randomizer = new Randomizer();
  #d6 = new Dice(DIE_SIDES);

  constructor(seed = Date.now()) {
    this.#generator = new RandomGenerator(seed);
  }

  rollD6() {
    return this.#d6.roll(this.#generator);
  }

  // True with the given probability, e.g. 0.2 is true 20% of the time.
  succeeds(probability) {
    return this.#generator.nextBoolean(probability);
  }

  pick(items) {
    return this.#randomizer.pick(items, this.#generator);
  }

  // Each item's chance is proportional to the weight at the same position.
  pickWeighted(items, weights) {
    return this.#randomizer.pickWeighted(items, weights, this.#generator);
  }
}
