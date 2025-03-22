import express from "express";
import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const router = express.Router();

const SUNO_API_URL = "https://apibox.erweima.ai/api/v1";
const SUNO_API_TOKEN = process.env.SUNO_API_TOKEN;

//Returns a task id to fetch the tasks details
router.post("/generate", async (req, res) => {
  const { prompt, style, title } = req.body;

  console.log('Generation task:')

  const requestData = {
    prompt,
    style,
    title,
    customMode: true,
    instrumental: false,
    model: "V3_5",
    callBackUrl: "https://api.example.com/callback" ,
  };

  if(!prompt || !style || !title){
    res.status(404).json({message: 'Please provide all the required parameters (prompt, style, title, tags)'})
    return
  }

  try {
    const response = await axios.post(`${SUNO_API_URL}/generate`, requestData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${SUNO_API_TOKEN}`,
      },
      maxBodyLength: Infinity,
    });
    console.log(response)
    res.json(response.data);
  } catch (error) {
    console.error("Error en generación:", error);
    res.status(500).json({ message: error.toString() });
  }
});


//Generates the actual song

router.get("/details/:taskId", async (req, res) => {
  const { taskId } = req.params;
  console.log(taskId)
  console.log(req.params)
  if (!taskId) {
    res.status(400).json({ message: "El parámetro taskId es requerido" });
    return
  }

    try {
      const response = await axios.get(`${SUNO_API_URL}/generate/record-info?taskId=${taskId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${SUNO_API_TOKEN}`,
        },
        maxBodyLength: Infinity,
      });

      res.json(response.data);
    } catch (error) {
      console.error("Error en consulta de estado:", error);
      res.status(500).json({ message: error.toString() });
    }
});

router.route("/").get((req, res) => {
  res.send("hola suno");
});

export default router;
