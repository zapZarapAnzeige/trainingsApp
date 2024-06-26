USE trainings_DB;

INSERT INTO
    User (
        username,
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
    User (
        username,
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
    `Exercise` (
        exercise_id,
        exercise_name,
        constant_unit_of_measure
    )
VALUES (1, "test", "Min");

INSERT INTO
    `Exercise` (
        exercise_id,
        exercise_name,
        constant_unit_of_measure
    )
VALUES (2, "c", "SxWdh");

INSERT INTO
    `Exercise` (
        exercise_id,
        exercise_name,
        constant_unit_of_measure
    )
VALUES (3, "qew", "Min");

INSERT INTO
    `Exercise` (
        exercise_id,
        exercise_name,
        constant_unit_of_measure
    )
VALUES (4, "svd", "SxWdh");

insert into
    `Training_plan` (
        training_id,
        training_name,
        user_id
    )
values (1, "temp", 1);

insert into
    `Training_plan` (
        training_id,
        training_name,
        user_id
    )
values (2, "temp2", 1);

insert into
    `Training_plan` (
        training_id,
        training_name,
        user_id
    )
values (3, "temp3", 1);

insert into
    `Day` (
        days_id,
        weekday,
        user_id,
        training_id
    )
values (1, "Monday", 1, 1);

insert into
    `Day` (
        days_id,
        weekday,
        user_id,
        training_id
    )
values (2, "Tuesday", 1, 1);

insert into
    `Day` (
        days_id,
        weekday,
        user_id,
        training_id
    )
values (8, "Tuesday", 1, 2);

insert into
    `Day` (
        days_id,
        weekday,
        user_id,
        training_id
    )
values (3, "Wednesday", 1, 1);

insert into
    `Day` (
        days_id,
        weekday,
        user_id,
        training_id
    )
values (9, "Wednesday", 1, 3);

insert into
    `Day` (
        days_id,
        weekday,
        user_id,
        training_id
    )
values (4, "Thursday", 1, 1);

insert into
    `Day` (
        days_id,
        weekday,
        user_id,
        training_id
    )
values (5, "Friday", 1, 1);

insert into
    `Day` (
        days_id,
        weekday,
        user_id,
        training_id
    )
values (6, "Saturday", 1, 1);

insert into
    `Day` (
        days_id,
        weekday,
        user_id,
        training_id
    )
values (7, "Sunday", 1, 1);

insert into
    `Exercise2Training_plan` (
        training_id,
        exercise_id
    )
values (1, 1);

insert into
    `Exercise2Training_plan` (
        training_id,
        exercise_id
    )
values (1, 2);

insert into
    `Exercise2Training_plan` (
        training_id,
        exercise_id
    )
values (1, 3);

insert into
    `Exercise2Training_plan` (
        training_id,
        exercise_id
    )
values (1, 4);

COMMIT;