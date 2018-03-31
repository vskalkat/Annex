-- if the commands doesn't work because of Invalid default value error,
-- run SET SQL_MODE='ALLOW_INVALID_DATES';

CREATE TABLE IF NOT EXISTS `users`
(
   `user_id`  INT not null auto_increment primary key,
   `email`     VARCHAR(50) NOT NULL,
   `name`      VARCHAR(50),
   `program`      VARCHAR(50),
   `description`     VARCHAR(255),
   `password` VARCHAR(255) NOT NULL,
   `fav_teacher` VARCHAR(255)
);

