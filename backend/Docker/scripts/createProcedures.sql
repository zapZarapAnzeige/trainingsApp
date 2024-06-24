DELIMITER ?/

USE trainings_DB ?/

CREATE PROCEDURE change_average_rating_by_exercise_id
(IN new_exercise_id INT) READS SQL DATA 
BEGIN 
DECLARE
	ratings_sum INT;
DECLARE
	total_ratings INT;
DECLARE
	average_rating FLOAT;
	SELECT SUM(rating), COUNT(1) INTO ratings_sum, total_ratings
	FROM Individual_rating
	WHERE	    exercise_id = new_exercise_id;
	IF total_ratings > 0 THEN
		SET average_rating = (ratings_sum / total_ratings);
		IF NOT EXISTS (
		    SELECT 1
		    FROM Average_rating
		    WHERE
		        exercise_id = new_exercise_id
		) THEN
			INSERT INTO Average_rating (exercise_id, rating, total_exercise_ratings)
			VALUES (new_exercise_id, average_rating, total_ratings);
		ELSE
			UPDATE Average_rating SET rating = average_rating, total_exercise_ratings=total_ratings 
			WHERE exercise_id = new_exercise_id;
		END IF;
	ELSE 
	IF EXISTS (
		    SELECT 1
		    FROM Average_rating
		    WHERE
		        exercise_id = new_exercise_id
		) THEN
			DELETE FROM Average_rating WHERE exercise_id = new_exercise_id;
		END IF;
	END IF;
END ?/


CREATE PROCEDURE insert_todays_plans_and_exercises()
BEGIN
    DECLARE done BOOLEAN DEFAULT FALSE;
    DECLARE user_id_var INT;
    DECLARE userCursor CURSOR FOR SELECT user_id FROM User;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN userCursor;
	
    read_loop: LOOP
        FETCH userCursor INTO user_id_var;
        IF done THEN
            LEAVE read_loop;
        END IF;

        INSERT INTO Training_plan_history (day, training_name, user_id, training_id)
        SELECT CURDATE(), tp.training_name, tp.user_id, tp.training_id
        FROM Training_plan tp
        INNER JOIN Day d ON d.training_id = tp.training_id AND d.user_id = tp.user_id
        WHERE tp.user_id = user_id_var AND d.weekday = DAYNAME(CURDATE());

        INSERT INTO Exercise_history (training_plan_history_id, user_id, completed, exercise_id, minutes, number_of_repetition, number_of_sets, trackable_unit_of_measure, value_trackable_unit_of_measure)
        SELECT LAST_INSERT_ID(), user_id_var, FALSE, ex.exercise_id, ucp.minutes, ucp.number_of_repetition, ucp.number_of_sets, ucp.trackable_unit_of_measure, ucp.value_trackable_unit_of_measure
        FROM Training_plan tp
		INNER JOIN Day d ON d.training_id = tp.training_id AND d.user_id = tp.user_id
		INNER JOIN Exercise2Training_plan e2t ON tp.training_id = e2t.training_id
		INNER JOIN Exercise ex ON e2t.exercise_id = ex.exercise_id
        LEFT OUTER JOIN User_current_performance ucp ON ex.exercise_id = ucp.exercise_id AND ucp.user_id = user_id_var AND tp.training_id=ucp.training_id
        WHERE tp.user_id = user_id_var AND d.weekday = DAYNAME(CURDATE());
    END LOOP;

    CLOSE userCursor;
END ?/

CREATE PROCEDURE insert_user_performance_update(IN new_exercise_id INT, new_user_id INT, new_minutes INT, new_number_of_repetition INT, new_number_of_sets INT,  new_trackable_unit_of_measure VARCHAR(255), new_value_trackable_unit_of_measure DECIMAL(20, 3))
BEGIN
   UPDATE Exercise_history eh INNER JOIN Training_plan_history tph ON eh.training_plan_history_id=tph.training_plan_history_id  SET eh.minutes = new_user_id, eh.number_of_repetition = new_number_of_repetition, eh.number_of_sets = new_number_of_sets, eh.trackable_unit_of_measure= new_trackable_unit_of_measure, eh.value_trackable_unit_of_measure = new_value_trackable_unit_of_measure WHERE eh.user_id = new_user_id AND eh.exercise_id = new_exercise_id AND tph.day = CURDATE();
END ?/

DELIMITER ;

CALL insert_todays_plans_and_exercises ();