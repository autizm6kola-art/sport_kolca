const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');
const outputPath = path.join(__dirname, 'output.json');

// Чтение файла
fs.readFile(inputPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Ошибка при чтении файла:', err);
    return;
  }

  // Обработка строк
  const lines = data.split('\n').filter(line => line.trim() !== '');
  const result = lines.map(line => {
    const [idStr, audio] = line.split('|').map(s => s.trim());
    return {
      id: Number(idStr),
      audio: audio
    };
  });

  // Запись JSON
  fs.writeFile(outputPath, JSON.stringify(result, null, 2), (err) => {
    if (err) {
      console.error('Ошибка при записи JSON:', err);
      return;
    }
    console.log('✅ Файл успешно сохранён в', outputPath);
  });
});
