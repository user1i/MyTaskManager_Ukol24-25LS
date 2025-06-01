import { useEffect, useState } from 'react';
import TaskFormModal from '../components/TaskFormModal';
import Filters from '../components/Filters';
import TaskList from '../components/TaskList';

export default function Dashboard() {
  // Stavy pro úkoly, kategorie a načítání
  const [tasks, setTasks] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Stavy pro zobrazení modálního formuláře a výběr upravovaného úkolu
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Filtry
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  // Načtení dat z BE (úkoly a kategorie)
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/tasks').then(res => res.json()),
      fetch('http://localhost:3001/categories').then(res => res.json())
    ])
      .then(([taskData, categoryData]) => {
        setTasks(taskData);
        setCategories(categoryData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Chyba při načítání:', error);
        setLoading(false);
      });
  }, []);

  // Barva podle priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Vysoká': return '#dc3545';
      case 'Střední': return '#fd7e14';
      case 'Nízká': return '#198754';
      default: return '#6c757d';
    }
  };

// Stylování kategorie
  const getCategoryStyle = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? {
      backgroundColor: category.color,
      color: 'white',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '0.8rem'
    } : {};
  };

  // Stylování podle stavu
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Aktivní': return 'badge bg-success';
      case 'Hotovo': return 'badge bg-secondary';
      default: return 'badge bg-light text-dark';
    }
  };

  // Styl textu podle stavu (přeškrtnutí hotových)
  const getTextClass = (status) => {
    return status === 'Hotovo' ? 'text-muted text-decoration-line-through' : '';
  };

    // Filtrace podle zvoleného časového rozsahu
  const isWithinDateRange = (dueDate) => {
    const today = new Date();
    const target = new Date(dueDate);
    const selected = filterDate;

    if (selected === 'today') {
      return target.toDateString() === today.toDateString();
    }

    if (selected === 'week') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return target >= startOfWeek && target <= endOfWeek;
    }

    if (selected === 'month') {
      return target.getMonth() === today.getMonth() && target.getFullYear() === today.getFullYear();
    }

    return true;
  };

  // Aplikace všech filtrů na seznam úkolů
  const filteredTasks = tasks.filter(task =>
    (filterCategory === 'all' || task.categoryId === filterCategory) &&
    (filterStatus === 'all' || task.status === filterStatus) &&
    (filterPriority === 'all' || task.priority === filterPriority) &&
    isWithinDateRange(task.dueDate)
  );

  // Přidání nového úkolu
  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  // Úprava existujícího úkolu
  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  // Smazání úkolu
  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Otevřít modální okno pro úpravu úkolu
  const openModalForEdit = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  // Otevřít modální okno pro nový úkol
  const openModalForNew = () => {
    setSelectedTask(null);
    setShowModal(true);
  };

  // Hlavní výstup komponenty
  return (
    <div>
      <h2>Dashboard</h2>

      {/* Tlačítko pro přidání nového úkolu */}
      <div className="mb-3 text-end">
        <button className="btn btn-success" onClick={openModalForNew}>
          <i className="bi bi-plus-circle-fill me-2"></i>
          Nový úkol
        </button>
      </div>

      {/* Komponenta pro filtrování úkolů */}
      <Filters
        categories={categories}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
      />

      {/* Zobrazení seznamu úkolů nebo zprávy */}
      {loading ? (
        <p>Načítám...</p>
      ) : filteredTasks.length === 0 ? (
        <p>Žádné úkoly neodpovídají filtrům.</p>
      ) : (
        <TaskList
          tasks={filteredTasks}
          categories={categories}
          onEdit={openModalForEdit}
          getTextClass={getTextClass}
          getPriorityColor={getPriorityColor}
          getCategoryStyle={getCategoryStyle}
          getStatusBadgeClass={getStatusBadgeClass}
        />
      )}

      {/* Modální formulář pro přidání nebo úpravu úkolu */}
      <TaskFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        categories={categories}
        onTaskAdded={handleTaskAdded}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleDeleteTask}
        task={selectedTask}
        mode={selectedTask ? 'edit' : 'add'}
      />
    </div>
  );
}
