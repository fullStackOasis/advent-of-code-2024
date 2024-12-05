/**
 * Advent of Code, day 5.
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
 * Return value is an Object with two elements which are arrays of strings:
 * pageOrderingRules, pageNumbersOfUpdate.
 *
 * @param {*} fileName name of the file to be read
 * @returns an Object with two arrays of strings
 */
const readData = async (fileName) => {
  try {
    const pageOrderingRules = [];
    const pageNumbersOfUpdate = [];
    const data = await fs.readFile(fileName.trim(), "utf8");
    let readingRules = true;
    data.split("\n").forEach((line) => {
      const row = line.trim();
      if (!row) {
        readingRules = false;
        return;
      }
      if (readingRules) {
        pageOrderingRules.push(row);
      } else {
        pageNumbersOfUpdate.push(row);
      }
    });
    return { pageOrderingRules, pageNumbersOfUpdate };
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }
};

printArray = (lines) => {
  console.log(`Your array:`);
  for (let i = 0; i < lines.length; i++) {
    console.log(lines[i]);
  }
  console.log();
};

const main = async (fileName) => {
  const { pageOrderingRules,
    pageNumbersOfUpdate } = await readData(fileName);
  printArray(pageOrderingRules);
  printArray(pageNumbersOfUpdate);

  if (part == "1") {
    throw new Error('Part 1 not done');
  } else if (part == "2") {
    throw new Error('Part 2 not done');
  }
};

main(fileName);
