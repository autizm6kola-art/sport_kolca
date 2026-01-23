const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'Input.txt');
const outputPath = path.join(__dirname, 'output.json');

// Чтение input.txt
const raw = fs.readFileSync(inputPath, 'utf8');

// Разделение на строки и парсинг
const result = raw
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0) // убрать пустые строки
  .map(line => {
    // Делим по символу |
    const parts = line.split('|').map(p => p.trim());

    return {
      id: Number(parts[0]),
      audio: parts[1],
      text: parts.slice(2).join(' | ') // если в тексте есть |, они сохранятся
    };
  });

// Записываем JSON в output.json
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');

console.log('Готово! Создан файл output.json');
