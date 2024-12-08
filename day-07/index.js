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
  const max = operands.length - 1;
  const permutations = generatePermutations(max);
  let total = 0;
  const plen = permutations.length;
  const olen = operands.length;
  for (let p = 0; p < plen; p++) {
    const permutation = permutations[p];
    let sum = Number(operands[0]);
    for (let i = 1; i < olen; i++) {
      if (permutation[i-1] == "0") {
        sum = sum + Number(operands[i]);
      } else {
        sum = sum * Number(operands[i]);
      }
    }
    if (sum == result) {
      // console.log(`Match when result is ${result} ${permutation}`);
      total += sum;
      // No need to search for more; just return
      return total;
    }
  };
  return 0;
};

const generatePermutations = (n) => {
  return Array.from({ length: 2 ** n }, (_, i) => i.toString(2).padStart(n, '0'));
}

const loopOverData = (linesOfData) => {
  const len = linesOfData.length;
  let total = 0;
  for (let i = 0; i < len; i++) {
    const result = linesOfData[i].shift();
    const n = applyOperatorsInAllPossibleOrders({
      result,
      operands: linesOfData[i],
    });
    total += n;
  }
  return total;
};

const main = async (fileName) => {
  if (part == "1") {
    const linesOfData = await readData(fileName);
    const totalFound = loopOverData(linesOfData);
    console.log(`Total of all matches: ${totalFound}`);
  } else if (part == "2") {
    throw new Error(`incomplete`);
  }
};

main(fileName);
