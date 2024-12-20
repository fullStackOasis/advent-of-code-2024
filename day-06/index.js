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
  W: "<",
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
  // Figure out what is directly in front of guard.
  let el;
  const max = labMap.length - 1;
  switch (guard["dir"]) {
    case DIRS["N"]: // guard is facing North
      if (guard["row"] - 1 < 0) return true;
      el = labMap[guard["row"] - 1][guard["col"]];
      break;
    case DIRS["E"]: // guard is facing East
      if (guard["col"] + 1 > max) return true;
      el = labMap[guard["row"]][guard["col"] + 1];
      break;
    case DIRS["S"]: // guard is facing South
      if (guard["row"] + 1 > max) return true;
      el = labMap[guard["row"] + 1][guard["col"]];
      break;
    case DIRS["W"]:
      if (guard["col"] - 1 < 0) return true;
      el = labMap[guard["row"]][guard["col"] - 1];
      break;
    default:
  }
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
      guard["row"]--;
      break;
    case DIRS["E"]:
      guard["col"]++;
      break;
    case DIRS["S"]:
      guard["row"]++;
      break;
    case DIRS["W"]:
      guard["col"]--;
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
 * "row" - it's row-position in the labMap array. Uppermost row is 0.
 * "col" - it's col-position (left-most col is 0)
 * 
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
        result["row"] = i;
        result["col"] = j;
        result["dir"] = item;
      }
      return found;
    });
  });
  return result;
};

const copy = (labMap) => {
  const len = labMap.length;
  const labMapCopy = new Array(len);
  for (let i = 0; i < len; i++) {
    if (!labMapCopy[i]) labMapCopy[i] = new Array(len);
    for (let j = 0; j < len; j++) {
      labMapCopy[i][j] = labMap[i][j];
    }
  }
  return labMapCopy;
};

const partOneMoveGuardUntilOutOfRoom = (labMap, guard) => {
    // The steps map has an "X" anywhere that the guard stepped.
    // Actually, it has an object, and the object has an "X" property.
    // This was done for part 2.
    const len = labMap.length;
    const max = len;
    const min = -1;
    const stepsMap = new Array(len);
    for (let i = 0; i < len; i++) {
      stepsMap[i] = new Array(len);
    }
    const validPosition = (guard) => {
      return (
        guard["row"] < max &&
        guard["row"] > min &&
        guard["col"] < max &&
        guard["col"] > min
      );
    };
    let isInLab = validPosition(guard);
    while (isInLab) {
      if (shouldMoveForward(guard, labMap)) {
        moveGuardForward(guard);
      } else {
        turnGuard(guard);
      }
      isInLab = validPosition(guard);
      if (isInLab) {
        if (stepsMap[guard["row"]][guard["col"]]) {
          // We were here before.
          // Do we currently have the same direction as before?
          const currentDirection = guard["dir"];
          const previousDirections = stepsMap[guard["row"]][guard["col"]]["dir"];
          if (previousDirections.includes(currentDirection)) {
            // We have been here before and we are pointed in the same direction.
            // This must mean we are in an infinite loop.
            throw new Error(`Guard is stuck in a loop`);
          }
          stepsMap[guard["row"]][guard["col"]]["dir"].push(guard["dir"]);
        } else {
          stepsMap[guard["row"]][guard["col"]] = {
            X: "X",
            row: guard["row"],
            col: guard["col"],
            dir: [guard["dir"]]
          }; // mark guard's step with "X"
        }
      } else {
        // console.log(`guard out of lab ${JSON.stringify(guard)}`);
      }
    }
    return stepsMap;
};

const printNxNArray = (arr) => {
  const max = arr.length;
  for (var k = 0; k < max; k++) {
    for (var m = 0; m < max; m++) {
      if (arr[k][m]) {
        const output = typeof arr[k][m] == 'string' ?
          arr[k][m] : JSON.stringify(arr[k][m]);
        process.stdout.write(output);
      } else {
        process.stdout.write("?");
      }
    }
    console.log('');
  }
};

const main = async (fileName) => {
  const { labMap } = await readData(fileName);
  const guard = findGuard(labMap);
  // originalLabMap shows the guard's original location
  const originalLabMap = copy(labMap);
  // Overwrite the guard.
  labMap[guard["row"]][guard["col"]] = ".";
  const rowInit = guard["row"];
  const colInit = guard["col"];
  // console.log(`initial position: row, col: ${rowInit} ${colInit}`);
  const len = labMap.length;
  const max = len;
  if (part == "1") {
    // get corresponding map with "X" marking spot where guard stepped.
    const stepsMap = partOneMoveGuardUntilOutOfRoom(labMap, guard);
    let numX = 0;
    for (var k = 0; k < max; k++) {
      for (var m = 0; m < max; m++) {
        if (!stepsMap[k][m]) {
          // process.stdout.write(labMap[k][m]);
        } else {
          numX++;
          // process.stdout.write(stepsMap[k][m] + "");
        }
      }
    }
    console.log(`Found ${numX} positions.`);
  } else if (part == "2") {
    let numX = 0;
    for (var k = 0; k < max; k++) {
      for (var m = 0; m < max; m++) {
        // Lazy. Candidate for refactor TODO FIXME.
        // Get the guard again, because we didn't save it, and the original guard changed.
        const guard = findGuard(originalLabMap);
        const newLabMap = copy(originalLabMap);
        // Overwrite the guard's position as before.
        newLabMap[guard["row"]][guard["col"]] = ".";
        if (k == rowInit && m == colInit) {
          // Note when guard is found: you cannot put an obstacle there, skip.
          console.log(`Cannot place obstacle on guard: ` + originalLabMap[k][m]);
          continue;
        }
        // Place an obstacle at this position.
        newLabMap[k][m] = "#";
        try {
          partOneMoveGuardUntilOutOfRoom(newLabMap, guard);
        } catch (e) {
          numX++;
        }
      }
    }
    console.log(`Found ${numX} positions.`);
  }
};

main(fileName);
