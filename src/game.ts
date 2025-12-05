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
  playerMoves: number[];
}

type GameUI = { header: HTMLElement; main: HTMLElement; footer: HTMLElement };

type GameState = {
  scene: string;
  moves: DanceMove[]; // Randomly generated array of moves
  currentMoveIndex: number;
  players: PlayerState[];
};

const TEMPO = 1000; // TODO: Replace with BPM
const NUMBER_OF_MOVES = 40;

const audio = new Audio("src/media/kick-snare-120-bpm.mp3");
audio.loop = true;

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

interface HitEval {
  // exclusive, i.e. [..49]
  label: string;
  percent: number;
  score: number;
}

const HIT_EVALS: HitEval[] = [
  {
    label: "Perfect!",
    percent: 0.05,
    score: 110,
  },
  {
    label: "Great!",
    percent: 0.1,
    score: 100,
  },
  {
    label: "Good",
    percent: 0.25,
    score: 75,
  },
  {
    label: "Poor",
    percent: 0.5,
    score: 20,
  },
  {
    label: "BAD!",
    percent: 1,
    score: 10,
  },
];

export class PosecadeGame {
  private ui: GameUI;
  private state: GameState;

  private mainTimeout: number | undefined;

  private START_TIME: number = Date.now();
  private currentIntervalTime: number = this.START_TIME;

  constructor(input: RCadeInputAdapter) {
    // Audio
    //const audioContext = new AudioContext();

    this.state = {
      scene: "title-screen",
      moves: [],
      currentMoveIndex: -1,
      players: [
        { score: 0, playerMoves: [] },
        { score: 0, playerMoves: [] },
      ],
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
        if (action === "A") {
          this.startRound();
        }
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
    this.state.players = [
      { score: 0, playerMoves: [] },
      { score: 0, playerMoves: [] },
    ];

    // Start playing music
    // TODO: Commented out
    audio.currentTime = 0;
    audio.play();

    // Reset current move index
    this.state.currentMoveIndex = 0;

    // Marquee: Populate div
    this.uiInitializeMoves(this.state.moves);

    let moveInterval = setInterval(() => {
      // increment current move
      this.state.currentMoveIndex++;
      console.log("Move Interval Time:", Date.now() - this.START_TIME);
      this.currentIntervalTime = Date.now(); // We want Date.now()!!!

      /*console.log("current move index: ", this.state.currentMoveIndex);
      console.log(
        "current move: ",
        this.state.moves[this.state.currentMoveIndex]
      );*/

      // display the current move
      //this.uiShowMove(this.state.moves[this.state.currentMoveIndex]);
      this.uiShowMove(this.state.currentMoveIndex);

      // TODO: if either player did not make the last move ... MINUS their score?

      if (this.state.currentMoveIndex === this.state.moves.length - 1) {
        // Done - go to score page
        clearInterval(moveInterval);
        audio.pause();
        //this.showScore();
      }
    }, TEMPO);

    // Show beginning of round
    //this.uiPlayRound();
  }

  makeMove(player: RCadePlayer, input: RCadeInput) {
    //console.log(player, input);
    // If it's correct - PLUS to the score - color in the input
    // If it's not correct - MINUS to the score - remove the input

    console.log("time:", Date.now() - this.currentIntervalTime);
    /*console.log("move made: player:");
    console.log(player);
    console.log("input:");
    console.log(input);*/

    const moveNum = this.state.currentMoveIndex;
    const currentMoveDelta = Date.now() - this.currentIntervalTime;

    let evalLabel = "LAZY!";
    let playerHitEval: HitEval | null = null;
    // Calculate the eval
    if (input !== this.state.moves[moveNum].word) {
      evalLabel = "WRONG!";
    } else {
      HIT_EVALS.some((hitEval: HitEval) => {
        if (currentMoveDelta <= TEMPO * hitEval.percent) {
          evalLabel = hitEval.label;
          playerHitEval = hitEval;
          return true;
        }
      });
    }
    console.log(evalLabel);

    // Prevents players from hitting it more than once per beat
    if (
      (player === "P1" && !this.state.players[0].playerMoves[moveNum]) ||
      (player === "P2" && !this.state.players[1].playerMoves[moveNum])
    ) {
      if (player === "P1") {
        // Update eval label
        const p1EvalLabel = document.getElementById("p1-eval-label");
        if (p1EvalLabel) {
          p1EvalLabel.innerText = evalLabel;
        }
      } else {
        const p2EvalLabel = document.getElementById("p2-eval-label");
        if (p2EvalLabel) {
          p2EvalLabel.innerText = evalLabel;
        }
      }

      // Find the delta of the time
      if (player === "P1") {
        //console.log(player + " HIT " + input);

        // Player has hit ANYTHING
        this.state.players[0].playerMoves[moveNum] = 1; // TODO: Make this the delta?

        if (input === this.state.moves[moveNum].word) {
          // And player has not hit this one

          if (playerHitEval) {
            // TODO: FIX THIS
            // @ts-ignore
            this.state.players[0].score += playerHitEval.score;
          }
          // Set: Player has hit this. This can even be the delta
          // Update UI (split into UI function?)
          const p1Score = document.getElementById("p1Score");
          if (p1Score) {
            p1Score.innerHTML = this.state.players[0].score.toString();
          }

          // Add a class to the current number
          const p1Move = document.getElementById("move-p1-" + moveNum);
          p1Move?.classList.add("isHit");
        }
      } else {
        // Player has hit ANYTHING
        this.state.players[1].playerMoves[moveNum] = 1; // TODO: Make this the delta?

        if (input === this.state.moves[moveNum].word) {
          if (playerHitEval) {
            // TODO: FIX THIS
            // @ts-ignore
            this.state.players[1].score += playerHitEval.score;
          }
          const p2Score = document.getElementById("p2Score");

          if (p2Score) {
            p2Score.innerHTML = this.state.players[1].score.toString();
          }

          // Add a class to the current number
          const p2Move = document.getElementById("move-p2-" + moveNum);
          p2Move?.classList.add("isHit");
        }
      }
    }
  }

  showScore() {
    this.state.scene = "score-screen";
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
    const p1MovesContainer = document.createElement("div");
    const p2MovesContainer = document.createElement("div");
    const p1MovesContainerParent = document.createElement("div");
    const p2MovesContainerParent = document.createElement("div");
    const p1EvalLabel = document.createElement("div");
    const p2EvalLabel = document.createElement("div");

    movesContainer.id = "moves-container";

    p1MovesContainerParent.classList.add("move-container-parent");
    p2MovesContainerParent.classList.add("move-container-parent");

    p1MovesContainer.id = "p1-moves-container";
    p2MovesContainer.id = "p2-moves-container";

    p1EvalLabel.id = "p1-eval-label";
    p2EvalLabel.id = "p2-eval-label";
    p1EvalLabel.classList.add("eval-label");
    p2EvalLabel.classList.add("eval-label");

    // fixed boxes on top of moves
    const p1CurrentMoveBox = document.createElement("div");
    p1CurrentMoveBox.id = "p1-current-move-box";
    const p2CurrentMoveBox = document.createElement("div");
    p2CurrentMoveBox.id = "p2-current-move-box";

    p1MovesContainer.appendChild(p1CurrentMoveBox);
    p2MovesContainer.appendChild(p2CurrentMoveBox);

    // Display scores
    const p1Score = document.createElement("p");
    p1Score.id = "p1Score";
    p1Score.innerHTML = "0";

    const p2Score = document.createElement("p");
    p2Score.id = "p2Score";
    p2Score.innerHTML = "0";

    for (let i = 0; i < moves.length; i++) {
      const p1Move = document.createElement("div");
      p1Move.className = "move-box";
      p1Move.innerHTML = moves[i].symbol;
      p1Move.id = `move-p1-${i}`;
      p1MovesContainer.appendChild(p1Move);

      const p2Move = document.createElement("div");
      p2Move.className = "move-box";
      p2Move.innerHTML = moves[i].symbol;
      p2Move.id = `move-p2-${i}`;
      p2MovesContainer.appendChild(p2Move);
    }

    this.ui.header.replaceChildren(p1Score, p2Score);

    p1MovesContainerParent.append(p1EvalLabel, p1MovesContainer);
    p2MovesContainerParent.append(p2MovesContainer, p2EvalLabel);

    this.ui.main.innerHTML = "";
    movesContainer.append(p1MovesContainerParent, p2MovesContainerParent);
    this.ui.main.appendChild(movesContainer);
  }

  uiShowMove(moveNum: number) {
    // Scroll to move-n
    const p1Move = document.getElementById("move-p1-" + moveNum);
    p1Move?.scrollIntoView({
      behavior: "smooth",
    });
    const p2Move = document.getElementById("move-p2-" + moveNum);
    p2Move?.scrollIntoView({
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

    if (p1Score > p2Score) {
      title.innerHTML = "P1 Wins!";
    } else if (p1Score < p2Score) {
      title.innerHTML = "P2 Wins!";
    } else {
      title.innerHTML = "Tie!";
    }

    const subtitle = document.createElement("p");
    subtitle.id = "subtitle";
    subtitle.innerHTML = "Press A to play again";

    this.ui.main.replaceChildren(title, subtitle);
  }
}
