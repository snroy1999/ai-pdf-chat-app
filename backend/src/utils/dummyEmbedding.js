const generateDummyVector = () => {
  return Array.from(
    { length: 384 },
    () => Math.random()
  );
};

module.exports = generateDummyVector;