import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LibraryScreen = ({ favorites, tracks, onTrackSelect }) => {
  const [activeTab, setActiveTab] = useState('favorites');

  const favoriteTracks = tracks.filter(track => favorites.includes(track.id));

  const renderFavoritesTab = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {favoriteTracks.length > 0 ? (
        favoriteTracks.map((track, index) => (
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
          <Ionicons name="heart-outline" size={64} color="#666" />
          <Text style={styles.emptyStateText}>Нет избранных треков</Text>
          <Text style={styles.emptyStateSubtext}>
            Добавляйте треки в избранное, нажимая на сердечко
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderAllTracksTab = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {tracks.map((track, index) => (
        <TouchableOpacity
          key={track.id}
          style={styles.trackItem}
          onPress={() => onTrackSelect(track, index)}
        >
          <Image source={{ uri: track.cover }} style={styles.trackImage} />
          <View style={styles.trackInfo}>
            <Text style={styles.trackName}>{track.title}</Text>
            <Text style={styles.trackArtist}>{track.artist}</Text>
            <Text style={styles.trackGenre}>{track.genre}</Text>
          </View>
          <Ionicons name="play" size={24} color="#ff6b6b" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Библиотека</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Ionicons 
            name="heart" 
            size={20} 
            color={activeTab === 'favorites' ? '#ff6b6b' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            Избранное ({favoriteTracks.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Ionicons 
            name="musical-notes" 
            size={20} 
            color={activeTab === 'all' ? '#ff6b6b' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            Все треки ({tracks.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'favorites' ? renderFavoritesTab() : renderAllTracksTab()}
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 25,
    backgroundColor: '#2a2a2a',
  },
  activeTab: {
    backgroundColor: '#ff6b6b',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
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

export default LibraryScreen; 