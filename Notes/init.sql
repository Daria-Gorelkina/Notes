CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(100),
                       lastname VARCHAR(100),
                       login VARCHAR(100) UNIQUE,
                       email VARCHAR(100) UNIQUE,
                       password TEXT,
                       foto TEXT
);

-- Создание таблицы notes
CREATE TABLE notes (
                       id BIGINT PRIMARY KEY,
                       title VARCHAR(255),
                       description TEXT,
                       date BIGINT,
                       user_id INTEGER,
                       FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Создание таблицы tags
CREATE TABLE tags (
                      id SERIAL PRIMARY KEY,
                      name VARCHAR(50)
);

-- Связующая таблица для заметок и тегов
CREATE TABLE note_tags (
                           note_id BIGINT,
                           tag_id INTEGER,
                           PRIMARY KEY (note_id, tag_id),
                           FOREIGN KEY (note_id) REFERENCES notes(id),
                           FOREIGN KEY (tag_id) REFERENCES tags(id)
);