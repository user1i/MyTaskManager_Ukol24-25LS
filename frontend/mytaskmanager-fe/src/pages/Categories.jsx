import { useEffect, useState } from 'react';
import CategoryFormModal from '../components/CategoryFormModal';

export default function Categories() {
  const [categories, setCategories] = useState([]); // Stav pro seznam kategorií
  const [showModal, setShowModal] = useState(false); // Zda se má zobrazit modální okno
  const [selectedCategory, setSelectedCategory] = useState(null); // Aktuálně vybraná kategorie
  const [error, setError] = useState(null);  // Chybová zpráva
  const [loading, setLoading] = useState(true); // Indikátor načítání dat

  // Načtení kategorií z backendu při prvním zobrazení stránky
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

  // Funkce pro uložení nové nebo upravené kategorie
  const handleCategorySaved = (category) => {
    if (selectedCategory) {
      // Úprava existující kategorie
      setCategories(prev =>
        prev.map(c => (c.id === category.id ? category : c))
      );
    } else {
      // Přidání nové kategorie
      setCategories(prev => [...prev, category]);
    }
    setShowModal(false);
    setSelectedCategory(null);
  };

// Funkce pro mazání kategorie
  const handleDelete = async (id) => {
    if (id === 'default') {
      alert('Výchozí kategorii nelze smazat.');
      return;
    }

    // Potvrzení od uživatele + upozornění na smazání úkolů
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

  // Renderování hlavní části stránky
  return (
    <div className="container">
      {/* Hlavička stránky a tlačítko pro přidání nové kategorie */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Správa kategorií</h2>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Nová kategorie
        </button>
      </div>
      {/* Zprávy o načítání nebo chybách */}
      {loading && <p>Načítání kategorií...</p>}
      {error && <div className="alert alert-danger">Chyba: {error}</div>}

      {/* Zobrazení seznamu kategorií */}
      {!loading && !error && categories.length === 0 && (
        <p>Žádné kategorie k zobrazení.</p>
      )}

      {!loading && !error && categories.length > 0 && (
        <ul className="list-group">
          {categories.map(c => (
            <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {/* Barevný čtvereček s názvem kategorie */}
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
                {/* Tlačítko pro úpravu */}
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => {
                    setSelectedCategory(c);
                    setShowModal(true);
                  }}
                >
                  <i className="bi bi-pencil"></i>
                </button>
                {/* Tlačítko pro smazání (pokud není výchozí kategorie) */}
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

      {/* Modální okno pro přidání nebo úpravu kategorie */}
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
