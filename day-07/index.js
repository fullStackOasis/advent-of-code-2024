/**
 * Advent of Code, day 7.
 * 
 * Rules:
 * Operators are always evaluated left-to-right
 * Operators are always placed in whitespace?
 */
const fs = require("fs").promises;

const { validateInput } = require("../lib");

const {fileName, part} = validateInput();

/**
 * Reads data from fileName, and returns an array of arrays, such as
 * [[ '190', '10', '19' ],...]. The first element will be the "result" of the
 * remaining elements with operators applied. See instructions.
 *
 * @param {*} fileName
 * @returns array
 */
const readData = async (fileName) => {
  try {
    const lines = [];
    const data = await fs.readFile(fileName.trim(), "utf8");
    data.split("\n").forEach((line, i) => {
      const row = line.trim();
      lines.push(row.match(/\d+/g));
    });
    return lines;
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }
};

const main = async (fileName) => {
  if (part == "1") {
    const linesOfData = await readData(fileName);
  } else if (part == "2") {
  }
  throw new Error(`incomplete`);
};

main(fileName);
