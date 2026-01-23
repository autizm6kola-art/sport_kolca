

import React, { useEffect, useState } from 'react';
import { generateRanges } from '../utils/taskUtils';
import ProgressBar from './ProgressBar';
import { clearAllAnswers } from '../utils/storage';
import BackButton from './BackButton';
import '../styles/menuPage.css';
import { isTaskCorrect } from '../utils/storage';

function MenuPage({ allTasks, onSelectRange }) {
  const [ranges, setRanges] = useState([]);
  const [progressByRange, setProgressByRange] = useState({});
  const [totalCorrect, setTotalCorrect] = useState(0);

  useEffect(() => {
    const generated = generateRanges(allTasks);
    setRanges(generated);
  }, [allTasks]);

  useEffect(() => {
    const progress = {};
    let total = 0;

    ranges.forEach((range) => {
      let correct = 0;

      range.taskIds.forEach((id) => {
        if (isTaskCorrect(id)) {
          correct++;
        }
      });

      progress[range.index] = {
        correct,
        total: range.taskIds.length,
        percent: (correct / range.taskIds.length) * 100,
      };

      total += correct;
    });

    setProgressByRange(progress);
    setTotalCorrect(total);
  }, [ranges]);

  if (!ranges.length) return <div>Загрузка меню...</div>;

  return (
    <div className="menu-container">
      <BackButton />

      <h1 className="menu-title">КОЛЬЦА</h1>

      <ProgressBar correct={totalCorrect} total={allTasks.length} />

      <p className="menu-progress-text">
         {totalCorrect} тренировок из {allTasks.length}
      </p>

      <div className="range-buttons-wrapper">
        {ranges.map((range) => {
          const progress = progressByRange[range.index];
          const from = range.taskIds[0];
          const to = range.taskIds[range.taskIds.length - 1];

          const label = range.index + 1;

          let buttonClass = 'range-button';

          if (progress) {
            if (progress.percent === 100) buttonClass += ' completed';
            else if (progress.percent > 0) buttonClass += ' partial';
          }

          return (
            <button
              key={range.index}
              onClick={() => onSelectRange(`${from}-${to}`)}
              className={buttonClass}
            >
              {label}
            </button>
          );
        })}
      </div>

      <button
        className="reset-button"
        onClick={() => {
          clearAllAnswers();
          window.location.reload();
        }}
      >
        Сбросить все ответы
      </button>

      <p className="menu-progress-text-autor">Автор приложения: autizm_i_6kola</p>
    </div>
  );
}

export default MenuPage;

