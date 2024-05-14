DELIMITER//

USE trainings_DB//

CREATE EVENT daily_user_records
ON SCHEDULE EVERY 1 DAY
STARTS (CURRENT_DATE  + INTERVAL 1 SECOND)
DO
CALL insert_todays_plans_and_excercises();


DELIMITER;