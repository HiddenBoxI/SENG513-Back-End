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
    totalWins     int          ,
    GamesPlayed   int          ,
    WinRate       float        ,
    CurrentStreak int          ,
    HighestStreak int          ,
    LastPlayed    DATETIME   ,
    UNIQUE KEY `nickname` (`nickname`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci COMMENT ='User';

insert into t_user (nickname, password, create_at, update_at, totalwins, gamesplayed, winrate, currentstreak, higheststreak, lastplayed)
values ("lalala","1234",now(),now(),1,2,12.5,3,3,now());
insert into t_user (nickname, password, create_at, update_at, totalwins, gamesplayed, winrate, currentstreak, higheststreak, lastplayed)
values ("abc","1234",now(),now(),3,9,10.5,2,1,now());