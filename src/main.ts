import "./style.css";
import { PLAYER_1, SYSTEM } from "@rcade/plugin-input-classic";
import { RCadeInputAdapter } from "./RCadeInputAdapter";
import { PosecadeGame } from "./game";

/*const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <h1>Posecade</h1>
  <p id="status">Press 1P START</p>
  <div id="controls"></div>
`;

const status = document.querySelector<HTMLParagraphElement>("#status")!;*/

let inputAdapter = new RCadeInputAdapter();
let game = new PosecadeGame(inputAdapter);

let gameStarted = false;

function setup() {
  update();
}

function update() {
  if (!gameStarted) {
    if (SYSTEM.ONE_PLAYER) {
      gameStarted = true;
      game.startRound();
    }
  } else {
    inputAdapter.postUpdate();
  }

  requestAnimationFrame(update);
}

setup();
