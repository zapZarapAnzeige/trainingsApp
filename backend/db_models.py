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


User = Table(
    "User",
    metaData,
    Column("user_id", Integer, primary_key=True, autoincrement=True),
    Column("profile_picture", BLOB, nullable=True),
    Column("nickname", String(255), nullable=True),
    Column("username", String(255), unique=True, nullable=False),
    Column("password", String(255), nullable=False),
    Column("expired", Boolean, nullable=False, default=False),
    Column("plz", String(5), nullable=True),
    Column("searching_for_partner", Boolean, nullable=False, default=False),
    Column("bio", Text, nullable=True),
)

Training_plan = Table(
    "Training_plan",
    metaData,
    Column("training_id", Integer, primary_key=True, autoincrement=True),
    Column("training_name", String(255), nullable=False),
    Column("user_id", Integer, nullable=False),
    ForeignKeyConstraint(["user_id"], ["User.user_id"], ondelete="CASCADE"),
)


Exercise = Table(
    "Exercise",
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
    ForeignKeyConstraint(["user_id"], ["User.user_id"], ondelete="CASCADE"),
    ForeignKeyConstraint(
        ["training_id"], ["Training_plan.training_id"], ondelete="CASCADE"
    ),
    ForeignKeyConstraint(
        ["exercise_id"], ["Exercise.exercise_id"], ondelete="CASCADE"
    ),
    PrimaryKeyConstraint("user_id", "exercise_id", "training_id"),
)

Exercise2Training_plan = Table(
    "Exercise2Training_plan",
    metaData,
    Column("training_id", Integer, nullable=False),
    Column("exercise_id", Integer, nullable=False),
    PrimaryKeyConstraint("training_id", "exercise_id"),
    ForeignKeyConstraint(
        ["training_id"], ["Training_plan.training_id"], ondelete="CASCADE"
    ),
    ForeignKeyConstraint(
        ["exercise_id"], ["Exercise.exercise_id"], ondelete="CASCADE"
    ),
)


Training_plan_history = Table(
    "Training_plan_history",
    metaData,
    Column("training_plan_history_id", Integer, autoincrement=True),
    Column("training_id", Integer),
    Column("training_name", String),
    Column("day", Date, nullable=False),
    Column("user_id", Integer, nullable=False),
    ForeignKeyConstraint(
        ["user_id"],
        ["User.user_id"],
        ondelete="CASCADE",
    ),
    PrimaryKeyConstraint("training_plan_history_id"),
)

Exercise_history = Table(
    "Exercise_history",
    metaData,
    Column("excercise_history_id", Integer, nullable=False),
    Column("training_plan_history_id", Integer, nullable=False),
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
        ["Exercise.exercise_id"],
        ondelete="CASCADE",
    ),
    ForeignKeyConstraint(
        ["excercise_history_id"],
        ["Training_plan_history.training_plan_history_id"],
        ondelete="CASCADE",
    ),
    ForeignKeyConstraint(
        ["user_id"],
        ["User.user_id"],
        ondelete="CASCADE",
    ),
    PrimaryKeyConstraint("excercise_history_id"),
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
        ["exercise_id"], ["Exercise.exercise_id"], ondelete="CASCADE"
    ),
    ForeignKeyConstraint(["tag_id"], ["Tags.tag_id"], ondelete="CASCADE"),
)

Individual_rating = Table(
    "Individual_rating",
    metaData,
    Column("user_id", Integer, nullable=False),
    Column("exercise_id", Integer, nullable=False),
    Column("rating", Integer, nullable=False),
    ForeignKeyConstraint(
        ["exercise_id"], ["Exercise.exercise_id"], ondelete="CASCADE"
    ),
    ForeignKeyConstraint(["user_id"], ["User.user_id"], ondelete="CASCADE"),
    PrimaryKeyConstraint("user_id", "exercise_id"),
)

Average_rating = Table(
    "Average_rating",
    metaData,
    Column("exercise_id", Integer, nullable=False),
    Column("total_exercise_ratings", Integer, nullable=False),
    Column("rating", Float, nullable=True),
    ForeignKeyConstraint(
        ["exercise_id"], ["Exercise.exercise_id"], ondelete="CASCADE"
    ),
    PrimaryKeyConstraint("exercise_id"),
)

Day = Table(
    "Day",
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
        ["Training_plan.training_id", "Training_plan.user_is"],
        ondelete="CASCADE",
    ),
    PrimaryKeyConstraint("days_id"),
)
