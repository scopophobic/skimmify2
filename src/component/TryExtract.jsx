import React, { useState, useEffect } from "react";
import axios from "axios";
import cheerio from "cheerio";
import { GoogleGenerativeAI } from "@google/generative-ai";
import nlp from 'compromise';


// Access your API key from environment variables
const apiKey = import.meta.env.VITE_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);



const TryExtract = () => {
  const [url, setUrl] = useState("");
  const [paragraphs, setParagraphs] = useState([]);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const stopwords = [
    "the", "is", "at", "of", "on", "and", "a", "to", "in", "it", "for", "with", 
    "as", "that", "this", "was", "by", "an", "be", "or", "not", "are", "from"
  ];
  

  const extractKeywords = async (para) => {
    try{
    const text = para.join(" ");
    console.log("Combined Text:", text);

    // Step 2: Split text into words and filter
    const words = text.split(/\s+/); // Split by spaces
    console.log("All Words:", words);

    // Step 3: Filter out stopwords and duplicates
    const filteredKeywords = [...new Set(words.filter(word => {
      const cleanWord = word.replace(/[^\w]/g, '').toLowerCase(); // Remove punctuation
      return cleanWord && !stopwords.includes(cleanWord);
    }))];

    console.log("Filtered Keywords:", filteredKeywords);

    return filteredKeywords;
  } catch (error) {
    console.error("Error in keyword extraction:", error);
    return [];
    }
  
  };


  const fetchData = async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      const extractedParagraphs = $("p")
        .map((i, el) => $(el).text())
        .get();
      setParagraphs(extractedParagraphs);

      const keyword = await extractKeywords(extractedParagraphs);
      
      const keywordStr = keyword.join(" ");
      console.log(keywordStr);
      if (extractedParagraphs.length > 0) {
        // (extractedParagraphs.slice(0, 10).join(" ")
        summarizeContent(keywordStr);
      }
    } catch (err) {
      setError("Error fetching paragraphs");
    } finally {
      setIsLoading(false);
    }
  };


  const summarizeContent = async (content) => {
    try {
      console.log("Content:", content);

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
  
      const prompt = `Given the following content of a webpage, provide a concise summary of what the webpage is about: ${content}`;
      console.log("Formatted Prompt:", prompt);
  
      // Correctly call the generateContent method
      const result = await model.generateContent(prompt);

      // Log the full result to inspect its structure
      console.log("Result:", result);
      const response = await result.response;
      const text = response.text();
      // console.log(text);

      if (result && result.response && result.response.candidates && result.response.candidates.length > 0) {
        // const text = result.response.candidates[0].text;
        setSummary(text);
      } else {
        throw new Error("No summary returned");
      }
    } catch (err) {
      console.error("Error summarizing content:", err);
      setError("Error summarizing content");
    }
  };

  return (
    <div className=" bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-black text-2xl font-bold mb-4">Content Extractor</h1>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">Enter URL:</label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          onClick={fetchData}  // Fetch data when the button is clicked
          className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
        >
          Fetch Summary
        </button>

        {isLoading && <div className="mt-4 text-blue-600">Loading...</div>}
        {error && <div className="mt-4 text-red-600">{error}</div>}
        {summary && <div className="mt-4 p-4 bg-gray-200 rounded-md">{summary}</div>}
        {/* {paragraphs.length > 0 && (
          <ul className="mt-4 space-y-2">
            {paragraphs.map((paragraph, index) => (
              <li key={index} className="bg-gray-100 p-2 rounded-md">{paragraph}</li>
            ))}
          </ul>
        )} */}
      </div>
    </div>
  );
};

export default TryExtract;
