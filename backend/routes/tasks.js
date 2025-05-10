const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/fileHandler');
const { v4: uuidv4 } = require('uuid');

const TASKS_FILE = 'tasks.json';
const CATEGORIES_FILE = 'categories.json';

// Povolené hodnoty pro status a prioritu
const allowedStatuses = ['Aktivní', 'Hotovo'];
const allowedPriorities = ['Nízká', 'Střední', 'Vysoká'];

// Pomocná funkce pro validaci úkolu
const validateTask = async ({ title, description, dueDate, priority, status, categoryId }) => {
  if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 50) {
    return 'Název úkolu musí mít 3–50 znaků.';
  }

  if (description && (typeof description !== 'string' || description.length > 250)) {
    return 'Popis úkolu je nepovolený nebo příliš dlouhý (max 250 znaků).';
  }

  if (!dueDate || isNaN(Date.parse(dueDate))) {
    return 'Neplatné datum splnění.';
  }

  if (!allowedPriorities.includes(priority)) {
    return 'Neplatná priorita. Povolené: Nízká, Střední, Vysoká.';
  }

  if (!allowedStatuses.includes(status)) {
    return 'Neplatný stav. Povolené: Aktivní, Hotovo.';
  }

  const categories = await readData(CATEGORIES_FILE);
  const categoryExists = categories.some(cat => cat.id === categoryId);
  if (!categoryExists) {
    return 'Neexistující kategorie.';
  }

  return null; // vše OK
};

// GET /tasks – vrátí všechny úkoly seřazené podle termínu
router.get('/', async (req, res) => {
  let tasks = await readData(TASKS_FILE);
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  res.json(tasks);
});

// POST /tasks – vytvoření úkolu s validací
router.post('/', async (req, res) => {
  const { title, description, dueDate, priority, status, categoryId } = req.body;

  const error = await validateTask({ title, description, dueDate, priority, status, categoryId });
  if (error) return res.status(400).json({ error });

  const tasks = await readData(TASKS_FILE);
  const newTask = {
    id: uuidv4(),
    title,
    description,
    dueDate,
    priority,
    status,
    categoryId
  };

  tasks.push(newTask);
  await writeData(TASKS_FILE, tasks);
  res.status(201).json(newTask);
});

// PUT /tasks/:id – úprava úkolu s validací
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, priority, status, categoryId } = req.body;

  const error = await validateTask({ title, description, dueDate, priority, status, categoryId });
  if (error) return res.status(400).json({ error });

  const tasks = await readData(TASKS_FILE);
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) return res.status(404).send('Úkol nenalezen');

  tasks[index] = { ...tasks[index], title, description, dueDate, priority, status, categoryId };
  await writeData(TASKS_FILE, tasks);
  res.json(tasks[index]);
});

// DELETE /tasks/:id – smazání úkolu
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  let tasks = await readData(TASKS_FILE);

  const exists = tasks.some(task => task.id === id);
  if (!exists) return res.status(404).send('Úkol nenalezen');

  tasks = tasks.filter(task => task.id !== id);
  await writeData(TASKS_FILE, tasks);
  res.status(204).send();
});

module.exports = router;
