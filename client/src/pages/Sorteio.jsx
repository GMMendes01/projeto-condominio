import { useState, useEffect } from 'react';
import api from '../services/api';

function Sorteio() {
  const [vagas, setVagas] = useState([]);
  const [condominos, setCondominos] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('success');

  useEffect(() => {
    loadVagas();
    loadCondominos();
  }, []);

  const loadVagas = async () => {
    const res = await api.get('/sorteio/vagas-disponiveis');
    setVagas(res.data);
  };

  const loadCondominos = async () => {
    const res = await api.get('/sorteio/condominos-disponiveis');
    setCondominos(res.data);
  };

  const realizarSorteio = async () => {
    try {
      const res = await api.post('/sorteio/realizar');
      setResultados(res.data.resultados);
      setMensagem('Sorteio realizado com sucesso!');
      setTipoMensagem('success');
      loadVagas();
      loadCondominos();
    } catch (err) {
      setMensagem(err.response?.data?.error || 'Erro ao realizar sorteio');
      setTipoMensagem('error');
    }
  };

  const limparSorteio = async () => {
    if (window.confirm('Tem certeza que deseja limpar o sorteio?')) {
      await api.post('/sorteio/limpar');
      setResultados([]);
      setMensagem('Sorteio limpo com sucesso!');
      setTipoMensagem('success');
      loadVagas();
    }
  };

  return (
    <div className="page">
      <h2>🎲 Sorteio de Garagens</h2>

      <div className="stats">
        <div className="stat-card"><h4>Vagas Disponíveis</h4><p>{vagas.length}</p></div>
        <div className="stat-card"><h4>Condôminos</h4><p>{condominos.length}</p></div>
        <div className="stat-card"><h4>Resultados</h4><p>{resultados.length}</p></div>
      </div>

      <div style={{marginBottom: 24, display: 'flex', gap: 12}}>
        <button className="btn btn-primary" onClick={realizarSorteio} disabled={vagas.length === 0 || condominos.length === 0}>🎲 Realizar Sorteio</button>
        <button className="btn btn-warning" onClick={limparSorteio} disabled={resultados.length === 0}>🗑️ Limpar Sorteio</button>
      </div>

      {mensagem && <div className={`alert alert-${tipoMensagem}`}>{mensagem}</div>}

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24}}>
        <div>
          <h3>Vagas Disponíveis ({vagas.length})</h3>
          <div style={{background: 'var(--background)', padding: 16, borderRadius: 'var(--radius)', maxHeight: 200, overflowY: 'auto'}}>
            {vagas.length === 0 ? <p style={{color: 'var(--text-light)'}}>Nenhuma vaga disponível</p> :
              vagas.map(v => <div key={v.id} style={{padding: '8px 12px', background: 'var(--surface)', marginBottom: 8, borderRadius: 6, boxShadow: 'var(--shadow)'}}>🚗 Garagem {v.numero}</div>)}
          </div>
        </div>

        <div>
          <h3>Condôminos ({condominos.length})</h3>
          <div style={{background: 'var(--background)', padding: 16, borderRadius: 'var(--radius)', maxHeight: 200, overflowY: 'auto'}}>
            {condominos.length === 0 ? <p style={{color: 'var(--text-light)'}}>Nenhum condômino disponível</p> :
              condominos.map(c => <div key={c.id} style={{padding: '8px 12px', background: 'var(--surface)', marginBottom: 8, borderRadius: 6, boxShadow: 'var(--shadow)'}}>👤 {c.nome} - Unidade {c.unidade_num}</div>)}
          </div>
        </div>
      </div>

      {resultados.length > 0 && (
        <div className="resultado">
          <h3>🏆 Resultado do Sorteio</h3>
          <div className="resultado-grid">
            {resultados.map((r, i) => (
              <div key={i} className="resultado-item">
                <span>🚗 Garagem {r.vaga}</span>
                <span style={{fontWeight: 600, color: 'var(--primary)'}}>{r.condomino}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Sorteio;
