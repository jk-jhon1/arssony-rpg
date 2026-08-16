// Grimório de Cinza: o aço de Arssony é legível por silhueta, alcance e um rastro de cor contido.
import { Color3 } from "@babylonjs/core/Maths/math.color";

export type WeaponId = "sword" | "twins" | "bow" | "spear";

export interface WeaponDefinition {
  id: WeaponId;
  label: string;
  key: string;
  damage: number;
  range: number;
  cooldown: number;
  duration: number;
  hits: number;
  projectile: boolean;
  color: Color3;
}

export const weapons: Record<WeaponId, WeaponDefinition> = {
  sword: {
    id: "sword",
    label: "Espada",
    key: "1",
    damage: 26,
    range: 3.1,
    cooldown: 0.52,
    duration: 0.28,
    hits: 1,
    projectile: false,
    color: Color3.FromHexString("#D9D5C7"),
  },
  twins: {
    id: "twins",
    label: "Lâminas gêmeas",
    key: "2",
    damage: 17,
    range: 2.7,
    cooldown: 0.62,
    duration: 0.38,
    hits: 2,
    projectile: false,
    color: Color3.FromHexString("#C74438"),
  },
  bow: {
    id: "bow",
    label: "Arco ritual",
    key: "3",
    damage: 24,
    range: 18,
    cooldown: 0.82,
    duration: 0.22,
    hits: 1,
    projectile: true,
    color: Color3.FromHexString("#D39844"),
  },
  spear: {
    id: "spear",
    label: "Lança rubra",
    key: "4",
    damage: 34,
    range: 5.2,
    cooldown: 0.74,
    duration: 0.32,
    hits: 1,
    projectile: false,
    color: Color3.FromHexString("#E1DDD2"),
  },
};

export const weaponOrder: WeaponId[] = ["sword", "twins", "bow", "spear"];
