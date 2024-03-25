USE trainings_DB;

CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT, profile_picture MEDIUMBLOB, user_name VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, expired BOOLEAN DEFAULT FALSE, plz VARCHAR(5) DEFAULT NULL, searching_for_partner BOOLEAN DEFAULT FALSE, PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS Excercises (
    excercise_id INT AUTO_INCREMENT, excercise_name VARCHAR(255) NOT NULL, description TEXT, constant_unit_of_measure ENUM("SxWdh", "Min") NOT NULL, trackable_unit_of_measure VARCHAR(255), PRIMARY KEY (excercise_id)
);

CREATE TABLE IF NOT EXISTS tags (
    tag_id INT AUTO_INCREMENT, excercise_id INT, tag_name VARCHAR(255) NOT NULL, is_primary_tag BOOLEAN DEFAULT FALSE, PRIMARY KEY (tag_id), FOREIGN KEY (excercise_id) REFERENCES Excercises (excercise_id) ON DELETE CASCADE
);