import { useState } from 'react'

const questions = [
  {
    question: "What is the capital of India?",
    options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
    answer: "Delhi"
  },
  {
    question: "Who wrote the Ramayana?",
    options: ["Valmiki", "Tulsidas", "Ved Vyas", "Kalidas"],
    answer: "Valmiki"
  },
  {
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: "Jupiter"
  },
  {
    question: "Who is the author of the book 'To Kill a Mockingbird'?",
    options: ["F. Scott Fitzgerald", "Harper Lee", "Jane Austen", "vishal"],
    answer: "Harper Lee"
  }
];

function App() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (option) => {
    if (option === questions[current].answer) {
      setScore(score + 1);
    }
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        background: 'white',
        borderRadius: 12,
        boxShadow: "0 2px 8px #0002",
        padding: 32,
        width: 350,
        textAlign: 'center'
      }}>
        <h1 style={{ color: 'blue' }}>quiz site</h1>
        {showResult ? (
          <div>
            <h2>your score : {score} / {questions.length}</h2>
            <button
              onClick={handleRestart}
              style={{
                marginTop: 20,
                padding: 10,
                backgroundColor: 'blue',
                color: 'white',
                border: 'none',
                borderRadius: 5,
                fontSize: 18,
                cursor: "pointer"
              }}>
              restart Quiz
            </button>
          </div>
        ) : (
          <div>
            <h2>{questions[current].question}</h2>
            <div style={{ marginTop: 24 }}>
              {questions[current].options.map((option, idx) => (
                <button key={idx}
                  onClick={() => handleOptionClick(option)}
                  style={{
                    display: "block",
                    width: "100%",
                    margin: "10px 0",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #0078fe",
                    background: "#f0f8ff",
                    color: "#222",
                    fontSize: 16,
                    cursor: "pointer"
                  }} >
                  {option}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 16, color: '#888' }}>
              Question {current + 1} of {questions.length}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App;