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

const distanceGreaterThan3 = (a, b) => {
  return Math.abs(a - b) > 3;
};

/**
 * Return value is an Object with a single "reports" element which is an array
 * of arrays. Each array is a "report", each element in the report is a
 * "level".
 *
 * @param {*} fileName name of the file to be read
 * @returns an array of report data
 */
const readData = async (fileName) => {
  // Parse the file content
  const reports = [];
  try {
    const data = await fs.readFile(fileName.trim(), "utf8");
    data.split("\n").forEach((line) => {
      if (line.trim()) {
        // Skip empty lines
        const report = line.split(/\s+/).map(Number);
        reports.push(report);
      }
    });

  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }
  return { reports };
};

const isIncreasing = (a, b) => {
  return a < b;
};

const isDecreasing = (a, b) => {
  return a > b;
};

/**
 * Returns true if report is safe, false otherwise. See instructions.
 *
 * @param {*} report 
 * @param {*} i index of report in reports, used for debugging
 * @returns 
 */
const reportIsSafe = (report, i) => {
  const level0 = report[0];
  const level1 = report[1];
  // Test first two elements to see if they are increasing or decreasing.
  // Also make sure they are not changing too much (by more than 3)
  if (level0 == level1 || distanceGreaterThan3(level0, level1)) {
    // If first two elements are equal, this is not a safe report.
    return false;
  }
  /**
   * Check whether first two levels are increasing or decreasing.
   * That determines whether the entire report needs to be increasing or not.
   **/
  const increasing = isIncreasing(level0, level1);
  let isSafe = false;
  const len = report.length - 1;
  // Start with i set to 1 because first 2 elements already checked.
  //
  for (let i = 1; i < len; i++) {
    const level = report[i];
    const nextLevel = report[i + 1];
    if (distanceGreaterThan3(level, nextLevel)) {
      return false;
    }
    isSafe = increasing
      ? isIncreasing(level, nextLevel)
      : isDecreasing(level, nextLevel);
    if (!isSafe) {
      return false;
    }
  }
  return true;
};

const main = async (fileName) => {
  // Read the file.
  // Comment: Instructions do not specify the number of reports or levels per
  // report. We're making some reasonable assumptions: at least one report,
  // at least 2 levels in a report.
  const { reports } = await readData(fileName);
  if (part == "1") {
    let numSafe = 0;
    reports.forEach((el, i) => (reportIsSafe(el, i) ? numSafe++ : undefined));
    console.log(`Number of safe reports: ${numSafe}`);
  } else if (part == "2") {
    throw new Error(`Part 2 not yet implemented`);
  }
};

main(fileName);
