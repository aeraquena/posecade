import { PLAYER_1, PLAYER_2 } from "@rcade/plugin-input-classic";

export type RCadePlayer = "P1" | "P2";
export type RCadeInput = "Up" | "Down" | "Left" | "Right" | "A" | "B";

export type RCadeInputEvent = {
  player: RCadePlayer;
  input: RCadeInput;
};

type RCadeInputState = {
  P1Up: boolean;
  P1Down: boolean;
  P1Left: boolean;
  P1Right: boolean;
  P1A: boolean;
  P1B: boolean;
  P2Up: boolean;
  P2Down: boolean;
  P2Left: boolean;
  P2Right: boolean;
  P2A: boolean;
  P2B: boolean;
};

export class RCadeInputAdapter {
  private prev;
  // private released;
  public inputPressedHandler: (e: RCadeInputEvent) => void;

  constructor() {
    const init = {
      P1Up: false,
      P1Down: false,
      P1Left: false,
      P1Right: false,
      P1A: false,
      P1B: false,
      P2Up: false,
      P2Down: false,
      P2Left: false,
      P2Right: false,
      P2A: false,
      P2B: false,
    };
    this.prev = init;
    // this.released = Object.fromEntries(entries);

    this.inputPressedHandler = () => {};
  }

  onInput(handler: (event: RCadeInputEvent) => void) {
    this.inputPressedHandler = handler;
  }

  // Called after each frame to update edge detection state
  postUpdate() {
    // Detect releases (was pressed last frame, not pressed now)
    // this.released.up = this.prev.up && !PLAYER_1.DPAD.up
    // this.released.down = this.prev.down && !PLAYER_1.DPAD.down
    // this.released.left = this.prev.left && !PLAYER_1.DPAD.left
    // this.released.right = this.prev.right && !PLAYER_1.DPAD.right

    // Store current as previous for next frame
    const state: RCadeInputState = {
      P1Up: PLAYER_1.DPAD.up,
      P1Down: PLAYER_1.DPAD.down,
      P1Left: PLAYER_1.DPAD.left,
      P1Right: PLAYER_1.DPAD.right,
      P1A: PLAYER_1.A,
      P1B: PLAYER_1.B,
      P2Up: PLAYER_2.DPAD.up,
      P2Down: PLAYER_2.DPAD.down,
      P2Left: PLAYER_2.DPAD.left,
      P2Right: PLAYER_2.DPAD.right,
      P2A: PLAYER_2.A,
      P2B: PLAYER_2.B,
    };

    if (state.P1Up && this.prev.P1Up) {
      this.inputPressedHandler({ player: "P1", input: "Up" });
    }

    if (state.P1Down && this.prev.P1Down) {
      this.inputPressedHandler({ player: "P1", input: "Down" });
    }

    if (state.P1Left && this.prev.P1Left) {
      this.inputPressedHandler({ player: "P1", input: "Left" });
    }

    if (state.P1Right && this.prev.P1Right) {
      this.inputPressedHandler({ player: "P1", input: "Right" });
    }

    if (state.P1A && this.prev.P1A) {
      this.inputPressedHandler({ player: "P1", input: "A" });
    }

    if (state.P1B && this.prev.P1B) {
      this.inputPressedHandler({ player: "P1", input: "B" });
    }

    if (state.P2Up && this.prev.P2Up) {
      this.inputPressedHandler({ player: "P2", input: "Up" });
    }

    if (state.P2Down && this.prev.P2Down) {
      this.inputPressedHandler({ player: "P2", input: "Down" });
    }

    if (state.P2Left && this.prev.P2Left) {
      this.inputPressedHandler({ player: "P2", input: "Left" });
    }

    if (state.P2Right && this.prev.P2Right) {
      this.inputPressedHandler({ player: "P2", input: "Right" });
    }

    if (state.P2A && this.prev.P2A) {
      this.inputPressedHandler({ player: "P2", input: "A" });
    }

    if (state.P2B && this.prev.P2B) {
      this.inputPressedHandler({ player: "P2", input: "B" });
    }

    this.prev = state;
  }
}
