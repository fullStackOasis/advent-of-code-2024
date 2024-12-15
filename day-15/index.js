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

const pushBoxLeft = (robot, warehouseRow) => {
  const leftCol = robot.col-1;
  let foundSpace = false;
  let spacePos = -1;
  for (let i = leftCol; i > 0; i--) {
    if (isSpace(warehouseRow[i])) {
      // There is space to move a box to the left of the robot.
      foundSpace = true;
      spacePos = i;
      break;
    }
  }
  if (foundSpace) {
    // starting at this space, swap everything from left to right.
    for (let i = spacePos; i < robot.col; i++) {
      console.log(`swap ${i} with ${i+1}`);
      swapCol(i, i+1, warehouseRow);
    }
    robot.col--; // update robot's col
  }
};

const moveRobotLeft = (robot, warehouseRow) => {
  const leftPos = robot.col-1;
  // interchange these two elements in this row.
  swapCol(leftPos, robot.col, warehouseRow);
  robot.col = leftPos; // update robot's col
};

const moveLeft = (robot, warehouse) => {
  const currentRow = robot.row;
  const leftPos = robot.col - 1;
  const leftOfRobot = warehouse[currentRow][leftPos];
  if (isWall(leftOfRobot)) {
    console.log(`is wall`);
    return;
  }
  if (isSpace(leftOfRobot)) {
    console.log(`is space`);
    moveRobotLeft(robot, warehouse[currentRow]);
    return;
  }
  if (isBox(leftOfRobot)) {
    console.log(`is box`);
    pushBoxLeft(robot, warehouse[currentRow]);
    return;
  }
  if (isRobot(leftOfRobot)) {
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
      "<": moveLeft
    }
    movements.forEach(el => {
      console.log(el);
    });
    console.log(`move left:`);
    map["<"](robot, warehouse);
    printWarehouse(warehouse);
    console.log(`move left again:`);
    moveLeft(robot, warehouse);
    printWarehouse(warehouse);
    console.log(`move left again:`);
    moveLeft(robot, warehouse);
    printWarehouse(warehouse);
    console.log(`move left again:`);
    moveLeft(robot, warehouse);
    printWarehouse(warehouse);
    console.log(`move left again:`);
    moveLeft(robot, warehouse);
    printWarehouse(warehouse);
  } else if (part == "2") {
  }
  throw new Error(`not done`);
};

main(fileName);
