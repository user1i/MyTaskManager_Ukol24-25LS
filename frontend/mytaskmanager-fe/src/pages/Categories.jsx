import { useEffect, useState } from 'react';
import CategoryFormModal from '../components/CategoryFormModal';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:3001/categories');
      if (!res.ok) throw new Error('Chyba při načítání kategorií');
      const data = await res.json();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategorySaved = (category) => {
    if (selectedCategory) {
      setCategories(prev =>
        prev.map(c => (c.id === category.id ? category : c))
      );
    } else {
      setCategories(prev => [...prev, category]);
    }
    setShowModal(false);
    setSelectedCategory(null);
  };

  const handleDelete = async (id) => {
    if (id === 'default') {
      alert('Výchozí kategorii nelze smazat.');
      return;
    }

    if (window.confirm('⚠️ Pozor: Smazáním této kategorie dojde také ke smazání všech úkolů, které do ní patří. Chcete pokračovat?')) {
      const res = await fetch(`http://localhost:3001/categories/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
      } else {
        alert('Chyba při mazání.');
      }
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Správa kategorií</h2>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Nová kategorie
        </button>
      </div>

      {loading && <p>Načítání kategorií...</p>}
      {error && <div className="alert alert-danger">Chyba: {error}</div>}

      {!loading && !error && categories.length === 0 && (
        <p>Žádné kategorie k zobrazení.</p>
      )}

      {!loading && !error && categories.length > 0 && (
        <ul className="list-group">
          {categories.map(c => (
            <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <span
                  className="me-2"
                  style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    backgroundColor: c.color,
                    borderRadius: '4px'
                  }}
                ></span>
                {c.name}
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => {
                    setSelectedCategory(c);
                    setShowModal(true);
                  }}
                >
                  <i className="bi bi-pencil"></i>
                </button>
                {c.id !== 'default' && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(c.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <CategoryFormModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onSave={handleCategorySaved}
      />
    </div>
  );
}
