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
values ("Karim","1234",now(),now(),9,12,75,4,2,"2022-4-7");
insert into t_user (nickname, password, create_at, update_at, totalwins, gamesplayed, winrate, currentstreak, higheststreak, lastplayed)
values ("Kevin","1234",now(),now(),3,9,33.33,1,1,"2022-3-6");
insert into t_user (nickname, password, create_at, update_at, totalwins, gamesplayed, winrate, currentstreak, higheststreak, lastplayed)
values ("Nina","1234",now(),now(),6,11,54.55,2,1,"2021-11-11");
insert into t_user (nickname, password, create_at, update_at, totalwins, gamesplayed, winrate, currentstreak, higheststreak, lastplayed)
values ("Boxiao","1234",now(),now(),6,17,35.29,3,3,"2021-7-18");
insert into t_user (nickname, password, create_at, update_at, totalwins, gamesplayed, winrate, currentstreak, higheststreak, lastplayed)
values ("Anna","1234",now(),now(),8,19,42.1,2,0,"2022-1-8");
insert into t_user (nickname, password, create_at, update_at, totalwins, gamesplayed, winrate, currentstreak, higheststreak, lastplayed)
values ("Nancy","1234",now(),now(),11,23,47.83,6,2,"2021-6-28");
insert into t_user (nickname, password, create_at, update_at, totalwins, gamesplayed, winrate, currentstreak, higheststreak, lastplayed)
values ("Ian","1234",now(),now(),8,17,47.06,3,1,"2022-2-9");
insert into t_user (nickname, password, create_at, update_at, totalwins, gamesplayed, winrate, currentstreak, higheststreak, lastplayed)
values ("Lisa","1234",now(),now(),8,17,47.06,3,1,"2022-1-9");