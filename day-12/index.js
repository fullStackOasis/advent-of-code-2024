/**
 * Advent of Code, day 12.
 */
const fs = require("fs").promises;

const { validateInput } = require("../lib");

const { fileName, part, extra } = validateInput();

/**
 * Return value is an Object with a single "line" element.
 *
 * @param {*} fileName name of the file to be read
 * @returns an Object with one element, "lines", which is an array of string
 */
const readData = async (fileName) => {
  try {
    const lines = [];
    const data = await fs.readFile(fileName.trim(), "utf8");
    data.split(" ").forEach((line) => {
      lines.push(line.trim());
    });
    return { lines };
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }
};

// part 1: node index.js input.txt 1
// part 2: node index.js input.txt 2
const main = async (fileName) => {
  // rows of lines expected with numbers 0..9 filling them.
  const { lines: stones } = await readData(fileName);

  if (part == "1") {
  } else if (part == "2") {
  }
  throw new Error(`not done`);
};

main(fileName);
