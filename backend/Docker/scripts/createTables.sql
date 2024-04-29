USE trainings_DB;

CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT, profile_picture MEDIUMBLOB, nickname VARCHAR(255), user_name VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, expired BOOLEAN DEFAULT FALSE, plz VARCHAR(5) DEFAULT NULL, searching_for_partner BOOLEAN DEFAULT FALSE, bio TEXT, PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS Excercises (
    excercise_id INT AUTO_INCREMENT, excercise_name VARCHAR(255) NOT NULL, description TEXT, constant_unit_of_measure ENUM("SxWdh", "Min") NOT NULL, trackable_unit_of_measure VARCHAR(255), PRIMARY KEY (excercise_id)
);

CREATE TABLE IF NOT EXISTS Tags (
    tag_id INT AUTO_INCREMENT, excercise_id INT, tag_name VARCHAR(255) NOT NULL, is_primary_tag BOOLEAN DEFAULT FALSE, PRIMARY KEY (tag_id), FOREIGN KEY (excercise_id) REFERENCES Excercises (excercise_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Individual_Excercise_Ratings (
    user_id INT, excercise_id INT, rating TINYINT(1) UNSIGNED CHECK (rating BETWEEN 1 and 5), PRIMARY KEY (excercise_id, user_id), FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE, FOREIGN KEY (excercise_id) REFERENCES Excercises (excercise_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Overall_Excercise_Ratings (
    excercise_id INT, rating FLOAT CHECK (rating BETWEEN 1 and 5), PRIMARY KEY (excercise_id), FOREIGN KEY (excercise_id) REFERENCES Excercises (excercise_id) ON DELETE CASCADE
);