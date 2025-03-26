import React, { useState, useRef, useEffect } from 'react';
import '../../assets/css/ChatWithAI/ChatGemini.css';
import { generatedataWithGemini } from '../../service/geminiService';
import { speak, stopSpeak } from '../../service/geminiService';
import { saveMessages, loadMessages, clearHistory } from '../../service/geminiService';
import { saveLearningContext, loadLearningContext, clearLearningContext } from '../../service/englishLearningService';
import geminiLogo from '../../assets/image/gemini-logo.png';
import { Avatar, message, Select, Progress, Modal, Spin } from 'antd';
const { Option } = Select;

const ChatGemini = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const chatContainerRef = useRef(null);
    const [learningContext, setLearningContext] = useState({
        level: 'beginner',
        topics: [],
        vocabulary: [],
        mistakes: [],
        progress: 0
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedWord, setSelectedWord] = useState(null);
    const [wordDetails, setWordDetails] = useState(null);
    const [isLoadingWord, setIsLoadingWord] = useState(false);

    // Load chat history and learning context when component mounts
    useEffect(() => {
        const history = loadMessages();
        if (history.length > 0) {
            setMessages(history);
            scrollToBottom();
        }

        const context = loadLearningContext() || {
            level: 'beginner',
            topics: [],
            vocabulary: [],
            mistakes: [],
            progress: 0
        };

        setLearningContext(context);
    }, []);

    // Save messages and learning context whenever they change
    useEffect(() => {
        if (messages?.length > 0) {
            saveMessages(messages);
            // Update learning context based on new messages
            const updatedContext = analyzeLearningProgress(messages, learningContext);
            setLearningContext(updatedContext);
            saveLearningContext(updatedContext);
        }
    }, [messages]);

    // Scroll handling
    useEffect(() => {
        const handleScroll = () => {
            if (!chatContainerRef.current) return;

            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const bottomThreshold = 100;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < bottomThreshold;
            setShowScrollButton(!isNearBottom);
        };

        const container = chatContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    // Auto scroll khi có tin nhắn mới
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
            }
        };

        inputRef.current?.addEventListener('keypress', handleKeyPress);
        return () => {
            inputRef.current?.removeEventListener('keypress', handleKeyPress);
        };
    }, [inputMessage]);

    // Enhanced speak message function using ResponsiveVoice
    const speakMessage = async (text) => {
        try {
            setIsSpeaking(true);
            await speak(text);
        } catch (error) {
            message.error('Không thể phát âm tin nhắn');
        } finally {
            setIsSpeaking(false);
        }
    };

    const stopSpeaking = () => {
        stopSpeak();
        setIsSpeaking(false);
    };

    const analyzeLearningProgress = (messages, currentContext) => {
        if (!messages || !currentContext) return currentContext;

        const recentMessages = messages.slice(-5);
        const newContext = {
            ...currentContext,
            topics: currentContext.topics || [],
            vocabulary: currentContext.vocabulary || [],
            mistakes: currentContext.mistakes || []
        };

        // Analyze recent messages for vocabulary and topics
        recentMessages.forEach(msg => {
            if (msg?.role === 'assistant' && msg?.content) {
                // Extract vocabulary with pronunciations
                const vocabMatches = msg.content.match(/\$([^$]+)\$\s*(?:\([^)]+\))?/g);
                if (vocabMatches) {
                    const newVocab = vocabMatches.map(v => 
                        v.replace(/\$([^$]+)\$\s*(?:\([^)]+\))?/, '$1').trim()
                    );
                    newContext.vocabulary = [...new Set([...newContext.vocabulary, ...newVocab])];
                }

                // Extract topics (words after "Topic:" or "Subject:")
                const topicMatch = msg.content.match(/(?:Topic|Subject):\s*([^\n]+)/i);
                if (topicMatch) {
                    newContext.topics = [...new Set([...newContext.topics, topicMatch[1]])];
                }

                // Extract mistakes (after "Correction:" or "Error:")
                const mistakeMatch = msg.content.match(/(?:Correction|Error):\s*([^\n]+)/i);
                if (mistakeMatch && !newContext.mistakes.includes(mistakeMatch[1])) {
                    newContext.mistakes.push(mistakeMatch[1]);
                }
            }
        });

        // Calculate progress (based on vocabulary and corrections)
        newContext.progress = Math.min(
            ((newContext.vocabulary.length * 2 + newContext.topics.length * 5) / 100) * 100,
            100
        );

        return newContext;
    };

    const formatMessageContent = (content) => {
        if (!content) return '';
        
        // First, extract word-pronunciation pairs
        const pairs = [];
        const regex = /\$([^$]+)\$\s*\(([^)]+)\)/g;
        let match;
        
        // Find all word-pronunciation pairs
        while ((match = regex.exec(content)) !== null) {
            pairs.push({
                word: match[1].trim(),
                pronunciation: match[2].trim()
            });
        }

        // Replace $word$ (pronunciation) with formatted span
        let formattedContent = content.replace(/\$([^$]+)\$\s*\(([^)]+)\)/g, (match, word, pronunciation) => {
            return `<span class="vocabulary" 
                data-pronunciation="${pronunciation}"
                onclick="window.handleVocabClick(this)">${word.trim()}</span>`;
        });

        // Handle any remaining $word$ without pronunciation
        formattedContent = formattedContent.replace(/\$([^$]+)\$/g, (match, word) => {
            return `<span class="vocabulary" onclick="window.handleVocabClick(this)">${word.trim()}</span>`;
        });

        return formattedContent;
    };

    const fetchWordDetails = async (word) => {
        setIsLoadingWord(true);
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await response.json();
            
            if (data && data[0]) {
                const details = {
                    word: data[0].word,
                    phonetic: data[0].phonetic || '',
                    meanings: data[0].meanings,
                    // Thêm dịch tiếng Việt ở đây nếu có API riêng
                    vietnameseMeaning: "Đang cập nhật..." // Placeholder
                };
                setWordDetails(details);
            }
        } catch (error) {
            console.error('Error fetching word details:', error);
            message.error('Could not fetch word details');
        } finally {
            setIsLoadingWord(false);
        }
    };

    // Add this to window object so it can be called from the onClick
    useEffect(() => {
        window.handleVocabClick = (element) => {
            const word = element.textContent;
            const pronunciation = element.getAttribute('data-pronunciation');
            
            setSelectedWord({
                word,
                pronunciation
            });
            fetchWordDetails(word);
            setIsModalVisible(true);
        };

        return () => {
            delete window.handleVocabClick;
        };
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage?.trim()) return;

        const userMessage = {
            role: 'user',
            content: inputMessage,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...(prev || []), userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            // Include learning context in the prompt
            const contextPrompt = `
                [Learning Context]
                Level: ${learningContext?.level || 'beginner'}
                Recent Topics: ${learningContext?.topics?.slice(-3).join(', ') || 'None'}
                Vocabulary Focus: ${learningContext?.vocabulary?.slice(-5).join(', ') || 'None'}
                Recent Mistakes: ${learningContext?.mistakes?.slice(-3).join(', ') || 'None'}

                User Message: ${inputMessage}

                Instructions:
                1. Respond in clear, natural English
                2. If you spot any mistakes, provide gentle corrections
                3. Use vocabulary appropriate for ${learningContext?.level || 'beginner'} level
                4. Include pronunciation help for new words (in IPA)
                5. Mark new vocabulary with asterisks $word$  
                6. End with a follow-up question to maintain conversation
                `;

            const response = await generatedataWithGemini(contextPrompt);
            if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
                const aiMessage = {
                    role: 'assistant',
                    content: response.candidates[0].content.parts[0].text,
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...(prev || []), aiMessage]);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, there was an error. Please try again.',
                timestamp: new Date().toISOString(),
                isError: true
            };
            setMessages(prev => [...(prev || []), errorMessage]);
            message.error('Could not connect to AI tutor');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([]);
        clearHistory();
        clearLearningContext();
        setLearningContext({
            level: 'beginner',
            topics: [],
            vocabulary: [],
            mistakes: [],
            progress: 0
        });
        message.success('Chat history and learning progress cleared');
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            const scrollHeight = chatContainerRef.current.scrollHeight;
            const height = chatContainerRef.current.clientHeight;
            const maxScrollTop = scrollHeight - height;

            chatContainerRef.current.scrollTo({
                top: maxScrollTop,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className='chat-wrapper'>
            <div className="chat-containerwithAI">
                <div className="chat-header">
                    <div className="header-content">
                        <img src={geminiLogo} alt="AI English Tutor" className="gemini-logo" />
                        <h2>English Learning Assistant</h2>
                    </div>
                    <div className="header-actions">
                        <Select
                            value={learningContext.level}
                            onChange={(value) => setLearningContext(prev => ({ ...prev, level: value }))}
                            style={{ width: 120, marginRight: 10 }}
                        >
                            <Option value="beginner">Beginner</Option>
                            <Option value="intermediate">Intermediate</Option>
                            <Option value="advanced">Advanced</Option>
                        </Select>
                        <button
                            className="clear-chat"
                            onClick={handleClearChat}
                            title="Clear chat history"
                        >
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>

                <div className="learning-progress">
                    <div className="progress-stats">
                        <div className="stat-item">
                            <span>Vocabulary: {learningContext.vocabulary.length} words</span>
                        </div>
                        <div className="stat-item">
                            <span>Topics: {learningContext.topics.length}</span>
                        </div>
                    </div>
                    <Progress
                        percent={Math.round(learningContext.progress)}
                        status="active"
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                    />
                </div>

                <div
                    ref={chatContainerRef}
                    className="chat-messages custom-scrollbar"
                >
                    {messages.length === 0 && (
                        <div className="welcome-message">
                            <h3>👋 Welcome to Your English Learning Journey!</h3>
                            <p>I'm your AI language tutor. I'll help you:</p>
                            <ul>
                                <li>Practice natural conversations</li>
                                <li>Learn new vocabulary</li>
                                <li>Improve pronunciation</li>
                                <li>Correct mistakes gently</li>
                            </ul>
                            <p>Let's start chatting in English!</p>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message-wrapper ${message.role === 'user' ? 'user-wrapper' : 'ai-wrapper'}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="message-avatar">
                                    <Avatar src={geminiLogo} className="ai-avatar" />
                                </div>
                            )}
                            <div className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'} ${message.isError ? 'error-message' : ''}`}>
                                <div 
                                    className="message-content"
                                    dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                                />
                                <div className="message-footer">
                                    <span className="message-time" title={formatTimestamp(message.timestamp)}>
                                        {formatTimestamp(message.timestamp)}
                                    </span>
                                    {message.role === 'assistant' && (
                                        <div className="message-actions">
                                            <button
                                                className="action-button"
                                                onClick={() => {
                                                    if (isSpeaking) {
                                                        stopSpeaking();
                                                    } else {
                                                        speakMessage(message.content);
                                                    }
                                                }}
                                                title={isSpeaking ? "Dừng đọc" : "Đọc tin nhắn"}
                                            >
                                                <i className={`fas ${isSpeaking ? 'fa-stop' : 'fa-play'}`}></i>
                                            </button>
                                            <button
                                                className="action-button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(message.content);
                                                    message.success('Đã sao chép tin nhắn');
                                                }}
                                                title="Sao chép tin nhắn"
                                            >
                                                <i className="fas fa-copy"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {message.role === 'user' && (
                                <div className="message-avatar">
                                    <Avatar className="user-avatar">U</Avatar>
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message-wrapper ai-wrapper">
                            <div className="message-avatar">
                                <Avatar src={geminiLogo} className="ai-avatar" />
                            </div>
                            <div className="message ai-message">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {showScrollButton && (
                    <button
                        className="scroll-bottom-button"
                        onClick={scrollToBottom}
                        title="Scroll to bottom"
                    >
                        <i className="fas fa-chevron-down"></i>
                    </button>
                )}

                <form className="chat-input-form" onSubmit={handleSendMessage}>
                    <div className="input-wrapper">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type in English..."
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="send-button"
                            disabled={isLoading || !inputMessage.trim()}
                            title="Send message"
                        >
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div className="input-footer">
                        <span className="input-tip">
                            Press Enter to send, Shift + Enter for new line
                        </span>
                    </div>
                </form>
            </div>

            <Modal
                title={<h2 style={{ textAlign: 'center', margin: 0 }}>{selectedWord?.word}</h2>}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setWordDetails(null);
                }}
                footer={null}
                centered
                width={600}
            >
                {isLoadingWord ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin size="large" />
                    </div>
                ) : wordDetails ? (
                    <div className="word-details">
                        <div className="pronunciation-section">
                            <h3>Pronunciation:</h3>
                            <p>{wordDetails.phonetic || selectedWord?.pronunciation || 'Not available'}</p>
                            <button 
                                className="action-button"
                                onClick={() => speak(selectedWord?.word)}
                                style={{ marginLeft: '10px' }}
                            >
                                <i className="fas fa-volume-up"></i>
                            </button>
                        </div>

                        <div className="meanings-section">
                            <h3>Meanings:</h3>
                            {wordDetails.meanings.map((meaning, index) => (
                                <div key={index} className="meaning-item">
                                    <h4>{meaning.partOfSpeech}</h4>
                                    <ul>
                                        {meaning.definitions.slice(0, 3).map((def, idx) => (
                                            <li key={idx}>
                                                <p>{def.definition}</p>
                                                {def.example && (
                                                    <p className="example">Example: "{def.example}"</p>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="vietnamese-section">
                            <h3>Vietnamese Meaning:</h3>
                            <p>{wordDetails.vietnameseMeaning}</p>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        No details available for this word.
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ChatGemini;