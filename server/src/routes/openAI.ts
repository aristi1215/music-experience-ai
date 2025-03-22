import OpenAI from "openai";
import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

router.route("/generate").post(async (req, res) => {
  const { prompt, count } = req.body;
  console.log(req.body)
  if (!prompt || !count) {
    res
      .status(400)
      .json({ message: "You must provide a prompt and a number of images" });
    return
  }
  const finalPrompt = `"Generate a series of images that visually narrate the story of a song. The images should evoke a rich, emotional atmosphere that inspires the viewer to feel the essence of the song. They must be stylistically consistent and include symbolic and artistic elements that convey the lyrics and context, creating a coherent narrative sequence. The context of the song is this one:${prompt} `;
  try {
    const imagePromises = Array.from({ length: count }, () =>
      openai.images.generate({
        model: "dall-e-3",
        prompt: finalPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      })
    );

    const responses = await Promise.all(imagePromises);

    const images = responses.map((response) => response.data[0].url);

    res.json({ images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error has occurred" });
  }
});

router.get("/", (req, res) => {
  res.send("hello");
});

export default router;
