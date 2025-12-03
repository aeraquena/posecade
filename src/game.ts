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

const TEMPO = 500; // TODO: Replace with BPM

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

const NUMBER_OF_MOVES = 50;

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
      players: [{ score: 0 }, { score: 0 }],
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

  handleAction(player: RCadePlayer, action: RCadeInput) {
    switch (this.state.scene) {
      case "title-screen":
        break;
      case "play-round":
        this.makeMove(player, action);
        break;
      case "score-screen":
        this.startRound();
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
    this.state.players = [{ score: 0 }, { score: 0 }];

    // Start playing music
    //const audio = new Audio("media/drumloop.wav");
    //audio.play();

    // Reset current move index
    this.state.currentMoveIndex = -1;

    // Marquee: Populate div
    this.uiInitializeMoves(this.state.moves);

    let moveInterval = setInterval(() => {
      // increment current move
      this.state.currentMoveIndex++;

      // display the current move
      //this.uiShowMove(this.state.moves[this.state.currentMoveIndex]);
      this.uiShowMove(this.state.currentMoveIndex);

      // TODO: if either player did not make the last move ... MINUS their score?

      if (this.state.currentMoveIndex === this.state.moves.length - 1) {
        // Done - go to score page
        clearInterval(moveInterval);
        this.showScore();
      }
    }, TEMPO);

    // Show beginning of round
    //this.uiPlayRound();
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

    console.log("p1score: ", this.state.players[0].score);
    console.log("p2score: ", this.state.players[1].score);
  }

  showScore() {
    this.uiScoreScreen();
  }

  /* UI Screens */

  uiTitleScreen() {
    this.ui.header.className = "title-screen";
    this.ui.main.className = "title-screen";
    this.ui.footer.className = "title-screen";

    const title = document.createElement("p");
    title.id = "title";
    title.innerHTML = "POSECADE";

    const subtitle = document.createElement("p");
    subtitle.id = "subtitle";
    subtitle.innerHTML = "press P1 to start<br/><br/>(work in progress!)";

    this.ui.main.replaceChildren(title, subtitle);
  }

  // Initialize marquee
  uiInitializeMoves(moves: DanceMove[]) {
    this.ui.header.className = "play-round";
    this.ui.main.className = "play-round";
    this.ui.footer.className = "play-round";

    // For every move...
    const movesContainer = document.createElement("div");
    movesContainer.id = "moves-container";

    const currentMoveBox = document.createElement("div");
    currentMoveBox.id = "current-move-box";

    movesContainer.appendChild(currentMoveBox);

    // Display scores
    const p1Score = document.createElement("p");
    p1Score.id = "p1Score";
    p1Score.innerHTML = "0";

    const p2Score = document.createElement("p");
    p2Score.id = "p2Score";
    p2Score.innerHTML = "0";

    for (let i = 0; i < moves.length; i++) {
      const thisMove = document.createElement("div");
      thisMove.innerHTML = moves[i].symbol;
      thisMove.id = "move-" + i;
      movesContainer.appendChild(thisMove);
    }

    this.ui.header.replaceChildren(p1Score, p2Score);

    this.ui.main.innerHTML = "";
    this.ui.main.appendChild(movesContainer);
  }

  uiShowMove(moveNum: number) {
    // Scroll to move-n
    const thisMove = document.getElementById("move-" + moveNum);
    thisMove?.scrollIntoView({
      behavior: "smooth",
    });
  }

  uiScoreScreen() {
    this.ui.header.className = "score-screen";
    this.ui.main.className = "score-screen";
    this.ui.footer.className = "score-screen";

    const title = document.createElement("p");
    title.id = "title";

    const p1Score = this.state.players[0].score;
    const p2Score = this.state.players[1].score;

    console.log("final p1score: ", p1Score);
    console.log("final p2score: ", p2Score);

    if (p1Score > p2Score) {
      title.innerHTML = "P1 Wins!";
    } else if (p1Score < p2Score) {
      title.innerHTML = "P2 Wins!";
    } else {
      title.innerHTML = "Tie!";
    }

    const subtitle = document.createElement("p");
    subtitle.id = "subtitle";
    subtitle.innerHTML = "Press any button to play again";

    this.ui.main.replaceChildren(title, subtitle);
  }
}
