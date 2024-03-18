USE trainings_DB;


CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT,
    profile_picture BLOB,
    user_name VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    expired BOOLEAN DEFAULT FALSE,
    plz VARCHAR(5) DEFAULT NULL,
    searching_for_partner BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id)
);