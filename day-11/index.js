/**
 * Advent of Code, day 11.
 * "Every time you blink, the stones each simultaneously change according to the first applicable rule in this list:
 * If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
 * If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
 * If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone."
 *
 * Note: appears there is always one whitespace between two stones.
 *
 * Comment: at 41 nblinks, there was a core dump with:
 * "Fatal JavaScript invalid size error 188720663"
 * Maximum size of an array in JavaScript is 4294967295.
 * Search results say you may run into memory problems earlier, however.
 */
const fs = require("fs").promises;

const { validateInput } = require("../lib");

const { fileName, part, extra } = validateInput();

const NBLINKS = extra ? extra : 6;

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

/**
 * See rules at top of code.
 * Given a stone, this function tells us what replaces it.
 *
 * @param {*} stone
 */
const getRuleResult = (stone) => {
  if (stone == "0") {
    return "1";
  } else if (stone.length % 2 == 0) {
    // split in half:
    const firstHalf = stone.substring(0, stone.length / 2);
    const secondHalf = stone.substring(stone.length / 2, stone.length);
    return Number(firstHalf) + " " + Number(secondHalf);
  } else {
    // multiply by 2024
    return stone * 2024 + "";
  }
};

// Input is an array
const applyPart1Rules = (stones) => {
  const len = stones.length;
  const result = new Array();
  for (let i = 0; i < len; i++) {
    const stone = stones[i];
    const ruleResult = getRuleResult(stone).split(" ");
    for (let j = 0; j < ruleResult.length; j++) {
      result.push(ruleResult[j]);
    }
  }
  return result;
};

// Input is a string
const applyPart2Rules = (stones) => {
  const len = stones.length;
  const result = new Array();
  let word = "";
  const processWord = (word, ) => {
    const ruleResult = getRuleResult(word).split(" ");
    for (let j = 0; j < ruleResult.length; j++) {
      result.push(ruleResult[j]); // TODO
    }
    return ruleResult;
  }
  for (let i = 0; i < len; i++) {
    const ch = stones[i];
    if (ch == " ") {
      const ruleResult = processWord(word); // TODO
      word = "";
    } else {
      word += ch;
    }
  }
  // There will be one remaining word that did not get processed.
  // Process it now.
  processWord(word);
  return result;
};

const printStones = (stones) => {
  const len = stones.length;
  let sep = "";
  for (let i = 0; i < len; i++) {
    process.stdout.write(sep + stones[i]);
    if (i == 0) sep = " ";
  }
  process.stdout.write("\n");
};

// part 1: node index.js input.txt 1 25
// 199946
// part 2: node index.js input.txt 1 25
const main = async (fileName) => {
  // rows of lines expected with numbers 0..9 filling them.
  const { lines: stones } = await readData(fileName);

  if (part == "1") {
    let currentStones = stones;
    let i = 0;
    for (i = 0; i < NBLINKS; i++) {
      currentStones = applyPart1Rules(currentStones);
    }
    // printStones(currentStones);
    console.log(
      `There are ${currentStones.length} stones in front of you after ${NBLINKS} blinks`
    );
  } else if (part == "2") {
    let currentStones = stones.join(" ");
    // console.log(`init ${currentStones}`);
    let i = 0;
    for (i = 0; i < NBLINKS; i++) {
      currentStones = applyPart2Rules(currentStones);
      currentStones = currentStones.join(" ");
    }
    currentStones = currentStones.split(" ");
    // printStones(currentStones);
    console.log(
      `There are ${currentStones.length} stones in front of you after ${NBLINKS} blinks`
    );
    throw new Error(`not finished`);
  }
};

main(fileName);
