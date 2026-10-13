import { Card, Deck, DiscardPile, Hand, Shuffler } from "DeckLib";
import { RandomGenerator, Dice, DiceExpression, RollResult, Randomizer } from 'dice-rng-toolkit';
import { starterDeck } from "./src/starterDeck.js"
const rng = new RandomGenerator()
const randomizer = new Randomizer()
const d6 = new Dice()
const stdRoll = d6.roll(rng)

const shuffledDeck = randomizer.shuffle(starterDeck, rng)
console.log(starterDeck)
console.log(shuffledDeck)


console.log(d6.roll(rng))
console.log(d6.roll(rng))
console.log(d6.roll(rng))
console.log(stdRoll)



console.log(randomizer.pick(starterDeck, rng))