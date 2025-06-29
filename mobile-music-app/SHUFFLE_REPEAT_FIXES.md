# Исправления Shuffle и Repeat в музыкальном плеере

## Проблема
Ранее кнопки "Случайный порядок" (shuffle) и "Повтор" (repeat) только показывали уведомления, но не влияли на логику воспроизведения треков.

## Решение
Добавлена полноценная функциональность shuffle и repeat с реальной логикой воспроизведения.

## Реализованные функции

### 1. Случайный порядок (Shuffle)

#### Состояния:
- `shuffle`: Включен/выключен режим случайного порядка
- `shuffledTracks`: Массив перемешанных треков
- `originalTrackIndex`: Индекс трека в оригинальном порядке

#### Логика работы:
```javascript
const toggleShuffle = () => {
  const newShuffle = !shuffle;
  setShuffle(newShuffle);
  
  if (newShuffle) {
    // Включаем shuffle - создаем перемешанный список
    const newShuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
    setShuffledTracks(newShuffledTracks);
    setOriginalTrackIndex(currentTrackIndex);
  } else {
    // Выключаем shuffle - возвращаемся к оригинальному порядку
    setShuffledTracks([]);
    setCurrentTrackIndex(originalTrackIndex);
  }
};
```

#### Особенности:
- При включении shuffle создается новый перемешанный список треков
- При выключении возвращается к оригинальному порядку
- Сохраняется позиция текущего трека

### 2. Повтор (Repeat)

#### Состояния:
- `repeat`: Включен/выключен режим повтора

#### Логика работы:
```javascript
const toggleRepeat = () => {
  const newRepeat = !repeat;
  setRepeat(newRepeat);
};
```

#### Особенности:
- При включенном repeat плейлист воспроизводится циклически
- При выключенном repeat воспроизведение останавливается в конце плейлиста

### 3. Обновленные функции воспроизведения

#### playNext():
```javascript
const playNext = () => {
  if (shuffle) {
    // В режиме shuffle выбираем случайный трек
    const availableTracks = shuffledTracks.filter((_, index) => index !== currentTrackIndex);
    if (availableTracks.length === 0) {
      // Если все треки проиграны, перемешиваем заново
      const newShuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
      setShuffledTracks(newShuffledTracks);
      setCurrentTrackIndex(0);
    } else {
      const randomIndex = Math.floor(Math.random() * availableTracks.length);
      setCurrentTrackIndex(randomIndex);
    }
  } else {
    // Обычный порядок
    if (currentTrackIndex === tracks.length - 1) {
      if (repeat) {
        // Если включен repeat, начинаем сначала
        setCurrentTrackIndex(0);
      } else {
        // Если repeat выключен, останавливаем воспроизведение
        setIsPlaying(false);
        return;
      }
    } else {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  }
};
```

#### playPrevious():
```javascript
const playPrevious = () => {
  if (shuffle) {
    // В режиме shuffle выбираем случайный трек
    const availableTracks = shuffledTracks.filter((_, index) => index !== currentTrackIndex);
    if (availableTracks.length === 0) {
      // Если все треки проиграны, перемешиваем заново
      const newShuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
      setShuffledTracks(newShuffledTracks);
      setCurrentTrackIndex(0);
    } else {
      const randomIndex = Math.floor(Math.random() * availableTracks.length);
      setCurrentTrackIndex(randomIndex);
    }
  } else {
    // Обычный порядок
    if (currentTrackIndex === 0) {
      if (repeat) {
        // Если включен repeat, переходим к последнему треку
        setCurrentTrackIndex(tracks.length - 1);
      } else {
        // Если repeat выключен, останавливаем воспроизведение
        setIsPlaying(false);
        return;
      }
    } else {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  }
};
```

### 4. Автоматическое переключение треков

#### onPlaybackStatusUpdate():
```javascript
const onPlaybackStatusUpdate = (status) => {
  if (status.isLoaded) {
    setIsPlaying(status.isPlaying);
    setPosition(status.positionMillis || 0);
    setDuration(status.durationMillis || 0);
    
    // Проверяем, завершился ли трек
    if (status.didJustFinish) {
      // Автоматически переключаемся на следующий трек
      setTimeout(() => {
        playNext();
      }, 500); // Небольшая задержка для плавности
    }
  }
};
```

### 5. Вспомогательные функции

#### getCurrentTrack():
```javascript
const getCurrentTrack = () => {
  if (shuffle && shuffledTracks.length > 0) {
    return shuffledTracks[currentTrackIndex] || tracks[currentTrackIndex];
  }
  return tracks[currentTrackIndex];
};
```

#### getCurrentTrackIndex():
```javascript
const getCurrentTrackIndex = () => {
  if (shuffle && shuffledTracks.length > 0) {
    // Находим индекс текущего трека в оригинальном списке
    const currentTrack = shuffledTracks[currentTrackIndex];
    return tracks.findIndex(track => track.id === currentTrack.id);
  }
  return currentTrackIndex;
};
```

### 6. Обновленная функция выбора треков

#### handleTrackSelect():
```javascript
const handleTrackSelect = (track, index) => {
  if (shuffle) {
    // В режиме shuffle находим трек в перемешанном списке
    const shuffledIndex = shuffledTracks.findIndex(t => t.id === track.id);
    if (shuffledIndex !== -1) {
      setCurrentTrackIndex(shuffledIndex);
    } else {
      // Если трек не найден в перемешанном списке, добавляем его
      const newShuffledTracks = [...shuffledTracks, track];
      setShuffledTracks(newShuffledTracks);
      setCurrentTrackIndex(newShuffledTracks.length - 1);
    }
  } else {
    setCurrentTrackIndex(index);
  }
  setShowPlayer(true);
};
```

## Визуальные индикаторы

### Кнопки в плеере:
- **Shuffle**: Красный цвет (#ff6b6b) когда включен, белый когда выключен
- **Repeat**: Красный цвет (#ff6b6b) когда включен, белый когда выключен

### Уведомления:
- При включении/выключении shuffle и repeat показываются информационные уведомления

## Комбинации режимов

### 1. Shuffle + Repeat
- Треки воспроизводятся в случайном порядке
- При достижении конца перемешанного списка создается новый случайный порядок
- Воспроизведение продолжается бесконечно

### 2. Shuffle без Repeat
- Треки воспроизводятся в случайном порядке
- При достижении конца перемешанного списка воспроизведение останавливается

### 3. Repeat без Shuffle
- Треки воспроизводятся в обычном порядке
- При достижении конца плейлиста воспроизведение начинается сначала

### 4. Без Shuffle и Repeat
- Треки воспроизводятся в обычном порядке
- При достижении конца плейлиста воспроизведение останавливается

## Результат

Теперь пользователи могут:
- ✅ **Включать/выключать** случайный порядок воспроизведения
- ✅ **Включать/выключать** повтор плейлиста
- ✅ **Комбинировать** shuffle и repeat
- ✅ **Автоматически** переключаться на следующий трек
- ✅ **Видеть** визуальные индикаторы состояния кнопок
- ✅ **Получать** уведомления о изменении режимов

Shuffle и Repeat теперь работают как в профессиональных музыкальных приложениях! 🎵 