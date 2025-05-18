-- Add up migration script here
DROP TABLE IF EXISTS flag;
CREATE TABLE flag (
    country varchar(3) NOT NULL,
    iso3 varchar(3) NOT NULL,
    img_path varchar(32) NOT NULL,
    PRIMARY KEY (country)

) COMMENT = 'Les drapeaux';
DROP TABLE IF EXISTS game;
CREATE TABLE game (
    id int unsigned NOT NULL,
    short_name varchar(8) NOT NULL,
    fullname varchar(45) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY game_unique (id),
    UNIQUE KEY fullname_unique (fullname)
) COMMENT = 'Le gaming';
DROP TABLE IF EXISTS enviro;
CREATE TABLE enviro (
    id int unsigned NOT NULL AUTO_INCREMENT,
    game_id int unsigned NOT NULL,
    fullname varchar(7) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (game_id) REFERENCES game (id)
);
DROP TABLE IF EXISTS maps;
CREATE TABLE maps (
    id varchar(36) NOT NULL,
    fullname varchar(45) NOT NULL,
    short_name varchar(15),
    enviro int unsigned NOT NULL,
    map_mode varchar(6) NOT NULL,
    difficulty tinyint unsigned NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY id_unique (id),
    FOREIGN KEY (enviro) REFERENCES enviro (id)
) COMMENT = 'Table that describes maps';
DROP TABLE IF EXISTS maps_order;
CREATE TABLE maps_order (
    map_id varchar(36) NOT NULL,
    pos_order int NOT NULL,
    PRIMARY KEY (map_id)
);
DROP TABLE IF EXISTS player;
CREATE TABLE player (
    id int unsigned NOT NULL AUTO_INCREMENT,
    displayname varchar(45) NOT NULL,
    country varchar(3) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY id_unique (id),
    FOREIGN KEY (country) REFERENCES flag (country)
) COMMENT = 'All the info about each players';
DROP TABLE IF EXISTS player_accounts;
CREATE TABLE player_accounts (
    id int unsigned NOT NULL,
    game_id int unsigned NOT NULL,
    accountkey varchar(45) NOT NULL,
    FOREIGN KEY (id) REFERENCES player (id),
    FOREIGN KEY (game_id) REFERENCES game (id),
    UNIQUE KEY (id, game_id, accountkey)
) COMMENT = 'Individual TMX accounts';
DROP TABLE IF EXISTS wr;
CREATE TABLE wr (
    id int unsigned NOT NULL AUTO_INCREMENT,
    player int unsigned NOT NULL,
    map_uuid varchar(36) NOT NULL,
    tempsraw varchar(45) NOT NULL,
    tempsnum int unsigned NOT NULL,
    istempstrusted tinyint NOT NULL,
    dateraw varchar(45) NOT NULL,
    datenum date NOT NULL,
    isdatetrusted tinyint NOT NULL,
    rank_id int unsigned NOT NULL,
    ischeated tinyint NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY id_unique (id),
    FOREIGN KEY (player) REFERENCES player (id),
    FOREIGN KEY (map_uuid) REFERENCES maps (id),
    INDEX idx_player (player),
    INDEX idx_map_uuid (map_uuid)
) COMMENT = 'Main database that contains the list of world records';
DROP TABLE IF EXISTS wr_extra;
CREATE TABLE wr_extra (
    id int NOT NULL,
    info varchar(128) DEFAULT NULL,
    vid varchar(128) DEFAULT NULL,
    replaytmx int unsigned DEFAULT NULL,
    UNIQUE KEY id_wr_unique (id)
) COMMENT = 'Extra info about wrs';

-- Populating initial data

INSERT INTO game (
    id,
    short_name,
    fullname
) VALUES (1, 'TMO', 'TrackMania Original'),
(2, 'TMS', 'TrackMania Sunrise eXtreme'),
(3, 'ESWC', 'TrackMania Nations ESWC'),
(4, 'TMU', 'TrackMania United'),
(5, 'TMUF', 'TrackMania United Forever'),
(6, 'TMNF', 'TrackMania Nations Forever'),
(7, 'TM2', 'TrackMania²'),
(8, 'TMT', 'TrackMania Turbo');

INSERT INTO enviro (
    game_id,
    fullname
) VALUES (1, 'Desert'),
(1, 'Rally'),
(1, 'Snow'),
(2, 'Island'),
(2, 'Bay'),
(2, 'Coast'),
(3, 'Stadium'),
(4, 'Desert'),
(4, 'Rally'),
(4, 'Snow'),
(4, 'Island'),
(4, 'Coast'),
(4, 'Bay'),
(4, 'Stadium'),
(5, 'Desert'),
(5, 'Rally'),
(5, 'Snow'),
(5, 'Island'),
(5, 'Coast'),
(5, 'Bay'),
(5, 'Stadium'),
(6, 'Stadium'),
(7, 'Canyon'),
(7, 'Stadium'),
(7, 'Valley'),
(7, 'Lagoon'),
(8, 'Canyon'),
(8, 'Stadium'),
(8, 'Valley'),
(8, 'Lagoon');

CREATE VIEW `v_enviro` AS
SELECT
    g.short_name AS game,
    e.fullname AS enviro,
    e.id
FROM twrc.enviro AS e
INNER JOIN twrc.game AS g
    ON e.game_id = g.id
ORDER BY g.id, e.id;
