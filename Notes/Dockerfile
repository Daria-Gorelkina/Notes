# Используем Node.js как базовый образ
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости для всех сервисов
RUN npm install

# Копируем все файлы в контейнер
COPY . .

# Открываем порты для сервера и клиента
EXPOSE 5137 5173

# Команды для запуска сервера и клиента
CMD ["sh", "-c", "npm run start & npm run dev"]
