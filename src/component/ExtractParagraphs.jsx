import React, { useState, useEffect } from "react";
import axios from "axios";
import cheerio from "cheerio";

const ExtractParagraphs = () => {
  const [url, setUrl] = useState("");
  const [paragraphs, setParagraphs] = useState([]);
  const [content, setContent] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors

      try {
        // const mainurl = "https://cors-anywhere.herokuapp.com/" + url;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const extractedParagraphs = $("p")
          .map((i, el) => $(el).text())
          .get();
        setParagraphs(extractedParagraphs);
      } catch (err) {
        setError("Error fetching paragraphs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <div>
      <label htmlFor="url">Enter URL:</label>
      <input
        type="text"
        id="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={() => fetchData()}>Fetch Paragraphs</button>

      {isLoading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      {paragraphs.length > 0 && (
        <ul>
          {paragraphs.map((paragraph, index) => (
            <li key={index}>{paragraph}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExtractParagraphs;
