DELIMITER ?/

USE trainings_DB ?/

DROP PROCEDURE IF EXISTS Update_overall_ratings_by_excercise_id ?/
DROP PROCEDURE IF EXISTS insert_todays_plans_and_excercises ?/



CREATE PROCEDURE update_or_insert_overall_ratings_by_excercise_id
(IN new_excercise_id INT) READS SQL DATA 
BEGIN 
DECLARE
	ratings_sum INT;
DECLARE
	total_ratings INT;
DECLARE
	average_rating FLOAT;
	SELECT SUM(rating), COUNT(1) INTO ratings_sum, total_ratings
	FROM Individual_Excercise_Ratings
	WHERE	    excercise_id = new_excercise_id;
	IF total_ratings > 0 THEN
	SET
	    average_rating = (ratings_sum / total_ratings);
	ELSE SET average_rating = 0;
END
	IF;
	IF NOT EXISTS (
	    SELECT 1
	    FROM Overall_Excercise_Ratings
	    WHERE
	        excercise_id = new_excercise_id
	) THEN
	INSERT INTO
	    Overall_Excercise_Ratings (excercise_id, rating)
	VALUES (
	        new_excercise_id, average_rating
	    );
	ELSE
	UPDATE Overall_Excercise_Ratings
	SET
	    rating = average_rating
	WHERE
	    excercise_id = new_excercise_id;
END
	IF;
END ?/

CREATE PROCEDURE insert_todays_plans_and_excercises()
BEGIN
    DECLARE done BOOLEAN DEFAULT FALSE;
    DECLARE user_id_var INT;
    DECLARE userCursor CURSOR FOR SELECT user_id FROM Users;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN userCursor;

    read_loop: LOOP
        FETCH userCursor INTO user_id_var;
        IF done THEN
            LEAVE read_loop;
        END IF;

        INSERT INTO Trainings_plan_history (day, trainings_name, user_id)
        SELECT CURDATE(), tp.trainings_name, tp.user_id
        FROM Trainings_plan tp
        INNER JOIN Days d ON d.trainings_id = tp.trainings_id AND d.user_id = tp.user_id
        WHERE tp.user_id = user_id_var AND d.weekday = DAYNAME(CURDATE());

        INSERT INTO Excercises_history (trainings_plan_history_id, user_id, completed, excercise_id, minutes, number_of_repetition, number_of_sets, weight)
        SELECT LAST_INSERT_ID(), user_id_var, FALSE, ucp.excercise_id, ucp.minutes, ucp.number_of_repetition, ucp.number_of_sets, ucp.weight
        FROM Trainings_plan tp
        INNER JOIN User_current_performance ucp ON tp.trainings_id = ucp.trainings_id
        INNER JOIN Days d ON d.trainings_id = tp.trainings_id AND d.user_id = tp.user_id
        WHERE tp.user_id = user_id_var AND d.weekday = DAYNAME(CURDATE());
    END LOOP;

    CLOSE userCursor;
END ?/

DELIMITER ;