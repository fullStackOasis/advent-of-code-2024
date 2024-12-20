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

/**
 * See rules at top of code.
 * Given a stone, this function tells us what replaces it.
 *
 * @param {*} stone
 */
const getRuleResultAsArray = (stone) => {
  if (stone == "0") {
    return [1];
  } else if (stone.length % 2 == 0) {
    // split in half:
    const firstHalf = stone.substring(0, stone.length / 2);
    const secondHalf = stone.substring(stone.length / 2, stone.length);
    return [Number(firstHalf), Number(secondHalf)];
  } else {
    // multiply by 2024
    return [stone * 2024];
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
  let result = "";
  let word = "";
  const processWord = (word) => {
    const ruleResult = getRuleResult(word).split(" ");
    // console.log(`word |${word}| rule result |${JSON.stringify(ruleResult)}|`)
    let tmp = "";
    let sep = "";
    for (let j = 0; j < ruleResult.length; j++) {
      tmp += sep + ruleResult[j];
      if (j == 0) sep = " ";
    }
    return tmp;
  };
  for (let i = 0; i < len; i++) {
    const ch = stones[i];
    if (ch == " ") {
      const tmp = processWord(word);
      result = (result + " " + tmp).trim();
      // console.log(`word=|${word}|, tmp=|${tmp}|, result=|${result}|`);
      word = "";
    } else {
      word += ch;
    }
  }
  // There will be one remaining word that did not get processed.
  // Process it now.
  result += " " + processWord(word);
  return result.trim();
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

// stones is a string with whitespace.
const getPart2NumberOfStones = (stones) => {
  const len = stones.length;
  let counter = 1;
  for (let i = 0; i < len; i++) {
    if (stones[i] == " ") counter++;
  }
  return counter;
};

const runPart2UsingPart1 = () => {
  let currentStones = stones;
  let i = 0;
  for (i = 0; i < NBLINKS; i++) {
    // printStones(currentStones);
    currentStones = applyPart1Rules(currentStones);
  }
  return currentStones.length;
};

// This performs even worse than the original!
// Not a win.
const runPart2UsingPart2 = (stones) => {
  let currentStones = stones.join(" ");
  let i = 0;
  for (i = 0; i < NBLINKS; i++) {
    currentStones = applyPart2Rules(currentStones);
  }
  const len = getPart2NumberOfStones(currentStones);
  return len;
};

// stones is an array
const runUsingRecursion = (stones) => {
  // console.log(stones);
  let counter = 0;
  let total = 0;
  for (i = 0; i < stones.length; i++) {
    let stone = stones[i];
    let x = workOnStone(counter, stone);
    total += x;
  }
  console.log(`total: ${JSON.stringify(total)}`);
  return total;
};
// 872*2024 = 1764928

// Returns a number. Counter is a number, stone is a string
const workOnStone = (counter, stone) => {
  if (counter >= NBLINKS) {
    return 1;
  }
  let retValue = 0;
  // let result = " ";
  const ruleResult = getRuleResult(stone).split(" ");
  if (ruleResult.length > 1) {
    // console.time("first");
    let hlp1 = workOnStone(counter + 1, ruleResult[0]);
    // result += " " + hlp1;
    retValue += hlp1;
    // console.timeEnd("first");
    // console.time("second");
    let hlp2 = workOnStone(counter + 1, ruleResult[1]);
    // console.timeEnd("second");
    // result += " " + hlp2;
    retValue += hlp2;
  } else {
    // console.time("third");
    let hlp3 = workOnStone(counter + 1, ruleResult[0]);
    // result += " " + hlp3;
    retValue += hlp3;
    // console.timeEnd("third");
  }
  // console.log(`Counter was not too big, returning ${retValue}, counter ${counter}`);
  return retValue; //result;
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
      // printStones(currentStones);
      currentStones = applyPart1Rules(currentStones);
    }
    printStones(currentStones);
    console.log(
      `There are ${currentStones.length} stones in front of you after ${NBLINKS} blinks`
    );
  } else if (part == "2") {
    const len = runUsingRecursion(stones);
    console.log(
      `There are ${len} stones in front of you after ${NBLINKS} blinks`
    );
  }
};

main(fileName);
