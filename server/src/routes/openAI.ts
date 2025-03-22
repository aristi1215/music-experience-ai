import OpenAI from "openai";
import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

router.route("/").get(async (req, res) => {
  try{
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "a white siamese cat",
      n: 1,
      size: "1024x1024",
    });
  }catch(err) {
    console.error(err)
    res.status(500).json({message: 'an error has occurred'})
  }


  console.log(response.data[0].url);


});

export default router;
