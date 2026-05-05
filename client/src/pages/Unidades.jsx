import { useState, useEffect } from 'react';
import api from '../services/api';

function Unidades() {
  const [unidades, setUnidades] = useState([]);
  const [form, setForm] = useState({ numero: '', bloco: '', tipo: 'apartamento' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { loadUnidades(); }, []);

  const loadUnidades = async () => {
    const res = await api.get('/unidades');
    setUnidades(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/unidades/${editingId}`, form);
    } else {
      await api.post('/unidades', form);
    }
    setForm({ numero: '', bloco: '', tipo: 'apartamento' });
    setEditingId(null);
    loadUnidades();
  };

  const handleEdit = (u) => {
    setForm(u);
    setEditingId(u.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta unidade?')) {
      await api.delete(`/unidades/${id}`);
      loadUnidades();
    }
  };

  return (
    <div className="page">
      <h2>🏠 Cadastro de Unidades</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Número (ex: 101)" value={form.numero} onChange={e => setForm({...form, numero: e.target.value})} required />
        <input placeholder="Bloco (ex: A)" value={form.bloco} onChange={e => setForm({...form, bloco: e.target.value})} />
        <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
          <option value="apartamento">Apartamento</option>
          <option value="casa">Casa</option>
          <option value="comercial">Comercial</option>
        </select>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{editingId ? 'Atualizar' : 'Cadastrar'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setForm({ numero: '', bloco: '', tipo: 'apartamento' }); }}>Cancelar</button>}
        </div>
      </form>

      <div className="stats">
        <div className="stat-card"><h4>Total</h4><p>{unidades.length}</p></div>
        <div className="stat-card"><h4>Apartamentos</h4><p>{unidades.filter(u => u.tipo === 'apartamento').length}</p></div>
        <div className="stat-card"><h4>Casas</h4><p>{unidades.filter(u => u.tipo === 'casa').length}</p></div>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>Número</th><th>Bloco</th><th>Tipo</th><th>Ações</th></tr></thead>
          <tbody>
            {unidades.map(u => (
              <tr key={u.id}>
                <td><strong>{u.numero}</strong></td>
                <td>{u.bloco || '-'}</td>
                <td><span style={{textTransform: 'capitalize'}}>{u.tipo}</span></td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(u)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Unidades;
