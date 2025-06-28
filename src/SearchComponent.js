import { useState } from "react";

export default function SearchComponent({ tracks, onTrackSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Популярное");

  const filteredTracks = tracks.filter((track) =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const playlists = [
    { id: 1, title: "Летняя", image: "https://via.placeholder.com/100" },
    { id: 2, title: "Настроения", image: "https://via.placeholder.com/100" },
    { id: 3, title: "Спокойная музыка", image: "https://via.placeholder.com/100" },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-4xl">
      <input
        type="text"
        placeholder="Трек, альбом, исполнитель"
        className="p-3 border rounded-full w-96 mb-6 shadow-md"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="flex space-x-4 mb-8">
        <button
          className={`px-4 py-2 rounded-full ${activeFilter === "Популярное" ? "bg-white text-black" : "bg-gray-700 text-white"}`}
          onClick={() => setActiveFilter("Популярное")}
        >
          Популярное
        </button>
        <button
          className={`px-4 py-2 rounded-full ${activeFilter === "История" ? "bg-white text-black" : "bg-gray-700 text-white"}`}
          onClick={() => setActiveFilter("История")}
        >
          История
        </button>
      </div>
  
      {searchQuery ? (
        filteredTracks.length > 0 ? (
          <ul className="w-full space-y-4">
            {filteredTracks.map((track) => (
              <li
                key={track.id}
                className="flex items-center justify-between w-full p-3 bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-700"
                onClick={() => onTrackSelect(track)}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{track.title}</span>
                    <span className="text-gray-400 text-sm">{track.artist}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Ничего не найдено.</p>
        )
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="flex flex-col items-center">
              <img
                src={playlist.image}
                alt={playlist.title}
                className="w-32 h-32 rounded-lg object-cover mb-2"
              />
              <span className="text-white font-semibold">{playlist.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
}