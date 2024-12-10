/**
 * Advent of Code, day 10.
 * "a hiking trail is any path that starts at height 0, ends at height 9, and
 *  always increases by a height of exactly 1 at each step. Hiking trails never
 *  include diagonal steps - only up, down, left, or right"
 * 
 * "A trailhead is any position that starts one or more hiking trails ...[they]
 *  will always have height 0."
 * 
 * "a trailhead's score is the number of 9-height positions reachable from that
 *  trailhead via a hiking trail"
 * 
 * From an example, a trailhead does not have to be at an edge of the map.
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
    const lines = await fs.readFile(fileName.trim(), "utf8");
    return { lines };
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }
};

const log = (msg, DEBUG) => {
  if (DEBUG) console.log(msg);
}


const main = async (fileName) => {
  // Single line expected.
  const DEBUG = false;
  const { lines } = await readData(fileName);
  console.log(lines);
  if (part == "1") {
    throw new Error(`not finished`);
  } else if (part == "2") {
    throw new Error(`not finished`);
  }
};

main(fileName);
