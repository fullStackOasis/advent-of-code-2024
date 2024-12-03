/**
 * Advent of Code, day 3.
 */
const fs = require("fs").promises;

const fileName = process.argv[2];

if (!fileName) {
  console.error(
    "Error: Please provide a file name as a command-line argument."
  );
  process.exit(1); // Exit with error code
}

// Part is a number, 1 or 2, meaning the "part" of the exercise to be completed.
const part = process.argv[3];

if (part != "1" && part != "2") {
  console.error(
    "Error: Please provide part (1 or 2) as a command-line argument."
  );
  process.exit(1); // Exit with error code
}

/**
 * Return value is an Object with a single "corrupted" element which is string
 * containing mangled words such as "mul(1,2)".
 *
 * @param {*} fileName name of the file to be read
 * @returns an Object with one element, "corrupted", which is a string
 */
const readData = async (fileName) => {
  const lines = [];
  try {
    const data = await fs.readFile(fileName.trim(), "utf8");
    data.split("\n").forEach((line) => {
      lines.push(line.trim());
    });
    const corrupted = lines.join();
    return { corrupted }
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }
};

/**
 * Use a regex to get matches to mul(n,n) where n is an integer with digits
 * 1-9 and no longer than 3 in length.
 * @param {*} input a string
 * @param {*} example number, either 1 or 2
 * 
 * returns an array of matches like [ 'mul(2,4)', 'mul(5,5)'... ]
 */
const findMatches = (input, exampleNumber) => {
  const regex = exampleNumber == 2 ?
    /mul\(\d{1,3},\d{1,3}\)|don't\(\)|do\(\)/g :
    /mul\(\d{1,3},\d{1,3}\)/g; // thank you ChatGPT
  const matches = input.match(regex);
  return matches;
};

/**
 * Loop over the matches to get the integers, multiply them, and add.
 * @param {*} matches
 * returns the summed result
 */
const multiplyMatchesThenAdd = (matches) => {
  const mul = (a, b) => { return a * b; };
  const results = matches.map(match => {
    // Extract the numbers from the match
    const [, a, b] = match.match(/mul\((\d{1,3}),(\d{1,3})\)/);
    return mul(Number(a), Number(b));
  });
  const total = results.reduce((sum, current) => sum + current, 0);
  return total;
};

/**
 * Loop over the matches to get the integers, as well as any do or don't
 * instructions. As needed, multiply them, then add.
 *
 * @param {*} matches
 * returns the result
 */
const doDontMultiplyMatchesThenAdd = (matches) => {
  const mul = (a, b) => { return a * b; };
  let doOperation = true;
  const results = matches.map(match => {
    // Extract the numbers from the match
    const [, a, b] = match.match(/mul\((\d{1,3}),(\d{1,3})\)/) || [];
    if (a && b) {
      return doOperation ? mul(Number(a), Number(b)) : 0;
    } else {
      const dont = match.match(/don't\(\)/);
      const doit = match.match(/do\(\)/);
      if (dont) {
        doOperation = false;
      } else if (doit) {
        doOperation = true;
      } else {
        // Help debug, but should not get here.
        console.log(`dont: ${dont} doit: ${doit} match: ${match} ${a} ${b}`);
        throw new Error(`invalid match`);
      }
      return 0;
    }
  });
  const total = results.reduce((sum, current) => sum + current, 0);
  return total;
};

const main = async (fileName) => {
  const { corrupted } = await readData(fileName);
  const matches = findMatches(corrupted, Number(part));
  if (part == "1") {
    const total = multiplyMatchesThenAdd(matches);
    console.log(`total part 1: ${total}`);
  } else if (part == "2") {
    const total = doDontMultiplyMatchesThenAdd(matches);
    console.log(`total part 2: ${total}`);
  }
};

main(fileName);
