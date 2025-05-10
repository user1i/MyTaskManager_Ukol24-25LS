const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');
const categoriesRouter = require('./routes/categories');
const { readData, writeData } = require('./utils/fileHandler');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Inicializace – ověření existence defaultní kategorie
const initDefaultCategory = async () => {
  const categories = await readData('categories.json');
  const defaultExists = categories.some(cat => cat.id === 'default');
  if (!defaultExists) {
    categories.push({
      id: 'default',
      name: 'Ostatní',
      color: '#999999'
    });
    await writeData('categories.json', categories);
    console.log('Defaultní kategorie "Ostatní" vytvořena.');
  }
};

// Routy
app.use('/tasks', tasksRouter);
app.use('/categories', categoriesRouter);

// Start serveru
app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
  initDefaultCategory(); // volání při startu
});
