// Grimório de Cinza: sentinelas de cinza e guardiões de osso são construídos para ameaçar sem esconder o terreno.
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Scene } from "@babylonjs/core/scene";

export type EnemyKind = "wisp" | "guardian";

export class Enemy {
  readonly root: TransformNode;
  readonly maxHealth: number;
  health: number;
  private readonly core: StandardMaterial;
  private attackCooldown = 0.8;
  private flashTime = 0;
  private downTime = 0;
  private lifeTime = 0;
  private readonly radius: number;
  private readonly speed: number;
  private readonly attackRange: number;
  private readonly damage: number;

  constructor(private readonly scene: Scene, readonly kind: EnemyKind, position: Vector3) {
    this.root = new TransformNode(`enemy-${kind}`, scene);
    this.root.position = position.clone();
    const guardian = kind === "guardian";
    this.maxHealth = guardian ? 120 : 64;
    this.health = this.maxHealth;
    this.radius = guardian ? 1.15 : 0.78;
    this.speed = guardian ? 1.28 : 1.75;
    this.attackRange = guardian ? 2.0 : 1.55;
    this.damage = guardian ? 13 : 8;

    this.core = new StandardMaterial(`enemy-core-${kind}`, scene);
    this.core.diffuseColor = Color3.FromHexString(guardian ? "#493E37" : "#3B302C");
    this.core.emissiveColor = Color3.FromHexString(guardian ? "#1A0704" : "#34110A");
    this.core.specularColor = Color3.FromHexString("#111111");
    const accent = new StandardMaterial(`enemy-accent-${kind}`, scene);
    accent.diffuseColor = Color3.FromHexString(guardian ? "#B4A78E" : "#C54A33");
    accent.emissiveColor = Color3.FromHexString(guardian ? "#382B1D" : "#53120B");

    const body = MeshBuilder.CreateSphere(`enemy-body-${kind}`, { diameter: guardian ? 1.5 : 1.03, segments: 10 }, scene);
    body.parent = this.root;
    body.position.y = guardian ? 1.23 : 0.92;
    body.scaling.y = guardian ? 1.15 : 0.85;
    body.material = this.core;

    const head = MeshBuilder.CreateSphere(`enemy-head-${kind}`, { diameter: guardian ? 0.62 : 0.44, segments: 8 }, scene);
    head.parent = this.root;
    head.position = new Vector3(0, guardian ? 2.14 : 1.48, 0.12);
    head.material = accent;

    for (let index = 0; index < (guardian ? 4 : 3); index += 1) {
      const shard = MeshBuilder.CreateCylinder(`enemy-shard-${kind}-${index}`, { height: guardian ? 0.52 : 0.32, diameterTop: 0.02, diameterBottom: guardian ? 0.18 : 0.13, tessellation: 5 }, scene);
      shard.parent = this.root;
      shard.position = new Vector3((index - 1.5) * 0.26, guardian ? 1.8 : 1.23, -0.38 + (index % 2) * 0.2);
      shard.rotation.x = Math.PI / 2;
      shard.material = accent;
    }
    if (guardian) {
      const axe = MeshBuilder.CreateBox("guardian-axe", { width: 0.12, height: 1.45, depth: 0.12 }, scene);
      axe.parent = this.root;
      axe.position = new Vector3(0.88, 1.45, 0);
      axe.rotation.z = -0.36;
      axe.material = accent;
    } else {
      const ring = MeshBuilder.CreateTorus("wisp-ring", { diameter: 1.23, thickness: 0.06, tessellation: 12 }, scene);
      ring.parent = this.root;
      ring.position.y = 0.46;
      ring.rotation.x = Math.PI / 2;
      ring.material = accent;
    }
  }

  get alive() {
    return this.downTime <= 0;
  }

  get position() {
    return this.root.position;
  }

  update(delta: number, target: Vector3, onAttack: (damage: number) => void) {
    if (!this.alive) {
      this.downTime -= delta;
      if (this.downTime <= 0) this.respawn();
      return;
    }
    this.lifeTime += delta;
    this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    this.flashTime = Math.max(0, this.flashTime - delta);
    this.core.emissiveColor = this.flashTime > 0 ? Color3.FromHexString("#B52F2B") : Color3.FromHexString(this.kind === "guardian" ? "#1A0704" : "#34110A");

    const deltaToTarget = target.subtract(this.root.position);
    const flat = new Vector3(deltaToTarget.x, 0, deltaToTarget.z);
    const distance = flat.length();
    if (distance > this.attackRange && distance > 0.01) {
      flat.normalize();
      this.root.position.addInPlace(flat.scale(delta * this.speed));
      this.root.rotation.y = Math.atan2(flat.x, flat.z);
    }
    this.root.position.y = this.kind === "wisp" ? 0.18 + Math.sin(this.lifeTime * 3.2) * 0.12 : 0;
    if (distance <= this.attackRange && this.attackCooldown <= 0) {
      this.attackCooldown = this.kind === "guardian" ? 1.5 : 1.18;
      onAttack(this.damage);
    }
  }

  takeDamage(amount: number) {
    if (!this.alive) return false;
    this.health = Math.max(0, this.health - amount);
    this.flashTime = 0.13;
    if (this.health <= 0) {
      this.downTime = 5.2;
      this.root.setEnabled(false);
      return true;
    }
    return false;
  }

  private respawn() {
    this.health = this.maxHealth;
    this.root.setEnabled(true);
    this.attackCooldown = 0.8;
  }

  dispose() {
    this.root.dispose(false, true);
  }
}
