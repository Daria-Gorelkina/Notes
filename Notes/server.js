import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import session from 'express-session';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import pkg from 'pg';
import * as yup from 'yup';

const { Pool } = pkg;
const app = express();
const PORT = 5137;
const USERS_FILE_PATH = path.join(process.cwd(), 'users_test.json');

// Настройка подключения к PostgreSQL
const pool = new Pool({
    user: 'user',
    host: 'localhost',
    database: 'app_db',
    password: 'password',
    port: 5432,
});

// Схема для регистрации
export const signupSchema = yup.object().shape({
    name: yup.string().required('Имя обязательно'),
    lastname: yup.string().required('Фамилия обязательна'),
    login: yup.string().min(3, 'Логин должен содержать минимум 3 символа').required('Логин обязателен'),
    email: yup.string().email('Некорректный формат email').required('Email обязателен'),
    password: yup.string().min(6, 'Пароль должен содержать минимум 6 символов').required('Пароль обязателен'),
});

// Схема для входа
export const signinSchema = yup.object().shape({
    login: yup.string().required('Логин обязателен'),
    password: yup.string().required('Пароль обязателен'),
});

const noteSchema = yup.object().shape({
    title: yup.string().required('Заголовок обязателен'),
    description: yup.string().required('Описание обязательно'),
    tags: yup.array().of(yup.string()),
});

export const profileSchema = yup.object().shape({
    name: yup.string().required('Имя обязательно'),
    lastname: yup.string().required('Фамилия обязательна'),
    email: yup.string().email('Некорректный формат email').required('Email обязателен'),
});

export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body, { abortEarly: false });
        next();
    } catch (err) {
        const formattedErrors = err.inner.map((error) => ({
            field: error.path, // Название поля, которое не прошло валидацию
            message: error.message, // Сообщение об ошибке
        }));

        res.status(400).json({
            success: false,
            message: 'Ошибка валидации данных',
            errors: formattedErrors,
        });
    }
};

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
app.post('/signin', validate(signinSchema), async (req, res) => {
    const {login, password} = req.body;
    try {
        const result = await pool.query('SELECT id, login, password FROM users WHERE login = $1', [login]);
        const user = result.rows[0];
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = { id: user.id, login: user.login };
            res.json({ success: true, user: { id: user.id, login: user.login } });
        } else {
            res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Маршрут для выхода
app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true, message: 'Вы успешно вышли из системы' });
    });
});

// Маршрут для регистрации
app.post('/signup', validate(signupSchema), async (req, res) => {
    const {name, lastname, login, email, password, foto} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (name, lastname, login, email, password, foto) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, lastname, login, email, foto`,
            [name, lastname, login, email, hashedPassword, foto]
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            res.status(409).json({ success: false, message: 'Логин или email уже используется' });
        } else {
            res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }
    }
});

// Получить заметки пользователя
app.get('/users/:login/notes', requireAuth, async (req, res) => {
    const { login } = req.params;

    if (req.session.user.login !== login) {
        return res.status(403).json({ success: false, message: 'Доступ запрещен' });
        app.redirect('/')
    }

    if (req.session.user.login !== login) {
        return res.redirect('/');  // Редирект на главную страницу
    }

    try {
        const result = await pool.query(
            `SELECT n.id, n.title, n.description, n.date 
             FROM notes n JOIN users u ON n.user_id = u.id WHERE u.login = $1`,
            [login]
        );
        res.json({ success: true, notes: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Добавить заметку пользователю
app.post('/users/:login/notes', validate(noteSchema), requireAuth, async (req, res) => {
    const {login} = req.params;
    const {title, description} = req.body;

    if (req.session.user.login !== login) {
        return res.status(403).json({success: false, message: 'Доступ запрещен'});
        res.redirect('/')
    }

    try {
        const userResult = await pool.query('SELECT id FROM users WHERE login = $1', [login]);
        const userId = userResult.rows[0].id;
        const result = await pool.query(
            `INSERT INTO notes (id, title, description, date, user_id)
             VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description, date`,
            [Date.now(), title, description, Date.now(), userId]
        );
        res.json({success: true, note: result.rows[0]});
    } catch (err) {
        console.log(err)
        res.status(500).json({success: false, message: 'Ошибка сервера'});
    }
});

// Удалить заметку
app.delete('/users/:login/notes/:noteId', requireAuth, async (req, res) => {
    const { login, noteId } = req.params;

    if (req.session.user.login !== login) {
        return res.status(403).json({ success: false, message: 'Доступ запрещен' });
        res.redirect('/')
    }

    try {
        const result = await pool.query(
            `DELETE FROM notes WHERE id = $1 AND user_id = (SELECT id FROM users WHERE login = $2)`,
            [noteId, login]
        );
        if (result.rowCount === 0) {
            res.status(404).json({ success: false, message: 'Заметка не найдена' });
        } else {
            res.json({ success: true });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Редактировать заметку
app.put('/users/:login/notes/:noteId', requireAuth, async (req, res) => {
    const { login, noteId } = req.params;
    const { title, description, date } = req.body;

    if (req.session.user.login !== login) {
        return res.status(403).json({ success: false, message: 'Доступ запрещен' });
        res.redirect('/')
    }

    try {
        const result = await pool.query(
            `UPDATE notes
             SET title = $1, description = $2, date = $3
             WHERE id = $4 AND user_id = (SELECT id FROM users WHERE login = $5)
             RETURNING *`,
            [title, description, Date.now(), noteId, login]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Заметка не найдена' });
        }

        res.json({ success: true, note: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Получить профиль пользователя
app.get('/profile/:login', requireAuth, async (req, res) => {
    const { login } = req.params; // Получаем login из параметров URL
    try {
        const result = await pool.query(
            `SELECT name, lastname, email, login, password, foto
             FROM users
             WHERE login = $1`,
            [login]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Пользователь не найден' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Обновить профиль пользователя по логину
app.put('/profile/:login', validate(profileSchema), requireAuth, async (req, res) => {
    const { login } = req.params; // Получаем login из параметров URL

    const { name, lastname, email} = req.body;

    try {
        const result = await pool.query(
            `UPDATE users
             SET name = $1, lastname = $2, email = $3
             WHERE login = $4
             RETURNING *`,
            [name, lastname, email, login]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Пользователь не найден' });
        }

        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.delete('/profile/:login', requireAuth, async (req, res) => {
    const { login } = req.params;
    try {
        const ResultUserId = await pool.query(
          `SELECT id FROM users WHERE login = $1`, [login]
        );


        const UserId = ResultUserId.rows[0].id;

        const ResultIdNote = await pool.query(
            `SELECT id FROM notes WHERE user_id = $1`, [UserId]
        );
        const NoteId = ResultIdNote.rows[0].id;

        const DelTagNoteResult = await pool.query(
            `DELETE FROM note_tags
        WHERE note_id = $1`, [NoteId]
        )

        const DelNoteResult = await pool.query(
            `DELETE FROM notes WHERE user_id = $1`,
            [UserId]
        );

        const result = await pool.query(
            `DELETE FROM users WHERE login = $1`,
            [login]
        );



        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Пользователь не найден' });
        }

        res.json({ success: true, message: 'Пользователь успешно удален' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Получить теги для заметки
app.get('/users/:login/notes/:noteId/tags', async (req, res) => {
    const { login, noteId } = req.params;
    console.log(login, noteId)
    try {
        const result = await pool.query(
            `SELECT tags.name
             FROM tags
             JOIN note_tags ON tags.id = note_tags.tag_id
             WHERE note_tags.note_id = $1
               AND note_tags.note_id IN (
                   SELECT id FROM notes
                   WHERE user_id = (SELECT id FROM users WHERE login = $2)
               )`,
            [noteId, login]
        );
        console.log(result)
        console.log(result.rows.map(row => row.name))

        res.json({ success: true, tags: result.rows.map(row => row.name) });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Добавить тег
app.post('/users/:login/notes/:noteId/tags', async (req, res) => {
    const { login, noteId } = req.params;
    const { tag } = req.body;

    try {
        // Вставить тег, если его нет
        let tagId;
        const existingTag = await pool.query(
            `SELECT id FROM tags WHERE name = $1`,
            [tag]
        );

        if (existingTag.rows.length > 0) {
            // Если тег уже существует, получить его ID
            tagId = existingTag.rows[0].id;
        } else {
            // Если тега нет, вставить его и получить ID
            const newTag = await pool.query(
                `INSERT INTO tags (name) VALUES ($1) RETURNING id`,
                [tag]
            );
            tagId = newTag.rows[0].id;
        }
        // Привязать тег к заметке
        await pool.query(
            `INSERT INTO note_tags (note_id, tag_id)
             VALUES ($1, $2)`,
            [noteId, tagId]
        );

        res.json({ success: true, tag });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Удалить тег
app.delete('/users/:login/notes/:noteId/tags/:tag', async (req, res) => {
    const { login, noteId, tag } = req.params;

    try {
        const tagIdResult = await pool.query(
            `SELECT id FROM tags WHERE name = $1`,
            [tag]
        );

        if (tagIdResult.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Тег не найден' });
        }

        const tagId = tagIdResult.rows[0].id;

        await pool.query(
            `DELETE FROM note_tags
             WHERE note_id = $1 AND tag_id = $2`,
            [noteId, tagId]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Получить все уникальные теги пользователя
app.get('/users/:login/tags', async (req, res) => {
    const { login } = req.params;
    try {
        const result = await pool.query(
            `SELECT tags.name
             FROM tags
             WHERE id IN (
                 SELECT DISTINCT tag_id
                 FROM note_tags
                 WHERE note_id IN (
                     SELECT id FROM notes WHERE user_id = (SELECT id FROM users WHERE login = $1)
                 )
             )`,
            [login]
        );

        res.json({ success: true, tags: result.rows.map(row => row.name) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});
