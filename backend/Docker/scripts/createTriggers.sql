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

DELIMITER ;