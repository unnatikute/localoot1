import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey there! 👋 I'm LocalLoot Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    { id: 1, text: '🔍 Browse Deals', question: 'How do I browse deals?' },
    { id: 2, text: '💾 Save Offers', question: 'How do I save offers?' },
    { id: 3, text: '🏪 Follow Shops', question: 'How do I follow shops?' },
    { id: 4, text: '📍 Location Based', question: 'How do location-based deals work?' },
    { id: 5, text: '⚡ Flash Deals', question: 'What are flash deals?' },
    { id: 6, text: '❓ Help', question: 'Can you help me?' },
  ];

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI responses mapping
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    const responses = {
      greeting: [
        'Hello! Welcome to LocalLoot. How can I assist you today?',
        'Hi there! 👋 Looking for great deals nearby?',
        'Hey! What brings you to LocalLoot today?',
      ],
      deals: [
        'We have tons of amazing deals across Food, Fashion, Electronics, Beauty, and more! Would you like me to show you some trending offers?',
        'Check out our Flash Deals section for limited-time offers! 🔥 What category interests you?',
        'You can browse offers by category or enable location-based filters to find deals near you!',
      ],
      help: [
        'I can help you with: Finding deals, browsing categories, saving offers, following shops, and more! What would you like to do?',
        'Need help? I can assist with: Searching offers, filtering by location/price, saving deals, and following favorite shops.',
      ],
      location: [
        'You can change your location anytime from the header! Just click "Change Location" to update it.',
        'Location-based deals show offers from shops near you. You can adjust your location in the top section.',
      ],
      save: [
        'You can save deals you like by clicking the bookmark icon. Access them anytime from "My Bookmarks"!',
        'Love an offer? Save it! All your saved deals are in "My Bookmarks" for easy access.',
      ],
      shops: [
        'You can follow your favorite shops to get notifications about their latest offers! Follow shops from "My Account" or individual shop pages.',
        'Follow shops to stay updated on their exclusive deals and new offers!',
      ],
      categories: [
        'We have categories like: Food & Dining 🍕, Fashion 👗, Electronics 📱, Beauty 💄, Health & Wellness 💪, Home & Living 🏠, and Sports ⚽',
        'Browse any of our categories or use quick filters to narrow down deals by type or distance!',
      ],
      flash: [
        'Flash Deals are limited-time offers with amazing discounts! They update regularly, so check back often. ⚡🔥',
        'Flash deals offer huge savings for a limited time. Browse the "⚡ Flash Deals" section to see current offers!',
      ],
      thanks: [
        'Thanks for using LocalLoot! 😊 Visit again soon for more amazing deals. Happy saving! 🛍️',
        'Thank you so much! We hope to see you again soon. Enjoy your savings! 👋',
        'Thanks for chatting with us! Come back soon to find more great offers. See you! 🎉',
      ],
      default: [
        'That\'s interesting! I\'m still learning. Can I help you with deals, categories, saving offers, or anything else about LocalLoot?',
        'I\'m here to help with LocalLoot features. What would you like to know about?',
        'Feel free to ask me about deals, offers, categories, or how to use LocalLoot! 🛍️',
      ],
    };

    // Keyword matching
    if (
      message.includes('hello') ||
      message.includes('hi') ||
      message.includes('hey') ||
      message.includes('help me')
    ) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else if (
      message.includes('browse') ||
      message.includes('deal') ||
      message.includes('offer') ||
      message.includes('discount') ||
      message.includes('cheap')
    ) {
      return responses.deals[Math.floor(Math.random() * responses.deals.length)];
    } else if (
      message.includes('help') ||
      message.includes('how') ||
      message.includes('can you')
    ) {
      return responses.help[Math.floor(Math.random() * responses.help.length)];
    } else if (
      message.includes('location') ||
      message.includes('near') ||
      message.includes('nearby')
    ) {
      return responses.location[Math.floor(Math.random() * responses.location.length)];
    } else if (
      message.includes('save') ||
      message.includes('bookmark') ||
      message.includes('favorite')
    ) {
      return responses.save[Math.floor(Math.random() * responses.save.length)];
    } else if (
      message.includes('shop') ||
      message.includes('follow') ||
      message.includes('merchant')
    ) {
      return responses.shops[Math.floor(Math.random() * responses.shops.length)];
    } else if (
      message.includes('category') ||
      message.includes('categor') ||
      message.includes('food') ||
      message.includes('fashion') ||
      message.includes('electronics')
    ) {
      return responses.categories[Math.floor(Math.random() * responses.categories.length)];
    } else if (
      message.includes('flash')
    ) {
      return responses.flash[Math.floor(Math.random() * responses.flash.length)];
    } else if (
      message.includes('thank')
    ) {
      return responses.thanks[Math.floor(Math.random() * responses.thanks.length)];
    } else {
      return responses.default[Math.floor(Math.random() * responses.default.length)];
    }
  };

  const handleSendMessage = async (e, messageText = null) => {
    e?.preventDefault();

    const textToSend = messageText || inputValue;
    if (!textToSend.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Check if user typed greeting (hi, hello, hey) to show quick replies
    const lowerText = textToSend.toLowerCase();
    const isGreeting = lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('hey');
    const isThanks = lowerText.includes('thank') || lowerText.includes('thanku') || lowerText.includes('thanks');

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(textToSend),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
      
      // Show quick replies only after greeting
      if (isGreeting) {
        setShowQuickReplies(true);
      } 
      // Hide quick replies after thank you
      else if (isThanks) {
        setShowQuickReplies(false);
      }
    }, 800);
  };

  const handleQuickReply = (question) => {
    const event = { preventDefault: () => {} };
    handleSendMessage(event, question);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Chat Widget */}
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col border border-gray-200 animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold">LocalLoot Assistant</h3>
                <p className="text-xs text-blue-100">Always here to help 🤖</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-all duration-300 transform hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl transform hover:scale-105 transition-all duration-200 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-lg'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none shadow-md'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className={`text-xs mt-1 block ${
                    msg.sender === 'user' ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-2xl rounded-bl-none flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}

            {/* Quick Reply Options */}
            {showQuickReplies && messages.length > 1 && (
              <div className="space-y-2 py-2">
                <p className="text-xs text-gray-500 font-semibold uppercase px-2">Quick replies:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.id}
                      onClick={() => handleQuickReply(reply.question)}
                      disabled={isLoading}
                      className="text-left px-3 py-2 text-xs bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
                    >
                      <span className="font-semibold text-gray-900">{reply.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        } text-white relative group animate-pulse`}
      >
        {!isOpen && (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Chat with us!
            </span>
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-bounce"></span>
          </>
        )}
        {isOpen && <X className="w-6 h-6" />}
      </button>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
