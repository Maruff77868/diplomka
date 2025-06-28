import { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import SearchComponent from "./SearchComponent";
import { Play, Pause, SkipBack, SkipForward, Heart as HeartIcon, Volume2, ListMusic, Shuffle, Repeat } from "lucide-react";

const tracks = [
  { id: 1, title: "DAO", artist: "Miyagi, HLOY, Даена", duration: 222, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", cover: "https://via.placeholder.com/150" },
  { id: 2, title: "Captain", artist: "Miyagi", duration: 214, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", cover: "https://via.placeholder.com/150" },
  { id: 3, title: "Marlboro", artist: "Miyagi", duration: 243, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", cover: "https://via.placeholder.com/150" },
  { id: 4, title: "Говори мне", artist: "Miyagi, Andy Panda", duration: 210, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", cover: "https://via.placeholder.com/150" },
  { id: 5, title: "Endorphin", artist: "Andy Panda, Miyagi", duration: 194, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", cover: "https://via.placeholder.com/150" },
];

export default function App() {
  const [selectedPage, setSelectedPage] = useState("Главная");
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(new Audio(tracks[0].url));

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleEnded = () => {
      if (loop) {
        audio.currentTime = 0;
        audio.play();
      } else if (shuffle) {
        const nextIndex = Math.floor(Math.random() * tracks.length);
        setCurrentTrackIndex(nextIndex);
        setIsPlaying(true);
      } else {
        setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
        setIsPlaying(true);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [shuffle, loop]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = tracks[currentTrackIndex].url;
    audio.volume = volume;
    audio.playbackRate = playbackRate;

    // Изменения здесь для обработки ошибки play()
    if (isPlaying) {
      audio.play().catch(e => {
        // Ловим ошибку, если play() был прерван (например, pause() вызван слишком быстро)
        if (e.name !== 'AbortError') {
          console.error("Ошибка воспроизведения:", e);
        }
      });
    } else {
      audio.pause();
    }

  }, [currentTrackIndex, volume, playbackRate, isPlaying]); // Добавил isPlaying в зависимости

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => {
        if (e.name !== 'AbortError') {
          console.error("Ошибка воспроизведения:", e);
        }
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (shuffle) {
      const nextIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    }
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleFavorite = (trackId) => {
    setFavorites((prev) =>
      prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const newTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(e.target.value);
  };

  const handlePlaybackRateChange = (e) => {
    setPlaybackRate(e.target.value);
  };

  const handleWheelSpeedChange = (e) => {
    e.preventDefault();
    setPlaybackRate((prevRate) => {
      let newRate = prevRate + (e.deltaY < 0 ? 0.1 : -0.1);
      newRate = Math.min(Math.max(newRate, 0.5), 2);
      return Math.round(newRate * 10) / 10;
    });
  };

  const handleTrackSelect = (track) => {
    const index = tracks.findIndex((t) => t.id === track.id);
    if (index !== -1) {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const renderPlayer = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white flex flex-col items-center p-4 rounded-t-2xl shadow-xl">
      <div className="mb-2 text-lg font-semibold">Сейчас играет: {tracks[currentTrackIndex].title}</div>
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-6">
        <div className="flex items-center space-x-4">
          <img src={tracks[currentTrackIndex].cover} alt={tracks[currentTrackIndex].title} className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white ${isPlaying ? "animate-spin-slow" : ""}`} />
          <div>
            <div className="text-base font-semibold">{tracks[currentTrackIndex].title}</div>
            <div className="text-sm text-gray-300">{tracks[currentTrackIndex].artist}</div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-4 mb-2">
            <button onClick={handlePrev} className="hover:scale-110 transition-transform">
              <SkipBack size={24} />
            </button>
            <button onClick={handlePlayPause} className="bg-white text-black p-3 rounded-full shadow hover:scale-105 transition-transform">
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </button>
            <button onClick={handleNext} className="hover:scale-110 transition-transform">
              <SkipForward size={24} />
            </button>
          </div>
          <div className="flex items-center space-x-2 w-64">
            <div className="text-xs">{Math.floor(audioRef.current.currentTime / 60)}:{("0" + Math.floor(audioRef.current.currentTime % 60)).slice(-2)}</div>
            <input
              type="range"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-300 rounded"
            />
            <div className="text-xs">{Math.floor(audioRef.current.duration / 60) || 0}:{("0" + Math.floor(audioRef.current.duration % 60)).slice(-2)}</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <button onClick={() => handleFavorite(tracks[currentTrackIndex].id)}>
            <HeartIcon size={24} color={favorites.includes(tracks[currentTrackIndex].id) ? "#ff4d6d" : "white"} />
          </button>
          <div className="flex items-center space-x-2">
            <Volume2 size={24} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20"
            />
          </div>
          <ListMusic size={24} />
          <button onClick={() => setShuffle(!shuffle)}>
            <Shuffle size={24} color={shuffle ? "#ffd93d" : "white"} />
          </button>
          <button onClick={() => setLoop(!loop)}>
            <Repeat size={24} color={loop ? "#ffd93d" : "white"} />
          </button>
          <select
            onChange={handlePlaybackRateChange}
            onWheel={handleWheelSpeedChange}
            value={playbackRate}
            className="bg-gray-700 text-white rounded px-2 py-1"
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedPage) {
      case "Главная":
        return (
          <div className="flex flex-col items-center w-full max-w-2xl">
            <ul className="w-full">
              {tracks.map((track) => (
               <li
               key={track.id}
               onClick={() => handleTrackSelect(track)}
               className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition
                          bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg hover:brightness-110
                          dark:from-purple-700 dark:via-pink-700 dark:to-red-700"
             >
               <div className="flex items-center space-x-4">
                 <img src={track.cover} alt={track.title} className="w-12 h-12 rounded-md object-cover" />
                 <div className="flex flex-col">
                   <span className="text-white font-semibold">{track.title}</span>
                   <span className="text-white text-sm">{track.artist}</span>
                 </div>
               </div>
               <div className="flex items-center space-x-6">
                 <span className="text-white text-sm">
                   {Math.floor(track.duration / 60)}:{("0" + (track.duration % 60)).slice(-2)}
                 </span>
                 <button onClick={(e) => { e.stopPropagation(); handleFavorite(track.id); }}>
                   <HeartIcon size={20} color={favorites.includes(track.id) ? "#ff4d6d" : "white"} />
                 </button>
               </div>
             </li>
             
              ))}
            </ul>
          </div>
        );
      case "Поиск":
        return <SearchComponent tracks={tracks} onTrackSelect={handleTrackSelect} />;
      case "Библиотека":
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-6">Ваша библиотека</h2>
            <ul className="space-y-2">
              {tracks.map((track) => (
                <li key={track.id} className="text-lg">{track.title} — {track.artist}</li>
              ))}
            </ul>
          </div>
        );
      case "Плейлисты":
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-6">Ваши Плейлисты</h2>
            <p className="text-gray-500">У вас пока нет плейлистов. Создайте первый!</p>
          </div>
        );
      case "Подкасты":
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-6">Подкасты</h2>
            <p className="text-gray-500">Скоро здесь появятся новые подкасты.</p>
          </div>
        );
      case "Избранное":
        const favoriteTracks = tracks.filter((track) => favorites.includes(track.id));
        return (
          <div className="flex flex-col items-center w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6">Избранные треки</h2>
            {favoriteTracks.length > 0 ? (
              <ul className="w-full">
                {favoriteTracks.map((track) => (
                  <li
                  key={track.id}
                  onClick={() => handleTrackSelect(track)}
                  className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition
                             bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg hover:brightness-110
                             dark:from-purple-700 dark:via-pink-700 dark:to-red-700"
                >
                  <div className="flex items-center space-x-4">
                    <img src={track.cover} alt={track.title} className="w-12 h-12 rounded-md object-cover" />
                    <div className="flex flex-col">
                      <span className="text-white font-semibold">{track.title}</span>
                      <span className="text-white text-sm">{track.artist}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className="text-white text-sm">
                      {Math.floor(track.duration / 60)}:{("0" + (track.duration % 60)).slice(-2)}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); handleFavorite(track.id); }}>
                      <HeartIcon size={20} color={favorites.includes(track.id) ? "#ff4d6d" : "white"} />
                    </button>
                  </div>
                </li>                
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">У вас нет избранных треков.</p>
            )}
          </div>
        );
      default:
        return <div className="text-2xl">Выберите пункт меню слева.</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-1">
        <Navbar onNavigate={setSelectedPage} selectedPage={selectedPage} />
        <main className="flex-1 p-12 flex items-center justify-center">
          {renderContent()}
        </main>
      </div>
      {renderPlayer()}
    </div>
  );
}