import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

function Chat() {
  const [mensagens, setMensagens] = useState([]);
  const [condominos, setCondominos] = useState([]);
  const [form, setForm] = useState({ condomino_id: '', texto: '' });
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadMensagens();
    loadCondominos();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const loadMensagens = async () => {
    const res = await api.get('/chat/mensagens');
    setMensagens(res.data);
  };

  const loadCondominos = async () => {
    const res = await api.get('/condominos');
    setCondominos(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.condomino_id || !form.texto.trim()) return;
    await api.post('/chat/mensagens', form);
    setForm({ ...form, texto: '' });
    loadMensagens();
  };

  const condominoSelecionado = condominos.find(c => c.id === parseInt(form.condomino_id));

  return (
    <div className="page">
      <h2>💬 Chat do Condomínio</h2>

      {!form.condomino_id && (
        <div style={{marginBottom: 24, padding: 16, background: 'var(--background)', borderRadius: 'var(--radius)', textAlign: 'center'}}>
          <p style={{marginBottom: 12, color: 'var(--text-light)'}}>Selecione seu nome para começar a conversar:</p>
          <select
            value={form.condomino_id}
            onChange={e => setForm({...form, condomino_id: e.target.value})}
            style={{minWidth: 300, padding: '10px 12px', fontSize: 16}}
          >
            <option value="">👤 Selecione seu nome...</option>
            {condominos.map(c => <option key={c.id} value={c.id}>👤 {c.nome} - Unidade {c.unidade_num}</option>)}
          </select>
        </div>
      )}

      {form.condomino_id && (
        <>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '12px 16px', background: 'var(--background)', borderRadius: 'var(--radius)'}}>
            <strong style={{color: 'var(--primary)'}}>💬 {condominoSelecionado?.nome}</strong>
            <button
              onClick={() => setForm({condomino_id: '', texto: ''})}
              style={{marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: 14}}
            >Trocar usuário</button>
          </div>

          <form onSubmit={handleSubmit} style={{display: 'flex', gap: 12, marginBottom: 24}}>
            <input
              placeholder="Digite sua mensagem..."
              value={form.texto}
              onChange={e => setForm({...form, texto: e.target.value})}
              style={{flex: 1, padding: '12px 16px', fontSize: 16, borderRadius: 24, border: '2px solid var(--border)', outline: 'none'}}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              autoFocus
            />
            <button type="submit" className="btn btn-primary" style={{borderRadius: 24, padding: '12px 24px'}}>Enviar</button>
          </form>
        </>
      )}

      <div className="chat-messages" style={{maxHeight: 500}}>
        {mensagens.length === 0 ? (
          <p style={{color: 'var(--text-light)', textAlign: 'center', padding: 40}}>
            Nenhuma mensagem ainda. Seja o primeiro a comentar! 💬
          </p>
        ) : (
          mensagens.map(m => (
            <div
              key={m.id}
              className="chat-message"
              style={m.condomino_id === parseInt(form.condomino_id) ? {borderLeft: '4px solid var(--primary)'} : {}}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                <strong>{m.condomino_nome}</strong>
                <small>{new Date(m.data).toLocaleString('pt-BR')}</small>
              </div>
              <p style={{margin: 0}}>{m.texto}</p>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

export default Chat;
