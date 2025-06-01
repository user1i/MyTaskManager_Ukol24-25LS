export default function Filters({
  categories,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  filterDate,
  setFilterDate
}) {
  return (
    <div className="row mb-4">
      {/* Výběr kategorie úkolu */}
      <div className="col-md-3">
        <label className="form-label">Kategorie</label>
        <select className="form-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="all">Vše</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Výběr stavu úkolu */}
      <div className="col-md-3">
        <label className="form-label">Stav</label>
        <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Vše</option>
          <option value="Aktivní">Aktivní</option>
          <option value="Hotovo">Hotovo</option>
        </select>
      </div>

       {/* Výběr priority úkolu */}
      <div className="col-md-3">
        <label className="form-label">Priorita</label>
        <select className="form-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="all">Vše</option>
          <option value="Nízká">Nízká</option>
          <option value="Střední">Střední</option>
          <option value="Vysoká">Vysoká</option>
        </select>
      </div>

      {/* Výběr časového období pro datum splnění */}
      <div className="col-md-3">
        <label className="form-label">Datum splnění</label>
        <select className="form-select" value={filterDate} onChange={e => setFilterDate(e.target.value)}>
          <option value="all">Vše</option>
          <option value="today">Dnes</option>
          <option value="week">Tento týden</option>
          <option value="month">Tento měsíc</option>
        </select>
      </div>
    </div>
  );
}
