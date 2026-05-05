const express = require('express');
const router = express.Router();
const db = require('../database');

// Reservar salão de festas
router.post('/reservar', (req, res) => {
    const { condomino_id, data, evento } = req.body;
    db.run(`INSERT INTO reservas (condomino_id, data, evento) VALUES (?, ?, ?)`,
        [condomino_id, data, evento], function(err) {
            if (err) return res.status(500).json({error: err.message});
            res.json({id: this.lastID});
        });
});

// Listar reservas
router.get('/reservas', (req, res) => {
    db.all(`SELECT r.*, c.nome as condomino_nome
            FROM reservas r
            JOIN condominos c ON r.condomino_id = c.id
            ORDER BY r.data`, (err, rows) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(rows);
    });
});

// Relatório de utensílios
router.get('/relatorio-utensilios', (req, res) => {
    db.all('SELECT * FROM utensilios WHERE disponivel = 1', (err, rows) => {
        if (err) return res.status(500).json({error: err.message});

        let relatorio = '=== RELATÓRIO DE UTENSÍLIOS DISPONÍVEIS ===\n\n';
        rows.forEach(u => {
            relatorio += `• ${u.nome} - Qtd: ${u.quantidade}\n`;
        });

        res.json({relatorio, dados: rows});
    });
});

module.exports = router;
