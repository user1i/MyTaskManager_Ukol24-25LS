const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/fileHandler');
const { v4: uuidv4 } = require('uuid');

const TASKS_FILE = 'tasks.json';
const CATEGORIES_FILE = 'categories.json';

// GET/ Načíst všechny kategorie
router.get('/', async (req, res) => {
  const categories = await readData(CATEGORIES_FILE);
  res.json(categories);
});

// POST/ Přidat novou kategorii
router.post('/', async (req, res) => {
  const { name, color } = req.body;

  if (typeof name !== 'string' || name.length < 2 || name.length > 20 || !/^[\w\sá-žÁ-Ž]+$/.test(name)) {
    return res.status(400).json({ error: 'Neplatný název kategorie. Povolené znaky: písmena, čísla, mezery. Délka 2–20.' });
  }

  if (typeof color !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return res.status(400).json({ error: 'Neplatná barva. Použij hex kód jako #ff6600.' });
  }

  const categories = await readData(CATEGORIES_FILE);

  const newCategory = {
    id: uuidv4(),
    name,
    color
  };

  categories.push(newCategory);
  await writeData(CATEGORIES_FILE, categories);
  res.status(201).json(newCategory);
});

// PUT/ Editace kategorie
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;

  if (typeof name !== 'string' || name.length < 2 || name.length > 20 || !/^[\w\sá-žÁ-Ž]+$/.test(name)) {
    return res.status(400).json({ error: 'Neplatný název kategorie. Povolené znaky: písmena, čísla, mezery. Délka 2–20.' });
  }

  if (typeof color !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return res.status(400).json({ error: 'Neplatná barva. Použij hex kód jako #ff6600.' });
  }

  const categories = await readData(CATEGORIES_FILE);

  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).send('Kategorie nenalezena');

  categories[index] = { ...categories[index], name, color };
  await writeData(CATEGORIES_FILE, categories);
  res.json(categories[index]);
});

// DELETE/ Smazání kategorie + mazání souvisejících úkolů
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (id === 'default') return res.status(400).send('Defaultní kategorii nelze smazat');

  let categories = await readData(CATEGORIES_FILE);
  let tasks = await readData(TASKS_FILE);

  const categoryExists = categories.some(c => c.id === id);
  if (!categoryExists) return res.status(404).send('Kategorie nenalezena');

  // Smaž úkoly přiřazené ke kategorii
  tasks = tasks.filter(task => task.categoryId !== id);

  // Smaž samotnou kategorii
  categories = categories.filter(c => c.id !== id);

  await writeData(CATEGORIES_FILE, categories);
  await writeData(TASKS_FILE, tasks);

  res.status(204).send();
});

module.exports = router;
