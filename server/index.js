const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Importar rotas
const condominosRoutes = require('./routes/condominos');
const unidadesRoutes = require('./routes/unidades');
const garagensRoutes = require('./routes/garagens');
const utensiliosRoutes = require('./routes/utensilios');
const sorteioRoutes = require('./routes/sorteio');
const chatRoutes = require('./routes/chat');
const documentosRoutes = require('./routes/documentos');

// Usar rotas
app.use('/api/condominos', condominosRoutes);
app.use('/api/unidades', unidadesRoutes);
app.use('/api/garagens', garagensRoutes);
app.use('/api/utensilios', utensiliosRoutes);
app.use('/api/sorteio', sorteioRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/documentos', documentosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
