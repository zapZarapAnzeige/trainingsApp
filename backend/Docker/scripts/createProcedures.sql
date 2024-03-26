DELIMITER ?/
USE trainings_DB ?/
DROP PROCEDURE IF EXISTS Update_overall_ratings_by_excercise_id ?/
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
DELIMITER ;