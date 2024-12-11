/**
 * Advent of Code, day 11.
 * "Every time you blink, the stones each simultaneously change according to the first applicable rule in this list:
 * If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
 * If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
 * If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone."
 * 
 * Note: appears there is always one whitespace between two stones.
 */
const fs = require("fs").promises;

const { validateInput } = require("../lib");

const { fileName, part } = validateInput();

const NBLINKS = 1;

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

const log = (msg, DEBUG) => {
  if (DEBUG) console.log(msg);
};

const main = async (fileName) => {
  // rows of lines expected with numbers 0..9 filling them.
  const { lines } = await readData(fileName);
  console.log(lines);
  if (part == "1") {
    throw new Error(`not finished`);
  } else if (part == "2") {
    throw new Error(`not finished`);
  }
};

main(fileName);
