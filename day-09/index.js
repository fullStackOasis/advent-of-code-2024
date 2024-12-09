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

/**
 * Swaps a dot in the middle of the raw array with the input character.
 *
 * @param {*} raw the array of characters
 * @param {*} ch character to swap
 * @param {*} chPos character's original position
 */
const swapFirstDotWith = (raw, ch, chPos) => {
  const pos = raw.indexOf(".");
  raw[pos] = ch;
  raw[chPos] = ".";
};

/**
 * Turns the raw string like 2333133121414131402 to the compressed string, like
 * 0099811188827773336446555566..............
 * @param {*} raw
 * @returns
 */
const convertRawToCompressed = (raw) => {
  const DEBUG = false;
  // It is easy programmatically to manipulate this string if we split it into
  // an array of characters. You cannot mutate the string.
  const rawArray = raw.split("");
  // Get count of all elements that are "."
  let nDots = rawArray.filter((el) => el == ".").length;
  const len = rawArray.length;
  for (let i = len - 1; i > -1; i--) {
    const ch = rawArray[i];
    swapFirstDotWith(rawArray, ch, i);
    nDots--;
    if (nDots == 0) {
      break;
    }
    if (DEBUG) process.stdout.write(ch);
  }
  if (DEBUG) console.log("");
  return rawArray.join("");
};

/**
 * Turns the input line into the raw data like "0..111....22222"
 * @param {*} line
 * @returns
 */
const convertLineToRaw = (line) => {
  const DEBUG = false;
  if (DEBUG) console.log(line);
  const len = line.length;
  let idNumber = 0;
  let result = "";
  for (let i = 0; i < len; i++) {
    const num = line[i];
    const isFreeSpace = i % 2 == 1;
    for (let j = 0; j < num; j++) {
      const ch = isFreeSpace ? "." : idNumber + "";
      result += ch;
      if (DEBUG) process.stdout.write(ch);
    }
    if (isFreeSpace) {
      idNumber++;
    }
  }
  if (DEBUG) console.log("");
  return result;
};

const main = async (fileName) => {
  // Single line expected.
  const { line } = await readData(fileName);
  if (part == "1") {
    const raw = convertLineToRaw(line);
    const compressed = convertRawToCompressed(raw);
    console.log(`compressed: ${compressed}`);
  } else if (part == "2") {
    throw new Error(`unfinished`);
  }
};

main(fileName);
