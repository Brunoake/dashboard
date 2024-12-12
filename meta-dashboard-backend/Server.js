require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const metaRoutes = require('./Routes/MetaRoutes');
const cors = require('cors');

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/meta', metaRoutes);
console.log('MONGO_URI:', process.env.MONGO_URI);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));