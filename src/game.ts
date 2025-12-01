import {
  RCadeInputAdapter,
  type RCadePlayer,
  type RCadeInput,
  type RCadeInputEvent,
} from "./RCadeInputAdapter";

type GameUI = { header: HTMLElement; main: HTMLElement; footer: HTMLElement };

type GameState = {
  scene: string;
  moves: string[]; // Randomly generated array of moves
};

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

  // Start a round of the rhythm game
  startRound() {
    console.log("start round!");
    this.state.scene = "play-round";
    this.state.moves = []; // Do a random assortment

    // Reset the moves
    //this.uiPromptMove();
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
}
