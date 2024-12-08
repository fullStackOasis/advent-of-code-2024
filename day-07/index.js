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
const applyOperatorsInAllPossibleOrders = ({ result, operands, fun }) => {
  const max = operands.length - 1;
  const permutations = fun(max);
  let total = 0;
  const plen = permutations.length;
  const olen = operands.length;
  for (let p = 0; p < plen; p++) {
    const permutation = permutations[p];
    let sum = Number(operands[0]);
    for (let i = 1; i < olen; i++) {
      if (permutation[i-1] == "0") {
        sum = sum + Number(operands[i]);
      } else if (permutation[i-1] == "1") {
        sum = sum * Number(operands[i]);
      } else if (permutation[i-1] == "2") {
        sum = Number(sum + operands[i]);
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

// Candidate for refactor
const generatePermutationsOfTwo = (n) => {
  return Array.from({ length: 2 ** n }, (_, i) => i.toString(2).padStart(n, '0'));
};

// Candidate for refactor
const generatePermutationsOfThree = (n) => {
  return Array.from({ length: 3 ** n }, (_, i) => i.toString(3).padStart(n, '0'));
};

const loopOverData = (linesOfData, fun) => {
  const len = linesOfData.length;
  let total = 0;
  for (let i = 0; i < len; i++) {
    const result = linesOfData[i].shift();
    const n = applyOperatorsInAllPossibleOrders({
      fun,
      result,
      operands: linesOfData[i],
    });
    total += n;
  }
  return total;
};

const main = async (fileName) => {
  const linesOfData = await readData(fileName);
  if (part == "1") {
    const totalFound = loopOverData(linesOfData, generatePermutationsOfTwo);
    console.log(`Total of all matches: ${totalFound}`);
  } else if (part == "2") {
    const totalFound = loopOverData(linesOfData, generatePermutationsOfThree);
    console.log(`Total of all matches: ${totalFound}`);
  }
};

main(fileName);
