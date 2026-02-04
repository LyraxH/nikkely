CREATE TABLE IF NOT EXISTS nikkes (
    nikke_id INTEGER PRIMARY KEY AUTOINCREMENT,
	rarity INTEGER NOT NULL CHECK(rarity BETWEEN 1 AND 3),
	name TEXT NOT NULL,
	manufacturer TEXT NOT NULL,
    element TEXT NOT NULL,
    weapon TEXT NOT NULL,
    role TEXT NOT NULL,
    squad TEXT NOT NULL,
    burst INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS stats (
    nikke_id INTEGER NOT NULL PRIMARY KEY,
    hp INTEGER NOT NULL,
    atk INTEGER NOT NULL,
    def INTEGER NOT NULL,
    FOREIGN KEY (nikke_id) REFERENCES nikkes(nikke_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS skills (
    skill_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nikke_id INTEGER NOT NULL,
    skill_name TEXT NOT NULL,
    type TEXT NOT NULL,
    cooldown TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (nikke_id) REFERENCES nikkes(nikke_id) ON DELETE CASCADE
    UNIQUE(nikke_id, type)
);