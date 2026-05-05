# Sistema de Condomínio

Sistema para gerenciamento de condomínio desenvolvido com React, Node.js e SQLite.

## Funcionalidades

- **Cadastros:** Condôminos, Unidades, Garagens e Utensílios da cozinha
- **Sorteio de Garagens:** Algoritmo que exclui automaticamente síndico, sub-síndico, quem possui garagem fixa e quem tem apenas 1 carro
- **Chat:** Comunicação entre condôminos
- **Documentos:** Reserva de salão de festas e relatório de utensílios

## Tecnologias

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Banco:** SQLite

## Como executar

### Backend
```bash
cd server
npm install
npm start
```
Servidor rodará na porta 3001.

### Frontend
```bash
cd client
npm install
npm run dev
```
Acesse `http://localhost:5173` no navegador.

## Estrutura

```
projeto-condominio/
├── server/          # Backend Node.js
│   ├── routes/     # Rotas da API
│   ├── index.js    # Servidor Express
│   └── database.js # Banco SQLite
└── client/         # Frontend React
    ├── src/
    │   ├── pages/  # Páginas do sistema
    │   └── services/ # API service
    └── vite.config.js
```

## Autor 
Guilherme de Mendonça Mendes

Projeto desenvolvido para disciplina de banco de dados - 3º semestre.
