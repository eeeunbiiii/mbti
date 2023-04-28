import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res){
  if (req.method === 'POST') {
    const { inputValue } = req.body;

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    try { // 이미지 요청
        const response = await openai.createImage({
            prompt: `cat that best fits this sentence : ${inputValue}`,
            n: 1,
            size: "1024x1024",
        })
      const image_url = response.data.data[0].url;

      // 결과 반환
      res.status(200).json({ image_url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create image' });
    }
  } else {
    res.status(405).json({ message:'Method Not Allowed' });
  }
}
