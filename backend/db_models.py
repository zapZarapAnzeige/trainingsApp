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
    Column("trainings_id", Integer, primary_key=True, autoincrement=True),
    Column("trainings_name", String(255), nullable=False),
    Column("user_id", Integer, nullable=False),
    ForeignKeyConstraint(["user_id"], ["Users.user_id"], ondelete="CASCADE"),
)


Excercises = Table(
    "Excercises",
    metaData,
    Column("excercise_id", Integer, primary_key=True, autoincrement=True),
    Column("excercise_name", String(255), nullable=False, unique=True),
    Column("description", Text, nullable=True),
    Column("constant_unit_of_measure", Enum("SxWdh", "Min"), nullable=False),
    Column("trackable_unit_of_measure", String(255), nullable=True),
)

Trainings_plan2Excercise = Table(
    "Trainings_plan2Excercise",
    metaData,
    Column("trainings_id", Integer, nullable=False),
    Column("excercise_id", String(255), nullable=False),
    ForeignKeyConstraint(
        ["trainings_id"], ["Trainings_plan.trainings_id"], ondelete="CASCADE"
    ),
    ForeignKeyConstraint(
        ["excercise_id"], ["Excercises.excercise_id"], ondelete="CASCADE"
    ),
    PrimaryKeyConstraint("trainings_id", "excercise_id"),
)


Trainings_plan2Days = Table(
    "Trainings_plan2Days",
    metaData,
    Column("trainings_plan2Days_id", Integer, autoincrement=True),
    Column("trainings_id", Integer),
    Column("day", Date, nullable=False),
    ForeignKeyConstraint(
        ["trainings_id"], ["Trainings_plan.trainings_id"], ondelete="CASCADE"
    ),
    PrimaryKeyConstraint("trainings_plan2Days_id"),
)


Tags = Table(
    "Tags",
    metaData,
    Column("tag_id", Integer, primary_key=True, autoincrement=True),
    Column("excercise_id", Integer, nullable=False),
    Column("tag_name", String(255), nullable=False),
    Column("is_primary_tag", Boolean, nullable=False, default=False),
    ForeignKeyConstraint(
        ["excercise_id"], ["Excercises.excercise_id"], ondelete="CASCADE"
    ),
)

Individual_Excercise_Ratings = Table(
    "Individual_Excercise_Ratings",
    metaData,
    Column("user_id", Integer, nullable=False),
    Column("excercise_id", Integer, nullable=False),
    Column("rating", Integer, nullable=False),
    ForeignKeyConstraint(
        ["excercise_id"], ["Excercises.excercise_id"], ondelete="CASCADE"
    ),
    ForeignKeyConstraint(["user_id"], ["Users.user_id"], ondelete="CASCADE"),
    PrimaryKeyConstraint("user_id", "excercise_id"),
)

Overall_Excercise_Ratings = Table(
    "Overall_Excercise_Ratings",
    metaData,
    Column("excercise_id", Integer, nullable=False, primary_key=True),
    Column("rating", Float, nullable=True),
    ForeignKeyConstraint(
        ["excercise_id"], ["Excercises.excercise_id"], ondelete="CASCADE"
    ),
)
