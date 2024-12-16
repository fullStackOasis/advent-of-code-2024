/**
 * Advent of Code, day 16.
 *
 * The reindeer race.
 */
const fs = require("fs").promises;

const { validateInput } = require("../lib");

const { fileName, part } = validateInput();

/**
 * @param {*} fileName name of the file to be read
 * @returns an Object with an array of arrays "map",
 * the location of the start point "start", and the
 * location of the end point "end"
 */
const readData = async (fileName) => {
  try {
    const result = [];
    const data = await fs.readFile(fileName.trim(), "utf8");
    const rows = data.split("\n");
    const len = rows.length;
    let start = {};
    let end = {};
    for (let row = 0; row < len; row++) {
      result.push([]);
      for (let col = 0; col < len; col++) {
        const ch = rows[row][col];
        if (ch == "S") {
          start = { row, col };
        } else if (ch == "E") {
          end = { row, col };
        }
        const obj = {
          ch,
        };
        result[row].push(obj);
      }
    }
    return { map: result, start, end };
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }
};

const print = (map) => {
  const len = map.length;
  for (let row = 0; row < len; row++) {
    for (let col = 0; col < len; col++) {
      process.stdout.write(map[row][col].ch);
    }
    console.log("");
  }
};

const clean = (map) => {
  const len = map.length;
  for (let row = 0; row < len; row++) {
    for (let col = 0; col < len; col++) {
      delete map[row][col].breadcrumb;
    }
  }
};

const processData = (map) => {};

const moveNotAllowed = (obj) => {
  // if (obj.ch == "E") throw new Error(`Found end`);
  return obj.breadcrumb || obj.ch == "#" || obj.deadend;
};

const goWest = (me, map) => {
  // take one step north
  const r = me.row;
  const c = me.col - 1;
  const obj = map[r][c]; // TODO FIXME check for edges of map
  if (moveNotAllowed(obj)) {
    // TODO FIXME any other characters to watch for?
    return false;
  }
  return c;
};

const goEast = (me, map) => {
  // take one step north
  const r = me.row;
  const c = me.col + 1;
  const obj = map[r][c]; // TODO FIXME check for edges of map
  if (moveNotAllowed(obj)) {
    // TODO FIXME any other characters to watch for?
    return false;
  }
  return c;
};

const goSouth = (me, map) => {
  // take one step north
  const r = me.row + 1;
  const c = me.col;
  const obj = map[r][c]; // TODO FIXME check for edges of map
  if (moveNotAllowed(obj)) {
    // TODO FIXME any other characters to watch for?
    return false;
  }
  return r;
};

const goNorth = (me, map) => {
  // take one step north
  const r = me.row - 1;
  const c = me.col;
  const obj = map[r][c]; // TODO FIXME check for edges of map
  if (moveNotAllowed(obj)) {
    // TODO FIXME any other characters to watch for?
    return false;
  }
  return r;
};

const atEnd = (me, map) => {
  const r = me.row;
  const c = me.col;
  const obj = map[r][c];
  return (obj.ch == "E");
}

// Apply an algorithm to go from the start at "S" to the end
const goToEnd = (start, end, map) => {
  let n = map.length;
  // Stab at the algorithm for walking a path through the map.
  let done = false;
  const me = {
    row: start.row,
    col: start.col,
  };
  const prev = { row: me.row, col: me.col };
  while (!done) {
    let r = goNorth(me, map);
    if (r !== false) {
      prev.row = me.row;
      me.row = r;
      if (atEnd(me, map)) {
        done = true;
      } else {
        map[me.row][me.col].breadcrumb = true;
      }
      continue;
    }
    r = goSouth(me, map);
    if (r !== false) {
      prev.row = me.row;
      me.row = r;
      if (atEnd(me, map)) {
        done = true;
      } else {
        map[me.row][me.col].breadcrumb = true;
      }
      continue;
    }
    let c = goEast(me, map);
    if (c !== false) {
      prev.col = me.col;
      me.col = c;
      if (atEnd(me, map)) {
        done = true;
      } else {
        map[me.row][me.col].breadcrumb = true;
      }
      continue;
    }
    c = goWest(me, map);
    if (c !== false) {
      prev.col = me.col;
      me.col = c;
      if (atEnd(me, map)) {
        done = true;
      } else {
        map[me.row][me.col].breadcrumb = true;
      }
      continue;
    }
    if (!atEnd(me, map)) {
      map[me.row][me.col].ch = "#";
      map[me.row][me.col].deadend = true;
    } else {
      console.log(`|${map[me.row][me.col].ch} ${JSON.stringify(prev)}|`);
    }
    done = true;
  }
  clean(map);
  return map[me.row][me.col].ch == "E";
};

// part 1: node index.js input.txt 1
// part 2: node index.js input.txt 2
const main = async (fileName) => {
  const { map, start, end } = await readData(fileName);
  // console.log(JSON.stringify(map));
  if (part == "1") {
    let counter = 0;
    let nCompletePaths = 0;
    let nDeadendPaths = 0;
    const countermax = 500;
    while (counter < countermax) {
      const found1 = goToEnd(start, end, map);
      if (found1) {
        nCompletePaths++;
      } else {
        nDeadendPaths++;
      }
      counter++;
    }
    print(map);
    console.log(`nCompletePaths ${nCompletePaths}`);
    console.log(`nDeadendPaths ${nDeadendPaths}`);
  } else if (part == "2") {
  }
  throw new Error(`not done`);
};

main(fileName);
