# Реальные URL для изображений

## Как заменить URL изображений на реальные

1. Откройте файл `constants/Data.js`
2. Найдите секцию `tracks`, `playlists`, `artists`
3. Замените URL в поле `cover`, `image` на реальные ссылки на изображения

## Примеры реальных URL для обложек альбомов:

### Miyagi & Andy Panda:
- YAMAKASI: `https://your-server.com/images/miyagi-yamakasi.jpg`
- Captain: `https://your-server.com/images/miyagi-captain.jpg`

### Pop исполнители:
- The Weeknd - After Hours: `https://your-server.com/images/weeknd-after-hours.jpg`
- Dua Lipa - Future Nostalgia: `https://your-server.com/images/dua-lipa-future-nostalgia.jpg`
- Harry Styles - Fine Line: `https://your-server.com/images/harry-styles-fine-line.jpg`
- Billie Eilish - When We All Fall Asleep: `https://your-server.com/images/billie-eilish-when-we-all-fall-asleep.jpg`

### Rock исполнители:
- Guns N' Roses - Appetite for Destruction: `https://your-server.com/images/gnr-appetite-for-destruction.jpg`
- Queen - A Night at the Opera: `https://your-server.com/images/queen-a-night-at-the-opera.jpg`
- Led Zeppelin - Led Zeppelin IV: `https://your-server.com/images/led-zeppelin-iv.jpg`
- Eagles - Hotel California: `https://your-server.com/images/eagles-hotel-california.jpg`
- Nirvana - Nevermind: `https://your-server.com/images/nirvana-nevermind.jpg`

### Electronic исполнители:
- Deadmau5 - For Lack of a Better Name: `https://your-server.com/images/deadmau5-for-lack-of-a-better-name.jpg`
- Avicii - True: `https://your-server.com/images/avicii-true.jpg`
- David Guetta - Nothing But the Beat: `https://your-server.com/images/david-guetta-nothing-but-the-beat.jpg`
- Martin Garrix - Animals: `https://your-server.com/images/martin-garrix-animals.jpg`

### Jazz исполнители:
- Dave Brubeck Quartet - Time Out: `https://your-server.com/images/dave-brubeck-time-out.jpg`
- Miles Davis - Kind of Blue: `https://your-server.com/images/miles-davis-kind-of-blue.jpg`
- Louis Armstrong - What a Wonderful World: `https://your-server.com/images/louis-armstrong-wonderful-world.jpg`

### Classical исполнители:
- Beethoven - Piano Sonata No. 14: `https://your-server.com/images/beethoven-moonlight-sonata.jpg`
- Beethoven - Symphony No. 5: `https://your-server.com/images/beethoven-symphony-5.jpg`

## URL для изображений исполнителей:

### Hip-Hop:
- Miyagi: `https://your-server.com/images/artists/miyagi.jpg`
- Andy Panda: `https://your-server.com/images/artists/andy-panda.jpg`

### Pop:
- The Weeknd: `https://your-server.com/images/artists/the-weeknd.jpg`
- Dua Lipa: `https://your-server.com/images/artists/dua-lipa.jpg`
- Harry Styles: `https://your-server.com/images/artists/harry-styles.jpg`
- Billie Eilish: `https://your-server.com/images/artists/billie-eilish.jpg`

### Rock:
- Queen: `https://your-server.com/images/artists/queen.jpg`
- Guns N' Roses: `https://your-server.com/images/artists/guns-n-roses.jpg`
- Led Zeppelin: `https://your-server.com/images/artists/led-zeppelin.jpg`
- Eagles: `https://your-server.com/images/artists/eagles.jpg`
- Nirvana: `https://your-server.com/images/artists/nirvana.jpg`

### Electronic:
- Avicii: `https://your-server.com/images/artists/avicii.jpg`
- Deadmau5: `https://your-server.com/images/artists/deadmau5.jpg`
- David Guetta: `https://your-server.com/images/artists/david-guetta.jpg`
- Martin Garrix: `https://your-server.com/images/artists/martin-garrix.jpg`

### Jazz:
- Miles Davis: `https://your-server.com/images/artists/miles-davis.jpg`
- Dave Brubeck: `https://your-server.com/images/artists/dave-brubeck.jpg`
- Louis Armstrong: `https://your-server.com/images/artists/louis-armstrong.jpg`

### Classical:
- Ludwig van Beethoven: `https://your-server.com/images/artists/beethoven.jpg`

## URL для изображений плейлистов:

- Летние хиты: `https://your-server.com/images/playlists/summer-hits.jpg`
- Спокойная музыка: `https://your-server.com/images/playlists/calm-music.jpg`
- Энергичная: `https://your-server.com/images/playlists/energetic.jpg`
- Романтическая: `https://your-server.com/images/playlists/romantic.jpg`
- Rock Classics: `https://your-server.com/images/playlists/rock-classics.jpg`
- Hip-Hop Essentials: `https://your-server.com/images/playlists/hip-hop-essentials.jpg`

## Формат изображений:
- Поддерживаемые форматы: JPG, PNG, WebP
- Рекомендуемый размер: 300x300px для обложек, 500x500px для исполнителей
- Максимальный размер файла: 2MB

## Пример замены в коде:

```javascript
// Для треков
{
  id: 1,
  title: "DAO",
  artist: "Miyagi, HLOY, Даена",
  duration: 222,
  cover: "https://your-server.com/images/miyagi-yamakasi.jpg", // Замените на реальный URL
  url: "https://your-server.com/music/miyagi-dao.mp3",
  genre: "Hip-Hop",
  album: "YAMAKASI"
}

// Для исполнителей
{
  id: 1,
  name: "Miyagi",
  image: "https://your-server.com/images/artists/miyagi.jpg", // Замените на реальный URL
  followers: 2500000,
  monthlyListeners: 15000000,
  tracks: tracks.filter(t => t.artist.includes('Miyagi'))
}

// Для плейлистов
{
  id: 1,
  title: "Летние хиты",
  description: "Лучшие треки для летнего настроения",
  image: "https://your-server.com/images/playlists/summer-hits.jpg", // Замените на реальный URL
  trackIds: [1, 2, 3, 4, 5, 11, 12, 13],
  creator: "Яндекс Музыка",
  followers: 125000
}
```

## Источники изображений:
Вы можете найти качественные изображения на:
- Spotify (для обложек альбомов)
- Wikipedia (для портретов исполнителей)
- Официальные сайты исполнителей
- Фотостоки (Shutterstock, iStock, Unsplash)

## Примечания:
- Убедитесь, что у вас есть права на использование изображений
- Оптимизируйте изображения для веба (сжатие, правильные размеры)
- Проверьте, что URL доступны и работают
- Используйте CDN для быстрой загрузки изображений 