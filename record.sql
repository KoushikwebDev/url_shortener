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

