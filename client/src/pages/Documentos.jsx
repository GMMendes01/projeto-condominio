import { useState, useEffect } from 'react';
import api from '../services/api';

function Documentos() {
  const [reservas, setReservas] = useState([]);
  const [condominos, setCondominos] = useState([]);
  const [relatorio, setRelatorio] = useState(null);
  const [formReserva, setFormReserva] = useState({ condomino_id: '', data: '', evento: '' });

  useEffect(() => {
    loadReservas();
    loadCondominos();
  }, []);

  const loadReservas = async () => {
    const res = await api.get('/documentos/reservas');
    setReservas(res.data);
  };

  const loadCondominos = async () => {
    const res = await api.get('/condominos');
    setCondominos(res.data);
  };

  const handleReserva = async (e) => {
    e.preventDefault();
    await api.post('/documentos/reservar', formReserva);
    setFormReserva({ condomino_id: '', data: '', evento: '' });
    loadReservas();
  };

  const gerarRelatorio = async () => {
    const res = await api.get('/documentos/relatorio-utensilios');
    setRelatorio(res.data);
  };

  return (
    <div className="page">
      <h2>📄 Documentos</h2>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>

        <div>
          <h3>🎉 Reserva de Salão de Festas</h3>
          <form className="form" onSubmit={handleReserva}>
            <select value={formReserva.condomino_id} onChange={e => setFormReserva({...formReserva, condomino_id: e.target.value})}>
              <option value="">Selecione Condômino</option>
              {condominos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
            <input type="date" value={formReserva.data} onChange={e => setFormReserva({...formReserva, data: e.target.value})} required />
            <input placeholder="Evento (ex: Aniversário)" value={formReserva.evento} onChange={e => setFormReserva({...formReserva, evento: e.target.value})} required />
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Reservar</button>
            </div>
          </form>

          <h3 style={{marginTop: 24}}>Reservas Realizadas</h3>
          <div style={{background: 'var(--background)', padding: 16, borderRadius: 'var(--radius)', maxHeight: 300, overflowY: 'auto'}}>
            {reservas.length === 0 ? <p style={{color: 'var(--text-light)'}}>Nenhuma reserva realizada</p> :
              reservas.map(r => (
                <div key={r.id} style={{padding: '12px 16px', background: 'var(--surface)', marginBottom: 8, borderRadius: 6, boxShadow: 'var(--shadow)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
                    <strong>{r.condomino_nome}</strong>
                    <span style={{fontSize: 12, color: 'var(--text-light)'}}>{r.status}</span>
                  </div>
                  <p style={{margin: '4px 0', fontSize: 14}}>{r.evento}</p>
                  <small>{new Date(r.data).toLocaleDateString('pt-BR')}</small>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3>📋 Relatório de Utensílios</h3>
          <button className="btn btn-success" onClick={gerarRelatorio} style={{marginBottom: 16}}>📊 Gerar Relatório</button>

          {relatorio && (
            <div style={{marginTop: 16}}>
              <pre>{relatorio.relatorio}</pre>
              <div style={{marginTop: 16}}>
                <h4>Lista Detalhada</h4>
                <div className="table-container">
                  <table>
                    <thead><tr><th>Utensílio</th><th>Qtd</th></tr></thead>
                    <tbody>
                      {relatorio.dados.map(u => (
                        <tr key={u.id}>
                          <td>{u.nome}</td>
                          <td>{u.quantidade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Documentos;
