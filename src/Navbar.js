import { useState } from "react";
import { Search, Home, Library, ListMusic, Podcast, Heart, Sun, Moon } from "lucide-react";

export default function Navbar({ onNavigate, selectedPage }) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  const navItems = [
    { icon: Home, label: "Главная" },
    { icon: Search, label: "Поиск" },
    { icon: Library, label: "Библиотека" },
    { icon: ListMusic, label: "Плейлисты" },
    { icon: Podcast, label: "Подкасты" },
    { icon: Heart, label: "Избранное" },
  ];

  return (
    <aside className="sticky top-0 left-0 h-screen bg-black dark:bg-gray-900 flex flex-col items-center py-6 space-y-8 transition-all duration-300 w-20 group hover:w-60 z-10 overflow-hidden">
      {/* Логотип или кнопка перехода на главную */}
      <div className="text-yellow-400 text-3xl font-bold cursor-pointer transition-transform hover:rotate-12" onClick={() => onNavigate("Главная")}>☀️</div>

      {/* Навигационные элементы */}
      <nav className="flex flex-col items-center space-y-6 mt-10 w-full">
        {navItems.map(({ icon: Icon, label }, index) => (
          <div key={index} className="relative flex flex-col items-center w-full">
            <button
              onClick={() => onNavigate(label)}
              className={`flex items-center justify-start w-full px-4 py-2 rounded-lg transition-all duration-300 transform text-left ${
                selectedPage === label ? "bg-purple-700 text-white scale-110 shadow-2xl border-l-4 border-yellow-400" : "text-gray-400 hover:text-white hover:scale-105"
              }`}
            >
              <Icon size={24} className="mr-3" />
              {/* Текст показывается только при наведении */}
              <span className="text-sm font-bold hidden group-hover:inline transition-opacity duration-300">{label}</span>
            </button>
          </div>
        ))}
      </nav>

      {/* Переключатель темы */}
      <div className="mt-auto">
        <button
          onClick={toggleTheme}
          className="text-gray-400 hover:text-white transition-transform duration-500 transform hover:scale-150"
          title="Переключить тему"
        >
          <span className="transition-transform duration-500 ease-in-out transform hover:rotate-180">
            {darkMode ? <Sun size={28} /> : <Moon size={28} />}
          </span>
        </button>
      </div>
    </aside>
  );
}
