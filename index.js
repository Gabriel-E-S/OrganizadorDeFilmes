// Importar módulos
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); 
require('dotenv').config();

// Criar aplicação
const app = express();
const port = process.env.PORT || 3000;

// Permitir o CORS 
app.use(cors()); 

// Permitir receber dados de formulário (HTML)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});
// Testar conexão
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar:', err);
    } else {
        console.log('Conectado ao MySQL');
    }
});
// Rota para salvar usuário (form HTML)
app.post('/add-filme', (req, res) => {

    const { nome, descricao, genero, lancamento,nota } = req.body;

    const sql = 'INSERT INTO filmes (nome, descricao, genero, lancamento, nota) VALUES (?, ?, ?, ?, ?)';

    db.query(sql, [nome, descricao, genero, lancamento, nota], (err, result) => {
        if (err) {
            console.error(err);
            return res.send('Erro ao salvar');
        }

        const paginaDeSucesso = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Sucesso</title>
            <style>
                body {
                    font-family: Arial, sans-serif; 
                    text-align: center;
                    padding-top: 50px;
                    background-color: #f4f4f9; 
                }
                .caixa { 
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                }
                h1 {
                     color: #28a745; 
                }
                .botao-voltar {
                    margin-top: 20px; 
                    padding: 10px 20px; 
                    background-color: #590186;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px; 
                }
            </style>
        </head>
        <body>
            <div class="caixa">
                <h1> Filme salvo com sucesso!</h1>
                <a href="http://127.0.0.1:5500/index.html" class="botao-voltar">Voltar para o Formulário</a>
            </div>
        </body>
        </html>
    `;

    res.send(paginaDeSucesso);
    });
});

// Rota para listar filmes
app.get('/filmes', (req, res) => {
    const sql = 'SELECT * FROM filmes';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Rota para deletar um filme
app.delete('/filmes/:id', (req, res) => {
    
    const idDaFilme = req.params.id; 

    const sql = 'DELETE FROM filmes WHERE id = ?';
    
    db.query(sql, [idDaFilme], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao deletar a filme no banco');
        }
        res.send('Filme deletada com sucesso!');
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});