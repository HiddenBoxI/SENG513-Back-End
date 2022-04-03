DROP DATABASE IF EXISTS CheckerBar;
create DATABASE CheckerBar CHARSET UTF8;

use CheckerBar;

DROP TABLE IF EXISTS t_user;
CREATE TABLE t_user
(
    `id`        INT AUTO_INCREMENT NOT NULL,
    `nickname`     VARCHAR(64)        NOT NULL,
    `password`  VARCHAR(128)       NOT NULL COMMENT 'encrypted password',
    `create_at` DATETIME           NULL,
    `update_at` DATETIME           NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `nickname` (`nickname`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci COMMENT ='User';