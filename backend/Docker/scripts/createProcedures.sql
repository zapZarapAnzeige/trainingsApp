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
		SET average_rating = (ratings_sum / total_ratings);
		IF NOT EXISTS (
		    SELECT 1
		    FROM Overall_Excercise_Ratings
		    WHERE
		        excercise_id = new_excercise_id
		) THEN
			INSERT INTO Overall_Excercise_Ratings (excercise_id, rating, total_excercise_ratings)
			VALUES (new_excercise_id, average_rating, total_ratings);
		ELSE
			UPDATE Overall_Excercise_Ratings SET rating = average_rating, total_excercise_ratings=total_ratings 
			WHERE excercise_id = new_excercise_id;
		END IF;
	ELSE 
	IF EXISTS (
		    SELECT 1
		    FROM Overall_Excercise_Ratings
		    WHERE
		        excercise_id = new_excercise_id
		) THEN
			DELETE FROM Overall_Excercise_Ratings WHERE excercise_id = new_excercise_id;
		END IF;
	END IF;
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

        INSERT INTO Trainings_plan_history (day, trainings_name, user_id, trainings_plan_id)
        SELECT CURDATE(), tp.trainings_name, tp.user_id, tp.trainings_plan_id
        FROM Trainings_plan tp
        INNER JOIN Days d ON d.trainings_id = tp.trainings_id AND d.user_id = tp.user_id
        WHERE tp.user_id = user_id_var AND d.weekday = DAYNAME(CURDATE());

        INSERT INTO Excercises_history (trainings_plan_history_id, user_id, completed, excercise_id, minutes, number_of_repetition, number_of_sets, weight, trackable_unit_of_measure, value_trackable_unit_of_measure)
        SELECT LAST_INSERT_ID(), user_id_var, FALSE, ucp.excercise_id, ucp.minutes, ucp.number_of_repetition, ucp.number_of_sets, ucp.weight, ucp.trackable_unit_of_measure, ucp.value_trackable_unit_of_measure
        FROM Trainings_plan tp
		INNER JOIN Days d ON d.trainings_id = tp.trainings_id AND d.user_id = tp.user_id
		INNER JOIN Excercises2Trainings_plans e2t ON tp.trainings_id = e2t.trainings_id
		INNER JOIN Excercises ex ON e2t.excercise_id = ex.excercise_id
        LEFT OUTER JOIN User_current_performance ucp ON ex.excercise_id = ucp.excercise_id AND ucp.user_id = user_id_var
        WHERE tp.user_id = user_id_var AND d.weekday = DAYNAME(CURDATE());
    END LOOP;

    CLOSE userCursor;
END ?/

CREATE PROCEDURE insert_user_performance_update(IN new_excercise_id INT, new_user_id INT, new_minutes INT, new_number_of_repetition INT, new_number_of_sets INT, new_weight DECIMAL(5,2), new_trackable_unit_of_measure VARCHAR(255), new_value_trackable_unit_of_measure DECIMAL(20, 3))
BEGIN
   UPDATE Excercises_history eh INNER JOIN Trainings_plan_history tph ON eh.trainings_plan_history_id=tph.trainings_plan_history_id  SET eh.minutes = new_user_id, eh.number_of_repetition = new_number_of_repetition, eh.number_of_sets = new_number_of_sets, eh.weight = new_weight, eh.trackable_unit_of_measure= new_trackable_unit_of_measure, eh.value_trackable_unit_of_measure = new_value_trackable_unit_of_measure WHERE eh.user_id = new_user_id AND eh.excercise_id = new_excercise_id AND tph.day = CURDATE();
END ?/

DELIMITER ;