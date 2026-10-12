import { Card, Deck, DiscardPile, Hand, Shuffler } from "DeckLib";

const deck = new Deck();       // shuffled standard 52-card deck
const discardPile = new DiscardPile(); // Discard pile for played cards
const hand = new Hand(deck.drawMultiple(5)); // A player hand with 5 drawn cards

hand.sortByValue(); // Sort the hand by value
console.log(hand.getCards());  // e.g. [2 of Hearts, 7 of Clubs, ...]

const [firstCard] = hand.getCards(); // Gets the first card in the hand
hand.playCard(firstCard, discardPile); // Plays the first card in the hand to the discardPile

console.log(deck.remainingDeckSize()); // Gets the remaining deck size
console.log(discardPile.getPileSize()); // Gets the discard pile size