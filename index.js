const fs = require("fs").promises;
const readline = require("readline");

// Create readline interface to read file name from stdin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Please enter the file name:");

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
    console.log("Left Integers:", leftInts);
    console.log("Right Integers:", rightInts);

    rl.close();
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    rl.close();
  }
  return { leftInts, rightInts };
};

rl.on("line", async (fileName) => {
  // Read the file
  const { rightInts, leftInts } = await readData(fileName);
  rightInts.sort(sorter);
  leftInts.sort(sorter);
  console.log(rightInts);
  console.log(leftInts);
  rightInts.forEach((rightInt, i) => {
    console.log(distance(rightInt, leftInts[i]));
  });
});
