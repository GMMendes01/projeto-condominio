const express = require('express');
const router = express.Router();
const db = require('../database');

// Listar vagas disponíveis para sorteio
router.get('/vagas-disponiveis', (req, res) => {
    db.all(`SELECT * FROM garagens WHERE tipo = 'comum' AND sorteada = 0`, (err, rows) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(rows);
    });
});

// Listar condôminos para sorteio (exclui síndico/sub-síndico e quem tem garagem fixa)
router.get('/condominos-disponiveis', (req, res) => {
    db.all(`SELECT c.*, u.numero as unidade_num
            FROM condominos c
            LEFT JOIN unidades u ON c.unidade_id = u.id
            WHERE c.tipo NOT IN ('sindico', 'subsindico')
            AND c.garagem_fixa IS NULL
            AND c.qtd_carros > 1`, (err, rows) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(rows);
    });
});

// Realizar sorteio
router.post('/realizar', (req, res) => {
    // Buscar vagas disponíveis
    db.all(`SELECT * FROM garagens WHERE tipo = 'comum' AND sorteada = 0`, (err, vagas) => {
        if (err) return res.status(500).json({error: err.message});
        if (vagas.length === 0) return res.status(400).json({error: 'Não há vagas disponíveis'});

        // Buscar condôminos disponíveis
        db.all(`SELECT * FROM condominos
                WHERE tipo NOT IN ('sindico', 'subsindico')
                AND garagem_fixa IS NULL
                AND qtd_carros > 1`, (err, condominos) => {
            if (err) return res.status(500).json({error: err.message});
            if (condominos.length === 0) return res.status(400).json({error: 'Não há condôminos disponíveis'});

            // Sorteio aleatório
            const resultados = [];
            const vagasSorteadas = [...vagas].sort(() => Math.random() - 0.5);
            const condominosSorteados = [...condominos].sort(() => Math.random() - 0.5);

            const min = Math.min(vagasSorteadas.length, condominosSorteados.length);

            for (let i = 0; i < min; i++) {
                db.run(`UPDATE garagens SET condomino_id = ?, sorteada = 1 WHERE id = ?`,
                    [condominosSorteados[i].id, vagasSorteadas[i].id]);
                resultados.push({
                    vaga: vagasSorteadas[i].numero,
                    condomino: condominosSorteados[i].nome
                });
            }

            res.json({resultados});
        });
    });
});

// Limpar sorteio
router.post('/limpar', (req, res) => {
    db.run(`UPDATE garagens SET condomino_id = NULL, sorteada = 0 WHERE tipo = 'comum'`, function(err) {
        if (err) return res.status(500).json({error: err.message});
        res.json({message: 'Sorteio limpo', changes: this.changes});
    });
});

module.exports = router;
