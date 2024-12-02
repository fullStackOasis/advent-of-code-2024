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

const distance = (a, b) => {
  return Math.abs(a - b);
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

    // Print the results
    console.log("reports:", reports);
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

const reportIsSafe = (report) => {
  // Test first two elements to see if they are increasing or decreasing:
  if (report[0] == report[1]) {
    // If the two elements are equal, this is not a safe report.
    return false;
  }
  // Check whether first two levels are increasing or decreasing.
  const increasing = isIncreasing(report[0], report[1]);
  // That determines whether the entire report needs to be increasing or not
  let isSafe = false;
  const len = report.length - 1;
  for (let i = 0; i < len; i++) {
    isSafe = increasing
      ? isIncreasing(report[i], report[i + 1])
      : isDecreasing(report[i], report[i + 1]);
    console.log(`${report[i]}, ${report[i + 1]} ${isSafe}`);
    if (!isSafe) {
      console.log(`is safe: ${isSafe}`);
      return false;
    }
  }
  console.log(`is safe: ${isSafe}`);
  return isSafe;
};

const main = async (fileName) => {
  // Read the file
  const { reports } = await readData(fileName);
  reports.forEach((el) => reportIsSafe(el));
  if (part == "1") {
    //computeTotalDistance(rightInts, leftInts);
  } else if (part == "2") {
    throw new Error(`Part 2 not yet implemented`);
  }
};

main(fileName);
