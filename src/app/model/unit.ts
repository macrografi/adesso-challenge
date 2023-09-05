export class Unit {
  id?: number;
  name?: string;
  description?: string;
  expansion?: string;
  age?: string;
  cost?: Cost;
  build_time?: number;
  reload_time?: number;
  attack_delay?: number;
  movement_rate?: number;
  line_of_sight?: number;
  hit_points?: number;
  range?: number;
  attack?: number;
  armor?: string;
  accuracy?: string;
}

export class UnitItem {
  id?: number;
  name?: string;
  description?: string;
  age?: string;
  wood?: number;
  gold?: number;
  food?: number;
  build_time?: number;
  reload_time?: number;
  hit_points?: number;
  attack?: number;
  accuracy?: string;
}
export class Cost {
  Wood?: number;
  Gold?: number;
  Food?: number;
}
