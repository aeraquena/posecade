import {
  RCadeInputAdapter,
  type RCadePlayer,
  type RCadeInput,
} from "./RCadeInputAdapter";

interface DanceMove {
  word: string;
  symbol: string;
}

interface PlayerState {
  score: number;
}

type GameUI = { header: HTMLElement; main: HTMLElement; footer: HTMLElement };

type GameState = {
  scene: string;
  moves: DanceMove[]; // Randomly generated array of moves
  currentMoveIndex: number;
  players: PlayerState[];
};

const TEMPO = 1000; // TODO: Replace with BPM

// current move pair: <-. A
// player:
//   score:
//   have they hit left?
//   have they hit right?
// maybe we don't even have to hit it... just calculate on the fly and add score

// in the moment, we calculate the timing diff and add to the score

const DANCE_MOVES: DanceMove[] = [
  { word: "Up", symbol: "↑" },
  { word: "Down", symbol: "↓" },
  { word: "Left", symbol: "←" },
  { word: "Right", symbol: "→" },
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
      currentMoveIndex: -1,
      players: new Array(2).fill(this.initializePlayer()),
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

      this.handleAction(e.player, e.input);
    });

    this.resetGame();
  }

  initializePlayer() {
    return { score: 0 };
  }

  handleAction(player: RCadePlayer, action: RCadeInput) {
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
    this.state.scene = "title-screen";
    this.uiTitleScreen();
  }

  generateMoves() {
    return Array.from({ length: NUMBER_OF_MOVES }, () => {
      const move1 = Math.floor(Math.random() * 4);
      return DANCE_MOVES[move1];
    });
  }

  // Start a round of the rhythm game
  startRound() {
    this.state.scene = "play-round";
    this.state.moves = this.generateMoves();

    console.log(this.state.moves);

    // Start playing music
    //const audio = new Audio("media/drumloop.wav");
    //audio.play();

    // Reset current move index
    this.state.currentMoveIndex = -1;

    let moveInterval = setInterval(() => {
      // increment current move
      this.state.currentMoveIndex++;

      // display the current move
      this.uiShowMove(this.state.moves[this.state.currentMoveIndex]);

      // TODO: if either player did not make the last move ... MINUS their score?
      if (this.state.currentMoveIndex === this.state.moves.length) {
        // Done - go to score page
        clearInterval(moveInterval);
        this.resetGame();
      }
    }, TEMPO);

    // Show beginning of round
    this.uiPlayRound();
  }

  makeMove(player: RCadePlayer, input: RCadeInput) {
    //console.log(player, input);
    // If it's correct - PLUS to the score - color in the input
    // If it's not correct - MINUS to the score - remove the input

    if (input === this.state.moves[this.state.currentMoveIndex].word) {
      console.log(player + " HIT " + input);
      if (player === "P1") {
        this.state.players[0].score += 100;
        const p1Score = document.getElementById("p1Score");
        if (p1Score) {
          p1Score.innerHTML = this.state.players[0].score.toString();
        }
      } else {
        this.state.players[1].score += 100;
        const p2Score = document.getElementById("p2Score");
        if (p2Score) {
          p2Score.innerHTML = this.state.players[1].score.toString();
        }
      }
    } else {
      console.log(
        "WRONG MOVE! Got " + input,
        " expected " + this.state.moves[this.state.currentMoveIndex].word
      );
    }
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

    // Display scores
    const p1Score = document.createElement("p");
    p1Score.id = "p1Score";
    p1Score.innerHTML = "0";

    const p2Score = document.createElement("p");
    p2Score.id = "p2Score";
    p2Score.innerHTML = "0";

    const title = document.createElement("p");
    title.id = "title";
    title.innerHTML = "DANCE!";

    // HEADER
    this.ui.header.replaceChildren(p1Score, p2Score);
    this.ui.main.replaceChildren(title);
  }

  uiShowMove(move: DanceMove) {
    const title = document.createElement("p");
    title.id = "move";
    title.innerHTML = move.symbol + " " + move.symbol;

    this.ui.main.replaceChildren(title);
  }
}
