-- urls table
CREATE TABLE urls (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    short_code VARCHAR(100) NOT NULL,
    original_url TEXT NOT NULL,
    click_count BIGINT UNSIGNED NOT NULL DEFAULT 0,
    expires_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_short_code (short_code)
    UNIQUE KEY uk_original_url (original_url),
    CONSTRAINT chk_original_url
    CHECK (
        original_url LIKE 'http://%'
        OR original_url LIKE 'https://%'
    )
);

-- add data to urls table
INSERT INTO urls (
    short_code,
    original_url
)
VALUES (
    'aB92xK',
    'https://www.google.com'
);

-- alter
ALTER TABLE urls
MODIFY original_url VARCHAR(2048) NOT NULL;

ALTER TABLE urls
ADD CONSTRAINT uk_original_url UNIQUE (original_url);

-- check
ALTER TABLE urls
ADD CONSTRAINT chk_original_url
CHECK (
    original_url LIKE 'http://%'
    OR original_url LIKE 'https://%'
);


-- user table
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    pass_hash VARCHAR(255) NOT NULL,
    image LONGTEXT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_users_email (email)
);
-- alter user name to null
ALTER TABLE users
MODIFY name VARCHAR(100) NULL;

-- add refresh token to users table
ALTER TABLE users
ADD refresh_token VARCHAR(500) NULL;