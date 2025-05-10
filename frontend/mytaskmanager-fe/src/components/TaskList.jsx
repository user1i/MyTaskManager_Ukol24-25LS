export default function TaskList({
  tasks,
  categories,
  onEdit,
  getTextClass,
  getPriorityColor,
  getCategoryStyle,
  getStatusBadgeClass
}) {
  return (
    <div className="row">
      {tasks.map(task => (
        <div className="col-md-6 mb-3" key={task.id}>
          <div className="card shadow-sm" onClick={() => onEdit(task)} style={{ cursor: 'pointer' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className={`card-title ${getTextClass(task.status)}`}>{task.title}</h5>
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: getPriorityColor(task.priority),
                      borderRadius: '4px'
                    }}
                    title={`Priorita: ${task.priority}`}
                  />
                  <span>{task.priority}</span>
                </div>
              </div>
              <div className="mb-2">
                <span style={getCategoryStyle(task.categoryId)}>
                  {categories.find(c => c.id === task.categoryId)?.name || 'Neznámá'}
                </span>
              </div>
              <p className={`card-text ${getTextClass(task.status)}`}>{task.description}</p>
              <p className={getTextClass(task.status)}>
                🗓 Termín: {task.dueDate} <br />
                🏷️ Stav: <span className={getStatusBadgeClass(task.status)}>{task.status}</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
