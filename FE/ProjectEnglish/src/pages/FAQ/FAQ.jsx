import "../../assets/css/FAQcss/FAQ.css";

const Faqpage = () => {
  // Hàm toggleFAQ
  const toggleFAQ = (id) => {
    const answer = document.getElementById(`answer-${id}`);
    const iconPlus = document.getElementById(`icon-plus-${id}`);
    const iconMinus = document.getElementById(`icon-minus-${id}`);
    if (answer.style.height === "0px" || answer.style.height === "" || answer.style.height === "0") {
      answer.classList.remove("hidden");
      const scrollHeight = answer.scrollHeight;
      answer.style.height = scrollHeight + "px";
      iconPlus.classList.add("hidden");
      iconMinus.classList.remove("hidden");
    } else {
      answer.style.height = "0px";
      setTimeout(() => {
        answer.classList.add("hidden");
      }, 300);
      iconPlus.classList.remove("hidden");
      iconMinus.classList.add("hidden");
    }
  };

  return (
    <>

        <body className="bg-white py-12">
    
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mt-8">
              Find Answers to Common Questions
            </h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* FAQ Item 1 */}
              <div className="bg-gray-100 rounded-lg p-6">
                <button
                  className="w-full text-left flex justify-between items-center"
                  onClick={() => toggleFAQ(1)}
                >
                  <span className="text-lg font-medium text-gray-800">
                    1. What makes this platform different from others?
                  </span>
                  <div className="flex-shrink-0">
                    {/* Plus Icon */}
                    <svg
                      id="icon-plus-1"
                      className="w-6 h-6 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {/* Minus Icon */}
                    <svg
                      id="icon-minus-1"
                      className="w-6 h-6 text-gray-500 hidden"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>
                <div
                  id="answer-1"
                  className="mt-4 text-gray-600 hidden overflow-hidden h-0 transition-all duration-300"
                  style={{ height: 0 }}
                >
                  <p>
                    We use AI to personalize your learning, provide real-time feedback, and offer interactive lessons to accelerate your progress.
                  </p>
                </div>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-gray-100 rounded-lg p-6">
                <button
                  className="w-full text-left flex justify-between items-center"
                  onClick={() => toggleFAQ(2)}
                >
                  <span className="text-lg font-medium text-gray-800">
                    2. How does the AI chatbot improve my speaking skills?
                  </span>
                  <div className="flex-shrink-0">
                    {/* Plus Icon */}
                    <svg
                      id="icon-plus-2"
                      className="w-6 h-6 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {/* Minus Icon */}
                    <svg
                      id="icon-minus-2"
                      className="w-6 h-6 text-gray-500 hidden"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>
                <div
                  id="answer-2"
                  className="mt-4 text-gray-600 hidden overflow-hidden h-0 transition-all duration-300"
                  style={{ height: 0 }}
                >
                  <p>
                    It corrects grammar, suggests better vocabulary, and helps you practice real-world conversations like job interviews and business meetings.
                  </p>
                </div>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-gray-100 rounded-lg p-6">
                <button
                  className="w-full text-left flex justify-between items-center"
                  onClick={() => toggleFAQ(3)}
                >
                  <span className="text-lg font-medium text-gray-800">
                    3. Does the platform support IELTS/TOEFL/TOEIC preparation?
                  </span>
                  <div className="flex-shrink-0">
                    {/* Plus Icon */}
                    <svg
                      id="icon-plus-3"
                      className="w-6 h-6 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {/* Minus Icon */}
                    <svg
                      id="icon-minus-3"
                      className="w-6 h-6 text-gray-500 hidden"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>
                <div
                  id="answer-3"
                  className="mt-4 text-gray-600 hidden overflow-hidden h-0 transition-all duration-300"
                  style={{ height: 0 }}
                >
                  <p>
                    Yes! We offer mock tests, AI feedback on speaking and writing, and expert strategies to boost your scores.
                  </p>
                </div>
              </div>
                 {/* FAQ Item 4 */}
                 <div className="bg-gray-100 rounded-lg p-6">
                                <button
                                    className="w-full text-left flex justify-between items-center"
                                    onClick={() => toggleFAQ(4)}
                                >
                                    <span className="text-lg font-medium text-gray-800">
                                        4. Can I learn English for my job?
                                    </span>
                                    <div className="flex-shrink-0">
                                        {/* Plus Icon */}
                                        <svg
                                            id="icon-plus-4"
                                            className="w-6 h-6 text-gray-500"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z"
                                                clipRule="evenodd"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {/* Minus Icon */}
                                        <svg
                                            id="icon-minus-4"
                                            className="w-6 h-6 text-gray-500 hidden"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </button>
                                <div
                                    id="answer-4"
                                    className="mt-4 text-gray-600 hidden overflow-hidden h-0 transition-all duration-300"
                                    style={{ height: 0 }}
                                >
                                    <p>
                                        Yes! We offer specialized courses in Business English, Technical English, and industry-specific communication.
                                    </p>
                                </div>
                            </div>

                            {/* FAQ Item 5 */}
                            <div className="bg-gray-100 rounded-lg p-6">
                                <button
                                    className="w-full text-left flex justify-between items-center"
                                    onClick={() => toggleFAQ(5)}
                                >
                                    <span className="text-lg font-medium text-gray-800">
                                        5. Does the platform help with pronunciation?
                                    </span>
                                    <div className="flex-shrink-0">
                                        {/* Plus Icon */}
                                        <svg
                                            id="icon-plus-5"
                                            className="w-6 h-6 text-gray-500"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z"
                                                clipRule="evenodd"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {/* Minus Icon */}
                                        <svg
                                            id="icon-minus-5"
                                            className="w-6 h-6 text-gray-500 hidden"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </button>
                                <div
                                    id="answer-5"
                                    className="mt-4 text-gray-600 hidden overflow-hidden h-0 transition-all duration-300"
                                    style={{ height: 0 }}
                                >
                                    <p>
                                        Yes! Our AI analyzes your speech, corrects mistakes, and helps you sound more natural in American or British English.
                                    </p>
                                </div>
                            </div>

                            {/* FAQ Item 6 */}
                            <div className="bg-gray-100 rounded-lg p-6">
                                <button
                                    className="w-full text-left flex justify-between items-center"
                                    onClick={() => toggleFAQ(6)}
                                >
                                    <span className="text-lg font-medium text-gray-800">
                                        6. What if I need help?
                                    </span>
                                    <div className="flex-shrink-0">
                                        {/* Plus Icon */}
                                        <svg
                                            id="icon-plus-6"
                                            className="w-6 h-6 text-gray-500"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z"
                                                clipRule="evenodd"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {/* Minus Icon */}
                                        <svg
                                            id="icon-minus-6"
                                            className="w-6 h-6 text-gray-500 hidden"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </button>
                                <div
                                    id="answer-6"
                                    className="mt-4 text-gray-600 hidden overflow-hidden h-0 transition-all duration-300"
                                    style={{ height: 0 }}
                                >
                                    <p>
                                        We offer 24/7 support via email, live chat, and one-on-one instructor consultations (for premium users).
                                    </p>
                                </div>
                            </div>
            </div>
          </div>
        </body>
  
    </>
  );
};

export default Faqpage;
