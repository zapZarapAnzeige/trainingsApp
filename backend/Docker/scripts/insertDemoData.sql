USE trainings_DB;

INSERT INTO
    Users (
        user_name, password, expired, searching_for_partner, plz
    )
VALUES (
        "abc", "$2b$12$lCAhVmz1AvHEtTc916Ky4ee36cT6Tyirl3CZraIg8ZEvIhbvF5iqm", -- decoded as abc
        False, True, 12345
    );

INSERT INTO
    Users (
        user_name, password, expired, searching_for_partner, plz
    )
VALUES (
        "a", "$2b$12$lCAhVmz1AvHEtTc916Ky4ee36cT6Tyirl3CZraIg8ZEvIhbvF5iqm", -- decoded as abc
        False, True, 12345
    );

COMMIT;