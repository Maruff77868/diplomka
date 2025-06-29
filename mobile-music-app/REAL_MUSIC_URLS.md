# Реальные URL для музыки

## Как заменить URL на реальные

1. Откройте файл `constants/Data.js`
2. Найдите секцию `tracks`
3. Замените URL в поле `url` на реальные ссылки на музыку

## Примеры реальных URL (замените на ваши):

### Hip-Hop треки:
- DAO: `https://your-server.com/music/miyagi-dao.mp3`
- Captain: `https://your-server.com/music/miyagi-captain.mp3`
- Marlboro: `https://your-server.com/music/miyagi-marlboro.mp3`
- Говори мне: `https://your-server.com/music/miyagi-govori-mne.mp3`
- Endorphin: `https://your-server.com/music/miyagi-endorphin.mp3`
- I Got Love: `https://your-server.com/music/miyagi-i-got-love.mp3`
- All The Time: `https://your-server.com/music/miyagi-all-the-time.mp3`
- Fire Man: `https://your-server.com/music/miyagi-fire-man.mp3`
- Улети: `https://your-server.com/music/miyagi-uleti.mp3`
- Там ревели горы: `https://your-server.com/music/miyagi-tam-reveli-gory.mp3`

### Pop треки:
- Blinding Lights: `https://your-server.com/music/weeknd-blinding-lights.mp3`
- Dance Monkey: `https://your-server.com/music/tones-dance-monkey.mp3`
- Levitating: `https://your-server.com/music/dua-lipa-levitating.mp3`
- Watermelon Sugar: `https://your-server.com/music/harry-styles-watermelon-sugar.mp3`
- Bad Guy: `https://your-server.com/music/billie-eilish-bad-guy.mp3`

### Rock треки:
- Sweet Child O' Mine: `https://your-server.com/music/gnr-sweet-child.mp3`
- Bohemian Rhapsody: `https://your-server.com/music/queen-bohemian-rhapsody.mp3`
- Stairway to Heaven: `https://your-server.com/music/led-zeppelin-stairway.mp3`
- Hotel California: `https://your-server.com/music/eagles-hotel-california.mp3`
- Smells Like Teen Spirit: `https://your-server.com/music/nirvana-teen-spirit.mp3`

### Electronic треки:
- Strobe: `https://your-server.com/music/deadmau5-strobe.mp3`
- Levels: `https://your-server.com/music/avicii-levels.mp3`
- Titanium: `https://your-server.com/music/david-guetta-titanium.mp3`
- Wake Me Up: `https://your-server.com/music/avicii-wake-me-up.mp3`
- Animals: `https://your-server.com/music/martin-garrix-animals.mp3`

### Jazz треки:
- Take Five: `https://your-server.com/music/dave-brubeck-take-five.mp3`
- So What: `https://your-server.com/music/miles-davis-so-what.mp3`
- What a Wonderful World: `https://your-server.com/music/louis-armstrong-wonderful-world.mp3`

### Classical треки:
- Moonlight Sonata: `https://your-server.com/music/beethoven-moonlight-sonata.mp3`
- Symphony No. 5: `https://your-server.com/music/beethoven-symphony-5.mp3`

## Формат файлов:
- Поддерживаемые форматы: MP3, AAC, WAV
- Рекомендуемый битрейт: 128-320 kbps
- Размер файлов: до 10MB на трек

## Хостинг файлов:
Вы можете использовать:
- AWS S3
- Google Cloud Storage
- Dropbox
- GitHub Releases
- Собственный сервер

## Пример замены в коде:

```javascript
{
  id: 1,
  title: "DAO",
  artist: "Miyagi, HLOY, Даена",
  duration: 222,
  cover: "https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a1c30d6c3d1c5",
  url: "https://your-server.com/music/miyagi-dao.mp3", // Замените на реальный URL
  genre: "Hip-Hop",
  album: "YAMAKASI"
}
```

## Примечания:
- Убедитесь, что у вас есть права на использование музыки
- Проверьте, что URL доступны и работают
- Тестируйте воспроизведение после замены URL 