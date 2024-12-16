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
          ch
        };
        result[row].push(obj);
      }
    }
    return { map: result, start, end };
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }
};

const processData = (map) => {

};

// Apply an algorithm to go from the start at "S" to the end
const goToEnd = (start, end, map) => {
  let n = map.length;
  // Stab at the algorithm for walking a path through the map.
  
}

// part 1: node index.js input.txt 1
// part 2: node index.js input.txt 2
const main = async (fileName) => {
  const { map, start, end } = await readData(fileName);
  // console.log(JSON.stringify(map));
  if (part == "1") {
    goToEnd(start, end, map);
  } else if (part == "2") {
  }
  throw new Error(`not done`);
};

main(fileName);
