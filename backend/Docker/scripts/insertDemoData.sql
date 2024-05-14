USE trainings_DB;

INSERT INTO
    Users (
        user_name,
        password,
        expired,
        searching_for_partner,
        plz
    )
VALUES (
        "abc",
        "$2b$12$lCAhVmz1AvHEtTc916Ky4ee36cT6Tyirl3CZraIg8ZEvIhbvF5iqm", -- decoded as abc
        False,
        True,
        12345
    );

INSERT INTO
    Users (
        user_name,
        password,
        expired,
        searching_for_partner,
        plz
    )
VALUES (
        "a",
        "$2b$12$lCAhVmz1AvHEtTc916Ky4ee36cT6Tyirl3CZraIg8ZEvIhbvF5iqm", -- decoded as abc
        False,
        True,
        12345
    );

INSERT INTO
    `Excercises` (
        excercise_id,
        excercise_name,
        constant_unit_of_measure,
        trackable_unit_of_measure
    )
VALUES (1, "test", "Min", "lol");

INSERT INTO
    `Excercises` (
        excercise_id,
        excercise_name,
        constant_unit_of_measure,
        trackable_unit_of_measure
    )
VALUES (2, "c", "SxWdh", "wfwe");

INSERT INTO
    `Excercises` (
        excercise_id,
        excercise_name,
        constant_unit_of_measure,
        trackable_unit_of_measure
    )
VALUES (3, "qew", "Min", "temp");

INSERT INTO
    `Excercises` (
        excercise_id,
        excercise_name,
        constant_unit_of_measure,
        trackable_unit_of_measure
    )
VALUES (4, "svd", "SxWdh", "lol");

insert into
    `Trainings_plan` (
        trainings_id,
        trainings_name,
        user_id
    )
values (1, "temp", 1);

insert into
    `Trainings_plan` (
        trainings_id,
        trainings_name,
        user_id
    )
values (2, "temp2", 1);

insert into
    `Trainings_plan` (
        trainings_id,
        trainings_name,
        user_id
    )
values (3, "temp3", 1);

insert into
    `Days` (
        days_id,
        weekday,
        user_id,
        trainings_id
    )
values (1, "Monday", 1, 1);

insert into
    `Days` (
        days_id,
        weekday,
        user_id,
        trainings_id
    )
values (2, "Tuesday", 1, 1);

insert into
    `Days` (
        days_id,
        weekday,
        user_id,
        trainings_id
    )
values (8, "Tuesday", 1, 2);

insert into
    `Days` (
        days_id,
        weekday,
        user_id,
        trainings_id
    )
values (3, "Wednesday", 1, 1);

insert into
    `Days` (
        days_id,
        weekday,
        user_id,
        trainings_id
    )
values (9, "Wednesday", 1, 3);

insert into
    `Days` (
        days_id,
        weekday,
        user_id,
        trainings_id
    )
values (4, "Thursday", 1, 1);

insert into
    `Days` (
        days_id,
        weekday,
        user_id,
        trainings_id
    )
values (5, "Friday", 1, 1);

insert into
    `Days` (
        days_id,
        weekday,
        user_id,
        trainings_id
    )
values (6, "Saturday", 1, 1);

insert into
    `Days` (
        days_id,
        weekday,
        user_id,
        trainings_id
    )
values (7, "Sunday", 1, 1);

insert into
    `User_current_performance` (
        trainings_id,
        excercise_id,
        minutes,
        number_of_repetition,
        number_of_sets,
        weight
    )
values (1, 1, NULL, 10, 5, 10.5);

insert into
    `User_current_performance` (
        trainings_id,
        excercise_id,
        minutes,
        number_of_repetition,
        number_of_sets,
        weight
    )
values (1, 2, 100, NULL, NULL, NULL);

insert into
    `User_current_performance` (
        trainings_id,
        excercise_id,
        minutes,
        number_of_repetition,
        number_of_sets,
        weight
    )
values (1, 3, NULL, NULL, NULL, NULL);

insert into
    `User_current_performance` (
        trainings_id,
        excercise_id,
        minutes,
        number_of_repetition,
        number_of_sets,
        weight
    )
values (1, 4, 13, NULL, NULL, NULL);

COMMIT;