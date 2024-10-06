'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Footer, Navbar, ExploreCard } from '../../components';
import { exploreWorlds } from '../../constants';

const GROQ_API_KEY = "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";

const DashboardPage = () => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [funFact, setFunFact] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [active, setActive] = useState('world-2');
  useEffect(() => {
    if (!isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    const fetchFunFact = async () => {
      try {
        const response = await fetch('https://api.funfacts.com/random');
        const data = await response.json();
        setFunFact(data.fact);
      } catch (error) {
        console.error('Error fetching fun fact:', error);
      }
    };

    fetchFunFact();
  }, []);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    setIsAtBottom(scrollHeight - scrollTop === clientHeight);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      const currentElement = messagesEndRef.current;
      currentElement.scrollTop = currentElement.scrollHeight; // Scroll to bottom on mount
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const botMessage = { text: '', sender: 'bot' };

    // Chatbot logic
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "messages": [
            {
              "role": "system",
              "content": "You are COSMIFY, an enthusiastic and knowledgeable space explorer! 🌌 NOTE: Use Emojis in chat and not too long responses!",
            },
            {
              "role": "user",
              "content": input
            }
          ],
          model: 'llama-3.1-8b-instant',
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
          stream: false,
        })
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      botMessage.text = data.choices[0]?.message?.content || "🚨 Oops! Something went wrong! Please try again.";
    } catch (error) {
      console.error('Error:', error);
      botMessage.text = '🚨 Oops! Something went wrong! Please try again.';
    }

    setMessages(prev => [...prev, botMessage]);

    // Scroll to bottom if user is at the bottom
    if (isAtBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="bg-primary-black overflow-hidden">
      <div style={{ marginTop: '20px' }}>
        <Navbar />
      </div>
      <div className="relative">
        <div className="gradient-03 z-0" />
        <div className="absolute top-30 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-4xl">
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <h2 className="text-3xl font-bold mb-4 text-white">COSMIFY Chat 🌍🚀</h2>
            <p className="text-sm text-gray-400 mb-2">{funFact}</p>
            <div
              ref={messagesEndRef}
              className="h-96 overflow-y-auto mb-4 p-4 bg-black bg-opacity-50 rounded-lg"
              onScroll={handleScroll} // Attach the scroll handler here
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-purple-500 bg-opacity-70 text-white' : 'bg-white text-black'}`}>
                    {msg.text.split('\n').map((line, index) => (
                      <span key={index}>{line}<br /></span>
                    ))}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow bg-gray-800 text-white rounded-l-full px-4 py-2 focus:outline-none"
                placeholder="Ask about the cosmos... 🌠"
              />
              <button
                type="submit"
                className="bg-white text-black font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline hover:bg-opacity-90 transition duration-300"
              >
                Launch 🚀
              </button>
            </form>
          </div>
        </div>

        <div className="mt-[50px] flex lg:flex-row flex-col min-h-[70vh] gap-5">
          {exploreWorlds.map((world, index) => (
            <ExploreCard
              key={world.id}
              {...world}
              index={index}
              active={active}
              handleClick={setActive}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
