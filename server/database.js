const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./condominio.db');

// Criar tabelas
db.serialize(() => {
    // Condôminos
    db.run(`CREATE TABLE IF NOT EXISTS condominos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cpf TEXT UNIQUE NOT NULL,
        telefone TEXT,
        email TEXT,
        tipo TEXT DEFAULT 'morador',
        qtd_carros INTEGER DEFAULT 1,
        unidade_id INTEGER,
        garagem_fixa INTEGER,
        FOREIGN KEY (unidade_id) REFERENCES unidades(id),
        FOREIGN KEY (garagem_fixa) REFERENCES garagens(id)
    )`);

    // Unidades
    db.run(`CREATE TABLE IF NOT EXISTS unidades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT NOT NULL,
        bloco TEXT,
        tipo TEXT DEFAULT 'apartamento'
    )`);

    // Garagens
    db.run(`CREATE TABLE IF NOT EXISTS garagens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT NOT NULL,
        tipo TEXT DEFAULT 'comum',
        sorteada INTEGER DEFAULT 0,
        condomino_id INTEGER,
        FOREIGN KEY (condomino_id) REFERENCES condominos(id)
    )`);

    // Utensílios
    db.run(`CREATE TABLE IF NOT EXISTS utensilios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        quantidade INTEGER DEFAULT 1,
        disponivel INTEGER DEFAULT 1
    )`);

    // Chat
    db.run(`CREATE TABLE IF NOT EXISTS mensagens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        condomino_id INTEGER,
        texto TEXT NOT NULL,
        data DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (condomino_id) REFERENCES condominos(id)
    )`);

    // Reservas
    db.run(`CREATE TABLE IF NOT EXISTS reservas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        condomino_id INTEGER,
        data DATE NOT NULL,
        evento TEXT,
        status TEXT DEFAULT 'pendente',
        FOREIGN KEY (condomino_id) REFERENCES condominos(id)
    )`);
});

module.exports = db;
