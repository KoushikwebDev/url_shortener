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

-- alter add user_id column
ALTER TABLE urls
ADD COLUMN user_id BIGINT UNSIGNED NOT NULL DEFAULT 1;

ALTER TABLE urls
ADD CONSTRAINT fk_urls_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) 
ON DELETE CASCADE;

--Once your application always gets user_id from JWT, you don't want MySQL silently assigning user 1 if your application forgets to provide it.
ALTER TABLE urls
ALTER COLUMN user_id DROP DEFAULT; -- we will set it after creating the user table


-- check
ALTER TABLE urls
ADD CONSTRAINT chk_original_url
CHECK (
    original_url LIKE 'http://%'
    OR original_url LIKE 'https://%'
);

ALTER TABLE urls
DROP INDEX uk_original_url;

--adding composite unique key
ALTER TABLE urls
ADD CONSTRAINT uk_user_original_url
UNIQUE (user_id, original_url);


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


