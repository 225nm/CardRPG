// Thrown from any prompt when the player presses the quit key, so quitting
// works on every screen without each prompt having to handle it.
export class QuitRequestedError extends Error {
  constructor(quitKey) {
    super(`Player pressed the quit key "${quitKey}"`);
    this.name = "QuitRequestedError";
  }
}
