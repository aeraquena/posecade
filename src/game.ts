import {
  RCadeInputAdapter,
  type RCadePlayer,
  type RCadeInput,
  type RCadeInputEvent,
} from "./RCadeInputAdapter";

interface DanceMove {
  word: string;
  symbol: string;
}

type GameUI = { header: HTMLElement; main: HTMLElement; footer: HTMLElement };

type GameState = {
  scene: string;
  moves: DanceMove[][]; // Randomly generated array of moves
};

const DANCE_MOVES: DanceMove[] = [
  { word: "Up", symbol: "↑" },
  { word: "Down", symbol: "↓" },
  { word: "Left", symbol: "←" },
  { word: "Right", symbol: "→" },
];

const LETTER_MOVES: DanceMove[] = [
  { word: "A", symbol: "A" },
  { word: "B", symbol: "B" },
];

const NUMBER_OF_MOVES = 20;

export class PosecadeGame {
  private ui: GameUI;
  private state: GameState;

  private mainTimeout: number | undefined;

  constructor(input: RCadeInputAdapter) {
    // Audio
    //const audioContext = new AudioContext();

    this.state = {
      scene: "title-screen",
      moves: [],
    };

    const h = document.createElement("header");
    document.body.appendChild(h);

    const m = document.createElement("main");
    document.body.appendChild(m);

    const f = document.createElement("footer");
    document.body.appendChild(f);

    this.ui = {
      header: h,
      main: m,
      footer: f,
    };

    input.onInput((e) => {
      // If game idle for 1 min, return to title screen
      if (this.mainTimeout) {
        clearTimeout(this.mainTimeout);
      }
      this.mainTimeout = setTimeout(() => {
        this.resetGame();
      }, 30000);

      //   const key = event.code;
      //   const binding = BINDINGS[key];
      //   if (!binding) return;

      //   const player = e.player;
      //   const action = e.input;

      this.handleAction(e.player, e.input);
    });

    this.resetGame();
  }

  handleAction(player: RCadePlayer, action: RCadeInput) {
    console.log("player: ", player, "action: ", action);
    switch (this.state.scene) {
      case "title-screen":
        break;
      case "play-round":
        this.makeMove(player, action);
        break;
      default:
        break;
    }
  }

  resetGame() {
    console.log("reset game!");
    this.state.scene = "title-screen";
    this.uiTitleScreen();
  }

  generateMoves() {
    return Array.from({ length: NUMBER_OF_MOVES }, () => {
      const move1 = Math.floor(Math.random() * 4);
      let move2 = Math.floor(Math.random() * 2);
      /*while (move2 === -1 || move2 === move1) {
        move2 = Math.floor(Math.random() * 4);
      }*/
      return [DANCE_MOVES[move1], LETTER_MOVES[move2]];
    });
  }

  // Start a round of the rhythm game
  startRound() {
    console.log("start round!");
    this.state.scene = "play-round";
    this.state.moves = this.generateMoves();

    // Start playing music
    const audio = new Audio("media/drumloop.wav");
    audio.play();

    let currentMove = 0;

    console.log(this.state.moves);

    setInterval(() => {
      // display the current move
      this.uiShowMove(this.state.moves[currentMove]);
      currentMove++;
    }, 500); // TODO: Replace with BPM

    // Show beginning of round
    this.uiPlayRound();
  }

  makeMove(player: RCadePlayer, input: RCadeInput) {
    console.log(player, input);
    // If it's correct - color in the input
    // If it's not correct - display some bad thing
    // Maybe we need a game state - what's the current thing on screen
  }

  uiTitleScreen() {
    this.ui.header.className = "title-screen";
    this.ui.main.className = "title-screen";
    this.ui.footer.className = "title-screen";

    const title = document.createElement("p");
    title.id = "title";
    title.innerHTML = "POSECADE";

    const subtitle = document.createElement("p");
    subtitle.id = "subtitle";
    subtitle.innerHTML = "press P1 to start";

    this.ui.main.replaceChildren(title, subtitle);
  }

  uiPlayRound() {
    this.ui.header.className = "play-round";
    this.ui.main.className = "play-round";
    this.ui.footer.className = "play-round";

    const title = document.createElement("p");
    title.id = "title";
    title.innerHTML = "DANCE!";

    // HEADER
    this.ui.main.replaceChildren(title);
  }

  uiShowMove(move: DanceMove[]) {
    const title = document.createElement("p");
    title.id = "move";
    title.innerHTML =
      move[0].symbol + move[1].symbol + " " + move[0].symbol + move[1].symbol;

    this.ui.main.replaceChildren(title);
  }
}
