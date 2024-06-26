import { SnowmanLogic } from "./snowman.js";

/**
 * Model for Snowman game.
 * Inputs are max number of wrong responses that defaults to 5
 *
 * - maxWrong: total number of wrong guesses allowed
 * - game: logic for current  game
 * - $keyboard: DOM keyboard area
 * - $word: current DOM word display
 * - $image: current melting snowman picture
 *
 * Includes methods addKeyboard, updateWord, updateImage, updateGuess, updateLetter
 * handlesGuess and checkForOutcomeAndUpdateUI
 */
class SnowmanUI {
  constructor(maxWrong = 5) {
    console.debug("Snowman UI");

    this.maxWrong = maxWrong;
    this.game = new SnowmanLogic(maxWrong);
    this.handleGuessBound = null;

    this.$keyboard = document.querySelector("#Snowman-keyboard");
    this.$word = document.querySelector("#Snowman-word");
    this.$image = document.querySelector("#Snowman-image");

    this.updateWord();
    this.addKeyboard();
  }

  /** Add keys to keyboard area and register single eaent listener for area.  */

  addKeyboard() {
    console.debug("addKeyboard");

    const $letters = [..."abcdefghijklmnopqrstuvwxyz"].map(
      letter => {
        const $letter = document.createElement("button");
        $letter.classList.add("letter");
        $letter.dataset.letter = letter;
        $letter.innerText = letter;
        return $letter;
      },
    );

    this.$keyboard.append(...$letters);

    this.handleGuessBound = this.handleGuess.bind(this)

    this.$keyboard.addEventListener("click", this.handleGuessBound);
  }

  /** Update guessed word on board. */

  updateWord() {
    console.debug("updateWord");

    this.$word.innerText = this.game.getGuessedWord();
  }

  /** Update image after a bad guess. */

  updateImage() {
    console.debug("updateImage");

    this.$image.src = `${this.game.numWrong}.png`;
  }

  /** Handle guessing a letter. */

  guessLetter(letter) {
    console.debug("guessLetter", letter);

    const isCorrect = this.game.guessLetter(letter); //TODO: what is this for?

    this.updateWord();
    this.updateImage();

    this.checkForOutcomeAndUpdateUI();

    if(this.game.gameState !== "PLAYING") this.endGame();
  }

  /** Handle clicking a letter button: disable button & handle guess. */

  handleGuess(evt) {
    console.debug("handleGuess");

    if (!evt.target.matches('button.letter')) {
      console.log('clicked between buttons oops');
      return;
    }
    const letter = evt.target.dataset.letter;

    evt.target.disabled = true;

    this.guessLetter(letter);
  }

  /* Check the gameState and update UI to display win or loss */
  checkForOutcomeAndUpdateUI() {
    if (this.game.gameState === "PLAYING") return;

    const $main = document.querySelector("#Snowman");
    const $outcomeArea = document.createElement("div");
    $outcomeArea.classList.add("Outcome-area");

    //WON
    if (this.game.gameState === "WON") {

      $outcomeArea.innerText = "CONGRATS!!!";
    } else {
      //LOST
      $outcomeArea.innerText = "You failed.";
      //this.endGame(); could put endGame here instead
    }

    $main.append($outcomeArea);
  }

  /* End game and stop button clicks */
  endGame(){
    this.$keyboard.removeEventListener("click", this.handleGuessBound);
  }
}

export { SnowmanUI };
