-- Active: 1709628091053@@127.0.0.1@3306@trainings_DB
DELIMITER //
USE trainings_DB //
DROP TRIGGER IF EXISTS update_Overall_Excercise_Ratings_on_update //
DROP TRIGGER IF EXISTS update_Overall_Excercise_Ratings_on_insert //

CREATE TRIGGER update_Overall_Excercise_Ratings_on_insert AFTER 
INSERT ON Individual_Excercise_Ratings FOR EACH ROW 
BEGIN 
	CALL update_or_insert_overall_ratings_by_excercise_id (NEW.excercise_id);
END //

CREATE TRIGGER update_Overall_Excercise_Ratings_on_update AFTER 
UPDATE ON Individual_Excercise_Ratings FOR EACH ROW 
BEGIN 
	CALL update_or_insert_overall_ratings_by_excercise_id (NEW.excercise_id);
END //

CREATE TRIGGER update_Overall_Excercise_Ratings_on_delete AFTER 
DELETE ON Individual_Excercise_Ratings FOR EACH ROW 
BEGIN 
	CALL update_or_insert_overall_ratings_by_excercise_id (OLD.excercise_id);
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
        INSERT INTO Excercises_history(trainings_plan_history_id, user_id, completed, excercise_id, minutes, number_of_repetition, number_of_sets, weight, trackable_unit_of_measure, value_trackable_unit_of_measure) 
        (SELECT LAST_INSERT_ID(), tp.user_id, FALSE, ex.excercise_id, minutes, ucp.number_of_repetition, ucp.number_of_sets, ucp.weight, ucp.trackable_unit_of_measure, ucp.value_trackable_unit_of_measure FROM Trainings_plan tp 
		INNER JOIN Excercises2Trainings_plans e2t ON e2t.trainings_id = tp.trainings_id 
		INNER JOIN Excercises ex ON e2t.excercise_id=ex.excercise_id 
		LEFT OUTER JOIN User_current_performance ucp ON ucp.excercise_id=ex.excercise_id AND ucp.user_id = NEW.user_id 
		WHERE tp.trainings_id=NEW.trainings_id);
    END IF;
END //

CREATE TRIGGER days_on_delete AFTER 
DELETE ON Days FOR EACH ROW 
BEGIN 
	IF OLD.weekday =  DAYNAME(CURDATE()) THEN
		-- needed when trainingsplan is twice on the same day so only one is deleted
		-- ON DELETE CASCADE deletes Excercises_history
		DELETE FROM Trainings_plan_history WHERE day = CURDATE() AND user_id=OLD.user_id AND trainings_id=OLD.trainings_id LIMIT 1;
    END IF;
END //


CREATE TRIGGER user_current_performance_on_insert AFTER 
INSERT ON User_current_performance FOR EACH ROW 
BEGIN 
	CALL insert_user_performance_update (NEW.excercise_id, NEW.user_id, NEW.minutes, NEW.number_of_repetition, NEW.number_of_sets, NEW.weight , NEW.trackable_unit_of_measure , NEW.value_trackable_unit_of_measure);
END //

CREATE TRIGGER user_current_performance_on_update AFTER 
UPDATE ON User_current_performance FOR EACH ROW 
BEGIN 
	CALL insert_user_performance_update (NEW.excercise_id, NEW.user_id, NEW.minutes, NEW.number_of_repetition, NEW.number_of_sets, NEW.weight , NEW.trackable_unit_of_measure , NEW.value_trackable_unit_of_measure);
END //

-- TODO Excercises2Trainings_plans with Cursor INSERT and delete

DELIMITER ;