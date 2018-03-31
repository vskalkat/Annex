CREATE TABLE IF NOT EXISTS `projects`
(
  `project_id`  INT not null auto_increment primary key,
  `title` VARCHAR(100),
  `description`     VARCHAR(255),
  `user_id`  INT not null
);