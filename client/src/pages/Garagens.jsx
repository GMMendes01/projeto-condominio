import { useState, useEffect } from 'react';
import api from '../services/api';

function Garagens() {
  const [garagens, setGaragens] = useState([]);
  const [form, setForm] = useState({ numero: '', tipo: 'comum' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { loadGaragens(); }, []);

  const loadGaragens = async () => {
    const res = await api.get('/garagens');
    setGaragens(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/garagens/${editingId}`, form);
    } else {
      await api.post('/garagens', form);
    }
    setForm({ numero: '', tipo: 'comum' });
    setEditingId(null);
    loadGaragens();
  };

  const handleEdit = (g) => {
    setForm(g);
    setEditingId(g.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta garagem?')) {
      await api.delete(`/garagens/${id}`);
      loadGaragens();
    }
  };

  return (
    <div className="page">
      <h2>🚗 Cadastro de Garagens</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Número (ex: G01)" value={form.numero} onChange={e => setForm({...form, numero: e.target.value})} required />
        <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
          <option value="comum">Comum (Sorteio)</option>
          <option value="fixa">Fixa (Síndico/Sub)</option>
        </select>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{editingId ? 'Atualizar' : 'Cadastrar'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setForm({ numero: '', tipo: 'comum' }); }}>Cancelar</button>}
        </div>
      </form>

      <div className="stats">
        <div className="stat-card"><h4>Total</h4><p>{garagens.length}</p></div>
        <div className="stat-card"><h4>Para Sorteio</h4><p>{garagens.filter(g => g.tipo === 'comum' && !g.sorteada).length}</p></div>
        <div className="stat-card"><h4>Sorteadas</h4><p>{garagens.filter(g => g.sorteada).length}</p></div>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>Número</th><th>Tipo</th><th>Condômino</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {garagens.map(g => (
              <tr key={g.id}>
                <td><strong>{g.numero}</strong></td>
                <td><span style={{textTransform: 'capitalize'}}>{g.tipo}</span></td>
                <td>{g.condomino_nome || '-'}</td>
                <td>{g.sorteada ? <span style={{color: 'var(--success)'}}>Sorteada</span> : <span style={{color: 'var(--text-light)'}}>Disponível</span>}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(g)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(g.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Garagens;
