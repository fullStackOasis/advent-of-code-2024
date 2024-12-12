/**
 * Advent of Code, day 12.
 * 
 * Get the price of each region, and compute total cost.
 */
const fs = require("fs").promises;

const { validateInput } = require("../lib");

const { fileName, part, extra } = validateInput();

/**
 * Return value is an Object with a single "lines" element, an array of
 * arrays of characters, like [["A", "A"], ["B", "B"]]
 *
 * @param {*} fileName name of the file to be read
 * @returns an Object with one element, "lines", which is an array of string
 */
const readData = async (fileName) => {
  try {
    const lines = [];
    const data = await fs.readFile(fileName.trim(), "utf8");
    data.split("\n").forEach((line) => {
      lines.push(line.trim().split(""));
    });
    console.log(JSON.stringify(lines));
    return { lines };
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }
};

// plant is a character such as "A"
// garden is an nxn array of such letters.
const getPerimeterCount = (plant, garden) => {
  // If you have the letter "R", count the perimeters around it.
  // A perimeter is a side that is adjacent to another non-R letter or an edge.
  const fn = (garden, row, col) => {
    // process.stdout.write(garden[row][col]);
    const me = garden[row][col];
    if (me != plant) return 0;
    // look around this area: left, right, up, down
    const up = row - 1 >= 0 ? garden[row - 1][col] : "";
    const down = row + 1 < len ? garden[row + 1][col] : "";
    const right = col + 1 < len ? garden[row][col + 1] : "";
    const left = col - 1 >= 0 ? garden[row][col - 1] : "";
    const nPerimeters = (up == plant ? 0 : 1) + 
      (down == plant ? 0 : 1) +
      (right == plant ? 0 : 1) +
      (left == plant ? 0 : 1);
    return nPerimeters;
  };
  const len = garden.length;
  let countPerimeters = 0;
  for (let row = 0; row < len; row++) {
    for (let col = 0; col < len; col++) {
      countPerimeters += fn(garden, row, col);
    }
  }
  return countPerimeters;
};

// returns an Object (map) of plants
const getDistinctPlants = (garden) => {
  const object = {};
  garden.forEach((plants, i) => {
    plants.forEach(plant => {
      object[plant] = plant;
    });
  });
  return object;
};

// seems correct. Maps each plant to its count of perimeters
const fillPerimeterToPlantMap = (garden, distinctPlants, map) => {
  Object.keys(distinctPlants).forEach(el => {
    const count = getPerimeterCount(el, garden);
    map[el] = count;
    console.log(`${el} -> ${count}`);
  });
  return map;
};

// part 1: node index.js input.txt 1
// part 2: node index.js input.txt 2
const main = async (fileName) => {
  // rows of lines expected with numbers 0..9 filling them.
  const { lines: garden } = await readData(fileName);
  const distinctPlants = getDistinctPlants(garden);
  const perimeterToPlantMap = fillPerimeterToPlantMap(garden, distinctPlants, {});
  // const count = getPerimeterCount("R", garden);
  // console.log(count);
  
  if (part == "1") {
  } else if (part == "2") {
  }
  throw new Error(`not done`);
};

main(fileName);
