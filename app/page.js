"use client";
import { useState } from "react";

export default function Home() {
  const [msgs, setMsgs] = useState([])
  const [msg, setMsg] = useState("")

  const sendPrompt = async () =>{
    setMsgs(prev => [...prev, {sender: 'You', msg: msg}]);
    const temp = msg
    setMsg('')
    await fetch('https://bots.easy-peasy.ai/bot/b6560a2e-27ac-4e25-a063-687fa6bd0e2f/api', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'e71d69e6-c507-40b6-9898-ad80b4711f5d'
      },
      body: JSON.stringify({
        "message": temp,
        "history": [],
        "stream": true
      })
    }).then(res=>{
      const decoder = new TextDecoder('utf-8');
      res.text().then(text=>{
      const lines = text.split('\n');
      lines.forEach(line=>{
        if(line){
          if(line.includes("data: ")){
            const data=JSON.parse(line.slice(6))
            if(data && data['bot']){
              setMsgs(prev => [...prev, {sender: 'Fred', msg: data['bot']['text']}]);
              
            }
          }
        }
      })})
    });
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-[#2b2e4a] to-[#1a1b29]">
      <label>Message: </label>
      <input className="text-black" type="text" value={msg} onChange={e=>{setMsg(e.target.value)}}></input>
      <button onClick={sendPrompt}>Send</button>
      <br></br>
      <div className="flex flex-col">
      {msgs.map((item, index)=>(
        <p>{item.sender}: {item.msg}</p>
      ))}
      </div>
    </div>
  );
}
