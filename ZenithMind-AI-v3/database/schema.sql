CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wellness_breaks (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  break_time TIMESTAMP,
  duration_minutes INT
);