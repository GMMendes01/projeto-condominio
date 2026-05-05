const express = require('express');
const router = express.Router();
const db = require('../database');

// Listar condôminos
router.get('/', (req, res) => {
    db.all(`SELECT c.*, u.numero as unidade_num, u.bloco
            FROM condominos c
            LEFT JOIN unidades u ON c.unidade_id = u.id`, (err, rows) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(rows);
    });
});

// Buscar condômino por ID
router.get('/:id', (req, res) => {
    db.get(`SELECT c.*, u.numero as unidade_num, u.bloco
            FROM condominos c
            LEFT JOIN unidades u ON c.unidade_id = u.id
            WHERE c.id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(row);
    });
});

// Criar condômino
router.post('/', (req, res) => {
    const { nome, cpf, telefone, email, tipo, qtd_carros, unidade_id, garagem_fixa } = req.body;
    db.run(`INSERT INTO condominos (nome, cpf, telefone, email, tipo, qtd_carros, unidade_id, garagem_fixa)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nome, cpf, telefone, email, tipo, qtd_carros, unidade_id, garagem_fixa], function(err) {
            if (err) return res.status(500).json({error: err.message});
            res.json({id: this.lastID});
        });
});

// Atualizar condômino
router.put('/:id', (req, res) => {
    const { nome, cpf, telefone, email, tipo, qtd_carros, unidade_id, garagem_fixa } = req.body;
    db.run(`UPDATE condominos SET nome=?, cpf=?, telefone=?, email=?, tipo=?, qtd_carros=?, unidade_id=?, garagem_fixa=?
            WHERE id=?`,
        [nome, cpf, telefone, email, tipo, qtd_carros, unidade_id, garagem_fixa, req.params.id], function(err) {
            if (err) return res.status(500).json({error: err.message});
            res.json({changes: this.changes});
        });
});

// Deletar condômino
router.delete('/:id', (req, res) => {
    db.run(`DELETE FROM condominos WHERE id=?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({error: err.message});
        res.json({changes: this.changes});
    });
});

module.exports = router;
