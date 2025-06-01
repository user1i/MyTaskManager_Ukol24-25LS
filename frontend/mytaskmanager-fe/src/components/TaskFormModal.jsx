import { useEffect, useState } from 'react';

export default function TaskFormModal({
  show,
  onClose,
  categories,
  onTaskAdded,
  onTaskUpdated,
  onTaskDeleted,
  task
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Střední',
    status: 'Aktivní',
    categoryId: ''
  });

  const [errors, setErrors] = useState({});

  // Nastavení výchozích hodnot formuláře při otevření
  useEffect(() => {
    if (!show) return;

    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate || '',
        priority: task.priority || 'Střední',
        status: task.status || 'Aktivní',
        categoryId: task.categoryId || (categories.length > 0 ? categories[0].id : '')
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Střední',
        status: 'Aktivní',
        categoryId: categories.length > 0 ? categories[0].id : ''
      });
    }
  }, [task, categories, show]);

  // Zpracování změn formuláře
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Odeslání formuláře (vytvoření nebo aktualizace úkolu)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (formData.title.trim().length < 3 || formData.title.trim().length > 50) {
      newErrors.title = 'Název musí mít 3–50 znaků.';
    }
    if (formData.description.length > 250) {
      newErrors.description = 'Popis je příliš dlouhý (max. 250 znaků).';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Zadejte datum splnění.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const method = task ? 'PUT' : 'POST';
    const url = task
      ? `http://localhost:3001/tasks/${task.id}`
      : 'http://localhost:3001/tasks';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const savedTask = await response.json();
      task ? onTaskUpdated(savedTask) : onTaskAdded(savedTask);
      onClose();
    } else {
      const errorData = await response.json();
      alert(errorData.error || 'Chyba při ukládání úkolu.');
    }
  };
// Mazání úkolu
  const handleDelete = async () => {
    if (!task) return;
    if (window.confirm('Opravdu chcete úkol smazat?')) {
      const res = await fetch(`http://localhost:3001/tasks/${task.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        onTaskDeleted(task.id);
        onClose();
      } else {
        alert('Chyba při mazání úkolu.');
      }
    }
  };

  if (!show) return null;
// Vykreslení formuláře jako modálního okna
  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">
              {task ? 'Upravit úkol' : 'Nový úkol'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Nazev ukolu */}
            <div className="mb-2">
              <label className="form-label">Název</label>
              <input
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>

            {/* Popis ukolu */}
            <div className="mb-2">
              <label className="form-label">Popis</label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            {/* Datum splnění */}
            <div className="mb-2">
              <label className="form-label">Datum splnění</label>
              <input
                type="date"
                className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
              {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
            </div>

            {/* Priorita */}
            <div className="mb-2">
              <label className="form-label">Priorita</label>
              <select className="form-select" name="priority" value={formData.priority} onChange={handleChange}>
                <option value="Nízká">Nízká</option>
                <option value="Střední">Střední</option>
                <option value="Vysoká">Vysoká</option>
              </select>
            </div>

            {/* Stav */}
            <div className="mb-2">
              <label className="form-label">Stav</label>
              <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                <option value="Aktivní">Aktivní</option>
                <option value="Hotovo">Hotovo</option>
              </select>
            </div>

            {/* Kategorie */}
            <div className="mb-2">
              <label className="form-label">Kategorie</label>
              <select className="form-select" name="categoryId" value={formData.categoryId} onChange={handleChange}>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Tlačítka dole v modalu */}
          <div className="modal-footer">
            {task && (
              <button type="button" className="btn btn-outline-danger me-auto" onClick={handleDelete}>
                <i className="bi bi-trash"></i> Smazat
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={onClose}>Zavřít</button>
            <button type="submit" className="btn btn-primary">Uložit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
