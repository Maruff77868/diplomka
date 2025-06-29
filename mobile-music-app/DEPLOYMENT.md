# 🚀 Развертывание мобильного приложения "Яндекс Музыка"

## 📋 Предварительные требования

### Для разработки:
- **Node.js** (версия 14 или выше)
- **npm** или **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git**

### Для Android:
- **Android Studio**
- **Android SDK**
- **Android Virtual Device (AVD)** или физическое устройство

### Для iOS (только на macOS):
- **Xcode**
- **iOS Simulator** или физическое устройство

## 🛠 Установка и настройка

### 1. Клонирование проекта
```bash
git clone <repository-url>
cd mobile-music-app
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Проверка установки
```bash
npx expo doctor
```

## 📱 Запуск приложения

### Разработка

#### Запуск через Expo Go (рекомендуется для быстрого тестирования):
```bash
npx expo start
```
Затем отсканируйте QR-код в приложении Expo Go на вашем устройстве.

#### Запуск на Android:
```bash
npm run android
```

#### Запуск на iOS:
```bash
npm run ios
```

#### Запуск веб-версии:
```bash
npm run web
```

### Продакшн

#### Сборка для Android:
```bash
eas build --platform android
```

#### Сборка для iOS:
```bash
eas build --platform ios
```

## 🔧 Конфигурация

### Настройка app.json
Убедитесь, что в файле `app.json` правильно настроены:

```json
{
  "expo": {
    "name": "Яндекс Музыка",
    "slug": "yandex-music-clone",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "dark",
    "ios": {
      "bundleIdentifier": "com.yourcompany.yandexmusicclone"
    },
    "android": {
      "package": "com.yourcompany.yandexmusicclone"
    }
  }
}
```

### Переменные окружения
Создайте файл `.env` для конфигурации:

```env
# API Configuration
API_BASE_URL=https://your-api-url.com
API_KEY=your-api-key

# Audio Configuration
AUDIO_QUALITY=high
CACHE_SIZE=100MB
```

## 📦 Сборка APK/IPA

### Использование EAS Build (рекомендуется)

1. Установите EAS CLI:
```bash
npm install -g @expo/eas-cli
```

2. Войдите в аккаунт Expo:
```bash
eas login
```

3. Настройте проект:
```bash
eas build:configure
```

4. Соберите приложение:
```bash
# Для Android
eas build --platform android

# Для iOS
eas build --platform ios

# Для обеих платформ
eas build --platform all
```

### Локальная сборка

#### Android APK:
```bash
expo build:android -t apk
```

#### Android AAB (для Google Play):
```bash
expo build:android -t app-bundle
```

#### iOS IPA:
```bash
expo build:ios
```

## 🏪 Публикация в магазинах приложений

### Google Play Store

1. Создайте аккаунт разработчика Google Play
2. Создайте новое приложение в Google Play Console
3. Загрузите AAB файл
4. Заполните информацию о приложении
5. Пройдите проверку Google

### Apple App Store

1. Создайте аккаунт разработчика Apple
2. Создайте новое приложение в App Store Connect
3. Загрузите IPA файл через Xcode
4. Заполните информацию о приложении
5. Пройдите проверку Apple

## 🔒 Безопасность

### Рекомендации по безопасности:

1. **API ключи**: Никогда не коммитьте API ключи в репозиторий
2. **Переменные окружения**: Используйте `.env` файлы для конфиденциальных данных
3. **HTTPS**: Все API запросы должны использовать HTTPS
4. **Валидация данных**: Проверяйте все входящие данные
5. **Обновления**: Регулярно обновляйте зависимости

### Настройка безопасности в app.json:

```json
{
  "expo": {
    "android": {
      "permissions": [
        "android.permission.INTERNET",
        "android.permission.WAKE_LOCK"
      ]
    },
    "ios": {
      "infoPlist": {
        "NSMicrophoneUsageDescription": "Приложению не требуется доступ к микрофону"
      }
    }
  }
}
```

## 📊 Мониторинг и аналитика

### Рекомендуемые инструменты:

1. **Expo Analytics**: Встроенная аналитика Expo
2. **Firebase Analytics**: Подробная аналитика пользователей
3. **Crashlytics**: Отслеживание ошибок
4. **Sentry**: Мониторинг производительности

### Настройка аналитики:

```bash
npm install expo-analytics
```

```javascript
import * as Analytics from 'expo-analytics';

// Отслеживание событий
Analytics.track('track_selected', { track_id: track.id });
```

## 🔄 CI/CD

### GitHub Actions

Создайте файл `.github/workflows/build.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run tests
      run: npm test
      
    - name: Build Android
      run: eas build --platform android --non-interactive
      
    - name: Build iOS
      run: eas build --platform ios --non-interactive
```

## 🐛 Отладка

### Логи разработки:
```bash
# Просмотр логов в реальном времени
npx expo start --clear

# Логи Android
adb logcat

# Логи iOS
xcrun simctl spawn booted log stream
```

### Отладка в браузере:
```bash
# Запуск с отладкой
npx expo start --dev-client
```

## 📈 Оптимизация производительности

### Рекомендации:

1. **Изображения**: Используйте оптимизированные изображения
2. **Кэширование**: Реализуйте кэширование аудио файлов
3. **Ленивая загрузка**: Загружайте данные по требованию
4. **Мемоизация**: Используйте React.memo для компонентов
5. **Бандл**: Минимизируйте размер приложения

### Анализ размера:
```bash
# Анализ размера бандла
npx expo export --dump-assetmap
```

## 🔄 Обновления

### OTA (Over The Air) обновления:
```bash
# Публикация обновления
eas update --branch production --message "Bug fixes"
```

### Принудительные обновления:
```javascript
import * as Updates from 'expo-updates';

// Проверка обновлений
Updates.checkForUpdateAsync().then(update => {
  if (update.isAvailable) {
    Updates.fetchUpdateAsync().then(() => {
      Updates.reloadAsync();
    });
  }
});
```

## 📞 Поддержка

### Полезные ресурсы:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Forums](https://forums.expo.dev/)

### Контакты для поддержки:
- Email: support@yourcompany.com
- GitHub Issues: [Repository Issues](https://github.com/yourcompany/mobile-music-app/issues)

---

**Удачного развертывания! 🎉** 