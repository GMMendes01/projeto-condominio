import { useState, useEffect } from 'react';
import api from '../services/api';

function Utensilios() {
  const [utensilios, setUtensilios] = useState([]);
  const [form, setForm] = useState({ nome: '', quantidade: 1, disponivel: 1 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { loadUtensilios(); }, []);

  const loadUtensilios = async () => {
    const res = await api.get('/utensilios');
    setUtensilios(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/utensilios/${editingId}`, form);
    } else {
      await api.post('/utensilios', form);
    }
    setForm({ nome: '', quantidade: 1, disponivel: 1 });
    setEditingId(null);
    loadUtensilios();
  };

  const handleEdit = (u) => {
    setForm(u);
    setEditingId(u.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este utensílio?')) {
      await api.delete(`/utensilios/${id}`);
      loadUtensilios();
    }
  };

  return (
    <div className="page">
      <h2>🍳 Utensílios da Cozinha</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Nome (ex: Panela de Pressão)" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
        <input type="number" placeholder="Quantidade" value={form.quantidade} onChange={e => setForm({...form, quantidade: e.target.value})} min="1" />
        <select value={form.disponivel} onChange={e => setForm({...form, disponivel: parseInt(e.target.value)})}>
          <option value={1}>Disponível</option>
          <option value={0}>Indisponível</option>
        </select>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{editingId ? 'Atualizar' : 'Cadastrar'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setForm({ nome: '', quantidade: 1, disponivel: 1 }); }}>Cancelar</button>}
        </div>
      </form>

      <div className="stats">
        <div className="stat-card"><h4>Total</h4><p>{utensilios.length}</p></div>
        <div className="stat-card"><h4>Disponíveis</h4><p>{utensilios.filter(u => u.disponivel).length}</p></div>
        <div className="stat-card"><h4>Qtd Total</h4><p>{utensilios.reduce((acc, u) => acc + u.quantidade, 0)}</p></div>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>Nome</th><th>Qtd</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {utensilios.map(u => (
              <tr key={u.id}>
                <td><strong>{u.nome}</strong></td>
                <td>{u.quantidade}</td>
                <td>{u.disponivel ? <span style={{color: 'var(--success)'}}>Disponível</span> : <span style={{color: 'var(--danger)'}}>Indisponível</span>}</td>
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

export default Utensilios;
