import { useState } from 'react';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [mbti, setMbti] = useState('');
  const [emoji, setEmoji] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    

    try {
      setLoading(true);
      const response = await fetch('/api/mbti', {
        method: 'POST',
        body: JSON.stringify({ inputValue }),
        headers: { 'Content-Type': 'application/json' }
      });

      const imageResponse = await fetch('/api/image', {
        method: 'POST',
        body: JSON.stringify({inputValue}),
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json();
      const ImageData = await imageResponse.json();

      setMbti(data.mbti);
      setEmoji(data.emoji);
      setImageUrl(ImageData.image_url); 

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          MBTI Calculator
        </h2>
        <p className="mt-6 text-center text-black">Find your cat soulmate</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loading ? (
            <div className="text-center">
              <p className="text-gray-700 text-lg">Loading...</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit} >
              <div>
                <label
                  htmlFor="inputValue"
                  className="block text-sm font-medium text-gray-700"
                >
                  Please enter your personality:
                </label>
                <div className="mt-1">
                  <input
                    id="inputValue"
                    name="inputValue"
                    type="text"
                    autoComplete="off"
                    required
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm  text-black"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Calculate
                </button>
              </div>
            </form>
          )}

          {mbti && (
            <div className="mt-6">
              <p className="font-medium text-gray-900">
                Your MBTI is {mbti} {emoji}
              </p>
              <p className='text-black'>And here is your soulmate cat : </p>
              {imageUrl && <img src={imageUrl} alt="picture of cat" className="mt-6 max-w-full"/>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
