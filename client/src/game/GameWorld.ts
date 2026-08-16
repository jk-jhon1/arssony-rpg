// Grimório de Cinza: o mundo coordena as quatro formas de combate em uma clareira de ruínas e estandartes rubros.
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene } from "@babylonjs/core/scene";
import { Enemy, type EnemyKind } from "./Enemy";
import { InputManager } from "./InputManager";
import { Player, type AttackEvent } from "./Player";
import { weapons } from "./weapons";

export interface HudState {
  started: boolean;
  health: number;
  maxHealth: number;
  arrows: number;
  weapon: keyof typeof weapons;
  objective: string;
  message: string;
  enemies: number;
}

interface Projectile {
  mesh: Mesh;
  direction: Vector3;
  damage: number;
  life: number;
}

interface Pulse {
  mesh: Mesh;
  life: number;
  material: StandardMaterial;
}

export class GameWorld {
  readonly player: Player;
  private readonly input: InputManager;
  private readonly enemies: Enemy[] = [];
  private readonly projectiles: Projectile[] = [];
  private readonly pulses: Pulse[] = [];
  private started: boolean;
  private demoTime = 0;
  private attackMessageTime = 0;
  private message = "O Círculo de Cinzas aguarda.";
  private hudTime = 0;

  constructor(private readonly scene: Scene, private readonly camera: ArcRotateCamera, canvas: HTMLCanvasElement, demo: boolean) {
    this.input = new InputManager(canvas);
    this.player = new Player(scene);
    this.started = demo;
    this.enemies.push(
      new Enemy(scene, "wisp", new Vector3(2.5, 0, 0.5)),
      new Enemy(scene, "wisp", new Vector3(4.6, 0, -3.6)),
      new Enemy(scene, "guardian", new Vector3(7.4, 0, 2.4)),
      new Enemy(scene, "guardian", new Vector3(1.6, 0, 6.5)),
    );
    this.emitHud();
  }

  start() {
    this.started = true;
    this.message = "Aço em mãos. O bosque observa.";
    this.emitHud();
  }

  update(delta: number) {
    if (!this.started && this.input.consumeStart()) this.start();
    if (!this.started) return;

    if (this.isDemo) this.updateDemo(delta);
    const event = this.player.update(delta, this.input, this.camera);
    if (event) this.performAttack(event);
    this.enemies.forEach((enemy) => enemy.update(delta, this.player.position, (damage) => this.hurtPlayer(damage)));
    this.updateProjectiles(delta);
    this.updatePulses(delta);
    this.attackMessageTime = Math.max(0, this.attackMessageTime - delta);
    this.hudTime -= delta;
    if (this.hudTime <= 0) {
      this.hudTime = 0.1;
      this.emitHud();
    }
    const target = this.player.position.add(new Vector3(0, 0.9, 0));
    this.camera.setTarget(Vector3.Lerp(this.camera.getTarget(), target, Math.min(1, delta * 4.6)));
  }

  private get isDemo() {
    return new URLSearchParams(window.location.search).has("demo");
  }

  private updateDemo(delta: number) {
    this.demoTime += delta;
    const step = Math.floor(this.demoTime / 3.1) % 4;
    this.input.setDemoMovement(step === 0 ? 0.26 : step === 1 ? 0.08 : 0, step === 2 ? 0.12 : 0.04);
    if (Math.abs((this.demoTime % 1.72) - 0.05) < delta * 1.4) {
      const ids: (keyof typeof weapons)[] = ["sword", "twins", "bow", "spear"];
      window.dispatchEvent(new CustomEvent("arssony-command", { detail: { type: "weapon", weapon: ids[step] } }));
      this.input.queueDemoAttack();
    }
  }

  private performAttack(event: AttackEvent) {
    const definition = weapons[event.weapon];
    this.message = event.weapon === "twins" ? "Duas lâminas, um juramento." : `${definition.label} em movimento.`;
    this.attackMessageTime = 0.8;
    this.makePulse(event.origin, definition.color, definition.range, definition.projectile ? 0.6 : 1);
    if (definition.projectile) {
      this.spawnArrow(event.origin, event.direction, definition.damage);
      return;
    }

    this.enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      const toEnemy = enemy.position.subtract(this.player.position);
      const flat = new Vector3(toEnemy.x, 0, toEnemy.z);
      const distance = flat.length();
      const forward = distance > 0 ? Vector3.Dot(flat.normalize(), event.direction) : 1;
      if (distance <= definition.range && forward > -0.12) {
        const multiplier = definition.hits === 2 ? 1.14 : 1;
        const slain = enemy.takeDamage(definition.damage * multiplier);
        if (slain) {
          this.player.heal(4);
          this.message = "Cinzas devolvidas ao bosque.";
        }
      }
    });
  }

  private spawnArrow(origin: Vector3, direction: Vector3, damage: number) {
    const arrow = MeshBuilder.CreateCylinder("ritual-arrow", { height: 0.95, diameter: 0.04, tessellation: 6 }, this.scene);
    arrow.position = origin.clone();
    arrow.rotation.z = Math.PI / 2;
    const material = new StandardMaterial("ritual-arrow-mat", this.scene);
    material.diffuseColor = Color3.FromHexString("#D39844");
    material.emissiveColor = Color3.FromHexString("#3E1606");
    arrow.material = material;
    this.projectiles.push({ mesh: arrow, direction: direction.normalize(), damage, life: 1.6 });
  }

  private updateProjectiles(delta: number) {
    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = this.projectiles[index];
      projectile.life -= delta;
      projectile.mesh.position.addInPlace(projectile.direction.scale(delta * 17));
      let hit = false;
      this.enemies.forEach((enemy) => {
        if (!enemy.alive || hit) return;
        if (Vector3.Distance(enemy.position.add(new Vector3(0, 1, 0)), projectile.mesh.position) < 1.15) {
          enemy.takeDamage(projectile.damage);
          hit = true;
          this.makePulse(projectile.mesh.position, Color3.FromHexString("#D39844"), 1.1, 0.45);
        }
      });
      if (projectile.life <= 0 || hit) {
        projectile.mesh.dispose(false, true);
        this.projectiles.splice(index, 1);
      }
    }
  }

  private makePulse(origin: Vector3, color: Color3, size: number, duration: number) {
    const pulse = MeshBuilder.CreateTorus("combat-pulse", { diameter: Math.max(0.9, size * 0.6), thickness: 0.055, tessellation: 24 }, this.scene);
    pulse.position = origin.clone();
    pulse.position.y = 0.12;
    pulse.rotation.x = Math.PI / 2;
    const material = new StandardMaterial("combat-pulse-mat", this.scene);
    material.emissiveColor = color;
    material.diffuseColor = color;
    material.alpha = 0.9;
    pulse.material = material;
    this.pulses.push({ mesh: pulse, life: duration, material });
  }

  private updatePulses(delta: number) {
    for (let index = this.pulses.length - 1; index >= 0; index -= 1) {
      const pulse = this.pulses[index];
      pulse.life -= delta;
      pulse.mesh.scaling.addInPlace(new Vector3(delta * 3.8, 0, delta * 3.8));
      pulse.material.alpha = Math.max(0, pulse.life * 2.5);
      if (pulse.life <= 0) {
        pulse.mesh.dispose(false, true);
        pulse.material.dispose();
        this.pulses.splice(index, 1);
      }
    }
  }

  private hurtPlayer(damage: number) {
    this.player.takeDamage(damage);
    this.message = "A sombra encontrou seu aço.";
    this.attackMessageTime = 0.5;
    if (this.player.health <= 0) {
      this.player.health = this.player.maxHealth;
      this.player.root.position = new Vector3(-7.5, 0, -7);
      this.message = "O juramento o trouxe de volta ao círculo.";
    }
  }

  private emitHud() {
    const alive = this.enemies.filter((enemy) => enemy.alive).length;
    const state: HudState = {
      started: this.started,
      health: this.player.health,
      maxHealth: this.player.maxHealth,
      arrows: this.player.arrows,
      weapon: this.player.activeWeapon,
      objective: alive > 0 ? "Purifique o Círculo de Cinzas" : "A rota para Movium está segura",
      message: this.message,
      enemies: alive,
    };
    window.dispatchEvent(new CustomEvent<HudState>("arssony-hud", { detail: state }));
  }

  dispose() {
    this.input.dispose();
    this.player.dispose();
    this.enemies.forEach((enemy) => enemy.dispose());
    this.projectiles.forEach((projectile) => projectile.mesh.dispose(false, true));
    this.pulses.forEach((pulse) => {
      pulse.mesh.dispose(false, true);
      pulse.material.dispose();
    });
  }
}
