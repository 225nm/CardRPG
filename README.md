# CardRPG (name in progress)

CardRPG is a turn based deckbuilder RPG built using Javascript in Node and uses standard playing cards and dice.

- Spades represent physical attacks.
- Hearts represent healing
- Diamonds represent armor
- Clubs represent special attacks

# Dependencies

- decklib: https://github.com/225nm/decklib
- dice-rng-toolkit: https://github.com/ThJoker3/Dice-RNG-Toolkit

# Installation
## Open a terminal in the folder where you want the game to exist, git bash recommended and enter the following commands:
### Clone the repo
```
git clone https://github.com/225nm/CardRPG.git
```
### Install dependencies
``` install dependencies
npm i
```
### Start the game
``` start the game
npm start
```

# Controls
Use the number keys to select cards to play or rewards.
Press q to exit the game.

# Project Vision

This applications purpose is to provide a light-weight and minimalistic gaming experience that uses traditional playing cards in a more exciting and unique manner through turn based Roleplaying game combat.

The application will be written in plain JS and includes at minimum two student created modules, including my own; DeckLib.

AI agents and tools will be used to assist with the programming, especially with the visual aspects of the application as well as with writing tests of the applications.

# Base requirement list

- The player deck should be improved with rewards from defeating enemies.
- There should be multiple enemies to fight.
- Game logic and data should be presented in a clear manner.
- Cards should perform different effects when played.

# Automatic unit tests

```
npm run test
```
