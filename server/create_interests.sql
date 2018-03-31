
CREATE TABLE IF NOT EXISTS `Interests` (
    `project_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    PRIMARY KEY (`user_id`, `project_id`)
 );