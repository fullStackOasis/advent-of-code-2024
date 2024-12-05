/**
 * Advent of Code, day 5.
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
 * Return value is an Object with two elements which are arrays of strings:
 * pageOrderingRules, pageNumbersOfUpdate.
 *
 * @param {*} fileName name of the file to be read
 * @returns an Object with two arrays of strings
 */
const readData = async (fileName) => {
  try {
    const pageOrderingRules = [];
    const pageNumbersOfUpdate = [];
    const data = await fs.readFile(fileName.trim(), "utf8");
    let readingRules = true;
    data.split("\n").forEach((line) => {
      const row = line.trim();
      if (!row) {
        readingRules = false;
        return;
      }
      if (readingRules) {
        pageOrderingRules.push(row.split("|"));
      } else {
        pageNumbersOfUpdate.push(row.split(","));
      }
    });
    return { pageOrderingRules, pageNumbersOfUpdate };
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }
};

printArray = (lines) => {
  console.log(`Your array:`);
  for (let i = 0; i < lines.length; i++) {
    console.log(lines[i]);
  }
  console.log();
};

/**
 * Returns true if all the elements in the page satisfy all the rules.
 *
 * @param {*} rules array of 2-element arrays of string, [["47", "53"],...]
 * @param {*} page array of string, assume odd number length ['75', '47',...]
 * @returns
 */
const isPageCorrectlyOrderedAccordingToRules = (rules, page) => {
  const result = rules.filter((rule) => {
    // rule is an array of length 2, e.g. ["47", "53"]
    const index0 = page.indexOf(rule[0]);
    if (index0 < 0) return false; // irrelevant, not in array
    const index1 = page.indexOf(rule[1]);
    if (index1 < 0) return false; // irrelevant, not in array
    if (index0 < index1) return false; // irrelevant, order is correct
    // If you get here, the pages are both in the rule array, and they are
    // ordered incorrectly.
    return true; // result will have at least one element
  });
  // if no invalid rows were found, that means page is correctly ordered
  // according to all rules. Return true in that case, otherwise return false.
  return result.length == 0;
};

/**
 * Sums the middle element of each page that is correctly ordered, and returns
 * that sum.
 *
 * @param {*} rules
 * @param {*} pages
 * @returns sum
 */
const computeCorrectlyOrderedUpdates = (rules, pages) => {
  // rules contains pairs of numbers, the rules about page ordering
  // pages contains an array of numbers, the pages in the update.
  let sumMiddlePages = 0;
  // Loop over all pages, looking for those that do not obey ordering rules.
  pages.forEach((page, i) => {
    const result = isPageCorrectlyOrderedAccordingToRules(rules, page);
    if (result) {
      // This page is correctly ordered, so count its middle element
      const index = (page.length - 1) / 2;
      sumMiddlePages += Number(page[index]);
    }
  });
  return sumMiddlePages;
};

/**
 * Checks all pages to see if they abide by the rules, return those that do not
 *
 * @param {*} rules
 * @param {*} pages
 * @returns array of pages that are ordered incorrectly.
 */
const getIncorrectlyOrderedUpdates = (rules, pages) => {
  // rules contains pairs of numbers, the rules about page ordering
  // pages contains an array of numbers, the pages in the update.

  // Loop over all pages, looking for those that do not obey ordering rules.
  // Return array of those pages.
  const result = pages.filter((page, i) => {
    return !isPageCorrectlyOrderedAccordingToRules(rules, page);
  });
  return result;
};

const arraysEqual = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }
  if (arr1.length != arr2.length) return false;
  const n = arr1.length;
  for (let i = 0; i < n; i++) {
    if (arr1[i] != arr2[i]) {
      return false;
    }
  }
  return true;
};

/**
 * Fixes the input pages, which are disorganized, by applying input rules.
 * @param {*} pages
 * @param {*} rules
 * @returns array of fixed pages.
 */
const reorderPagesAccordingToRules = (pages, rules) => {
  const isFixed = (page) => {
    // create a copy of this page.
    let copy = page.slice();
    // reorganize using rules
    orderPageAccordingToRules(rules, page);
    // return true if there was no change, so fixed, otherwise false.
    return arraysEqual(copy, page);
  };
  const fixedPages = pages.map((page, i) => {
    let fixed = isFixed(page);
    while (!fixed) {
      fixed = isFixed(page);
    }
    return page;
  });
  return fixedPages;
};

/**
 * Fixes the input page, which is disorganized, by applying input rules.
 * The input page is altered. You may have to do this repeatedly, since
 * only one rule is applied, and that may even break other rules, who
 * knows. Might we wind up with a stack overflow if the rules keep
 * clobbering each other? Who knows.
 *
 * @param {*} rules
 * @param {*} page
 * @returns page that has been fixed by applying all rules once.
 */
const orderPageAccordingToRules = (rules, page) => {
  rules.forEach((rule) => {
    // rule is an array of length 2, e.g. ["47", "53"]
    const index0 = page.indexOf(rule[0]);
    if (index0 < 0) return false; // irrelevant, not in array
    const index1 = page.indexOf(rule[1]);
    if (index1 < 0) return false; // irrelevant, not in array
    if (index0 < index1) return false; // irrelevant, order is correct
    // If you get here, the pages are both in the rule array, and they are
    // ordered incorrectly. Swap them.
    const hlp = page[index0];
    page[index0] = page[index1];
    page[index1] = hlp;
    return true;
  });
};

const validateHasOddLength = (page) => {
  if (!(page.length % 2 == 1)) {
    console.log(page);
    throw new Error(`Page length not odd`);
  }
};

const main = async (fileName) => {
  const { pageOrderingRules, pageNumbersOfUpdate } = await readData(fileName);
  // printArray(pageOrderingRules);
  pageNumbersOfUpdate.forEach((page) => validateHasOddLength(page));
  // printArray(pageNumbersOfUpdate);

  if (part == "1") {
    const sumMiddlePages = computeCorrectlyOrderedUpdates(
      pageOrderingRules,
      pageNumbersOfUpdate
    );
    console.log(`Sum of middle page numbers: ${sumMiddlePages}`);
  } else if (part == "2") {
    const badPages = getIncorrectlyOrderedUpdates(
      pageOrderingRules,
      pageNumbersOfUpdate
    );
    const fixedPages = reorderPagesAccordingToRules(
      badPages,
      pageOrderingRules
    );
    const sumMiddlePages = computeCorrectlyOrderedUpdates(
      pageOrderingRules,
      fixedPages
    );
    console.log(`Sum of fixed middle page numbers: ${sumMiddlePages}`);
  }
};

main(fileName);
