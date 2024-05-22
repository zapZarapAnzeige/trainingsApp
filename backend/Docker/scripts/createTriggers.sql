-- Active: 1709628091053@@127.0.0.1@3306@trainings_DB
DELIMITER //
USE trainings_DB //
DROP TRIGGER IF EXISTS update_Overall_Exercise_Ratings_on_update //
DROP TRIGGER IF EXISTS update_Overall_Exercise_Ratings_on_insert //

CREATE TRIGGER update_Overall_Exercise_Ratings_on_insert AFTER 
INSERT ON Individual_Exercise_Ratings FOR EACH ROW 
BEGIN 
	CALL update_or_insert_overall_ratings_by_exercise_id (NEW.exercise_id);
END //

CREATE TRIGGER update_Overall_Exercise_Ratings_on_update AFTER 
UPDATE ON Individual_Exercise_Ratings FOR EACH ROW 
BEGIN 
	CALL update_or_insert_overall_ratings_by_exercise_id (NEW.exercise_id);
END //

CREATE TRIGGER update_Overall_Exercise_Ratings_on_delete AFTER 
DELETE ON Individual_Exercise_Ratings FOR EACH ROW 
BEGIN 
	CALL update_or_insert_overall_ratings_by_exercise_id (OLD.exercise_id);
END //
CREATE TRIGGER update_trainingsplan_name_on_update AFTER 
UPDATE ON Trainings_plan FOR EACH ROW 
BEGIN 
	UPDATE Trainings_plan_history SET trainings_name = NEW.trainings_name WHERE Trainings_plan_history.trainings_id = NEW.trainings_id AND Trainings_plan_history.day = CURDATE() AND Trainings_plan_history.user_id = NEW.user_id;
END //
CREATE TRIGGER days_on_insert AFTER 
INSERT ON Days FOR EACH ROW 
BEGIN 
	IF NEW.weekday =  DAYNAME(CURDATE()) THEN
		INSERT INTO Trainings_plan_history(trainings_id, trainings_name, user_id, day) (SELECT trainings_id, trainings_name, NEW.user_id, CURDATE() FROM `Trainings_plan` tp where tp.trainings_id=NEW.trainings_id);
        INSERT INTO Exercises_history(trainings_plan_history_id, user_id, completed, exercise_id, minutes, number_of_repetition, number_of_sets, trackable_unit_of_measure, value_trackable_unit_of_measure) 
        (SELECT LAST_INSERT_ID(), tp.user_id, FALSE, ex.exercise_id, minutes, ucp.number_of_repetition, ucp.number_of_sets,  ucp.trackable_unit_of_measure, ucp.value_trackable_unit_of_measure FROM Trainings_plan tp 
		INNER JOIN Exercises2Trainings_plans e2t ON e2t.trainings_id = tp.trainings_id 
		INNER JOIN Exercises ex ON e2t.exercise_id=ex.exercise_id 
		LEFT OUTER JOIN User_current_performance ucp ON ucp.exercise_id=ex.exercise_id AND ucp.user_id = NEW.user_id 
		WHERE tp.trainings_id=NEW.trainings_id);
    END IF;
END //

CREATE TRIGGER days_on_delete AFTER 
DELETE ON Days FOR EACH ROW 
BEGIN 
	IF OLD.weekday =  DAYNAME(CURDATE()) THEN
		-- needed when trainingsplan is twice on the same day so only one is deleted
		-- ON DELETE CASCADE deletes Exercises_history
		DELETE FROM Trainings_plan_history WHERE day = CURDATE() AND user_id=OLD.user_id AND trainings_id=OLD.trainings_id LIMIT 1;
    END IF;
END //


CREATE TRIGGER user_current_performance_on_insert AFTER 
INSERT ON User_current_performance FOR EACH ROW 
BEGIN 
	CALL insert_user_performance_update (NEW.exercise_id, NEW.user_id, NEW.minutes, NEW.number_of_repetition, NEW.number_of_sets,  NEW.trackable_unit_of_measure , NEW.value_trackable_unit_of_measure);
END //

CREATE TRIGGER user_current_performance_on_update AFTER 
UPDATE ON User_current_performance FOR EACH ROW 
BEGIN 
	CALL insert_user_performance_update (NEW.exercise_id, NEW.user_id, NEW.minutes, NEW.number_of_repetition, NEW.number_of_sets,  NEW.trackable_unit_of_measure , NEW.value_trackable_unit_of_measure);
END //

CREATE TRIGGER exercises2Trainings_plans_on_insert AFTER 
INSERT ON Exercises2Trainings_plans FOR EACH ROW 
BEGIN 

	DECLARE done BOOLEAN DEFAULT FALSE;
	DECLARE trainings_plan_history_id_var INT;
    DECLARE this_user_id INT;
    DECLARE history_cursor CURSOR FOR SELECT trainings_plan_history_id FROM Trainings_plan_history WHERE trainings_id = NEW.trainings_id AND day = CURDATE();
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    
    SELECT user_id INTO this_user_id FROM Trainings_plan WHERE trainings_id = NEW.trainings_id;

    OPEN history_cursor;
	
    read_loop: LOOP
        FETCH history_cursor INTO trainings_plan_history_id_var;
        IF done THEN
            LEAVE read_loop;
        END IF;

        INSERT INTO Exercises_history(trainings_plan_history_id, user_id, completed, exercise_id, minutes, number_of_repetition, number_of_sets, trackable_unit_of_measure, value_trackable_unit_of_measure)
         SELECT trainings_plan_history_id_var, user_id, FALSE, exercise_id, minutes, number_of_repetition, number_of_sets, trackable_unit_of_measure, value_trackable_unit_of_measure FROM User_current_performance WHERE user_id = this_user_id AND exercise_id = NEW.exercise_id;
    END LOOP;

    CLOSE history_cursor;

END //

CREATE TRIGGER exercises2Trainings_plans_on_delete AFTER 
DELETE ON Exercises2Trainings_plans FOR EACH ROW 
BEGIN 
    DELETE ex FROM Exercises_history ex INNER JOIN Trainings_plan_history tph ON ex.trainings_plan_history_id = tph.trainings_plan_history_id WHERE ex.exercise_id = OLD.exercise_id AND tph.trainings_id = OLD.trainings_id AND day=CURDATE();
END //

-- TODO testing
DELIMITER ;