const fs = require('fs').promises;
const path = require('path');

const readData = async (fileName) => {
  try {
    const filePath = path.join(__dirname, '..', 'data', fileName);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return [];
  }
};

const writeData = async (fileName, data) => {
  try {
    const filePath = path.join(__dirname, '..', 'data', fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
  }
};

module.exports = { readData, writeData };
