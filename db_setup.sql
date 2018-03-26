-- if the commands doesn't work because of Invalid default value error,
-- run SET SQL_MODE='ALLOW_INVALID_DATES';
create database annex;

CREATE TABLE `Profiles`
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

CREATE TABLE `Projects`
(
  `project_id` integer not null auto_increment primary key,
  `title` VARCHAR(100) NOT NULL,
  `description`     VARCHAR(500),
  `created_by`  integer not null,
  `created_at`    TIMESTAMP default now(),
  `deleted_at`    TIMESTAMP,
  `last_edit` timestamp default now() on update now(),
  CONSTRAINT `Constr_Project_user_fk`
      FOREIGN KEY `user_fk` (`created_by`) REFERENCES `Profile` (`user_id`)
      ON UPDATE CASCADE
);

CREATE TABLE `Interests` (
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

-- for testing purposes, don't have to run
insert into profiles(name, email, hash, salt) values('admin', 'shenchenlei@gmail.com', 'abc', 'adminsalt');
insert into projects(title, description, created_by) values('project1', 'test project 1', 1);
insert into projects(title, description, created_by) values('project2', 'test project 2', 1);
insert into projects(title, description, created_by) values('project3', 'test project 3', 1);
