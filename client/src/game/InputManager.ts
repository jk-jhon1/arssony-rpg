// Grimório de Cinza: entradas semânticas mantêm o combate direto, tátil e independente da camada visual.
import type { WeaponId } from "./weapons";

export type ArssonyCommand =
  | { type: "start" }
  | { type: "attack" }
  | { type: "weapon"; weapon: WeaponId }
  | { type: "cycle" };

export class InputManager {
  private readonly canvas: HTMLCanvasElement;
  private readonly pressed = new Set<string>();
  private weaponRequest: WeaponId | null = null;
  private cycleRequest = false;
  private attackRequest = false;
  private startRequest = false;
  private virtualMovement = { x: 0, z: 0 };
  private virtualAttack = false;
  private readonly onKeyDown: (event: KeyboardEvent) => void;
  private readonly onKeyUp: (event: KeyboardEvent) => void;
  private readonly onPointerDown: () => void;
  private readonly onCommand: (event: Event) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.onKeyDown = (event) => {
      const controlled = ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "KeyQ", "Digit1", "Digit2", "Digit3", "Digit4"];
      if (controlled.includes(event.code)) event.preventDefault();
      if (event.code === "Space" && !event.repeat) this.attackRequest = true;
      if (event.code === "KeyQ" && !event.repeat) this.cycleRequest = true;
      const weaponByKey: Partial<Record<string, WeaponId>> = {
        Digit1: "sword",
        Digit2: "twins",
        Digit3: "bow",
        Digit4: "spear",
      };
      const requestedWeapon = weaponByKey[event.code];
      if (requestedWeapon && !event.repeat) this.weaponRequest = requestedWeapon;
      this.pressed.add(event.code);
    };
    this.onKeyUp = (event) => this.pressed.delete(event.code);
    this.onPointerDown = () => {
      this.attackRequest = true;
    };
    this.onCommand = (event) => {
      const command = (event as CustomEvent<ArssonyCommand>).detail;
      if (!command) return;
      if (command.type === "attack") this.attackRequest = true;
      if (command.type === "cycle") this.cycleRequest = true;
      if (command.type === "weapon") this.weaponRequest = command.weapon;
      if (command.type === "start") this.startRequest = true;
    };

    window.addEventListener("keydown", this.onKeyDown, { passive: false });
    window.addEventListener("keyup", this.onKeyUp);
    canvas.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("arssony-command", this.onCommand);
  }

  get movement() {
    const x = (this.pressed.has("KeyD") || this.pressed.has("ArrowRight") ? 1 : 0) - (this.pressed.has("KeyA") || this.pressed.has("ArrowLeft") ? 1 : 0) + this.virtualMovement.x;
    const z = (this.pressed.has("KeyW") || this.pressed.has("ArrowUp") ? 1 : 0) - (this.pressed.has("KeyS") || this.pressed.has("ArrowDown") ? 1 : 0) + this.virtualMovement.z;
    return { x: Math.max(-1, Math.min(1, x)), z: Math.max(-1, Math.min(1, z)) };
  }

  consumeAttack() {
    const result = this.attackRequest || this.virtualAttack;
    this.attackRequest = false;
    this.virtualAttack = false;
    return result;
  }

  consumeWeapon() {
    const result = this.weaponRequest;
    this.weaponRequest = null;
    return result;
  }

  consumeCycle() {
    const result = this.cycleRequest;
    this.cycleRequest = false;
    return result;
  }

  consumeStart() {
    const result = this.startRequest;
    this.startRequest = false;
    return result;
  }

  setDemoMovement(x: number, z: number) {
    this.virtualMovement = { x, z };
  }

  queueDemoAttack() {
    this.virtualAttack = true;
  }

  dispose() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("arssony-command", this.onCommand);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
  }
}
