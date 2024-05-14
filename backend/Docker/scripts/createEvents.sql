DELIMITER//

USE trainings_DB//

CREATE EVENT daily_user_records
ON SCHEDULE EVERY 1 DAY
STARTS (CURRENT_DATE + INTERVAL 1 MINUTE)
DO
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE user_id_var INT;

    DECLARE userCursor CURSOR FOR SELECT user_id FROM Users;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    OPEN userCursor;

    read_loop: LOOP
        FETCH userCursor INTO user_id_var;
        IF done THEN
            LEAVE read_loop;
        END IF;

        INSERT INTO `Trainings_plan_history` (day, trainings_name, user_id)
        VALUES ((SELECT CURDATE(), tp.trainings_name, tp.user_id FROM `Trainings_plan` tp INNER JOIN `Days` d ON d.trainings_id=tp.trainings_id AND d.user_id=tp.user_id  where tp.user_id=user_id_var AND  d.weekday=DAYNAME(CURDATE())));

        INSERT INTO `Excercises_history` (trainings_plan_history_id, user_id, completed, excercise_id, minutes, number_of_repetition, number_of_sets, weight)
        VALUES(LAST_INSERT_ID(), user_id, FALSE ,(SELECT ucp.excercise_id, ucp.minutes, ucp.number_of_repetition, ucp.number_of_sets, ucp.weight  FROM `Trainings_plan` tp inner join `User_current_performance` ucp ON tp.trainings_id=ucp.trainings_id INNER JOIN `Days` d ON d.trainings_id=tp.trainings_id AND d.user_id=tp.user_id  where tp.user_id=user_id_var AND d.weekday=DAYNAME(CURDATE())));
    END LOOP read_loop;
    CLOSE userCursor;
END//

DELIMITER;