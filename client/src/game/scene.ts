// Grimório de Cinza: uma clareira oblíqua mistura o caminho de Movium, ruínas de ardósia e círculos rúnicos vermelhos.
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { assets } from "./assets";
import { GameWorld } from "./GameWorld";

export interface GameHandle {
  scene: Scene;
  dispose: () => void;
}

const material = (scene: Scene, name: string, color: string, emissive = "#000000") => {
  const result = new StandardMaterial(name, scene);
  result.diffuseColor = Color3.FromHexString(color);
  result.emissiveColor = Color3.FromHexString(emissive);
  result.specularColor = Color3.FromHexString("#181818");
  return result;
};

const createTree = (scene: Scene, position: Vector3, scale: number, trunk: StandardMaterial, leaves: StandardMaterial) => {
  const root = new TransformNode("pines-of-movium", scene);
  root.position = position;
  const stem = MeshBuilder.CreateCylinder("pine-trunk", { height: 3.2 * scale, diameter: 0.34 * scale, tessellation: 8 }, scene);
  stem.parent = root;
  stem.position.y = 1.6 * scale;
  stem.material = trunk;
  [0, 1, 2].forEach((layer) => {
    const crown = MeshBuilder.CreateCylinder("pine-crown", { height: (2.2 - layer * 0.22) * scale, diameterBottom: (2.35 - layer * 0.44) * scale, diameterTop: 0.12, tessellation: 9 }, scene);
    crown.parent = root;
    crown.position.y = (2.8 + layer * 0.88) * scale;
    crown.material = leaves;
  });
};

const createRuins = (scene: Scene, position: Vector3, stone: StandardMaterial) => {
  [-1, 1].forEach((side) => {
    const pillar = MeshBuilder.CreateBox("movium-ruin", { width: 0.8, height: 3.8, depth: 0.8 }, scene);
    pillar.position = position.add(new Vector3(side * 1.15, 1.9, 0));
    pillar.rotation.z = side * 0.08;
    pillar.material = stone;
  });
  const cap = MeshBuilder.CreateBox("movium-ruin-cap", { width: 3.3, height: 0.43, depth: 0.85 }, scene);
  cap.position = position.add(new Vector3(0, 3.92, 0));
  cap.rotation.z = -0.05;
  cap.material = stone;
};

export async function createGameScene(engine: Engine, canvas: HTMLCanvasElement): Promise<GameHandle> {
  const scene = new Scene(engine);
  scene.clearColor = Color4.FromHexString("#172029FF");
  scene.ambientColor = Color3.FromHexString("#38453B");

  const camera = new ArcRotateCamera("arssony-camera", -2.32, 1.12, 20.8, new Vector3(-4, 1, -4), scene);
  camera.lowerBetaLimit = 0.78;
  camera.upperBetaLimit = 1.3;
  camera.lowerRadiusLimit = 14;
  camera.upperRadiusLimit = 26;
  camera.wheelPrecision = 52;
  camera.attachControl(canvas, false);

  const skyLight = new HemisphericLight("cold-sky", new Vector3(0.28, 1, 0.22), scene);
  skyLight.intensity = 1.15;
  skyLight.groundColor = Color3.FromHexString("#1B1918");
  const directional = new DirectionalLight("ashen-sun", new Vector3(-0.45, -1, -0.25), scene);
  directional.position = new Vector3(12, 18, 10);
  directional.intensity = 1.25;
  const glow = new GlowLayer("rune-glow", scene, { mainTextureFixedSize: 512, blurKernelSize: 32 });
  glow.intensity = 0.35;

  const groundMaterial = material(scene, "forest-ground", "#3A4634");
  const groundTexture = new Texture(assets.ground, scene);
  groundTexture.uScale = 8;
  groundTexture.vScale = 8;
  groundMaterial.diffuseTexture = groundTexture;
  groundMaterial.specularColor = Color3.FromHexString("#0B0C0A");
  const ground = MeshBuilder.CreateGround("forest-floor", { width: 54, height: 54, subdivisions: 2 }, scene);
  ground.material = groundMaterial;

  const stone = material(scene, "slate-stone", "#4B5550", "#0D1213");
  const darkStone = material(scene, "dark-slate", "#252C2B", "#080909");
  const redRune = material(scene, "red-rune", "#9D332F", "#3E0705");
  const trunk = material(scene, "tree-bark", "#3F302A", "#100A08");
  const leaves = material(scene, "cold-pines", "#263B33", "#07100D");
  const bannerMaterial = material(scene, "banner-runes", "#74211E");
  const bannerTexture = new Texture(assets.banner, scene);
  bannerMaterial.diffuseTexture = bannerTexture;
  bannerMaterial.backFaceCulling = false;

  const ring = MeshBuilder.CreateCylinder("circle-of-ashes", { height: 0.18, diameter: 13.2, tessellation: 48 }, scene);
  ring.position = new Vector3(3.2, 0.08, 1.6);
  ring.material = darkStone;
  [0, 1, 2].forEach((layer) => {
    const torus = MeshBuilder.CreateTorus("rune-ring", { diameter: 11.6 - layer * 2.4, thickness: 0.075, tessellation: 40 }, scene);
    torus.position = new Vector3(3.2, 0.2 + layer * 0.025, 1.6);
    torus.rotation.x = Math.PI / 2;
    torus.material = layer === 1 ? redRune : stone;
  });
  for (let index = 0; index < 8; index += 1) {
    const rune = MeshBuilder.CreateBox("rune-mark", { width: 0.24, height: 0.035, depth: 0.82 }, scene);
    const angle = (Math.PI * 2 * index) / 8;
    rune.position = new Vector3(3.2 + Math.cos(angle) * 4.7, 0.24, 1.6 + Math.sin(angle) * 4.7);
    rune.rotation.y = -angle;
    rune.material = redRune;
  }

  [new Vector3(-13, 0, -14), new Vector3(-15, 0, 8), new Vector3(-8, 0, 17), new Vector3(14, 0, -12), new Vector3(16, 0, 11), new Vector3(8, 0, 18), new Vector3(-1, 0, -18)].forEach((position, index) => createTree(scene, position, 1 + (index % 3) * 0.23, trunk, leaves));
  [new Vector3(-5, 0, 5), new Vector3(11, 0, 7), new Vector3(14, 0, -2), new Vector3(-9, 0, -4)].forEach((position) => {
    const rock = MeshBuilder.CreatePolyhedron("moss-rock", { type: 2, size: 1.35 }, scene);
    rock.position = position.add(new Vector3(0, 0.6, 0));
    rock.scaling.y = 0.78;
    rock.material = stone;
  });
  createRuins(scene, new Vector3(-12, 0, 2), stone);
  createRuins(scene, new Vector3(10, 0, -8), stone);

  [new Vector3(-1.8, 0, 6.8), new Vector3(9.5, 0, 5.9)].forEach((position) => {
    const pole = MeshBuilder.CreateCylinder("battle-banner-pole", { height: 3.5, diameter: 0.09, tessellation: 8 }, scene);
    pole.position = position.add(new Vector3(0, 1.75, 0));
    pole.material = trunk;
    const cloth = MeshBuilder.CreatePlane("battle-banner", { width: 1.05, height: 1.7 }, scene);
    cloth.parent = pole;
    cloth.position = new Vector3(0.48, 0.45, 0);
    cloth.material = bannerMaterial;
  });

  const routeStone = MeshBuilder.CreateBox("movium-route-marker", { width: 2.0, height: 0.12, depth: 5.8 }, scene);
  routeStone.position = new Vector3(-4.8, 0.06, -2.4);
  routeStone.rotation.y = -0.57;
  routeStone.material = material(scene, "route-earth", "#675747", "#140D08");

  const demo = new URLSearchParams(window.location.search).has("demo");
  const world = new GameWorld(scene, camera, canvas, demo);
  scene.onBeforeRenderObservable.add(() => world.update(Math.min(0.05, scene.getEngine().getDeltaTime() / 1000)));
  scene.onDisposeObservable.add(() => world.dispose());

  return {
    scene,
    dispose: () => scene.dispose(),
  };
}
