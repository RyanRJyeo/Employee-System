CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    firstName TEXT,
    lastName TEXT,
    phone VARCHAR(15),
    email TEXT UNIQUE,
    image TEXT,
    work_under_id INTEGER,
    work_under_name TEXT
);