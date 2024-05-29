from sqlalchemy import (
    String,
    Column,
    Table,
    Boolean,
    Integer,
    BLOB,
    Text,
    Enum,
    ForeignKeyConstraint,
    PrimaryKeyConstraint,
    Float,
    Date,
    DECIMAL,
)
from db_connection import metaData


Users = Table(
    "Users",
    metaData,
    Column("user_id", Integer, primary_key=True, autoincrement=True),
    Column("profile_picture", BLOB, nullable=True),
    Column("nickname", String(255), nullable=True),
    Column("user_name", String(255), unique=True, nullable=False),
    Column("password", String(255), nullable=False),
    Column("expired", Boolean, nullable=False, default=False),
    Column("plz", String(5), nullable=True),
    Column("searching_for_partner", Boolean, nullable=False, default=False),
    Column("bio", Text, nullable=True),
)

Trainings_plan = Table(
    "Trainings_plan",
    metaData,
    Column("training_id", Integer, primary_key=True, autoincrement=True),
    Column("trainings_name", String(255), nullable=False),
    Column("user_id", Integer, nullable=False),
    ForeignKeyConstraint(["user_id"], ["Users.user_id"], ondelete="CASCADE"),
)


Exercises = Table(
    "Exercises",
    metaData,
    Column("exercise_id", Integer, primary_key=True, autoincrement=True),
    Column("exercise_name", String(255), nullable=False, unique=True),
    Column("description", Text, nullable=True),
    Column("preview_image", BLOB, nullable=True),
    Column("constant_unit_of_measure", Enum("SxWdh", "Min"), nullable=False),
)

User_current_performance = Table(
    "User_current_performance",
    metaData,
    Column("user_id", Integer, nullable=False),
    Column("exercise_id", Integer, nullable=False),
    Column("training_id", Integer, nullable=False),
    Column("minutes", Integer, nullable=True),
    Column("number_of_repetition", Integer, nullable=True),
    Column("number_of_sets", Integer, nullable=True),
    Column("value_trackable_unit_of_measure", DECIMAL(20, 3), nullable=True),
    Column("trackable_unit_of_measure", String(255), nullable=True),
    ForeignKeyConstraint(["user_id"], ["Users.user_id"], ondelete="CASCADE"),
    ForeignKeyConstraint(
        ["training_id"], ["Trainings_plan.training_id"], ondelete="CASCADE"
    ),
    ForeignKeyConstraint(
        ["exercise_id"], ["Exercises.exercise_id"], ondelete="CASCADE"
    ),
    PrimaryKeyConstraint("user_id", "exercise_id", "training_id"),
)

Exercises2Trainings_plans = Table(
    "Exercises2Trainings_plans",
    metaData,
    Column("training_id", Integer, nullable=False),
    Column("exercise_id", Integer, nullable=False),
    PrimaryKeyConstraint("training_id", "exercise_id"),
    ForeignKeyConstraint(
        ["training_id"], ["Trainings_plan.training_id"], ondelete="CASCADE"
    ),
    ForeignKeyConstraint(
        ["exercise_id"], ["Exercises.exercise_id"], ondelete="CASCADE"
    ),
)


Trainings_plan_history = Table(
    "Trainings_plan_history",
    metaData,
    Column("trainings_plan_history_id", Integer, autoincrement=True),
    Column("training_id", Integer),
    Column("trainings_name", String),
    Column("day", Date, nullable=False),
    Column("user_id", Integer, nullable=False),
    ForeignKeyConstraint(
        ["user_id"],
        ["Users.user_id"],
        ondelete="CASCADE",
    ),
    PrimaryKeyConstraint("trainings_plan_history_id"),
)

Exercises_history = Table(
    "Exercises_history",
    metaData,
    Column("exercises_history_id", Integer, nullable=False),
    Column("trainings_plan_history_id", Integer, nullable=False),
    Column("user_id", Integer, nullable=False),
    Column("exercise_id", Integer, nullable=False),
    Column("completed", Boolean, nullable=False, default=False),
    Column("minutes", Integer, nullable=True),
    Column("number_of_repetition", Integer, nullable=True),
    Column("number_of_sets", Integer, nullable=True),
    Column("value_trackable_unit_of_measure", DECIMAL(20, 3), nullable=True),
    Column("trackable_unit_of_measure", String(255), nullable=True),
    ForeignKeyConstraint(
        ["exercise_id"],
        ["Exercises.exercise_id"],
        ondelete="CASCADE",
    ),
    ForeignKeyConstraint(
        ["exercises_history_id"],
        ["Trainings_plan_history.trainings_plan_history_id"],
        ondelete="CASCADE",
    ),
    ForeignKeyConstraint(
        ["user_id"],
        ["Users.user_id"],
        ondelete="CASCADE",
    ),
    PrimaryKeyConstraint("exercises_history_id"),
)

Tags = Table(
    "Tags",
    metaData,
    Column("tag_id", Integer, nullable=False),
    Column("tag_name", String(255), nullable=False),
    PrimaryKeyConstraint("tag_id"),
)

Tags2Exercises = Table(
    "Tags2Exercises",
    metaData,
    Column("tag_id", Integer, primary_key=True, autoincrement=True),
    Column("exercise_id", Integer, nullable=False),
    Column("is_primary_tag", Boolean, nullable=False, default=False),
    ForeignKeyConstraint(
        ["exercise_id"], ["Exercises.exercise_id"], ondelete="CASCADE"
    ),
    ForeignKeyConstraint(["tag_id"], ["Tags.tag_id"], ondelete="CASCADE"),
)

Individual_Exercise_Ratings = Table(
    "Individual_Exercise_Ratings",
    metaData,
    Column("user_id", Integer, nullable=False),
    Column("exercise_id", Integer, nullable=False),
    Column("rating", Integer, nullable=False),
    ForeignKeyConstraint(
        ["exercise_id"], ["Exercises.exercise_id"], ondelete="CASCADE"
    ),
    ForeignKeyConstraint(["user_id"], ["Users.user_id"], ondelete="CASCADE"),
    PrimaryKeyConstraint("user_id", "exercise_id"),
)

Overall_Exercise_Ratings = Table(
    "Overall_Exercise_Ratings",
    metaData,
    Column("exercise_id", Integer, nullable=False),
    Column("total_exercise_ratings", Integer, nullable=False),
    Column("rating", Float, nullable=True),
    ForeignKeyConstraint(
        ["exercise_id"], ["Exercises.exercise_id"], ondelete="CASCADE"
    ),
    PrimaryKeyConstraint("exercise_id"),
)

Days = Table(
    "Days",
    metaData,
    Column(
        "days_id",
        Integer,
        nullable=False,
    ),
    Column(
        "weekday",
        Enum(
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ),
        nullable=False,
    ),
    Column("training_id", Integer, nullable=False),
    Column("user_id", Integer, nullable=False),
    ForeignKeyConstraint(
        ["training_id", "user_id"],
        ["Trainings_plan.training_id", "Trainings_plan.user_is"],
        ondelete="CASCADE",
    ),
    PrimaryKeyConstraint("days_id"),
)
