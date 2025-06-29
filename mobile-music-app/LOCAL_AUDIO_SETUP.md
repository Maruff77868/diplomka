# Настройка локальных аудиофайлов

## 📁 Структура папок

```
mobile-music-app/
├── assets/
│   ├── audio/           # Папка для аудиофайлов
│   │   ├── track1.mp3
│   │   ├── track2.mp3
│   │   └── track3.mp3
│   ├── images/          # Папка для изображений
│   └── icons/           # Папка для иконок
├── constants/
│   └── Data.js          # Данные треков
└── App.js               # Основной файл приложения
```

## 🎵 Добавление локальных файлов

### Шаг 1: Создайте папку для аудио
```bash
mkdir assets/audio
```

### Шаг 2: Добавьте MP3 файлы
Скопируйте ваши .mp3 файлы в папку `assets/audio/`

### Шаг 3: Обновите Data.js
```javascript
// constants/Data.js
export const tracks = [
  {
    id: 1,
    title: "Мой трек 1",
    artist: "Мой артист",
    duration: 180, // в секундах
    cover: "https://via.placeholder.com/300x300/666666/FFFFFF?text=Cover",
    url: require('../assets/audio/track1.mp3'), // Локальный файл
    genre: "Pop",
    album: "Мой альбом"
  },
  {
    id: 2,
    title: "Мой трек 2", 
    artist: "Мой артист",
    duration: 200,
    cover: "https://via.placeholder.com/300x300/666666/FFFFFF?text=Cover",
    url: require('../assets/audio/track2.mp3'),
    genre: "Rock",
    album: "Мой альбом"
  }
];
```

## 🔧 Альтернативные способы

### Способ 1: require() (рекомендуется)
```javascript
const track = {
  url: require('../assets/audio/mysong.mp3')
};
```

### Способ 2: import
```javascript
import track1 from '../assets/audio/track1.mp3';

const track = {
  url: track1
};
```

### Способ 3: Динамический импорт
```javascript
const getTrackUrl = (filename) => {
  switch(filename) {
    case 'track1.mp3':
      return require('../assets/audio/track1.mp3');
    case 'track2.mp3':
      return require('../assets/audio/track2.mp3');
    default:
      return require('../assets/audio/default.mp3');
  }
};
```

## 📱 Поддержка платформ

### Web (браузер)
- ✅ Поддерживается
- Файлы загружаются как статические ресурсы

### iOS
- ✅ Поддерживается  
- Файлы включаются в bundle приложения

### Android
- ✅ Поддерживается
- Файлы включаются в APK

## ⚠️ Ограничения

### Размер файлов
- **Web**: Нет ограничений (зависит от браузера)
- **iOS**: Рекомендуется < 100MB на файл
- **Android**: Рекомендуется < 100MB на файл

### Форматы
- **MP3** - ✅ Поддерживается
- **WAV** - ✅ Поддерживается  
- **M4A** - ✅ Поддерживается
- **AAC** - ✅ Поддерживается
- **OGG** - ⚠️ Ограниченная поддержка

### Количество файлов
- **Web**: Нет ограничений
- **Mobile**: Рекомендуется < 1000 файлов

## 🚀 Оптимизация

### Сжатие аудио
```bash
# Используйте ffmpeg для сжатия
ffmpeg -i input.wav -b:a 128k output.mp3

# Или онлайн инструменты:
# - https://www.onlinevideoconverter.com/
# - https://convertio.co/
```

### Качество файлов
- **128 kbps** - для веб (быстрая загрузка)
- **192 kbps** - для мобильных (баланс)
- **320 kbps** - для высокого качества

### Размер файлов
- **< 5MB** - оптимально для мобильных
- **< 10MB** - приемлемо для веб
- **> 10MB** - может быть медленно

## 🔄 Гибридный подход

### Комбинация локальных и удаленных файлов
```javascript
export const tracks = [
  // Локальные файлы
  {
    id: 1,
    title: "Локальный трек",
    url: require('../assets/audio/local.mp3')
  },
  // Удаленные файлы
  {
    id: 2, 
    title: "Удаленный трек",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  }
];
```

## 🛠️ Устранение неполадок

### Ошибка: "Cannot resolve module"
```javascript
// Убедитесь, что путь правильный
url: require('../assets/audio/track.mp3') // ✅
url: require('./assets/audio/track.mp3')  // ❌
```

### Ошибка: "File not found"
1. Проверьте, что файл существует
2. Проверьте расширение файла (.mp3)
3. Проверьте регистр букв в имени файла

### Ошибка: "Invalid audio format"
1. Убедитесь, что файл не поврежден
2. Попробуйте переконвертировать в MP3
3. Проверьте битрейт (рекомендуется 128-320 kbps)

## 📋 Чек-лист

- [ ] Создана папка `assets/audio/`
- [ ] Добавлены MP3 файлы
- [ ] Обновлен `constants/Data.js`
- [ ] Проверена работа на веб
- [ ] Проверена работа на мобильных
- [ ] Оптимизированы размеры файлов
- [ ] Добавлены обложки треков

## 🎯 Пример готового файла

```javascript
// constants/Data.js
export const tracks = [
  {
    id: 1,
    title: "Мой первый трек",
    artist: "Мой артист",
    duration: 180,
    cover: "https://via.placeholder.com/300x300/ff6b6b/FFFFFF?text=Track+1",
    url: require('../assets/audio/track1.mp3'),
    genre: "Pop",
    album: "Мой первый альбом"
  },
  {
    id: 2,
    title: "Мой второй трек", 
    artist: "Мой артист",
    duration: 200,
    cover: "https://via.placeholder.com/300x300/4ecdc4/FFFFFF?text=Track+2",
    url: require('../assets/audio/track2.mp3'),
    genre: "Rock",
    album: "Мой первый альбом"
  }
];
``` 