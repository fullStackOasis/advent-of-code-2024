/**
 * Advent of Code, day 7.
 * 
 * Rules:
 * Operators are always evaluated left-to-right
 * Operators are always placed in whitespace?
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

const main = async (fileName) => {
  throw new Error(`incomplete`);
  if (part == "1") {
  } else if (part == "2") {
    console.log(`Found ${numX} positions.`);
  }
};

main(fileName);
