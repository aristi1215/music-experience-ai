import express from "express";
import cors from 'cors'
import bodyParser from "body-parser";
import openAiRoutes from './routes/openAI.ts'
import sunoRoutes from './routes/suno.ts'

const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use('/api/v1/openai', openAiRoutes)
app.use('/api/v1/suno', sunoRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(
    `listening on port: ${PORT}. Running on: http://localhost:${PORT}`
  )
);

app.get("/", (_req, res) => {
  res.send("hola");
});
