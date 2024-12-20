const fs = require("fs").promises;

const fileName = process.argv[2];

if (!fileName) {
  console.error('Error: Please provide a file name as a command-line argument.');
  process.exit(1); // Exit with error code
}

// Part is a number, 1 or 2, meaning the "part" of the exercise to be completed.
const part = process.argv[3];

if (part != "1" && part != "2") {
  console.error('Error: Please provide part (1 or 2) as a command-line argument.');
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

const computeTotalDistance = (rightInts, leftInts) => {
  rightInts.sort(sorter);
  leftInts.sort(sorter);
  let totalDistance = 0;
  rightInts.forEach((rightInt, i) => {
    totalDistance += distance(rightInt, leftInts[i]);
  });
  console.log(`Total distance: ${totalDistance}`);
  return totalDistance;
};

/**
 * Returns the frequency of each item in the right list as a map of number to
 * frequency.
 *
 * @param {*} rightInts
 */
const computeFrequency = (rightInts) => {
  // frequency maps a number to a frequency of that number in the left list.
  // e.g. if 3 occurs in the left list 10 times, then frequncy[3] is 10.
  const frequency = {};
  rightInts.forEach(el => {
    if (!frequency[el]) {
      frequency[el] = 0;
    }
    frequency[el]++;
  });
  return frequency;
};



const computeSimilarityScore = (rightInts, leftInts) => {
  const frequency = computeFrequency(rightInts, leftInts);
  let similarityScore = 0;
  leftInts.forEach(rightInt => {
    const multiplier = frequency[rightInt] || 0;
    similarityScore += rightInt * multiplier;
  });
  console.log(`Similarity score: ${similarityScore}`);
  return similarityScore;
};

const main = async (fileName) => {
  // Read the file
  const { rightInts, leftInts } = await readData(fileName);
  if (part == "1") {
    computeTotalDistance(rightInts, leftInts);
  } else if (part == "2") {
    computeSimilarityScore(rightInts, leftInts);
  }
};

main(fileName);