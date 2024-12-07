/**
 * Advent of Code, day 7.
 *
 * Rules:
 * Operators are always evaluated left-to-right
 * Operators are always placed in whitespace?
 */
const fs = require("fs").promises;

const { validateInput } = require("../lib");

const { fileName, part } = validateInput();

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

/**
 * Apply all possible combinations of operators to the operands, and return
 * the number of results that equal the expected result.
 *
 * @param {*} Object with properties result (integer) and operands (array of
 * integers)
 * @returns
 */
const applyOperatorsInAllPossibleOrders = ({ result, operands }) => {
  console.log(`result: ${result} operands: ${operands}`);
  // Simple algorithm but not extensible, realistically. Just get something working.
  if (operands.length == 2) {
    const result1 = operands[0] + operands[1] == result;
    const result2 = operands[0] * operands[1] == result;
    return result1 && result2 ? result*2 : result1 || result2 ? result : 0;
  }
  throw new Error(`incomplete`);
};

const loopOverData = (linesOfData) => {
  const len = linesOfData.length;
  for (let i = 0; i < len; i++) {
    const result = linesOfData[i].shift();
    const n = applyOperatorsInAllPossibleOrders({
      result,
      operands: linesOfData[i],
    });
    console.log(`loopOverData got n = ${n}`);
  }
};

const main = async (fileName) => {
  if (part == "1") {
    const linesOfData = await readData(fileName);
    loopOverData(linesOfData);
  } else if (part == "2") {
  }
  throw new Error(`incomplete`);
};

main(fileName);
