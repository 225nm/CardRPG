export class HandFullError extends Error {
  #maxHandSize;

  constructor(maxHandSize) {
    super(`Cannot add card: hand already holds the maximum of ${maxHandSize} cards`);
    this.name = "HandFullError";
    this.#maxHandSize = maxHandSize;
  }

  getMaxHandSize() {
    return this.#maxHandSize;
  }
}
