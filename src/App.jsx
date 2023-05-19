import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import './index.css'


const configuration = new Configuration({
  organization: "org-xxx",
  apiKey: "sk-xxxxxx",
});

const openai = new OpenAIApi(configuration);

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (e, message) => {
      e.preventDefault();
      
      if (!message) return;
      setIsTyping(true);

      let msgs = chats;
      msgs.push({ role: "user", content: message });
      setChats(msgs);

      setMessage("");


      await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "你现在是 EbereGPT。 你可以帮助完成图形设计任务",
          },
          ...chats,
        ],
      }).then(res => {
        msgs.push(res.data.choices[0].message)
        setChats(msgs)
        setIsTyping(false)
      }).catch(error => {
        console.log(error)
        setIsTyping(false)
      })

  }

  return <main>
        <h1>
          <div className={isTyping ? "" : "hide"}>
            <p>
              <i>{isTyping ? "正在输入..." : ""}</i>
            </p>
          </div>
        </h1>
        <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
              <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
                <span>
                  <b>{chat.role.toUpperCase()}</b>
                </span>
                <span>:</span>
                <span>{chat.content}</span>
              </p>
            ))
          : ""}
      </section>
        <form action="" onSubmit={(e) => chat(e, message)}>
          <input
            type="text"
            name="message"
            value={message}
            placeholder="在这里输入消息并按下回车键..."
            onChange={(e) => setMessage(e.target.value)}
          />
        </form>
      </main>
}

export default App
