import { QuitRequestedError } from "./src/errors/QuitRequestedError.js";
import { GameLog } from "./src/views/GameLog.js";
import { GameController } from "./src/controllers/GameController.js";

async function main() {
  const gameLog = new GameLog();

  try {
    await new GameController(gameLog).run();
  } catch (error) {
    if (!(error instanceof QuitRequestedError)) {
      throw error;
    }
    gameLog.showGoodbye();
  }

  // Reading keys leaves stdin open, which would keep the process running.
  process.exit(0);
}

main();
