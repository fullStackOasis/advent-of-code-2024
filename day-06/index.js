/**
 * Advent of Code, day 6.
 */
const fs = require("fs").promises;

const fileName = process.argv[2];

if (!fileName) {
  console.error(
    "Error: Please provide a file name as a command-line argument."
  );
  process.exit(1); // Exit with error code
}

// Part is a number, 1 or 2, meaning the "part" of the exercise to be completed.
const part = process.argv[3];

if (part != "1" && part != "2") {
  console.error(
    "Error: Please provide part (1 or 2) as a command-line argument."
  );
  process.exit(1); // Exit with error code
}

const FACING = {
  "E" : ">",
  "N" : "^",
  "S" : "v",
  "W" : "?"
};

/**
 * Return value is an Object with one element which is an array of arrays:
 * labMap.
 *
 * @param {*} fileName name of the file to be read
 * @returns an Object with an array of characters
 */
const readData = async (fileName) => {
  try {
    const labMap = [];
    const data = await fs.readFile(fileName.trim(), "utf8");
    data.split("\n").forEach((line, i) => {
      const row = line.trim();
      labMap[i] = row.split("");
    });
    return { labMap };
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }
};

const printArray = (lines) => {
  console.log(`Your array:`);
  for (let i = 0; i < lines.length; i++) {
    console.log(lines[i]);
  }
  console.log();
};


const shouldMoveForward = (guard, labMap) => {
  return false;
};

const moveGuardForward = (guard, labMap) => {

};

/**
 * Returns the "guard" Object. A guard has:
 * "x" - it's x-position
 * "y" - it's y-position (location in the x,y array)
 * "dir" - a character that indicates which way it's pointing
 *
 * @param {*} labMap 
 * @returns 
 */
const findGuard = (labMap) => {
  const result = {};
  labMap.find((rows, i) => {
    return rows.find((item, j) => {
      const found = item != "." && item != "#";
      if (found) {
        result["x"] = i;
        result["y"] = j;
        result["dir"] = item;      
      }
      return found;
    });
  });
  console.log(result);
  return result;
};

const main = async (fileName) => {
  const { labMap } = await readData(fileName);
  const guard = findGuard(labMap);
  console.log(guard);
  if (shouldMoveForward(guard, labMap)) {
    moveGuardForward(guard);
  }
  // printArray(labMap);
  // In the example, the guard starts at position (6, 4)
  console.log(labMap[6][4]); // prints up array for guard symbol
  if (part == "1") {
  } else if (part == "2") {
  }
};

main(fileName);
