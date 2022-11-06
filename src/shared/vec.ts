
export type Vec3 = [ number, number, number ]

export function addVec3 (a: Vec3, b: Vec3): Vec3 {
  return a.map((e, i) => e + b[i]) as Vec3
}

export function multVec3 (a: Vec3, b: Vec3): Vec3 {
  return a.map((e, i) => e * b[i]) as Vec3
}
