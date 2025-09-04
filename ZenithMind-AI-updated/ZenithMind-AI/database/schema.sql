CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120),
  email VARCHAR(180) UNIQUE NOT NULL,
  descope_user_id VARCHAR(120) UNIQUE NOT NULL,
  language_pref VARCHAR(16) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS preferences (
  pref_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  break_freq INT DEFAULT 3,
  focus_blocks INT DEFAULT 50, -- minutes
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS connections (
  conn_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  provider VARCHAR(64) NOT NULL, -- 'google'
  provider_conn_ref VARCHAR(256) NOT NULL, -- store Descope connection reference, not tokens
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  event_type VARCHAR(32) NOT NULL, -- Focus, Break, Relax
  ext_event_id VARCHAR(256), -- Google event id (optional)
  created_at TIMESTAMP DEFAULT NOW()
);
