const express = require('express');
const router = express.Router();
const db = require('../database');

// Listar unidades
router.get('/', (req, res) => {
    db.all('SELECT * FROM unidades', (err, rows) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(rows);
    });
});

// Criar unidade
router.post('/', (req, res) => {
    const { numero, bloco, tipo } = req.body;
    db.run(`INSERT INTO unidades (numero, bloco, tipo) VALUES (?, ?, ?)`,
        [numero, bloco, tipo], function(err) {
            if (err) return res.status(500).json({error: err.message});
            res.json({id: this.lastID});
        });
});

// Atualizar unidade
router.put('/:id', (req, res) => {
    const { numero, bloco, tipo } = req.body;
    db.run(`UPDATE unidades SET numero=?, bloco=?, tipo=? WHERE id=?`,
        [numero, bloco, tipo, req.params.id], function(err) {
            if (err) return res.status(500).json({error: err.message});
            res.json({changes: this.changes});
        });
});

// Deletar unidade
router.delete('/:id', (req, res) => {
    db.run(`DELETE FROM unidades WHERE id=?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({error: err.message});
        res.json({changes: this.changes});
    });
});

module.exports = router;
