import { useEffect, useState } from 'react';

export default function CategoryFormModal({ show, onClose, category, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    color: '#999999'
  });

// Při změně vybrané kategorie nastaví hodnoty do formuláře
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        color: category.color
      });
    } else {
      setFormData({
        name: '',
        color: '#999999'
      });
    }
  }, [category]);

  // Zpracování změn v polích formuláře
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Odeslání formuláře pro uložení nebo úpravu kategorie
  const handleSubmit = async (e) => {
    e.preventDefault();
// Validace délky názvu
    if (formData.name.trim().length < 2 || formData.name.trim().length > 30) {
      alert('Název musí mít 2–30 znaků.');
      return;
    }
// Nastavení metody podle toho, jestli jde o novou nebo upravovanou kategorii
    const url = category
      ? `http://localhost:3001/categories/${category.id}`
      : 'http://localhost:3001/categories';

    const method = category ? 'PUT' : 'POST';

    // Odeslání dat na server
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

     // Reakce na odpověď serveru
    if (response.ok) {
      const data = await response.json();
      onSave(data);
    } else {
      alert('Chyba při ukládání kategorie.');
    }
  };

  if (!show) return null; // Pokud se modální okno nemá zobrazit, vrátí null

  //zobrazení modálního formuláře
  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">
              {category ? 'Upravit kategorii' : 'Nová kategorie'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Název</label>
              <input
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Barva</label>
              <input
                type="color"
                className="form-control form-control-color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                title="Vyber barvu"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Zavřít
            </button>
            <button type="submit" className="btn btn-primary">
              Uložit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
