function getPair(line: string): string[] {
  return line.split(" x ");
}
function tupleFromBun(bun: string): [string, number, number] | null {
  const arr = bun.split("-");
  if(arr.length !== 3) return null;
  const direction : string = arr[0];
  const floor : number = parseInt(arr[1]);
  const id : number = parseInt(arr[2]);
  return [direction, floor, id];
}
function compDirection(a: string, b: string) : number {
  const dirList: string[] = ["W", "N", "C", "S", "E", "NW?", "NE?", "SW?", "SE?"];
  let aidx = dirList.indexOf(a);
  if(aidx === -1) aidx = 100;
  let bidx = dirList.indexOf(b);
  if(bidx === -1) bidx = 100;
  if(aidx === 100 && bidx === 100){
    // fallback
    if(a === b) return 0;
    return a<b ? -1 : 1;
  }
  return aidx - bidx;
}

function compByFloor(a: string, b: string) : number {
  const at = tupleFromBun(a)!;
  const bt = tupleFromBun(b)!;
  if(at[1] !== bt[1]) return at[1] - bt[1];
  const compDir = compDirection(at[0], bt[0]);
  if(compDir !== 0) return compDir;
  return at[2] - bt[2];
}
function compByDirection(a: string, b: string) : number {
  const at = tupleFromBun(a)!;
  const bt = tupleFromBun(b)!;
  const compDir = compDirection(at[0], bt[0]);
  if(compDir !== 0) return compDir;
  if(at[1] !== bt[1]) return at[1] - bt[1];
  return at[2] - bt[2];
}

export function listBuns(you: string, rival: string, floorFirst: boolean): string[] {
  let set = new Set<string>();
  for (const line of you.split("\n").concat(rival.split("\n"))) {
    let pair = getPair(line);
    if (pair.length === 2) {
      set.add(pair[0]);
      set.add(pair[1]);
    }
  }
  let arr = Array.from(set);
  for (const bun of arr){
    if(!tupleFromBun(bun)) return ["err", bun];
  }
  if(floorFirst) arr.sort(compByFloor);
  else arr.sort(compByDirection);
  return arr;
}

export function getBabiesMap(
  list: string,
  bunList: string[]
): Map<string, string[]> {
  let map = new Map<string, string[]>();
  bunList.forEach((bun) => map.set(bun, []));
  for (const line of list.split("\n")) {
    let pair = getPair(line);
    if (pair.length === 2) {
      let a = pair[0];
      let b = pair[1];
      map.get(a)?.push(b);
      map.get(b)?.push(a);
    }
  }
  return map;
}
