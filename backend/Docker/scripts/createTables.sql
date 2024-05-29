-- Active: 1709628091053@@127.0.0.1@3306@trainings_DB
USE trainings_DB;

CREATE TABLE IF NOT EXISTS User (
    user_id INT AUTO_INCREMENT,
    profile_picture MEDIUMBLOB,
    nickname VARCHAR(255),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    expired BOOLEAN DEFAULT FALSE,
    plz VARCHAR(5) DEFAULT NULL,
    searching_for_partner BOOLEAN DEFAULT FALSE,
    bio TEXT,
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS Exercise (
    exercise_id INT AUTO_INCREMENT,
    exercise_name VARCHAR(255) UNIQUE NOT NULL,
    preview_image MEDIUMBLOB,
    description TEXT,
    constant_unit_of_measure ENUM("SxWdh", "Min") NOT NULL,
    PRIMARY KEY (exercise_id)
);

CREATE TABLE IF NOT EXISTS Tags (
    tag_id INT AUTO_INCREMENT,
    tag_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (tag_id)
);

CREATE TABLE IF NOT EXISTS Tags2Exercises (
    tag_id INT NOT NULL,
    exercise_id INT NOT NULL,
    is_primary_tag BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (tag_id, exercise_id),   
    FOREIGN KEY (tag_id) REFERENCES Tags (tag_id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES Exercise (exercise_id) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS Individual_rating (
    user_id INT,
    exercise_id INT,
    rating TINYINT(1) UNSIGNED CHECK (rating BETWEEN 1 and 5),
    PRIMARY KEY (exercise_id, user_id),
    FOREIGN KEY (user_id) REFERENCES User (user_id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES Exercise (exercise_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Average_rating (
    exercise_id INT,
    rating FLOAT CHECK (rating BETWEEN 1 and 5),
    total_exercise_ratings INT NOT NULL,
    PRIMARY KEY (exercise_id),
    FOREIGN KEY (exercise_id) REFERENCES Exercise (exercise_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Training_plan (
    training_id INT AUTO_INCREMENT,
    training_name VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (training_id),
    FOREIGN KEY (user_id) REFERENCES User (user_id),
    INDEX (training_id, user_id)
);

CREATE TABLE IF NOT EXISTS Exercise2Training_plan(
    training_id INT NOT NULL,
    exercise_id INT NOT NULL,
    PRIMARY KEY (training_id, exercise_id),
    FOREIGN KEY (exercise_id) REFERENCES Exercise (exercise_id) ON DELETE CASCADE,
    FOREIGN KEY (training_id) REFERENCES Training_plan (training_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS User_current_performance (
    exercise_id INT NOT NULL,
    user_id INT NOT NULL,
    training_id INT NOT NULL,
    minutes INT,
    number_of_repetition INT,
    number_of_sets INT,
    trackable_unit_of_measure VARCHAR(255),
    value_trackable_unit_of_measure DECIMAL(20, 3),
    PRIMARY KEY ( exercise_id, user_id, training_id),
    FOREIGN KEY (exercise_id) REFERENCES Exercise (exercise_id) ON DELETE CASCADE,
    FOREIGN KEY (training_id) REFERENCES Training_plan (training_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User (user_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS Training_plan_history (
    training_plan_history_id INT AUTO_INCREMENT,
    training_id INT NOT NULL,
    training_name VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    day DATE NOT NULL,
    PRIMARY KEY (training_plan_history_id),
    FOREIGN KEY (user_id) REFERENCES User (user_id) ON DELETE CASCADE,
    INDEX (
        training_plan_history_id,
        user_id
    )
);

CREATE TABLE IF NOT EXISTS Exercise_history (
    excercise_history_id INT AUTO_INCREMENT,
    training_plan_history_id INT NOT NULL,
    user_id INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    exercise_id INT NOT NULL,
    minutes INT,
    number_of_repetition INT,
    number_of_sets INT,
    trackable_unit_of_measure VARCHAR(255),
    value_trackable_unit_of_measure DECIMAL(20, 3),
    PRIMARY KEY (excercise_history_id),
    FOREIGN KEY (training_plan_history_id) REFERENCES Training_plan_history (training_plan_history_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User (user_id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES Exercise (exercise_id)
);

CREATE TABLE IF NOT EXISTS Day (
    days_id INT AUTO_INCREMENT,
    weekday ENUM(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ) NOT NULL,
    user_id INT NOT NULL,
    training_id INT NOT NULL,
    PRIMARY KEY (days_id),
    FOREIGN KEY (training_id) REFERENCES Training_plan (training_id) ON DELETE CASCADE
);