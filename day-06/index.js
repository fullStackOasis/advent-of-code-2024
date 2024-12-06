/**
 * Advent of Code, day 6.
 *
 * Rules:
 * If there is something directly in front of you, turn right 90 degrees.
 * Otherwise, take a step forward.
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
  E: ">",
  N: "^",
  S: "v",
  W: "?",
};

const DIRS = {
  ">": "E",
  "^": "N",
  v: "S",
  "?": "W",
  E: ">",
  N: "^",
  S: "v",
  W: "?",
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

/**
 * Returns true if there is an obstacle "#" in front of the guard.
 * @param {*} guard
 * @param {*} labMap
 * @returns
 */
const shouldMoveForward = (guard, labMap) => {
  console.log(labMap[guard["x"]][guard["y"]]);
  // Figure out what is directly in front of guard.
  let el;
  switch (guard["dir"]) {
    case DIRS["N"]: // guard is facing North
      el = labMap[guard["x"]][guard["y"] + 1];
      break;
    case DIRS["E"]: // guard is facing East
      el = labMap[guard["x"] + 1][guard["y"]];
      break;
    case DIRS["S"]: // guard is facing South
      el = labMap[guard["x"]][guard["y"] - 1];
      break;
    case DIRS["W"]:
      el = labMap[guard["x"] - 1][guard["y"]];
      break;
    default:
  }
  console.log(`el is ${el} guard is ${JSON.stringify(guard)}`);
  return el != "#";
};

/**
 * This function mutates the guard Object by changing either its x-position
 * or its y-position. It does not change the "dir" property.
 *
 * @param {*} guard
 * @param {*} labMap
 * @returns undefined
 */
const moveGuardForward = (guard, labMap) => {
  switch (guard["dir"]) {
    case DIRS["N"]:
      guard["y"]++;
      break;
    case DIRS["E"]:
      guard["x"]++;
      break;
    case DIRS["S"]:
      guard["y"]--;
      break;
    case DIRS["W"]:
      guard["x"]--;
      break;
    default:
  }
  return;
};

/**
 * This function mutates the guard Object by changing its "dir" property.
 * The guard is obstructed, so turn right 90 degrees.
 *
 * @param {*} guard
 * @returns undefined
 */
const turnGuard = (guard, labMap) => {
  switch (guard["dir"]) {
    case DIRS["N"]:
      guard["dir"] = DIRS["E"];
      break;
    case DIRS["E"]:
      guard["dir"] = DIRS["S"];
      break;
    case DIRS["S"]:
      guard["dir"] = DIRS["W"];
      break;
    case DIRS["W"]:
      guard["dir"] = DIRS["N"];
      break;
    default:
  }
  return;
};

/**
 * Returns the "guard" Object. A guard has:
 * "x" - it's x-position
 * "y" - it's y-position (location in the x,y array)
 * KEY!!! The lower left corner is (0, 0). The upper right is (max-1, max-1)
 * "dir" - a character that indicates which way it's pointing
 *
 * @param {*} labMap
 * @returns
 */
const findGuard = (labMap) => {
  const max = labMap.length - 1; // assume nxn
  const result = {};
  labMap.find((rows, i) => {
    return rows.find((item, j) => {
      const found = item != "." && item != "#";
      if (found) {
        result["x"] = j;
        result["y"] = max - i;
        result["dir"] = item;
      }
      return found;
    });
  });
  return result;
};

const main = async (fileName) => {
  const { labMap } = await readData(fileName);
  if (part == "1") {
    const guard = findGuard(labMap);
    // The steps map has an "X" anywhere that the guard stepped.
    const len = labMap.length;
    const max = len;
    const min = -1;
    const stepsMap = new Array(len);
    for (let i = 0; i < len; i++) {
      stepsMap[i] = new Array(len);
    }
    console.log(`guard ${JSON.stringify(guard)}`);
    const validPosition = (guard) => {
      return (
        guard["x"] < max &&
        guard["x"] > min &&
        guard["y"] < max &&
        guard["y"] > min
      );
    };
    let isInLab = validPosition(guard);
    console.log(isInLab);
    let z = 0;
    while (isInLab) {
      if (shouldMoveForward(guard, labMap)) {
        moveGuardForward(guard);
      } else {
        printArray(labMap);
        console.log(`Guard will be turned ${guard}`);
        turnGuard(guard);
      }
      isInLab = validPosition(guard);
      if (isInLab) {
        stepsMap[guard["x"]][guard["y"]] = "X"; // mark guard's step with "X"
      }
      console.log(guard);
      if (z++ > 10) throw new Error(``);
    }

    printArray(stepsMap);
    // In the example, the guard starts at position (6, 4)
    // console.log(labMap[6][4]); // prints up array for guard symbol
  } else if (part == "2") {
  }
};

main(fileName);
