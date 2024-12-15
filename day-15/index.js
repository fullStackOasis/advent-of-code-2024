/**
 * Advent of Code, day 15.
 * 
 * The lanternfish warehouse.
 */
const fs = require("fs").promises;

const { validateInput } = require("../lib");

const { fileName, part } = validateInput();

/**
 * @param {*} fileName name of the file to be read
 * @returns an Object with two elements, "robot", "warehouse" an array of
 * arrays containing symbols that represent the warehouse, and the series
 * of attempted movements "movements"
 */
const readData = async (fileName) => {
  try {
    const robot = {};
    const warehouse = [];
    warehouse[0] = [];
    const movements = [];
    const data = await fs.readFile(fileName.trim(), "utf8");
    let isMovement = false;
    let row = 0;
    let col = 0;
    for (let i = 0; i < data.length; i++) {
      const ch = data[i];
      if (ch == " ") {
        isMovement = true;
      } else if (isMovement) {
        if (ch != "\n") {
          movements.push(data[i]);
        }
      } else if (ch == "\n") {
        warehouse.push([]);
        col = 0;
        row++; // rows advance vertically
      } else {
        warehouse[warehouse.length-1].push(ch);
        if (ch == "@") {
          robot.row = row;
          robot.col = col;
        }
        col++; // columns advance horizontally
      }
    }
    warehouse.pop();
    // console.log(JSON.stringify({ robot, warehouse, movements }))
    return { robot, warehouse, movements };
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }
};

const printWarehouse = (warehouse) => {
  console.log(`printing:`)
  warehouse.forEach(col => {
    col.forEach(item => {
      process.stdout.write(item);
    });
    console.log("");
  });
};

const isRobot = (ch) => {
  return ch == "@";
};

const isWall = (ch) => {
  return ch == "#";
};

const isSpace = (ch) => {
  return ch == ".";
};

const isBox = (ch) => {
  return ch == "O";
};

const decr = (i) => {
  return i - 1;
};

const incr = (i) => {
  return i + 1;
};


// If pushing left, dir is -1 and horizontal is true
// If pushing right, dir is +1 and horizontal is true
// If pushing up, dir is -1 and horizontal is false
// If pushing down, dir is +1 and horizontal is false
const pushBoxHorizontally = (robot, warehouseRow, dir, horizontal) => {
  const nextPos = horizontal ? robot.col + dir : robot.row + dir;
  const len = warehouseRow.length;
  let foundSpace = false;
  let spacePos = -1;
  const fn = dir == -1 ? decr : incr;
  const cond = dir == -1 ? (i) => { return i > 0 } :
    (i) => { return i < len };
  // start just next to robot, and move away, searching for a space.
  for (let i = nextPos; cond(i); i = fn(i)) {
    if (isSpace(warehouseRow[i])) {
      // There is space to move a box to the left/right of the robot.
      foundSpace = true;
      spacePos = i;
      break;
    }
  }
  console.log(`found space? ${foundSpace}`);
  if (foundSpace) {
    // starting at this space, swap everything from left to right OR
    // from right to left, depending on dir
    const fn2 = dir == -1 ? incr : decr;
    const cond2 = dir == -1 ? (i) => { return i < robot.col } :
      (i) => { return i > robot.col }; // TODO FIXME. Why is this not working?
    for (let i = spacePos; cond2(i); i = fn2(i)) {
      console.log(`swap ${i} with ${i+1}`);
      swapCol(i, i-dir, warehouseRow);
    }
    robot.col = robot.col + dir; // update robot's col
  }
};

// If moving left, dir is -1.
// If moving right, dir is +1.
const moveRobotHorizontally = (robot, warehouseRow, dir) => {
  const nextPos = robot.col + dir;
  // interchange these two elements in this row.
  swapCol(nextPos, robot.col, warehouseRow);
  robot.col = nextPos; // update robot's col
};

// If moving left, dir is -1, horizontally is true
// If moving right, dir is +1, horizontally is true
// If moving up, dir is -1, horizontally is false
// If moving down, dir is +1, horizontally is false
const move = (robot, warehouse, dir, horizontally) => {
  console.log(`horizontally ${horizontally}`);
  // If moving right or left, find out which row in the warehouse to move in:
  const currentPos = horizontally ? robot.row : robot.col;
  // What is the next position that the robot moves to:
  const nextPos = horizontally ? robot.col + dir : robot.row + dir;
  const nextObject = horizontally ? warehouse[currentPos][nextPos] :
    warehouse[nextPos][currentPos];
  if (isWall(nextObject)) {
    console.log(`is wall`);
    return;
  }
  if (isSpace(nextObject)) {
    console.log(`is space`);
    moveRobotHorizontally(robot, warehouse[currentPos], dir, horizontally);
    return;
  }
  if (isBox(nextObject)) {
    console.log(`is box`);
    pushBoxHorizontally(robot, warehouse[currentPos], dir, horizontally);
    return;
  }
  if (isRobot(nextObject)) {
    console.log(`oops`);
    throw new Error(`Not allowed`);
  }
};

const swapCol = (x1, x2, arr) => {
  const hlp = arr[x1];
  arr[x1] = arr[x2];
  arr[x2] = hlp;
  if (isRobot(hlp)) {
    hlp.col = x1;
  } else if (isRobot(arr[x1])) {
    hlp.col = x2;
  }
};

// part 1: node index.js input.txt 1
// part 2: node index.js input.txt 2
const main = async (fileName) => {
  const { robot, warehouse, movements } = await readData(fileName);
  //console.log(JSON.stringify(robots, '', ''));
  printWarehouse(warehouse);
  if (part == "1") {
    const map = {
      "<": move
    }
    // map["<"](robot, warehouse);
    console.log(`original:`)
    printWarehouse(warehouse);
    const left = -1;
    const right = 1;
    for (let j = 0; j < 5; j++) {
      console.log(`move left:`);
      move(robot, warehouse, left, true);
      printWarehouse(warehouse);
    }
    for (let j = 0; j < 5; j++) {
      console.log(`move right:`);
      move(robot, warehouse, right, true);
      printWarehouse(warehouse);  
    }
  } else if (part == "2") {
  }
  throw new Error(`not done`);
};

main(fileName);
