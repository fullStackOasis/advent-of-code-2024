/**
 * Advent of Code, day 9.
 *
 */
const fs = require("fs").promises;

const { validateInput } = require("../lib");

const { fileName, part } = validateInput();

/**
 * Return value is an Object with a single "line" element.
 *
 * @param {*} fileName name of the file to be read
 * @returns an Object with one element, "lines", which is an array of string
 */
const readData = async (fileName) => {
  try {
    const line = await fs.readFile(fileName.trim(), "utf8");
    return { line };
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }
};

const main = async (fileName) => {
  // Single line expected.
  const { line } = await readData(fileName);
  console.log(line);
  if (part == "1") {
  } else if (part == "2") {
  }
  throw new Error(`unfinished`);

};

main(fileName);
