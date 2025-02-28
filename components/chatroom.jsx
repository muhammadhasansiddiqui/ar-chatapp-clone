import { useState, useEffect, useRef } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  db,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "../utils/firebase"; 
import { Message } from "./Message"; 
import Logout from "./logout";

export default function ChatRoom({ user }) {
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState(""); 
  const messagesEndRef = useRef(null); 

  useEffect(() => {
    console.log("Setting up Firestore listener");

    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log("Snapshot received:", snapshot);

        const newMessages = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Message data:", data);
          return {
            ...data,
            timestamp: data.timestamp.toDate().toString(),
            userUsername: data.username,  
          };
        });

        console.log("Fetched messages:", newMessages);
        setMessages(newMessages);
      },
      (error) => {
        console.error("Error fetching messages:", error);
      }
    );

    return () => unsubscribe(); 
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return; 

    try {
      await addDoc(collection(db, "messages"), {
        userId: user?.uid,
        text: input,
        timestamp: new Date(),
        username: user?.username,  
        // imageUrl: user?.imageUrl,
      });
      setInput(""); 
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4">
        <div className="flex items-center justify-between border-b py-2">
          <h1>Chat app</h1>
          <div>
            <span>{user.username} | </span>
            <span>{user.email}</span>
          </div>
          <Logout />
        </div>
        <CardContent className="h-96 overflow-y-auto p-2 flex flex-col gap-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">No messages yet.</div>
          ) : (
            messages.map((msg, index) => (
              <Message
                key={index}
                text={msg.text}
                userId={msg.userId}
                currentUserId={user?.uid}
                userImageUrl={msg.imageUrl}
                userUsername={msg.userUsername} 
                timestamp={msg.timestamp}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <form onSubmit={sendMessage} className="flex items-center gap-2 p-2 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1"
          />
          <Button type="submit" className="bg-[#16A34A] text-white">Send</Button>
        </form>
      </Card>
    </div>
  );
}
