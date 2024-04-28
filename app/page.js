"use client";
import { useState, useRef, useEffect } from "react";
import './globals.css';
import Image from "next/image";

export default function Home() {
  const [msgs, setMsgs] = useState([]);
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);

  const sendPrompt = async () => {
    setMsgs((prev) => [...prev, { sender: "You", msg: msg }]);
    const temp = msg;
    setMsg("");
    await fetch(
      "https://bots.easy-peasy.ai/bot/b6560a2e-27ac-4e25-a063-687fa6bd0e2f/api",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "e71d69e6-c507-40b6-9898-ad80b4711f5d",
        },
        body: JSON.stringify({
          message: temp,
          history: [],
          stream: true,
        }),
      }
    ).then((res) => {
      const decoder = new TextDecoder("utf-8");
      res.text().then((text) => {
        const lines = text.split("\n");
        lines.forEach((line) => {
          if (line) {
            if (line.includes("data: ")) {
              const data = JSON.parse(line.slice(6));
              if (data && data["bot"]) {
                setMsgs((prev) => [
                  ...prev,
                  { sender: "Fred", msg: data["bot"]["text"] },
                ]);
                
              }
            }
          }
        });
      });
    });
  };

  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  },[msgs])

  return (
    <div className="flex flex-col w-screen h-screen bg-gradient-to-b from-purple-600 via-blue-500 to-blue-200 min-h-screen bg-fixed bg-cover text-white">
      <div class="max-w-4xl mx-auto p-5 text-center h-[20vh]">
        <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase tracking-wider mb-5 mt-[2vh]">Fred LLM</h1>
        <p class="text-sm sm:text-md md:text-md lg:text-lg mb-3">Chat with Fred, your own AI assistant.</p>
      </div>
      <div className="w-[60vw] ml-[20vw] h-[70%] items-center flex flex-col p-2">
        <div className="break-words flex flex-col overflow-auto h-[80%] mb-5">
          {msgs.map((item, index) => (
            <p key={index} className="break-words text-wrap whitespace-normal w-[60vw] mt-2" style={{'word-wrap': 'break-word'}}>
              {item.sender}: {item.msg}
            </p>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <div className=" h-[10%] flex flex-row mt-auto w-full items-center rounded-md">
          <div className="w-[57%] sm:w-[67%] md:w-[77%] lg:w-[87%] border-2 border-white z-[100] rounded-lg">
          <input
          id="focus"
          placeholder="Type Your Message"
            className="focus-white text-white w-full text-md sm:text-lg md:text-lg lg:text-xl pl-2 p-2 rounded-lg bg-transparent border-0 focus:border-0 reset-input"
            type="text"
            onKeyDown={(e)=>{
              if(e.key == "Enter"){
                sendPrompt()
              }
            }}
            style={{
              borderColor: 'white',
              ':focus': {
                borderColor: 'white',
              },
           }}
            value={msg}
            onChange={(e) => {
              setMsg(e.target.value);
            }}
          ></input>
          </div>
          <button className="w-[38%] sm:w-[28%] md:w-[18%] lg:w-[8%] ml-auto mr-4 text-xl border-2 border-white rounded-lg p-2" onClick={sendPrompt}>Send</button>
        </div>
      </div>
    </div>
  );
}
