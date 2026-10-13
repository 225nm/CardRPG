export class CombatUI {
  constructor(player, enemy, deck, discard) {
    this.player = player;
    this.enemy = enemy;
    this.deck = deck;
    this.discard = discard;
  }

  render() {
    const width = 54;
    const line = "─".repeat(width);

    // ANSI Escape Codes, implements colours to output.
    const reset = "\x1b[0m";
    const green = "\x1b[32m";
    const red = "\x1b[31m";
    const cyan = "\x1b[36m";
    const yellow = "\x1b[33m";
    const bold = "\x1b[1m";

    // 1. Pad raw strings first so border alignments remain exact
    const hName = (this.player.name || "Player1").padEnd(13);
    const eName = (this.enemy.name || "Goblin").padEnd(13);
    const hHp = `${this.player.getHp()}/${this.player.maxHp}`.padEnd(7);
    const eHp = `${this.enemy.getHp()}/${this.enemy.maxHp}`.padEnd(7);
    const hArmour = String(this.player.getArmour()).padEnd(3);
    const deckCount = String(this.deck.remainingDeckSize()).padEnd(3);
    const discardCount = String(this.discard.getPileSize()).padEnd(3);

    // 2. Build layout text blocks
    const leftCol1 = ` HERO: ${hName}`.padEnd(26);
    const rightCol1 = ` ENEMY: ${eName}`.padEnd(27);

    const leftCol2 = ` HP: ${hHp} Armour: ${hArmour}`.padEnd(26);
    const rightCol2 = ` HP: ${eHp}`.padEnd(27);

    const leftCol3 = ` Deck: ${deckCount}`.padEnd(26);
    const rightCol3 = ` Discard: ${discardCount}`.padEnd(27);

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
