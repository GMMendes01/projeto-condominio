const express = require('express');
const router = express.Router();
const db = require('../database');

// Listar garagens
router.get('/', (req, res) => {
    db.all(`SELECT g.*, c.nome as condomino_nome
            FROM garagens g
            LEFT JOIN condominos c ON g.condomino_id = c.id`, (err, rows) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(rows);
    });
});

// Criar garagem
router.post('/', (req, res) => {
    const { numero, tipo } = req.body;
    db.run(`INSERT INTO garagens (numero, tipo) VALUES (?, ?)`,
        [numero, tipo], function(err) {
            if (err) return res.status(500).json({error: err.message});
            res.json({id: this.lastID});
        });
});

// Atualizar garagem
router.put('/:id', (req, res) => {
    const { numero, tipo, condomino_id } = req.body;
    db.run(`UPDATE garagens SET numero=?, tipo=?, condomino_id=? WHERE id=?`,
        [numero, tipo, condomino_id, req.params.id], function(err) {
            if (err) return res.status(500).json({error: err.message});
            res.json({changes: this.changes});
        });
});

// Deletar garagem
router.delete('/:id', (req, res) => {
    db.run(`DELETE FROM garagens WHERE id=?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({error: err.message});
        res.json({changes: this.changes});
    });
});

module.exports = router;
