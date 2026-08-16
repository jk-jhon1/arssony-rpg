// Grimório de Cinza: Arssony é uma figura original composta por volumes de miniatura, ossos, pele e aço ritual.
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Scene } from "@babylonjs/core/scene";
import { InputManager } from "./InputManager";
import { weaponOrder, weapons, type WeaponId } from "./weapons";

export interface AttackEvent {
  weapon: WeaponId;
  origin: Vector3;
  direction: Vector3;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export class Player {
  readonly root: TransformNode;
  readonly weaponPivot: TransformNode;
  private readonly weaponGroups = new Map<WeaponId, TransformNode>();
  private readonly weaponNames: WeaponId[] = weaponOrder;
  private readonly skin: StandardMaterial;
  private readonly fur: StandardMaterial;
  private readonly iron: StandardMaterial;
  private readonly bone: StandardMaterial;
  private readonly red: StandardMaterial;
  private readonly hair: StandardMaterial;
  private cooldown = 0;
  private attackTime = 0;
  private attackDuration = 0;
  private gait = 0;
  private facing = new Vector3(0, 0, 1);
  private weapon: WeaponId = "sword";
  health = 100;
  maxHealth = 100;
  arrows = 12;

  constructor(private readonly scene: Scene) {
    this.root = new TransformNode("arssony", scene);
    this.root.position = new Vector3(-7.5, 0, -7);
    this.weaponPivot = new TransformNode("arssony-weapon-pivot", scene);
    this.weaponPivot.parent = this.root;
    this.weaponPivot.position = new Vector3(0.36, 1.05, 0.38);

    this.skin = this.material("skin", "#6E3F2D", "#120905");
    this.fur = this.material("fur", "#241E1D", "#0B0808");
    this.iron = this.material("iron", "#4B5051", "#131819");
    this.bone = this.material("bone", "#B9AD92", "#43372A");
    this.red = this.material("red", "#B52F2B", "#310504");
    this.hair = this.material("hair", "#C8C7C4", "#33363A");

    this.createBody();
    this.createWeaponSets();
    this.setWeapon("sword");
  }

  get position() {
    return this.root.position;
  }

  get activeWeapon() {
    return this.weapon;
  }

  get direction() {
    return this.facing.clone();
  }

  private material(name: string, diffuse: string, emissive: string) {
    const material = new StandardMaterial(`mat-${name}`, this.scene);
    material.diffuseColor = Color3.FromHexString(diffuse);
    material.emissiveColor = Color3.FromHexString(emissive);
    material.specularColor = Color3.FromHexString("#181818");
    return material;
  }

  private createBody() {
    const torso = MeshBuilder.CreateCylinder("arssony-torso", { height: 1.05, diameterTop: 0.62, diameterBottom: 0.78, tessellation: 10 }, this.scene);
    torso.parent = this.root;
    torso.position.y = 1.2;
    torso.material = this.fur;

    const mantle = MeshBuilder.CreateCylinder("arssony-mantle", { height: 0.62, diameterTop: 0.92, diameterBottom: 1.1, tessellation: 12 }, this.scene);
    mantle.parent = this.root;
    mantle.position.y = 1.55;
    mantle.material = this.fur;

    const waist = MeshBuilder.CreateTorus("arssony-belt", { diameter: 0.72, thickness: 0.11, tessellation: 10 }, this.scene);
    waist.parent = this.root;
    waist.position.y = 0.88;
    waist.rotation.x = Math.PI / 2;
    waist.material = this.red;

    const head = MeshBuilder.CreateSphere("arssony-head", { diameter: 0.62, segments: 12 }, this.scene);
    head.parent = this.root;
    head.position.y = 2.17;
    head.material = this.skin;

    const hair = MeshBuilder.CreateCylinder("arssony-hair", { height: 0.46, diameterTop: 0.1, diameterBottom: 0.64, tessellation: 7 }, this.scene);
    hair.parent = this.root;
    hair.position = new Vector3(0, 2.49, -0.05);
    hair.rotation.x = 0.1;
    hair.material = this.hair;

    const mark = MeshBuilder.CreateBox("arssony-mark", { width: 0.08, height: 0.21, depth: 0.018 }, this.scene);
    mark.parent = this.root;
    mark.position = new Vector3(0, 2.18, 0.31);
    mark.material = this.red;

    [-1, 1].forEach((side) => {
      const arm = MeshBuilder.CreateCylinder(`arssony-arm-${side}`, { height: 0.8, diameter: 0.22, tessellation: 8 }, this.scene);
      arm.parent = this.root;
      arm.position = new Vector3(side * 0.48, 1.37, 0.03);
      arm.rotation.z = side * 0.34;
      arm.material = this.skin;

      const bracer = MeshBuilder.CreateCylinder(`arssony-bracer-${side}`, { height: 0.28, diameter: 0.32, tessellation: 8 }, this.scene);
      bracer.parent = this.root;
      bracer.position = new Vector3(side * 0.57, 1.08, 0.12);
      bracer.rotation.z = side * 0.34;
      bracer.material = this.bone;

      const leg = MeshBuilder.CreateCylinder(`arssony-leg-${side}`, { height: 0.82, diameter: 0.3, tessellation: 8 }, this.scene);
      leg.parent = this.root;
      leg.position = new Vector3(side * 0.23, 0.42, 0);
      leg.material = this.iron;

      const foot = MeshBuilder.CreateSphere(`arssony-foot-${side}`, { diameterX: 0.31, diameterY: 0.17, diameterZ: 0.48, segments: 8 }, this.scene);
      foot.parent = this.root;
      foot.position = new Vector3(side * 0.23, 0.04, 0.14);
      foot.material = this.skin;

      const shoulderBone = MeshBuilder.CreateBox(`arssony-shoulder-${side}`, { width: 0.24, height: 0.16, depth: 0.46 }, this.scene);
      shoulderBone.parent = this.root;
      shoulderBone.position = new Vector3(side * 0.47, 1.73, 0.03);
      shoulderBone.rotation.z = side * 0.15;
      shoulderBone.material = this.bone;
    });

    for (let index = 0; index < 4; index += 1) {
      const claw = MeshBuilder.CreateCylinder(`arssony-fur-${index}`, { height: 0.33, diameterTop: 0.02, diameterBottom: 0.19, tessellation: 5 }, this.scene);
      claw.parent = this.root;
      claw.position = new Vector3(-0.38 + index * 0.25, 1.75 + (index % 2) * 0.1, -0.38);
      claw.rotation.x = Math.PI / 2;
      claw.material = this.fur;
    }
  }

  private createWeaponSets() {
    const sword = new TransformNode("weapon-sword", this.scene);
    sword.parent = this.weaponPivot;
    this.createSword(sword, new Vector3(0, 0, 0), Color3.FromHexString("#D9D5C7"));
    this.weaponGroups.set("sword", sword);

    const twins = new TransformNode("weapon-twins", this.scene);
    twins.parent = this.weaponPivot;
    this.createSword(twins, new Vector3(-0.16, 0, 0), Color3.FromHexString("#D9D5C7"));
    this.createSword(twins, new Vector3(0.17, -0.03, -0.06), Color3.FromHexString("#C74438"));
    twins.rotation.y = 0.1;
    this.weaponGroups.set("twins", twins);

    const bow = new TransformNode("weapon-bow", this.scene);
    bow.parent = this.weaponPivot;
    const arc = MeshBuilder.CreateTorus("arssony-bow-arc", { diameter: 1.15, thickness: 0.065, tessellation: 16 }, this.scene);
    arc.parent = bow;
    arc.scaling.x = 0.48;
    arc.rotation.x = Math.PI / 2;
    arc.material = this.bone;
    const string = MeshBuilder.CreateBox("arssony-bow-string", { width: 0.018, height: 0.97, depth: 0.018 }, this.scene);
    string.parent = bow;
    string.position.x = 0.27;
    string.material = this.red;
    const arrow = MeshBuilder.CreateCylinder("arssony-bow-arrow", { height: 0.92, diameter: 0.035, tessellation: 6 }, this.scene);
    arrow.parent = bow;
    arrow.rotation.z = Math.PI / 2;
    arrow.position.z = 0.1;
    arrow.material = this.iron;
    this.weaponGroups.set("bow", bow);

    const spear = new TransformNode("weapon-spear", this.scene);
    spear.parent = this.weaponPivot;
    const shaft = MeshBuilder.CreateCylinder("arssony-spear-shaft", { height: 2.45, diameter: 0.08, tessellation: 8 }, this.scene);
    shaft.parent = spear;
    shaft.rotation.z = -0.36;
    shaft.position = new Vector3(0, 0.72, 0);
    shaft.material = this.red;
    const tip = MeshBuilder.CreateCylinder("arssony-spear-tip", { height: 0.63, diameterTop: 0, diameterBottom: 0.22, tessellation: 6 }, this.scene);
    tip.parent = spear;
    tip.rotation.z = -0.36;
    tip.position = new Vector3(-0.44, 1.83, 0);
    tip.material = this.iron;
    this.weaponGroups.set("spear", spear);
  }

  private createSword(parent: TransformNode, position: Vector3, color: Color3) {
    const bladeMaterial = new StandardMaterial(`blade-${parent.name}-${position.x}`, this.scene);
    bladeMaterial.diffuseColor = color;
    bladeMaterial.emissiveColor = color.scale(0.08);
    bladeMaterial.specularColor = Color3.FromHexString("#EEEEEE");
    const blade = MeshBuilder.CreateBox(`blade-${parent.name}-${position.x}`, { width: 0.09, height: 0.1, depth: 1.12 }, this.scene);
    blade.parent = parent;
    blade.position = position.add(new Vector3(0, 0.05, 0.62));
    blade.rotation.x = -0.35;
    blade.material = bladeMaterial;
    const guard = MeshBuilder.CreateBox(`guard-${parent.name}-${position.x}`, { width: 0.45, height: 0.08, depth: 0.12 }, this.scene);
    guard.parent = parent;
    guard.position = position.add(new Vector3(0, 0, 0.1));
    guard.material = this.bone;
    const handle = MeshBuilder.CreateCylinder(`handle-${parent.name}-${position.x}`, { height: 0.34, diameter: 0.1, tessellation: 7 }, this.scene);
    handle.parent = parent;
    handle.rotation.x = Math.PI / 2;
    handle.position = position.add(new Vector3(0, 0, -0.14));
    handle.material = this.red;
  }

  setWeapon(weapon: WeaponId) {
    this.weapon = weapon;
    this.weaponGroups.forEach((group, key) => group.setEnabled(key === weapon));
  }

  cycleWeapon() {
    const index = this.weaponNames.indexOf(this.weapon);
    this.setWeapon(this.weaponNames[(index + 1) % this.weaponNames.length]);
  }

  update(delta: number, input: InputManager, camera: ArcRotateCamera): AttackEvent | null {
    this.cooldown = Math.max(0, this.cooldown - delta);
    const requestedWeapon = input.consumeWeapon();
    if (requestedWeapon) this.setWeapon(requestedWeapon);
    if (input.consumeCycle()) this.cycleWeapon();

    const movement = input.movement;
    const moving = Math.abs(movement.x) + Math.abs(movement.z) > 0.02;
    if (moving && this.attackTime <= 0) {
      const cameraOffset = camera.position.subtract(this.root.position);
      const forward = new Vector3(-cameraOffset.x, 0, -cameraOffset.z).normalize();
      const right = new Vector3(forward.z, 0, -forward.x).normalize();
      const desired = forward.scale(movement.z).add(right.scale(movement.x));
      if (desired.lengthSquared() > 0.001) {
        desired.normalize();
        this.facing = Vector3.Lerp(this.facing, desired, Math.min(1, delta * 11)).normalize();
        this.root.position.addInPlace(this.facing.scale(delta * 5.1));
        this.root.position.x = clamp(this.root.position.x, -22, 22);
        this.root.position.z = clamp(this.root.position.z, -22, 22);
        this.root.rotation.y = Math.atan2(this.facing.x, this.facing.z);
        this.gait += delta * 12;
      }
    }
    this.root.position.y = Math.max(0, Math.sin(this.gait) * (moving ? 0.035 : 0));

    if (this.attackTime > 0) {
      this.attackTime -= delta;
      const progress = 1 - Math.max(0, this.attackTime) / this.attackDuration;
      const power = Math.sin(progress * Math.PI);
      this.weaponPivot.rotation.z = this.weapon === "bow" ? -power * 0.45 : -power * (this.weapon === "twins" ? 1.1 : 0.78);
      this.weaponPivot.rotation.y = this.weapon === "spear" ? power * 0.35 : 0;
    } else {
      this.weaponPivot.rotation.x = 0;
      this.weaponPivot.rotation.y = 0;
      this.weaponPivot.rotation.z = 0;
    }

    if (!input.consumeAttack() || this.cooldown > 0 || this.attackTime > 0) return null;
    const definition = weapons[this.weapon];
    if (definition.projectile && this.arrows <= 0) return null;
    if (definition.projectile) this.arrows -= 1;
    this.cooldown = definition.cooldown;
    this.attackTime = definition.duration;
    this.attackDuration = definition.duration;
    return {
      weapon: this.weapon,
      origin: this.root.position.add(new Vector3(0, 1.15, 0)).add(this.facing.scale(0.7)),
      direction: this.facing.clone(),
    };
  }

  takeDamage(amount: number) {
    this.health = Math.max(0, this.health - amount);
  }

  heal(amount: number) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  dispose() {
    this.root.dispose(false, true);
  }
}
