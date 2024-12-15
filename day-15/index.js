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

const printWarehouse = (warehouse, robot) => {
  console.log(`printing:`);
  console.log(JSON.stringify(robot));
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
  // start just next to robot, and move away, searching for a space OR
  // a blockage (wall)
  for (let i = nextPos; cond(i); i = fn(i)) {
    if (isWall(warehouseRow[i])) {
      foundSpace = false;
      break;
    }
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
    const condHorizontal = dir == -1 ? (i) => { return i < robot.col } :
      (i) => { return i > robot.col }; // TODO FIXME. Why is this not working?
    const condVertical = dir == -1 ? (i) => { return i < robot.row } :
      (i) => { return i > robot.row }; // TODO FIXME. Why is this not working?
    const cond2 = horizontal ? condHorizontal : condVertical;
    for (let i = spacePos; cond2(i); i = fn2(i)) {
      swapCol(i, i-dir, warehouseRow, horizontal);
    }
    if (horizontal) {
      robot.col = robot.col + dir; // update robot's col
    } else {
      robot.row = robot.row + dir;
    }
    
  }
};

// If moving left, dir is -1.
// If moving right, dir is +1.
const moveRobotHorizontally = (robot, warehouseRow, dir, horizontally) => {
  const nextPos = horizontally ? robot.col + dir : robot.row + dir;
  const robotPos = horizontally ? robot.col : robot.row;
  // interchange these two elements in this row.
  swapCol(nextPos, robotPos, warehouseRow, horizontally);
  if (horizontally) {
    robot.col = nextPos; // update robot's col
  } else {
    robot.row = nextPos;
  }
};

// If moving left, dir is -1, horizontally is true
// If moving right, dir is +1, horizontally is true
// If moving up, dir is -1, horizontally is false
// If moving down, dir is +1, horizontally is false
const move = (robot, warehouse, dir, horizontally) => {
  console.log(`horizontally ${horizontally}`);
  const getRow = (warehouse, col) => {
    const result = [];
    const len = warehouse[0].length;
    for (let i = 0; i < len; i++) {
      // console.log(col + " " + i);
      result.push(warehouse[i][col]);
    }
    console.log(`result: ${JSON.stringify(result)}`);
    return result;
  }
  const row = horizontally ? warehouse[robot.row] :
    getRow(warehouse, robot.col);
  // If moving right or left, find out which row in the warehouse to move in:
  const currentPos = horizontally ? robot.row : robot.col;
  // What is the next position that the robot moves to:
  const nextPos = horizontally ? robot.col + dir : robot.row + dir;
  const nextObject = row[nextPos];
  console.log(`What is nextObject? ${nextObject} and what is robot ${JSON.stringify(robot)}`);
  if (isWall(nextObject)) {
    console.log(`is wall`);
    return;
  }
  if (isSpace(nextObject)) {
    console.log(`is space`);
    console.log(row);
    moveRobotHorizontally(robot, row, dir, horizontally);
    if (!horizontally) {
      const len = warehouse.length;
      for (let i = 0; i < len; i++) {
        console.log(row[i]);
        warehouse[i][robot.col] = row[i];
      }
    }
    return;
  }
  if (isBox(nextObject)) {
    pushBoxHorizontally(robot, row, dir, horizontally);
    if (!horizontally) {
      const len = warehouse.length;
      for (let i = 0; i < len; i++) {
        warehouse[i][robot.col] = row[i];
      }
    }
    return;
  }
  if (isRobot(nextObject)) {
    console.log(`oops`);
    throw new Error(`Not allowed`);
  }
};

const swapCol = (x1, x2, arr, horizontally) => {
  if (horizontally) {
    const hlp = arr[x1];
    arr[x1] = arr[x2];
    arr[x2] = hlp;
  } else {
    const hlp = arr[x1];
    arr[x1] = arr[x2];
    arr[x2] = hlp;
    console.log(`After swapping, the array is ${JSON.stringify(arr)}`);
  }
};

const getGPS = (warehouse) => {
  let total = 0;
  warehouse.forEach((row, j) => { // j is distance from left
    row.forEach((col, i) => { // i is distance from top
      const ch = warehouse[i][j];
      if (isBox(ch)) {
        // sum
        console.log(`O? warehouse[${i}][${j}] is ${ch}`);
        total += 100 * i + j;
      }
      // console.log(`O? ${i} ${j} ${ch}`);
    });
  });
  return total;
};

// part 1: node index.js input.txt 1
// part 2: node index.js input.txt 2
const main = async (fileName) => {
  const { robot, warehouse, movements } = await readData(fileName);
  //console.log(JSON.stringify(robots, '', ''));
  printWarehouse(warehouse);
  if (part == "1") {
    console.log(`original:`)
    printWarehouse(warehouse);
    const left = -1;
    const right = 1;
    const map = {
      "<": {dir: left, horizontally: true, pretty: "left"},
      ">": {dir: right, horizontally: true, pretty: "right"},
      "^": {dir: left, horizontally: false, pretty: "up"},
      "v": {dir: right, horizontally: false, pretty: "down"},
    };
    movements.forEach((movement, i) => {
      const obj = map[movement];
      console.log(i+1 + " " + JSON.stringify(obj));
      move(robot, warehouse, obj.dir, obj.horizontally);
      printWarehouse(warehouse, robot);
    });
    /*
    move(robot, warehouse, right, false);
    printWarehouse(warehouse);
    */
    /*
    printWarehouse(warehouse);  
    // map["<"](robot, warehouse);
    for (let j = 0; j < 5; j++) {
      console.log(`move left:`);
      move(robot, warehouse, left, false);
      printWarehouse(warehouse);
    }
      */
    const gps = getGPS(warehouse);
    console.log(`Total GPS is ${gps}`);
    /*
    for (let j = 0; j < 5; j++) {
      console.log(`move right:`);
      move(robot, warehouse, right, true);
      printWarehouse(warehouse);  
    }
    for (let j = 0; j < 2; j++) {
      console.log(`move up:`);
      move(robot, warehouse, left, false);
      printWarehouse(warehouse);  
    }
      */
  } else if (part == "2") {
  }
  throw new Error(`not done`);
};

main(fileName);
