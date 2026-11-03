import { GameCard } from "./GameCard.js";

export const CommonCards = [
  GameCard.heal("2"),
  GameCard.heal("3"),
  GameCard.heal("4"),
  GameCard.attack("2"),
  GameCard.attack("3"),
  GameCard.attack("4"),
  GameCard.armour("2"),
  GameCard.armour("3"),
  GameCard.armour("4"),
];
export const UncommonCards = [
  GameCard.heal("5"),
  GameCard.heal("6"),
  GameCard.attack("5"),
  GameCard.attack("6"),
  GameCard.armour("5"),
  GameCard.armour("6"),
  GameCard.drawTwo(),
];

export const RareCards = [
  GameCard.heal("7"),
  GameCard.heal("8"),
  GameCard.attack("7"),
  GameCard.attack("8"),
  GameCard.armour("7"),
  GameCard.armour("8"),
];
