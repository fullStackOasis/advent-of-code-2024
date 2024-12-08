/**
 * Advent of Code, day 8.
 *
 */
const fs = require("fs").promises;

const { validateInput } = require("../lib");

const { fileName, part } = validateInput();

/**
 * Return value is an Object with a single "lines" element which is an array
 * of strings, each representing a row in the input file.
 * Same as day 4?
 *
 * @param {*} fileName name of the file to be read
 * @returns an Object with one element, "lines", which is an array of string
 */
const readData = async (fileName) => {
  const lines = [];
  try {
    const data = await fs.readFile(fileName.trim(), "utf8");
    data.split("\n").forEach((line) => {
      lines.push(line.trim());
    });
    return { lines };
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }
};

/**
 * col and row cannot exceed n, and cannot be less than 0.
 * @param {*} antinode Object with col and row
 */
const isValidAntinode = (n, antinode) => {
  const max = n;
  return antinode.col < max && antinode.col > -1 &&
    antinode.row < max && antinode.row > -1;
};

// Return an array of objects with col and row
const getAntinodes = (part2, antenna1, lines, antenna2) => {
  // Kind of a horrible algorithm, but quick.
  const n = lines.length;
  // row and col are always after antenna's row and col.
  const diffCol = Math.abs(antenna1.col - antenna2.col);
  const diffRow = Math.abs(antenna1.row - antenna2.row);
  const antinodes = [];
  if (antenna1.col > antenna2.col) {
    // antenna1 is to the right of antenna2
    // ........0... antenna1
    // .....0...... antenna2
    // first antinode is to upper right
    let antinode1 = {
      col: antenna1.col + diffCol,
      row: antenna1.row - diffRow,
    };
    let inc = 1;
    while (isValidAntinode(n, antinode1)) {
      antinodes.push(antinode1);
      if (part2) {
        inc++;
        antinode1 = {
          col: antenna1.col + inc*diffCol,
          row: antenna1.row - inc*diffRow,    
        };
      } else {
        antinode1 = {};
      }
    }
    // second antinode is to lower left
    let antinode2 = {
      col: antenna2.col - diffCol,
      row: antenna2.row + diffRow,
    };
    inc = 1;
    while (isValidAntinode(n, antinode2)) {
      antinodes.push(antinode2);
      if (part2) {
        inc++;
        antinode2 = {
          col: antenna2.col - inc*diffCol,
          row: antenna2.row + inc*diffRow,    
        };
      } else {
        antinode2 = {};
      }
    }
  } else {
    // antenna2 is to the right of antenna1
    // .....0...... antenna1
    // .......0.... antenna2
    // first antinode is to upper left
    let antinode1 = {
      col: antenna1.col - diffCol,
      row: antenna1.row - diffRow,
    };
    let inc = 1;
    while (isValidAntinode(n, antinode1)) {
      antinodes.push(antinode1);
      if (part2) {
        inc++;
        antinode1 = {
          col: antenna1.col - inc*diffCol,
          row: antenna1.row - inc*diffRow,    
        };
      } else {
        antinode1 = {};
      }
    }
    // second antinode is to lower right
    inc = 1;
    let antinode2 = {
      col: antenna2.col + diffCol,
      row: antenna2.row + diffRow,
    };
    while (isValidAntinode(n, antinode2)) {
      antinodes.push(antinode2);
      if (part2) {
        inc++;
        antinode2 = {
          col: antenna2.col + inc*diffCol,
          row: antenna2.row + inc*diffRow,    
        };
      } else {
        antinode2 = {};
      }
    }
  }
  /* debugging
  if (!antinodes.length) {
    console.log(`No antinodes for ${JSON.stringify(antenna1)} ${JSON.stringify(antenna2)}`);
  } else {
    console.log(`Antinodes for ${JSON.stringify(antenna1)} ${JSON.stringify(antenna2)}`);
  }
  */
  return antinodes;
};

/**
 * Starting at x, y, find the next non "." character in lines.
 * Prints the character and its position.
 *
 * @param {*} part2 is true of false if working on part 1
 * @param {*} storage stores antinodes when found 
 * @param {*} antenna is the original antenna, we search for another antenna
 * after it (right and down) in the map, with the same frequency
 * @param {*} lines original array of characters
 * @param {*} row where we start searching
 * @param {*} col where we start searching
 */
const findNextCharacterPosition = (part2, storage, antenna, lines, row, col) => {
  // search beginning at (row, col), excluding (row, col)
  const n = lines.length;
  // Compute the next position, then check to see if there's same antenna there.
  // Traverse right and down.
  const nextCol = col + 1 >= n ? 0 : col + 1;
  const nextRow = nextCol == 0 ? row + 1 : row;

  if (nextRow >= n) return [];

  if (antenna.freq == lines[nextRow][nextCol]) {
    // Found a pair. You can only have antinodes around a pair.
    const antinodes = getAntinodes(part2, antenna, lines, {
      freq: antenna.freq, row: nextRow, col: nextCol
    });
    antinodes.push({row: antenna.row, col: antenna.col});
    antinodes.push({row: nextRow, col: nextCol});
    if (antinodes.length) {
      antinodes.forEach(antinode => storage.push(antinode));
    }
  }
  findNextCharacterPosition(part2, storage, antenna, lines, nextRow, nextCol);
};

const isAntenna = (element) => {
  // return "frequency" if this is an antenna, otherwise false.
  return element != '.' ? element : false;
};

// for debugging
const printArray = (n, antinodes, antennae) => {
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      if (antinodes.some(el => el.col == col && el.row == row)) {
        process.stdout.write('#');
      } else if (antennae.some(el => el.col == col && el.row == row)) {
        const antenna = antennae.find(el => el.col == col && el.row == row);
        process.stdout.write(antenna.freq);
      } else {
        process.stdout.write('.');
      }
    }
    process.stdout.write('\n');
  }
};

const findUniqueAntinodes = (lines, part2) => {
  const n = lines.length;
  const storage = [];
  const antennae = [];
  lines.forEach((el, row) => { // move down rows
    for (let col = 0; col < n; col++) { // move across columns
      const foundAntenna = isAntenna(el[col]);
      if (foundAntenna) {
        const antenna = {freq: foundAntenna, row: row, col: col};
        antennae.push(antenna);
        // console.log(`Looping, found antenna ${JSON.stringify(antenna)} at row=${row} col=${col}`);
        findNextCharacterPosition(part2, storage,
          antenna, lines, row, col);
      }
    }
  });

  const uniques = {};
  storage.forEach((el, i) => {
    // Note: when you stringify an object you cannot guarantee order in which
    // properties are printed so stringify is non-determinate for a key.
    // Meaning, you might get one key {"col":2,"row":3} and another key
    // {"row":3,"col":2} and they represent the same point.
    // So, instead, stringify an array, where order is guaranteed.
    const key = JSON.stringify([el.row, el.col]);
    uniques[key] = el;
  });
  console.log(`Found ${storage.length} antinodes.`);
  console.log(`Found ${Object.keys(uniques).length} unique antinodes.`);
  // antennae.forEach((el, i) => console.log(JSON.stringify(el)));
  // printArray(n, storage, antennae);
};

// Solution is kind of ugly but I don't want to spend more time making it nicer.
const main = async (fileName) => {
  // Looks like we can assume an nxn array.
  const { lines } = await readData(fileName);
  if (part == "1") {
    findUniqueAntinodes(lines, false);
  } else if (part == "2") {
    findUniqueAntinodes(lines, true);
  }
};

main(fileName);
