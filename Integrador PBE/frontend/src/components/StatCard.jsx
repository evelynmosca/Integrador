function StatCard({ titulo, valor, detalhe }) {
  return (
    <div className="stat-card">
      <div>
        <span>{titulo}</span>
        <h3>{valor}</h3>
        {detalhe && <small>{detalhe}</small>}
      </div>
      <div className="stat-icon">◦</div>
    </div>
  )
}

export default StatCard