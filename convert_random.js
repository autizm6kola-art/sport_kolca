const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'Input.txt');
const outputPath = path.join(__dirname, 'output.json');

// Чтение input.txt
const raw = fs.readFileSync(inputPath, 'utf8');

// Разделение строк и парсинг
let items = raw
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0)
  .map(line => {
    const parts = line.split('|').map(p => p.trim());
    return {
      id: Number(parts[0]),
      audio: parts[1],
      text: parts.slice(2).join(' | ')
    };
  });

// 🔀 Перемешивание массива (Fisher–Yates shuffle)
for (let i = items.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [items[i], items[j]] = [items[j], items[i]];
}

// 🔢 Перенумерация от 1 до items.length (или 1–400)
items = items.map((item, index) => ({
  id: index + 1,
  audio: item.audio,
  text: item.text
}));

// Запись результата
fs.writeFileSync(outputPath, JSON.stringify(items, null, 2), 'utf8');

console.log('Готово! Строки перемешаны и перенумерованы.');
