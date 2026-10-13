import readline from "node:readline/promises";
import {stdin as input, stdout as output} from "node:process";
import { Card, Deck, DiscardPile, Hand, Shuffler } from "DeckLib";
import { Player } from "./src/Player.js";
import { RandomGenerator, Dice, DiceExpression, RollResult, Randomizer } from 'dice-rng-toolkit';
import { starterDeck } from "./src/starterDeck.js";

async function startGame() {
  const rl = readline.createInterface({input, output})
}

// Initialize random handlers
const rng = new RandomGenerator()
const randomizer = new Randomizer()
const shuffler = new Shuffler()

// Initialize dice logic
const d6 = new Dice()
const stdRoll = d6.roll(rng)

// Initialize player and deck handlers
const player = new Player("Player1", 30)
const deck = new Deck(starterDeck, shuffler)
const discard = new DiscardPile()

console.log("=== Welcome to CardRPG ===")


console.log(deck.getCards())
deck.shuffle()
console.log(deck.getCards())

console.log(d6.roll(rng))
console.log(d6.roll(rng))
console.log(d6.roll(rng))
console.log(stdRoll)

const drawnCards = deck.drawMultiple(3)
player.addCardToHand(drawnCards)
player.renderHand()

console.log(deck.getCards())