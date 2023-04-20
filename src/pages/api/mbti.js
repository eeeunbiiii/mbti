import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res){
  if (req.method === 'POST') {
    const { inputValue } = req.body;

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    try { // mbti 계산
      const prompt_mbti = `Please classify the following text into one of the 16 MBTI types: ${inputValue}\nType:`;

      const completionsMbti = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt_mbti,
      });
      const mbti = completionsMbti.data.choices?.[0]?.text?.trim();
      if (!mbti) {
        throw new Error("Failed to calculate MBTI");
      }
      
      const completionsEmo = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Output only three emojis that best represent ${mbti} \nType:`
      })
      const emoji = completionsEmo.data.choices?.[0]?.text?.trim();

      // 결과 반환
      res.status(200).json({ mbti , emoji});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to calculate' });
    }
  } else {
    res.status(405).json({ message:'Method Not Allowed' });
  }
}
