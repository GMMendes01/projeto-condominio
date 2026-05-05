const express = require('express');
const router = express.Router();
const db = require('../database');

// Listar mensagens
router.get('/mensagens', (req, res) => {
    db.all(`SELECT m.*, c.nome as condomino_nome
            FROM mensagens m
            JOIN condominos c ON m.condomino_id = c.id
            ORDER BY m.data DESC`, (err, rows) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(rows);
    });
});

// Enviar mensagem
router.post('/mensagens', (req, res) => {
    const { condomino_id, texto } = req.body;
    db.run(`INSERT INTO mensagens (condomino_id, texto) VALUES (?, ?)`,
        [condomino_id, texto], function(err) {
            if (err) return res.status(500).json({error: err.message});
            res.json({id: this.lastID});
        });
});

module.exports = router;
