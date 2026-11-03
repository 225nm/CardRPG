// Character widths of the status box. Values are padded to these widths so
// the borders line up no matter how long the names and numbers are.
const NAME_WIDTH = 13;
const HP_WIDTH = 7;
const COUNT_WIDTH = 3;
const LEFT_COLUMN_WIDTH = 26;
const RIGHT_COLUMN_WIDTH = 27;
const COLUMN_DIVIDER_WIDTH = 1;
const boxInnerWidth =
  LEFT_COLUMN_WIDTH + COLUMN_DIVIDER_WIDTH + RIGHT_COLUMN_WIDTH;

export class CombatUI {
  #player;
  #enemy;
  #deck;
  #discard;

  constructor(player, enemy, deck, discard) {
    this.#player = player;
    this.#enemy = enemy;
    this.#deck = deck;
    this.#discard = discard;
  }

  render() {
    const line = "─".repeat(boxInnerWidth);

    // ANSI Escape Codes, implements colours to output.
    const reset = "\x1b[0m";
    const green = "\x1b[32m";
    const red = "\x1b[31m";
    const cyan = "\x1b[36m";
    const yellow = "\x1b[33m";
    const bold = "\x1b[1m";

    // 1. Pad raw strings first so border alignments remain exact
    const hName = (this.#player.getName() || "Player1").padEnd(NAME_WIDTH);
    const eName = (this.#enemy.getName() || "Goblin").padEnd(NAME_WIDTH);
    const hHp = `${this.#player.getHp()}/${this.#player.getMaxHp()}`.padEnd(
      HP_WIDTH,
    );
    const eHp = `${this.#enemy.getHp()}/${this.#enemy.getMaxHp()}`.padEnd(
      HP_WIDTH,
    );
    const hArmour = String(this.#player.getArmour()).padEnd(COUNT_WIDTH);
    const deckCount = String(this.#deck.remainingDeckSize()).padEnd(
      COUNT_WIDTH,
    );
    const discardCount = String(this.#discard.getPileSize()).padEnd(
      COUNT_WIDTH,
    );

    // 2. Build layout text blocks
    const leftCol1 = ` HERO: ${hName}`.padEnd(LEFT_COLUMN_WIDTH);
    const rightCol1 = ` ENEMY: ${eName}`.padEnd(RIGHT_COLUMN_WIDTH);

    const leftCol2 = ` HP: ${hHp} Armour: ${hArmour}`.padEnd(LEFT_COLUMN_WIDTH);
    const rightCol2 = ` HP: ${eHp}`.padEnd(RIGHT_COLUMN_WIDTH);

    const leftCol3 = ` Deck: ${deckCount}`.padEnd(LEFT_COLUMN_WIDTH);
    const rightCol3 = ` Discard: ${discardCount}`.padEnd(RIGHT_COLUMN_WIDTH);

    // 3. Render with ANSI color wrappers applied to full sections
    console.log(`\n┌${line}┐`);
    console.log(
      `│${bold}${green}${leftCol1}${reset}│${bold}${red}${rightCol1}${reset}│`,
    );
    console.log(`│${green}${leftCol2}${reset}│${red}${rightCol2}${reset}│`);
    console.log(`├${line}┤`);
    console.log(`│${cyan}${leftCol3}${reset}│${yellow}${rightCol3}${reset}│`);
    console.log(`└${line}┘`);
  }
}
