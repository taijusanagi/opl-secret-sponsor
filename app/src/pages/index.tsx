import Head from 'next/head';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function Page() {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col ${inter.className}`}
    >
      <Head>
        <title>Simple Form</title>
      </Head>

      {/* Header Section */}
      <div className="flex justify-end items-center p-4">
        <button className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-2 rounded hover:from-blue-600 hover:to-blue-800">
          Connect Wallet
        </button>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center my-10">
        <h1 className="text-white text-4xl font-bold mb-2">
          Stealth Sponsor
          <span className="ml-2 inline-block animate-rotate">⛽️</span>
        </h1>
        <p className="text-white text-lg">
          Stealth gas sponsoring with Oasis Privacy Layer and Account Abstraction
        </p>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center flex-grow">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-blue-200">
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="text"
                id="name"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="email"
                id="email"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                id="message"
                placeholder="Enter your message"
                rows={4}
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="w-full p-2 rounded bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
