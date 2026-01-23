import React from "react";
import {
  getSavedAnswer,
  saveAnswerText,
  saveCorrectAnswer,
  isTaskCorrect
} from '../utils/storage';
import '../styles/taskItem.css';

function Task({ task, onCorrect, resetSignal }) {
  const [answer, setAnswer] = React.useState('');
  const [isCorrect, setIsCorrect] = React.useState(false);

  const recognitionRef = React.useRef(null);

  React.useEffect(() => {
    const savedAnswer = getSavedAnswer(task.id);
    const correct = isTaskCorrect(task.id);

    setAnswer(savedAnswer || '');
    setIsCorrect(correct);
  }, [task.id, resetSignal]);

  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswer(transcript);
      setIsCorrect(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleChange = (e) => {
    setAnswer(e.target.value);
    setIsCorrect(false);
  };

  const saveAnswer = () => {
    if (answer.trim() === '') return;

    saveAnswerText(task.id, answer.trim());
    saveCorrectAnswer(task.id);
    setIsCorrect(true);

    if (typeof onCorrect === 'function') {
      onCorrect(task.id);
    }
  };

  const inputStyle = {
    backgroundColor: isCorrect ? '#c8f7c5' : 'white',
    padding: '5px',
    marginLeft: '50px',
    marginRight: '10px',
    width: '230px',
    marginBottom: '10px',
    marginTop: '10px',
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <strong>{task.id}</strong>

      {task.audio && (
        <img
          src={process.env.PUBLIC_URL + task.audio}
          alt="изображение"
          style={{
            width: '320px',
            height: '250px',
            marginBottom: '10px',
            marginLeft: '170px',
            alignContent: "center",
            margin: '25px',
            objectFit: 'cover',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />
      )}
      <strong>{task.text}</strong>
      {isCorrect && (
        <div className="correct-answer">
          {answer}
        </div>
      )}

      <input
        type="text"
        value={answer}
        onChange={handleChange}
        style={inputStyle}
        placeholder="дата"
      />
      <button
        onClick={saveAnswer}
        className={`save-button ${isCorrect ? 'disabled' : ''}`}
        style={{ width: '50px', height: '30px', marginBottom: '10px' }}
      >
        OK
      </button>
    </div>
  );
}

export default Task;
