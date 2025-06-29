import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Alert
} from 'react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import SearchScreen from './components/SearchScreen';
import LibraryScreen from './components/LibraryScreen';
import { tracks, colors, formatTime } from './constants/Data';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentTab, setCurrentTab] = useState('home');
  const [showPlayer, setShowPlayer] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const [shuffledTracks, setShuffledTracks] = useState([]);
  const [originalTrackIndex, setOriginalTrackIndex] = useState(0);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    };

    initAudio();
  }, []);

  useEffect(() => {
    if (!isSeeking) {
      setSeekPosition(position);
    }
  }, [position, isSeeking]);

  const loadAudio = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      
      const track = tracks[currentTrackIndex];
      if (!track) {
        console.error('Track not found');
        return;
      }

      console.log('Loading audio:', track.title, 'URL:', track.url);
      
      // Проверяем тип URL
      if (track.url.includes('sefon.pro')) {
        console.log('Sefon.pro URL detected - this is a webpage, not a direct audio file');
        Alert.alert(
          "Веб-страница",
          "Это ссылка на веб-страницу, а не на аудиофайл. Нужна прямая ссылка на .mp3 файл.",
          [{ text: "OK" }]
        );
        return;
      }

      if (track.url.includes('music.yandex.ru')) {
        console.log('Yandex Music URL detected - this is a streaming service page, not a direct audio file');
        Alert.alert(
          "Яндекс.Музыка",
          "Это ссылка на страницу Яндекс.Музыки, а не на прямой аудиофайл. Яндекс.Музыка не предоставляет прямые ссылки на треки из-за авторских прав.\n\nПопробуйте найти прямую ссылку на .mp3 файл или используйте другой источник.",
          [{ text: "OK" }]
        );
        return;
      }

      if (track.url.includes('youtu.be') || track.url.includes('youtube.com')) {
        console.log('YouTube URL detected');
        Alert.alert(
          "YouTube ссылка",
          "Это YouTube ссылка. Для воспроизведения нужны прямые ссылки на аудиофайлы (.mp3, .wav, etc.).",
          [{ text: "OK" }]
        );
        return;
      }

      // Проверяем, что URL заканчивается на аудио расширение
      const audioExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.ogg'];
      const hasAudioExtension = audioExtensions.some(ext => track.url.toLowerCase().endsWith(ext));
      
      if (!hasAudioExtension) {
        console.log('URL does not have audio extension');
        Alert.alert(
          "Неподдерживаемый формат",
          "URL не содержит расширение аудиофайла (.mp3, .wav, etc.). Попробуйте прямую ссылку на аудиофайл.",
          [{ text: "OK" }]
        );
        return;
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: false, volume: volume },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
    } catch (error) {
      console.error('Error loading audio:', error);
      Alert.alert(
        "Ошибка",
        `Не удалось загрузить трек: ${error.message}\n\nПопробуйте другой трек или проверьте URL.`,
        [{ text: "OK" }]
      );
    }
  };

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

  const togglePlayPause = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

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

  const seekTo = async (value) => {
    try {
      if (sound && duration > 0) {
        const clampedValue = Math.max(0, Math.min(value, duration));
        await sound.setPositionAsync(clampedValue);
        setSeekPosition(clampedValue);
      }
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const onProgressGestureEvent = (event) => {
    const { translationX } = event.nativeEvent;
    const progressBarWidth = width - 40; // Учитываем отступы
    const progressRatio = translationX / progressBarWidth;
    const newPosition = seekPosition + (progressRatio * duration);
    const clampedPosition = Math.max(0, Math.min(newPosition, duration));
    setSeekPosition(clampedPosition);
  };

  const onProgressHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setIsSeeking(true);
    } else if (event.nativeEvent.state === State.END) {
      setIsSeeking(false);
      seekTo(seekPosition);
    }
  };

  const onProgressPress = (event) => {
    const { locationX } = event.nativeEvent;
    const progressBarWidth = width - 40;
    const progressRatio = locationX / progressBarWidth;
    const newPosition = progressRatio * duration;
    seekTo(newPosition);
  };

  const toggleFavorite = (trackId) => {
    setFavorites(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

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

  const toggleShuffle = () => {
    const newShuffle = !shuffle;
    setShuffle(newShuffle);
    
    if (newShuffle) {
      // Включаем shuffle - создаем перемешанный список
      const newShuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
      setShuffledTracks(newShuffledTracks);
      setOriginalTrackIndex(currentTrackIndex);
      Alert.alert(
        "Случайный порядок включен",
        "Треки будут воспроизводиться в случайном порядке"
      );
    } else {
      // Выключаем shuffle - возвращаемся к оригинальному порядку
      setShuffledTracks([]);
      setCurrentTrackIndex(originalTrackIndex);
      Alert.alert(
        "Случайный порядок выключен",
        "Треки будут воспроизводиться в обычном порядке"
      );
    }
  };

  const toggleRepeat = () => {
    const newRepeat = !repeat;
    setRepeat(newRepeat);
    Alert.alert(
      newRepeat ? "Повтор включен" : "Повтор выключен",
      newRepeat ? "Треки будут повторяться" : "Треки не будут повторяться"
    );
  };

  const getCurrentTrack = () => {
    if (shuffle && shuffledTracks.length > 0) {
      return shuffledTracks[currentTrackIndex] || tracks[currentTrackIndex];
    }
    return tracks[currentTrackIndex];
  };

  const getCurrentTrackIndex = () => {
    if (shuffle && shuffledTracks.length > 0) {
      // Находим индекс текущего трека в оригинальном списке
      const currentTrack = shuffledTracks[currentTrackIndex];
      return tracks.findIndex(track => track.id === currentTrack.id);
    }
    return currentTrackIndex;
  };

  const renderHomeTab = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Музыка</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Рекомендуемые треки</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tracks.slice(0, 10).map((track, index) => (
            <TouchableOpacity
              key={track.id}
              style={styles.trackCard}
              onPress={() => handleTrackSelect(track, index)}
            >
              <Image source={{ uri: track.cover }} style={styles.trackCover} />
              <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
              <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Популярные жанры</Text>
        <View style={styles.genreGrid}>
          {['Hip-Hop', 'Pop', 'Rock', 'Electronic', 'Jazz', 'Classical'].map((genre) => (
            <TouchableOpacity key={genre} style={styles.genreCard}>
              <Text style={styles.genreText}>{genre}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Все треки</Text>
        {tracks.map((track, index) => (
          <TouchableOpacity
            key={track.id}
            style={styles.trackItem}
            onPress={() => handleTrackSelect(track, index)}
          >
            <Image source={{ uri: track.cover }} style={styles.trackImage} />
            <View style={styles.trackInfo}>
              <Text style={styles.trackName}>{track.title}</Text>
              <Text style={styles.trackArtistName}>{track.artist}</Text>
            </View>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(track.id)}
            >
              <Ionicons 
                name={favorites.includes(track.id) ? "heart" : "heart-outline"} 
                size={20} 
                color={favorites.includes(track.id) ? "#ff6b6b" : "#fff"} 
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderCurrentScreen = () => {
    switch (currentTab) {
      case 'search':
        return <SearchScreen tracks={tracks} onTrackSelect={handleTrackSelect} />;
      case 'library':
        return <LibraryScreen favorites={favorites} tracks={tracks} onTrackSelect={handleTrackSelect} />;
      default:
        return renderHomeTab();
    }
  };

  const renderMiniPlayer = () => {
    if (!showPlayer) return null;
    
    const currentTrack = getCurrentTrack();
    if (!currentTrack) return null;

    return (
      <TouchableOpacity 
        style={styles.miniPlayer}
        onPress={() => setShowPlayer(true)}
      >
        <Image source={{ uri: currentTrack.cover }} style={styles.miniPlayerCover} />
        <View style={styles.miniPlayerInfo}>
          <Text style={styles.miniPlayerTitle} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.miniPlayerArtist} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>
        <TouchableOpacity onPress={togglePlayPause} style={styles.miniPlayerButton}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderPlayer = () => {
    if (!showPlayer) return null;
    
    const currentTrack = getCurrentTrack();
    if (!currentTrack) return null;

    const currentPosition = isSeeking ? seekPosition : position;
    const progressPercentage = duration > 0 ? (currentPosition / duration) * 100 : 0;

    return (
      <Animated.View 
        style={[
          styles.player,
          {
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={['#1e3c72', '#2a5298']}
          style={styles.playerGradient}
        >
          <View style={styles.playerHeader}>
            <TouchableOpacity onPress={() => setShowPlayer(false)}>
              <Ionicons name="chevron-down" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.playerTitle} numberOfLines={1}>{currentTrack.title}</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.playerContent}>
            <Animated.Image
              source={{ uri: currentTrack.cover }}
              style={[
                styles.playerCover,
                {
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            />
            
            <View style={styles.playerInfo}>
              <Text style={styles.playerTrackTitle}>{currentTrack.title}</Text>
              <Text style={styles.playerTrackArtist}>{currentTrack.artist}</Text>
            </View>

            <View style={styles.progressContainer}>
              <PanGestureHandler
                onGestureEvent={onProgressGestureEvent}
                onHandlerStateChange={onProgressHandlerStateChange}
              >
                <TouchableOpacity 
                  style={styles.progressBarContainer}
                  onPress={onProgressPress}
                  activeOpacity={0.8}
                >
                  <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: `${progressPercentage}%` }]} />
                    <View style={[styles.progressThumb, { left: `${progressPercentage}%` }]} />
                  </View>
                </TouchableOpacity>
              </PanGestureHandler>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
                {isSeeking && (
                  <View style={styles.seekingIndicator}>
                    <Text style={styles.seekingText}>Перемотка...</Text>
                  </View>
                )}
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity onPress={toggleShuffle} style={styles.controlButton}>
                <Ionicons name="shuffle" size={24} color={shuffle ? "#ff6b6b" : "#fff"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={playPrevious} style={styles.controlButton}>
                <Ionicons name="play-skip-back" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
                <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={playNext} style={styles.controlButton}>
                <Ionicons name="play-skip-forward" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleRepeat} style={styles.controlButton}>
                <Ionicons name="repeat" size={24} color={repeat ? "#ff6b6b" : "#fff"} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderBottomTabs = () => (
    <View style={styles.bottomTabs}>
      <TouchableOpacity 
        style={[styles.tab, currentTab === 'home' && styles.activeTab]}
        onPress={() => setCurrentTab('home')}
      >
        <Ionicons 
          name="home" 
          size={24} 
          color={currentTab === 'home' ? "#ff6b6b" : "#fff"} 
        />
        <Text style={[styles.tabText, currentTab === 'home' && styles.activeTabText]}>
          Главная
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, currentTab === 'search' && styles.activeTab]}
        onPress={() => setCurrentTab('search')}
      >
        <Ionicons 
          name="search" 
          size={24} 
          color={currentTab === 'search' ? "#ff6b6b" : "#fff"} 
        />
        <Text style={[styles.tabText, currentTab === 'search' && styles.activeTabText]}>
          Поиск
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, currentTab === 'library' && styles.activeTab]}
        onPress={() => setCurrentTab('library')}
      >
        <Ionicons 
          name="library" 
          size={24} 
          color={currentTab === 'library' ? "#ff6b6b" : "#fff"} 
        />
        <Text style={[styles.tabText, currentTab === 'library' && styles.activeTabText]}>
          Библиотека
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1e3c72" />
        
        {renderCurrentScreen()}
        {renderMiniPlayer()}
        {renderPlayer()}
        {renderBottomTabs()}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchButton: {
    padding: 8,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  trackCard: {
    width: 150,
    marginLeft: 20,
  },
  trackCover: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 12,
    color: '#ccc',
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  genreCard: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  genreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  trackArtistName: {
    fontSize: 14,
    color: '#ccc',
  },
  favoriteButton: {
    padding: 8,
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: '#2a2a2a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  miniPlayerCover: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  miniPlayerInfo: {
    flex: 1,
  },
  miniPlayerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  miniPlayerArtist: {
    fontSize: 12,
    color: '#ccc',
  },
  miniPlayerButton: {
    padding: 8,
  },
  player: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 80,
    zIndex: 1000,
  },
  playerGradient: {
    flex: 1,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  playerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  playerContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  playerCover: {
    width: 300,
    height: 300,
    borderRadius: 20,
    marginBottom: 30,
  },
  playerInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  playerTrackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  playerTrackArtist: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 30,
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginBottom: 10,
    justifyContent: 'center',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: 3,
    position: 'relative',
  },
  progress: {
    height: '100%',
    backgroundColor: '#ff6b6b',
    borderRadius: 3,
  },
  progressThumb: {
    width: 16,
    height: 16,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    position: 'absolute',
    top: -5,
    marginLeft: -8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    color: '#ccc',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabs: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
  activeTabText: {
    color: '#ff6b6b',
  },
  seekingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seekingText: {
    color: '#ff6b6b',
    fontSize: 12,
    fontWeight: '500',
  },
});
