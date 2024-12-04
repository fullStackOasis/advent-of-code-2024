/**
 * Advent of Code, day 4.
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

/**
 * Return value is an Object with a single "lines" element which is an array
 * of strings, each representing a row in the input file.
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
 * Find all instances of XMAS in the input string.
 * @param {*} input a string
 *
 * returns number of instances of XMAS in the input
 */
const findXMAS = (input) => {
  // might as well use a regex.
  const regex = /XMAS/g;
  const matches = input.match(regex);
  return matches?.length || 0;
};

const reverseString = (str) => {
  return str.split("").reverse().join("");
};

/**
 * Process the array of strings to get a count of the instances of XMAS
 * horizontally (in rows), and also backwards horizontally.
 * @param {*} array of strings
 *
 * returns number of instances of XMAS in all rows
 */
const findXMASHorizontally = (lines) => {
  let hCounter = 0;
  for (let i = 0; i < lines.length; i++) {
    hCounter += findXMAS(lines[i]);
    // also count backwards
    hCounter += findXMAS(reverseString(lines[i]));
  }
  // In the example, 5 is correct.
  console.log(`Found ${hCounter} horizontal instance(s) of XMAS`);
  return hCounter;
};

/**
 * Process the array of strings to get a count of the instances of XMAS
 * vertically (in columns), and also backwards (upwards)
 * @param {*} array of strings
 *
 * returns number of instances of XMAS in all columns
 */
const findXMASVertically = (lines) => {
  let vCounter = 0;
  const nRows = lines.length;
  const nColumns = lines[0].length;
  for (let col = 0; col < nColumns; col++) {
    let str = "";
    for (let row = 0; row < nRows; row++) {
      str += lines[row][col];
    }
    vCounter += findXMAS(str);
    vCounter += findXMAS(reverseString(str));
  }
  // In the example, 3 is correct.
  console.log(`Found ${vCounter} vertical instance(s) of XMAS`);
  return vCounter;
};

/**
 * Process the array of strings to get a count of the instances of XMAS
 * diagonally, and also backwards on left-leaning diagonals
 * @param {*} array of strings
 *
 * returns number of instances of XMAS in strings on the left-leaning diagonal
 */
const findXMASLeftLeaningDiagonally = (lines) => {
  // This is a pretty nasty algorithm.
  const n = lines.length;
  let counterLower = 0;
  // Get string on lower diagonal.
  // row = n-1 is the very bottom of the array.
  // Move up to top by decrementing row.
  for (let row = n - 1; row >= 0; row--) {
    let str = "";
    let i = row,
      j = 0; // Start at (row, 0)
    while (i < n && j < n) {
      str += lines[i][j];
      i++;
      j++;
    }
    counterLower += findXMAS(str);
    counterLower += findXMAS(reverseString(str));
    // Also, reverse this string, since backwards
  }
  // Loop over upper diagonal, starting with second column.
  let counterUpper = 0;
  for (let col = 1; col < n; col++) {
    let str = "";
    let i = 0,
      j = col;
    while (i < n && j < n) {
      str += lines[i][j];
      i++;
      j++;
    }
    counterUpper += findXMAS(str);
    counterUpper += findXMAS(reverseString(str));
  }
  console.log(`Found ${counterUpper} instance(s) of XMAS on upper diagonal`);
  console.log(`Found ${counterLower} instance(s) of XMAS on lower diagonal`);
  return counterUpper + counterLower;
};

/**
 * Process the array of strings to get a count of the instances of XMAS
 * diagonally, and also backwards on right-leaning diagonals
 * @param {*} array of strings
 *
 * returns number of instances of XMAS in strings on the right-leaning diagonal
 */
const findXMASRightLeaningDiagonally = (lines) => {
  // Instead of reimplementing the diagonal algorithm,
  // flip the array, and process with the original diagonal algo.
  const flipped = [];
  for (let col = 0; col < lines.length; col++) {
    flipped.push(reverseString(lines[col]));
  }
  return findXMASLeftLeaningDiagonally(flipped);
};

printArray = (lines) => {
  console.log(`Your array:`);
  for (let i = 0; i < lines.length; i++) {
    console.log(lines[i]);
  }
  console.log();
};

/**
 * A crosser is valid if char1 is "S" and char2 is "M" or vice versa.
 * @param {*} char1
 * @param {*} char2
 */
const isValidCrosser = (char1, char2) => {
  return (char1 == "S" && char2 == "M") || (char1 == "M" && char2 == "S");
};

/**
 * Search for MAS crossing another MAS at the "A",
 * return the count of all such instances. Looks
 * like only diagonal crossings are allowed.
 *
 * @param {*} lines
 */
const findMASCrossers = (lines) => {
  // Search for "A".
  // Check to see if upper right and lower left are "M"/"S"
  // AND lower right and upper left are "M"/"S".
  const n = lines.length - 1;
  let counter = 0;
  for (let x = 1; x < n; x++) {
    // "A" must be at center so skip edges
    for (let y = 1; y < n; y++) {
      const letter = lines[x][y];
      const upperLeft = lines[x - 1][y - 1];
      const upperRight = lines[x + 1][y - 1];
      const lowerLeft = lines[x - 1][y + 1];
      const lowerRight = lines[x + 1][y + 1];
      let isValid = letter == "A" && isValidCrosser(upperRight, lowerLeft) &&
        isValidCrosser(upperLeft, lowerRight);
      if (isValid) {
        counter++;
      }
    }
  }
  return counter;
};

const main = async (fileName) => {
  const { lines } = await readData(fileName);
  printArray(lines);

  if (part == "1") {
    const counter =
      findXMASHorizontally(lines) +
      findXMASVertically(lines) +
      findXMASLeftLeaningDiagonally(lines) +
      findXMASRightLeaningDiagonally(lines);
    console.log(`part 1: ${counter} instances of XMAS found`);
  } else if (part == "2") {
    const counter = findMASCrossers(lines);
    console.log(`part 2: ${counter} instances of crossed MAS found`);
  }
};

main(fileName);
