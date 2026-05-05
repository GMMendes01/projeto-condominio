const express = require('express');
const router = express.Router();
const db = require('../database');

// Listar utensílios
router.get('/', (req, res) => {
    db.all('SELECT * FROM utensilios', (err, rows) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(rows);
    });
});

// Criar utensílio
router.post('/', (req, res) => {
    const { nome, quantidade, disponivel } = req.body;
    db.run(`INSERT INTO utensilios (nome, quantidade, disponivel) VALUES (?, ?, ?)`,
        [nome, quantidade, disponivel], function(err) {
            if (err) return res.status(500).json({error: err.message});
            res.json({id: this.lastID});
        });
});

// Atualizar utensílio
router.put('/:id', (req, res) => {
    const { nome, quantidade, disponivel } = req.body;
    db.run(`UPDATE utensilios SET nome=?, quantidade=?, disponivel=? WHERE id=?`,
        [nome, quantidade, disponivel, req.params.id], function(err) {
            if (err) return res.status(500).json({error: err.message});
            res.json({changes: this.changes});
        });
});

// Deletar utensílio
router.delete('/:id', (req, res) => {
    db.run(`DELETE FROM utensilios WHERE id=?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({error: err.message});
        res.json({changes: this.changes});
    });
});

module.exports = router;
