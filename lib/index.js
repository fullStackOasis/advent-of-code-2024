const validateInput = () => {
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

  return { fileName, part, extra: process.argv[4] };
  
};

module.exports = { validateInput };