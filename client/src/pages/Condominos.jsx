import { useState, useEffect } from 'react';
import api from '../services/api';

function Condominos() {
  const [condominos, setCondominos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [form, setForm] = useState({ nome: '', cpf: '', telefone: '', email: '', tipo: 'morador', qtd_carros: 1, unidade_id: '', garagem_fixa: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadCondominos();
    loadUnidades();
  }, []);

  const loadCondominos = async () => {
    const res = await api.get('/condominos');
    setCondominos(res.data);
  };

  const loadUnidades = async () => {
    const res = await api.get('/unidades');
    setUnidades(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/condominos/${editingId}`, form);
    } else {
      await api.post('/condominos', form);
    }
    setForm({ nome: '', cpf: '', telefone: '', email: '', tipo: 'morador', qtd_carros: 1, unidade_id: '', garagem_fixa: '' });
    setEditingId(null);
    loadCondominos();
  };

  const handleEdit = (c) => {
    setForm({ ...c, unidade_id: c.unidade_id || '', garagem_fixa: c.garagem_fixa || '' });
    setEditingId(c.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este condômino?')) {
      await api.delete(`/condominos/${id}`);
      loadCondominos();
    }
  };

  return (
    <div className="page">
      <h2>👥 Cadastro de Condôminos</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Nome completo" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
        <input placeholder="CPF" value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} required />
        <input placeholder="Telefone" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
          <option value="morador">Morador</option>
          <option value="sindico">Síndico</option>
          <option value="subsindico">Sub-síndico</option>
        </select>
        <input type="number" placeholder="Qtd Carros" value={form.qtd_carros} onChange={e => setForm({...form, qtd_carros: e.target.value})} min="1" />
        <select value={form.unidade_id} onChange={e => setForm({...form, unidade_id: e.target.value})}>
          <option value="">Selecione Unidade</option>
          {unidades.map(u => <option key={u.id} value={u.id}>{u.numero} - Bloco {u.bloco || 'A'}</option>)}
        </select>
        <select value={form.garagem_fixa} onChange={e => setForm({...form, garagem_fixa: e.target.value})}>
          <option value="">Garagem Fixa (opcional)</option>
          {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>Garagem {n}</option>)}
        </select>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{editingId ? 'Atualizar' : 'Cadastrar'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setForm({ nome: '', cpf: '', telefone: '', email: '', tipo: 'morador', qtd_carros: 1, unidade_id: '', garagem_fixa: '' }); }}>Cancelar</button>}
        </div>
      </form>

      <div className="stats">
        <div className="stat-card"><h4>Total</h4><p>{condominos.length}</p></div>
        <div className="stat-card"><h4>Moradores</h4><p>{condominos.filter(c => c.tipo === 'morador').length}</p></div>
        <div className="stat-card"><h4>Síndico/Sub</h4><p>{condominos.filter(c => c.tipo !== 'morador').length}</p></div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th><th>CPF</th><th>Tipo</th><th>Qtd Carros</th><th>Unidade</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {condominos.map(c => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.cpf}</td>
                <td><span style={{textTransform: 'capitalize'}}>{c.tipo}</span></td>
                <td>{c.qtd_carros}</td>
                <td>{c.unidade_num} {c.bloco}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(c)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Condominos;
