-- Active: 1709628091053@@127.0.0.1@3306@trainings_DB
DELIMITER //
USE trainings_DB //

CREATE TRIGGER update_Overall_Exercise_Ratings_on_insert AFTER 
INSERT ON Individual_rating FOR EACH ROW 
BEGIN 
	CALL update_or_insert_overall_ratings_by_exercise_id (NEW.exercise_id);
END //

CREATE TRIGGER update_Overall_Exercise_Ratings_on_update AFTER 
UPDATE ON Individual_rating FOR EACH ROW 
BEGIN 
	CALL update_or_insert_overall_ratings_by_exercise_id (NEW.exercise_id);
END //

CREATE TRIGGER update_Overall_Exercise_Ratings_on_delete AFTER 
DELETE ON Individual_rating FOR EACH ROW 
BEGIN 
	CALL update_or_insert_overall_ratings_by_exercise_id (OLD.exercise_id);
END //
CREATE TRIGGER update_trainingsplan_name_on_update AFTER 
UPDATE ON Training_plan FOR EACH ROW 
BEGIN 
	UPDATE Training_plan_history SET training_name = NEW.training_name WHERE Training_plan_history.training_id = NEW.training_id AND Training_plan_history.day = CURDATE() AND Training_plan_history.user_id = NEW.user_id;
END //

CREATE TRIGGER days_on_insert AFTER 
INSERT ON Day FOR EACH ROW 
BEGIN 
    DECLARE last_trainings_plan_history_id INT;
	IF NEW.weekday =  DAYNAME(CURDATE()) THEN
		INSERT INTO Training_plan_history(training_id, training_name, user_id, day) (SELECT training_id, training_name, NEW.user_id, CURDATE() FROM `Training_plan` tp where tp.training_id=NEW.training_id);
        
        SET last_trainings_plan_history_id = LAST_INSERT_ID();
        
        INSERT INTO Exercise_history(training_plan_history_id, user_id, completed, exercise_id, minutes, number_of_repetition, number_of_sets, trackable_unit_of_measure, value_trackable_unit_of_measure) 
        (SELECT last_trainings_plan_history_id, tp.user_id, FALSE, ex.exercise_id, minutes, ucp.number_of_repetition, ucp.number_of_sets,  ucp.trackable_unit_of_measure, ucp.value_trackable_unit_of_measure FROM Training_plan tp 
		INNER JOIN Exercise2Training_plan e2t ON e2t.training_id = tp.training_id 
		INNER JOIN Exercise ex ON e2t.exercise_id=ex.exercise_id 
		LEFT OUTER JOIN User_current_performance ucp ON ucp.exercise_id=ex.exercise_id AND ucp.user_id = NEW.user_id  AND ucp.training_id=tp.training_id 
		WHERE tp.training_id=NEW.training_id);
        
    END IF;
END //


CREATE TRIGGER days_on_delete BEFORE 
DELETE ON Day FOR EACH ROW 
BEGIN 
	IF OLD.weekday =  DAYNAME(CURDATE()) THEN
		-- needed when trainingsplan is twice on the same day so only one is deleted
		-- ON DELETE CASCADE deletes Exercise_history
		DELETE FROM Training_plan_history WHERE day = CURDATE() AND user_id=OLD.user_id AND training_id=OLD.training_id LIMIT 1;
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
INSERT ON Exercise2Training_plan FOR EACH ROW 
BEGIN 

	DECLARE done BOOLEAN DEFAULT FALSE;
	DECLARE trainings_plan_history_id_var INT;
    DECLARE this_user_id INT;
    DECLARE history_cursor CURSOR FOR SELECT training_plan_history_id FROM Training_plan_history WHERE training_id = NEW.training_id AND day = CURDATE();
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    
    SELECT user_id INTO this_user_id FROM Training_plan WHERE training_id = NEW.training_id;

    OPEN history_cursor;
	
    read_loop: LOOP
        FETCH history_cursor INTO trainings_plan_history_id_var;
        IF done THEN
            LEAVE read_loop;
        END IF;

        INSERT INTO Exercise_history(training_plan_history_id, user_id, completed, exercise_id, minutes, number_of_repetition, number_of_sets, trackable_unit_of_measure, value_trackable_unit_of_measure)
         SELECT trainings_plan_history_id_var, user_id, FALSE, exercise_id, minutes, number_of_repetition, number_of_sets, trackable_unit_of_measure, value_trackable_unit_of_measure FROM User_current_performance WHERE user_id = this_user_id AND exercise_id = NEW.exercise_id AND training_id=NEW.training_id;
    END LOOP;

    CLOSE history_cursor;

END //

CREATE TRIGGER exercises2Trainings_plans_on_delete AFTER 
DELETE ON Exercise2Training_plan FOR EACH ROW 
BEGIN 
    DELETE ex FROM Exercise_history ex INNER JOIN Training_plan_history tph ON ex.training_plan_history_id = tph.training_plan_history_id WHERE ex.exercise_id = OLD.exercise_id AND tph.training_id = OLD.training_id AND day=CURDATE();
END //


CREATE TRIGGER insert_default_trainingsplan AFTER 
INSERT ON User FOR EACH ROW 
BEGIN 
    DECLARE last_inserted_training_id INT;
    INSERT INTO `Training_plan`(training_name, user_id) VALUES ("Ganzkörpertraining", NEW.user_id);

    SET last_inserted_training_id = LAST_INSERT_ID();
    INSERT INTO `Exercise2Training_plan`(training_id, exercise_id) 
    (SELECT last_inserted_training_id, exercise_id FROM `Exercise` WHERE 
    exercise_name IN ("Fahrrad fahren", "Beinpresse", "Latzug", "Breites Rudern", "Hyperextension", "Schrägbankdrücken", "Crunchmaschine", "Seitheben") );
	INSERT INTO `Day`(weekday, user_id, training_id) 
    VALUES 
    ("Monday", NEW.user_id, last_inserted_training_id), 
    ("Wednesday", NEW.user_id, last_inserted_training_id),
    ("Friday", NEW.user_id, last_inserted_training_id);

    INSERT INTO `User_current_performance`(exercise_id, user_id, training_id, minutes, number_of_repetition, number_of_sets)
    (SELECT exercise_id, NEW.user_id, last_inserted_training_id, 15 AS minutes, NULL AS number_of_repetition, NULL AS number_of_sets FROM `Exercise` WHERE exercise_name="Fahrrad fahren")
    UNION ALL
    (SELECT exercise_id, NEW.user_id, last_inserted_training_id, NULL AS minutes, 10 AS number_of_repetition, 3 AS number_of_sets FROM `Exercise` WHERE exercise_name IN ("Beinpresse", "Latzug", "Breites Rudern", "Hyperextension", "Schrägbankdrücken", "Crunchmaschine", "Seitheben"));
END //

-- TODO testing
DELIMITER ;