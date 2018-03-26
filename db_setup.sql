-- if the commands doesn't work because of Invalid default value error,
-- run SET SQL_MODE='ALLOW_INVALID_DATES';

CREATE TABLE `Profile`
(
   `user_id`  integer not null auto_increment primary key,
   `email`     VARCHAR(50) NOT NULL,
   `name`      VARCHAR(50)  NOT NULL,
   `program`      VARCHAR(50),
   `description`     VARCHAR(500),
   `created_at`    TIMESTAMP default now(),
   `deleted_at`    TIMESTAMP,
   `last_login` TIMESTAMP default now() on update now(),
   `hash` VARCHAR(200) NOT NULL,
   `salt` VARCHAR(200) NOT NULL,
   `fb_token` VARCHAR(200)
);

CREATE TABLE `Project`
(
  `project_id` integer not null auto_increment primary key,
  `title` VARCHAR(100) NOT NULL,
  `description`     VARCHAR(500),
  `created_by`  integer not null,
  `created_at`    TIMESTAMP default now(),
  `deleted_at`    TIMESTAMP,
  `last_edit` timestamp default now() on update now()
);

CREATE TABLE `Interest` (
    `project_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    PRIMARY KEY (`user_id`, `project_id`),
    CONSTRAINT `Constr_Interest_user_fk`
        FOREIGN KEY `user_fk` (`user_id`) REFERENCES `Profile` (`user_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Constr_Interest_project_fk`
        FOREIGN KEY `project_fk` (`project_id`) REFERENCES `Project` (`Project_id`)
        ON DELETE CASCADE ON UPDATE CASCADE
);

insert into profile(name, email, hash, salt) values('admin', 'shenchenlei@gmail.com', 'abc', 'adminsalt');
