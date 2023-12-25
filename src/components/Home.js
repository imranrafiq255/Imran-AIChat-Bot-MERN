import React, { useState } from "react";
import "./Home.css";
import Logo from "../images/chatbot.png";
import SendLogo from "../images/send-message.png";
import { TypeAnimation } from "react-type-animation";
import { HashLoader } from "react-spinners";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [text, setText] = useState("");
  const [generatedAnswer, setAnswer] = useState("");
  const [loader, setLoader] = useState(false);
  const API_KEY = process.env.key;
  const apiUrl =
    "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" +
    API_KEY;

  const handleInput = () => {
    setLoader(true);
    const requestData = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        const generatedContent = data.candidates[0].content.parts[0].text;
        setAnswer(generatedContent);
        setText(prompt);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoader(false);
      });

    setPrompt("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && prompt.trim() !== "") {
      // Prevent the default behavior of the Enter key (e.g., form submission)
      e.preventDefault();
      // Handle the input
      handleInput();
    }
  };

  return (
    <>
      <div className="home-container">
        <h3 className="top-text">WELCOME to</h3>
        <img
          src={Logo}
          alt=""
          width={100}
          height={100}
          className="text-center"
        />
        <h3 className="name-text">
          <TypeAnimation
            sequence={["", 2000, "IMRAN AIChat", 2000, "by IMRAN MALIK", 2000]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          ></TypeAnimation>
        </h3>
        {loader ? (
          <div className="loader">
            <HashLoader
              color={"rgb(236, 23, 201)"}
              loading={loader}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />{" "}
            <br />
          </div>
        ) : (
          <div className="container">
            {text !== "" ? (
              <h2 className="question">
                Question: <span>{<h2>{text + "?"}</h2>}</span>{" "}
              </h2>
            ) : (
              ""
            )}
            <p className="chat-text">{generatedAnswer}</p>
          </div>
        )}
        <div className="text-input">
          <input
            type="text"
            placeholder="Enter your prompt"
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            value={prompt}
          />
          {prompt.trim() !== "" && (
            <img
              className="send-logo"
              src={SendLogo}
              alt=""
              width={30}
              height={30}
              onClick={handleInput}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
