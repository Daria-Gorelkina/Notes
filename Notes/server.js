import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import session from 'express-session';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5137;
const USERS_FILE_PATH = path.join(process.cwd(), 'users.json');

// Настройка сессий
app.use(session({
    secret: 'your_secret_key', // Замените на ваш секретный ключ
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000, // Время жизни куки: 1 час
    },
}));

app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Проверка авторизации
const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Не авторизован' });
    }
};

app.get('/some-protected-route', (req, res) => {
    console.log('Куки запроса:', req.cookies);  // Логирование куков
    if (req.session.user) {
        res.json({ message: 'Доступ разрешен' });
    } else {
        res.status(401).json({ message: 'Не авторизован' });
    }
});

// Вспомогательные функции для работы с файлом пользователей
const readUsersFromFile = () => {
    const data = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
};

const writeUsersToFile = (users) => {
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
};

// Маршрут корневой страницы
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Маршрут для входа
app.post('/signin', (req, res) => {
    const { login, password } = req.body;
    const users = readUsersFromFile();
    const user = users.find((u) => u.login === login && u.password === password);

    if (user) {
        req.session.user = { login: user.login };
        console.log(req.session.user)// Сохраняем информацию о пользователе в сессии
        res.json({ success: true, user});
    } else {
        res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
    }
});

// Маршрут для выхода
app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true, message: 'Вы успешно вышли из системы' });
    });
});

// Маршрут для регистрации
app.post('/signup', (req, res) => {
    const { name, lastname, login, email, password, foto } = req.body;
    const users = readUsersFromFile();

    const userExists = users.some((user) => user.login === login);

    if (userExists) {
        return res.status(409).json({ success: false, message: 'Логин уже используется' });
    }

    const newUser = { name, lastname, login, email, password, notes: [], foto };
    users.push(newUser);
    writeUsersToFile(users);

    res.json({ success: true, user: newUser });
});

// Получить заметки пользователя
app.get('/users/:login/notes', requireAuth, (req, res) => {
    const { login } = req.params;

    if (req.session.user.login !== login) {
        return res.status(403).json({ success: false, message: 'Доступ запрещен' });
        app.redirect('/')
    }

    if (req.session.user.login !== login) {
        return res.redirect('/');  // Редирект на главную страницу
    }

    const users = readUsersFromFile();
    const user = users.find((u) => u.login === login);

    if (!user) {
        return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    res.json({ success: true, notes: user.notes || [] });
});

// Добавить заметку пользователю
app.post('/users/:login/notes', requireAuth, (req, res) => {
    const { login } = req.params;
    const { title, description } = req.body;

    if (req.session.user.login !== login) {
        return res.status(403).json({ success: false, message: 'Доступ запрещен' });
    }

    const users = readUsersFromFile();
    const userIndex = users.findIndex((u) => u.login === login);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    const newNote = { id: Date.now(), title, description };
    users[userIndex].notes = [...(users[userIndex].notes || []), newNote];
    writeUsersToFile(users);

    res.json({ success: true, note: newNote });
});

// Удалить заметку
app.delete('/users/:login/notes/:noteId', requireAuth, (req, res) => {
    const { login, noteId } = req.params;

    if (req.session.user.login !== login) {
        return res.status(403).json({ success: false, message: 'Доступ запрещен' });
    }

    const users = readUsersFromFile();
    const userIndex = users.findIndex((u) => u.login === login);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    users[userIndex].notes = users[userIndex].notes.filter(
        (note) => note.id !== parseInt(noteId, 10)
    );
    writeUsersToFile(users);

    res.json({ success: true });
});

// Редактировать заметку
app.put('/users/:login/notes/:noteId', requireAuth, (req, res) => {
    const { login, noteId } = req.params;
    const { title, description } = req.body;

    if (req.session.user.login !== login) {
        return res.status(403).json({ success: false, message: 'Доступ запрещен' });
    }

    const users = readUsersFromFile();
    const userIndex = users.findIndex((u) => u.login === login);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    const note = users[userIndex].notes.find((note) => note.id === parseInt(noteId, 10));

    if (!note) return res.status(404).send('Note not found');

    note.title = title;
    note.description = description;
    writeUsersToFile(users);

    res.json({ success: true, note });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Получить профиль пользователя
app.get('/profile/:login', requireAuth, (req, res) => {
    const { login } = req.params; // Получаем login из параметров URL
    const users = readUsersFromFile();
    const user = users.find((u) => u.login === login);

    if (!user) {
        return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    const { name, lastname, email, password, foto } = user;
    res.json({ name, lastname, email, login, password, foto });
});

// Обновить профиль пользователя по логину
app.put('/profile/:login', requireAuth, (req, res) => {
    const { login } = req.params; // Получаем login из параметров URL
    const users = readUsersFromFile();
    const userIndex = users.findIndex((u) => u.login === login);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    const { name, lastname, email, password} = req.body;

    // Обновляем данные пользователя
    users[userIndex] = { ...users[userIndex], name, lastname, email, login, password};
    writeUsersToFile(users);

    res.json({ success: true, user: users[userIndex] });
});

app.delete('/profile/:login', requireAuth, (req, res) => {
    const { login } = req.params;
    const users = readUsersFromFile();
    const updatedUsers = users.filter((user) => user.login !== login);

    if (users.length === updatedUsers.length) {
        return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    writeUsersToFile(updatedUsers);
    res.json({ success: true, message: 'Пользователь успешно удален' });
});
