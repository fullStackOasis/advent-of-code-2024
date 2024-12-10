/**
 * Advent of Code, day 9.
 *
 * "The disk map uses a dense format to represent the layout of files and free
 * space on the disk. The digits alternate between indicating the length of a
 * file and the length of free space."
 *
 * The examples are not clear, but it sounds like digits can only be betwen 0
 * and 9. However, indices go from 0 to any large integer.
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

const log = (msg, DEBUG) => {
  if (DEBUG) console.log(msg);
}

const convertToArray = (str) => {
  const result = str.split("][");
  result[0] = result[0].replace("[", "");
  result[result.length-1] = result[result.length-1].replace("]", "");
  return result;
};

// Given an array like [1,1,1] return a string like [1][1][1]
const convertArrayToString = (arr) => {
  const len = arr.length;
  let str = "";
  for (let j = 0; j < len; j++) {
    str += "[" + arr[j] + "]";
  }
  return str;
};

// part 2 function. raw is an array of items like [0][0] or [6][6][6][6]
// ch is just one of those items, like [9][9] or [12][12] etc.
// chPos is the position of the ch value in the raw array.
const swapWithDotsIfPossible = (raw, ch, chPos) => {
  if (ch.indexOf(".") > -1) return;
  const DEBUG = false;
  // e.g. if ch is [9][9] returns 2, if [11][11] returns 2, if [.] returns 1 etc
  const getNumberOfItems = (ch) => {
    return (ch.match(/\[/g) || []).length;
  }
  // In part 2, you have to put the "ch" in any position that will hold it.
  // That means it goesin an "array" of dots that's as big or bigger than ch.
  // So we have to find that space, if any.
  const chLen = getNumberOfItems(ch); // 
  const pos = raw.findIndex((el, i) => {
    // item contains a "." and item is long enough to be replaced by
    // ch. E.g. if item is [.][.][.] it can be (partially) replaced by [9][9]
    // And, item is located before chPos
    return i < chPos && el.indexOf(".") > -1 && getNumberOfItems(el) >= chLen;
  });
  if (pos < 0) return; // item cannot be placed in "..." earlier in raw array
  // This pos will hold ch and perhaps more.
  const existingDots = raw[pos]; // [.][.][.]
  const tmpExistingDots = convertToArray(existingDots);
  const tmpCh = convertToArray(ch);
  raw.splice(pos, 1, ch); // replace dots with [11][11] in array
  const remainderLength = tmpExistingDots.length - tmpCh.length;
  // existingDots can be [.][.][.] and ch is [11][11].
  // In that case, [.][.][.] is replaced with [11][11], [.]
  if (remainderLength > 0) {
    // there are extra dots, splice them into the array after the new one
    const replacement = tmpExistingDots.splice(0, remainderLength);
    const dotsMovedLeft = tmpExistingDots;
    raw.splice(pos + 1, 0, convertArrayToString(replacement));
    raw.splice(chPos+1, 1, convertArrayToString(dotsMovedLeft));
  } else {
    raw.splice(chPos, 1);
    // exact match, so swap all existingDots to position where ch was
    raw.splice(chPos, 0, existingDots);
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
 * @returns the compressed array with numbers at the left where possible
 */
const convertRawToCompressed = (raw, part2) => {
  // It is easy programmatically to manipulate this string if we split it into
  // an array of characters. You cannot mutate the string.
  const splitOn = part2 ? ")(" : "][";
  const rawArray = raw.split(splitOn);
  const replaceFirst = part2 ? "(" : "[";
  const replaceLast = part2 ? ")" : "]";
  rawArray[0] = rawArray[0].replace(replaceFirst, "");
  rawArray[rawArray.length - 1] = rawArray[rawArray.length - 1].replace(
    replaceLast,
    ""
  );
  // Get count of all elements that are "."
  let nDots = rawArray.filter((el) => el == ".").length;
  const len = rawArray.length;
  for (let i = len - 1; i > -1; i--) {
    // This "ch" represents either freespace (".") or an index ("0", "21"  etc)
    const ch = rawArray[i];
    if (part2) {
      swapWithDotsIfPossible(rawArray, ch, i);
    } else {
      swapFirstDotWith(rawArray, ch, i);
    }
    nDots--;
    if (nDots == 0) {
      break;
    }
  }
  return rawArray;
};

/**
 * Turns the input line into the raw data like "0..111....22222"
 * @param {*} line
 * @param {*} part2 if true, put parenthesis around each block of same indices,
 * e.g. ([0][0])([.][.][.])...
 * @returns string e.g. ([0][0])([.][.][.])([1][1][1])...
 */
const convertLineToRaw = (line, part2) => {
  const len = line.length;
  let idNumber = 0;
  let result = "";
  for (let i = 0; i < len; i++) {
    const num = line[i];
    const isFreeSpace = i % 2 == 1;
    if (part2 && num != 0) result += "(";
    for (let j = 0; j < num; j++) {
      const ch = isFreeSpace ? "[.]" : `[${idNumber}]`;
      result += ch;
    }
    if (part2 && num != 0) result += ")";
    if (isFreeSpace) {
      idNumber++;
    }
  }
  return result;
};

/**
 * Compute "checksum" and return it.
 * @param {*} compressed
 */
const getChecksumFromCompressed = (compressed) => {
  const compressedArray = compressed;
  const len = compressedArray.length;
  let result = 0;
  for (let i = 0; i < len; i++) {
    if (compressedArray[i] == ".") continue;
    const n = i * new Number(compressedArray[i]);
    result += n;
  }
  return result;
};

// prints the array with digits and dots only
const printRawArray = (raw) => {
  const len = raw.length;
  for (let i = 0; i < len; i++) {
    const ch = raw[i].replaceAll("[", "").replaceAll("]","").replaceAll("(").replaceAll(")");
    process.stdout.write(ch);
  }
  console.log("");
};

/**
 * Compressed array is contaminated with extra characters like "[",
 * remove those and return the processed value as an array.
 * @param {*} raw array of blocks moved around ['[0][0]', '[11][11]', ...]
 * @returns array of individual items [0, 0, 11, 11...]
 */
const processCompressedPart2 = (raw) => {
  const result = [];
  raw.forEach(el => {
    mini = el.split("][");
    mini[0] = mini[0].replace("[", "");
    mini[mini.length - 1] = mini[mini.length - 1].replace(
      "]",
      ""
    );
    mini.forEach(el => result.push(el));
  });
  return result;
};

const main = async (fileName) => {
  // Single line expected.
  const DEBUG = false;
  const { line } = await readData(fileName);
  if (part == "1") {
    if (DEBUG) console.log(`line: ${line}`);
    const raw = convertLineToRaw(line);
    if (DEBUG) console.log(`raw: ${raw}`);
    const compressed = convertRawToCompressed(raw);
    if (DEBUG) console.log(`compressed: ${compressed}`);
    const checksum = getChecksumFromCompressed(compressed);
    console.log(`checksum: ${checksum}`);
  } else if (part == "2") {
    if (DEBUG) console.log(`line: ${line}`);
    const raw = convertLineToRaw(line, true);
    if (DEBUG) console.log(`raw: ${raw}`);
    const compressed = convertRawToCompressed(raw, true);
    if (DEBUG) console.log(`compressed: ${compressed}`);
    // We need an array of individual ints to compute checksum,
    // so process "compressed" array
    const processed = processCompressedPart2(compressed);
    if (DEBUG) console.log(`processed: ${processed}`);
    const checksum = getChecksumFromCompressed(processed);
    console.log(`checksum: ${checksum}`);
  }
};

main(fileName);
