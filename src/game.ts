import {
  RCadeInputAdapter,
  type RCadePlayer,
  type RCadeInput,
  type RCadeInputEvent,
} from "./RCadeInputAdapter";

type GameUI = { header: HTMLElement; main: HTMLElement; footer: HTMLElement };

type GameState = {
  scene: string;
  moves: string[][]; // Randomly generated array of moves
};

const DANCE_MOVES: string[] = ["Up", "Down", "Left", "Right"];

export class PosecadeGame {
  private ui: GameUI;
  private state: GameState;

  private mainTimeout: number | undefined;

  constructor(input: RCadeInputAdapter) {
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
    return Array.from({ length: 10 }, () => {
      const move1 = Math.floor(Math.random() * 4);
      let move2 = -1;
      while (move2 === -1 || move2 === move1) {
        move2 = Math.floor(Math.random() * 4);
      }
      return [DANCE_MOVES[move1], DANCE_MOVES[move2]];
    });
  }

  // Start a round of the rhythm game
  startRound() {
    console.log("start round!");
    this.state.scene = "play-round";
    this.state.moves = this.generateMoves();

    console.log(this.state.moves);

    // Reset the moves
    this.uiPlayRound();
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
    console.log("play round");
    this.ui.header.className = "play-round";
    this.ui.main.className = "play-round";
    this.ui.footer.className = "play-round";

    const title = document.createElement("p");
    title.id = "title";
    title.innerHTML = "DANCE!";

    // HEADER
    this.ui.main.replaceChildren(title);
  }
}
