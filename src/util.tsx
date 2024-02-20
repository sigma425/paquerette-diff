function getPair(line: string): string[] {
  return line.split(" x ");
}

export function listBuns(you: string, rival: string): string[] {
  var set = new Set<string>();
  for (const line of you.split("\n").concat(rival.split("\n"))) {
    let pair = getPair(line);
    if (pair.length === 2) {
      set.add(pair[0]);
      set.add(pair[1]);
    }
  }
  // console.log(set);
  // TODO: sort
  return Array.from(set);
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
