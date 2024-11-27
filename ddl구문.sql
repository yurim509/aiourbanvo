-- projadb.tbl_entry_car definition

CREATE TABLE `tbl_entry_car` (
  `eeno` bigint NOT NULL AUTO_INCREMENT,
  `car_num` varchar(255) DEFAULT NULL,
  `dong` varchar(255) DEFAULT NULL,
  `entry_date` date DEFAULT NULL,
  `exit_date` date DEFAULT NULL,
  `ho` varchar(255) DEFAULT NULL,
  `is_exit` bit(1) NOT NULL,
  PRIMARY KEY (`eeno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- projadb.tbl_household definition

CREATE TABLE `tbl_household` (
  `dong` varchar(255) NOT NULL,
  `ho` varchar(255) NOT NULL,
  PRIMARY KEY (`dong`,`ho`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- projadb.tbl_study definition

CREATE TABLE `tbl_study` (
  `reservation_id` bigint NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `del_flag` bit(1) NOT NULL,
  `end_time` time(6) DEFAULT NULL,
  `seat_num` int NOT NULL,
  `start_time` time(6) DEFAULT NULL,
  PRIMARY KEY (`reservation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- projadb.tbl_user definition

CREATE TABLE `tbl_user` (
  `uno` bigint NOT NULL AUTO_INCREMENT,
  `del_flag` bit(1) NOT NULL,
  `dong` varchar(255) DEFAULT NULL,
  `ho` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `pw` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- projadb.tbl_announce definition

CREATE TABLE `tbl_announce` (
  `pno` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `uno` bigint NOT NULL,
  PRIMARY KEY (`pno`),
  KEY `FKd9rsyemt87sssg0q5m6ttf70k` (`uno`),
  CONSTRAINT `FKd9rsyemt87sssg0q5m6ttf70k` FOREIGN KEY (`uno`) REFERENCES `tbl_user` (`uno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- projadb.tbl_community definition

CREATE TABLE `tbl_community` (
  `pno` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `uno` bigint NOT NULL,
  PRIMARY KEY (`pno`),
  KEY `FKf9l605f6c2r3njbo6nisbuxb` (`uno`),
  CONSTRAINT `FKf9l605f6c2r3njbo6nisbuxb` FOREIGN KEY (`uno`) REFERENCES `tbl_user` (`uno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- projadb.tbl_golf definition

CREATE TABLE `tbl_golf` (
  `reservation_id` bigint NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `del_flag` bit(1) NOT NULL,
  `end_time` time(6) DEFAULT NULL,
  `start_time` time(6) DEFAULT NULL,
  `tee_box` int NOT NULL,
  `uno` bigint DEFAULT NULL,
  PRIMARY KEY (`reservation_id`),
  KEY `FK54pndlyyymraj2bnb2e8t3dys` (`uno`),
  CONSTRAINT `FK54pndlyyymraj2bnb2e8t3dys` FOREIGN KEY (`uno`) REFERENCES `tbl_user` (`uno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- projadb.tbl_gym definition

CREATE TABLE `tbl_gym` (
  `program_id` bigint NOT NULL AUTO_INCREMENT,
  `application_end_date` datetime(6) DEFAULT NULL,
  `application_start_date` datetime(6) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `current_participants` int NOT NULL,
  `del_flag` bit(1) NOT NULL,
  `participant_limit` int NOT NULL,
  `program_end_date` date DEFAULT NULL,
  `program_end_time` time(6) DEFAULT NULL,
  `program_start_date` date DEFAULT NULL,
  `program_start_time` time(6) DEFAULT NULL,
  `program_state` tinyint DEFAULT NULL,
  `target` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `uno` bigint DEFAULT NULL,
  PRIMARY KEY (`program_id`),
  KEY `FKg8k0ueytdi6eodgwyl0miogyv` (`uno`),
  CONSTRAINT `FKg8k0ueytdi6eodgwyl0miogyv` FOREIGN KEY (`uno`) REFERENCES `tbl_user` (`uno`),
  CONSTRAINT `tbl_gym_chk_1` CHECK ((`program_state` between 0 and 3))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- projadb.tbl_market definition

CREATE TABLE `tbl_market` (
  `mno` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `price` int NOT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `uno` bigint NOT NULL,
  PRIMARY KEY (`mno`),
  KEY `FK5pxls8rwfsetob9p7slicf1u3` (`uno`),
  CONSTRAINT `FK5pxls8rwfsetob9p7slicf1u3` FOREIGN KEY (`uno`) REFERENCES `tbl_user` (`uno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- projadb.tbl_market_images definition

CREATE TABLE `tbl_market_images` (
  `mno` bigint NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  KEY `FKg3i7h7ivkxrnktg5dsu6b4ewd` (`mno`),
  CONSTRAINT `FKg3i7h7ivkxrnktg5dsu6b4ewd` FOREIGN KEY (`mno`) REFERENCES `tbl_market` (`mno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- projadb.tbl_regular_parking definition

CREATE TABLE `tbl_regular_parking` (
  `rpno` bigint NOT NULL AUTO_INCREMENT,
  `car_num` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `reg_date` date DEFAULT NULL,
  `household_dong` varchar(255) DEFAULT NULL,
  `household_ho` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`rpno`),
  KEY `FK5uhcacx5rrr3ywuxi83ah2ffa` (`household_dong`,`household_ho`),
  CONSTRAINT `FK5uhcacx5rrr3ywuxi83ah2ffa` FOREIGN KEY (`household_dong`, `household_ho`) REFERENCES `tbl_household` (`dong`, `ho`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- projadb.tbl_visit_parking definition

CREATE TABLE `tbl_visit_parking` (
  `vpno` bigint NOT NULL AUTO_INCREMENT,
  `car_num` varchar(255) DEFAULT NULL,
  `expected_date` date DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `household_dong` varchar(255) DEFAULT NULL,
  `household_ho` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`vpno`),
  KEY `FKp528m0cu5s87wabu546iyc4sd` (`household_dong`,`household_ho`),
  CONSTRAINT `FKp528m0cu5s87wabu546iyc4sd` FOREIGN KEY (`household_dong`, `household_ho`) REFERENCES `tbl_household` (`dong`, `ho`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- projadb.user_user_role_list definition

CREATE TABLE `user_user_role_list` (
  `user_uno` bigint NOT NULL,
  `user_role_list` tinyint DEFAULT NULL,
  KEY `FKka48p93st00aplkh1705u9ual` (`user_uno`),
  CONSTRAINT `FKka48p93st00aplkh1705u9ual` FOREIGN KEY (`user_uno`) REFERENCES `tbl_user` (`uno`),
  CONSTRAINT `user_user_role_list_chk_1` CHECK ((`user_role_list` between 0 and 3))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- projadb.gym_participant definition

CREATE TABLE `gym_participant` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `waitlisted` bit(1) NOT NULL,
  `gym_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjv0xk4taii1m9jblbcxg9fdxs` (`gym_id`),
  KEY `FK27e67eir419mdrqrjyvqlompb` (`user_id`),
  CONSTRAINT `FK27e67eir419mdrqrjyvqlompb` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`uno`),
  CONSTRAINT `FKjv0xk4taii1m9jblbcxg9fdxs` FOREIGN KEY (`gym_id`) REFERENCES `tbl_gym` (`program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- projadb.tbl_chat definition

CREATE TABLE `tbl_chat` (
  `crn` bigint NOT NULL AUTO_INCREMENT,
  `message` varchar(255) DEFAULT NULL,
  `recipient_id` bigint NOT NULL,
  `sender_id` bigint NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`crn`),
  KEY `FK84xqrayhk1uc235uwkcn5dgwt` (`product_id`),
  CONSTRAINT `FK84xqrayhk1uc235uwkcn5dgwt` FOREIGN KEY (`product_id`) REFERENCES `tbl_market` (`mno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;