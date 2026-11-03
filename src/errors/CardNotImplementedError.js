// Thrown when creating a card whose effect has not been designed yet,
// instead of letting it into the game as a card that does nothing.
export class CardNotImplementedError extends Error {
  constructor(suit, rank) {
    super(`No effect is implemented for the ${rank} of ${suit} yet`);
    this.name = "CardNotImplementedError";
  }
}
