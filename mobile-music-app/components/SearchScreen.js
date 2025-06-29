import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchScreen = ({ tracks, onTrackSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Hip-Hop', 'Pop', 'Rock', 'Electronic', 'Jazz', 'Classical'];

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Поиск</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск треков и исполнителей..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.genreContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {genres.map((genre) => (
            <TouchableOpacity
              key={genre}
              style={[
                styles.genreButton,
                selectedGenre === genre && styles.selectedGenreButton
              ]}
              onPress={() => setSelectedGenre(genre)}
            >
              <Text style={[
                styles.genreButtonText,
                selectedGenre === genre && styles.selectedGenreButtonText
              ]}>
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track, index) => (
            <TouchableOpacity
              key={track.id}
              style={styles.trackItem}
              onPress={() => onTrackSelect(track, tracks.indexOf(track))}
            >
              <Image source={{ uri: track.cover }} style={styles.trackImage} />
              <View style={styles.trackInfo}>
                <Text style={styles.trackName}>{track.title}</Text>
                <Text style={styles.trackArtist}>{track.artist}</Text>
                <Text style={styles.trackGenre}>{track.genre}</Text>
              </View>
              <Ionicons name="play" size={24} color="#ff6b6b" />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#666" />
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'Треки не найдены' : 'Начните поиск'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Попробуйте изменить запрос' : 'Введите название трека или исполнителя'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 16,
  },
  genreContainer: {
    marginBottom: 20,
  },
  genreButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 20,
  },
  selectedGenreButton: {
    backgroundColor: '#ff6b6b',
  },
  genreButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedGenreButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  trackImage: {
    width: 60,
    height: 60,
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
  trackArtist: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 2,
  },
  trackGenre: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default SearchScreen; 