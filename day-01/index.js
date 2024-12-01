const fs = require("fs").promises;

const fileName = process.argv[2];

if (!fileName) {
  console.error('Error: Please provide a file name as a command-line argument.');
  process.exit(1); // Exit with error code
}


const distance = (a, b) => {
    return Math.abs(a - b);
};

const sorter = (a, b) => {
  return a - b;
};

const readData = async (fileName) => {
  // Parse the file content
  const leftInts = [];
  const rightInts = [];
  try {
    const data = await fs.readFile(fileName.trim(), "utf8");
    data.split("\n").forEach((line) => {
      if (line.trim()) {
        // Skip empty lines
        const [left, right] = line.split(/\s+/).map(Number);
        if (!isNaN(left) && !isNaN(right)) {
          leftInts.push(left);
          rightInts.push(right);
        } else {
          console.warn(`Skipping invalid line: "${line}"`);
        }
      }
    });

    // Print the results
    // console.log("Left Integers:", leftInts);
    // console.log("Right Integers:", rightInts);

  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }
  return { leftInts, rightInts };
};

const main = async (fileName) => {
  // Read the file
  const { rightInts, leftInts } = await readData(fileName);
  rightInts.sort(sorter);
  leftInts.sort(sorter);
  let totalDistance = 0;
  rightInts.forEach((rightInt, i) => {
    totalDistance += distance(rightInt, leftInts[i]);
  });
  console.log(`Total distance: ${totalDistance}`);
};

main(fileName);