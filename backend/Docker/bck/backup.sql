-- MySQL dump 10.13  Distrib 8.2.0, for Linux (x86_64)
--
-- Host: localhost    Database: trainings_DB
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!50503 SET NAMES utf8mb4 */
;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */
;
/*!40103 SET TIME_ZONE='+00:00' */
;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */
;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `Categories` (
    `category_id` int NOT NULL AUTO_INCREMENT, `category_name` varchar(255) NOT NULL, PRIMARY KEY (`category_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */
;

INSERT INTO
    `Categories`
VALUES (1, 'Gym'),
    (2, 'Uni'),
    (3, 'adsasda'),
    (4, 'asd');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `Cells`
--

DROP TABLE IF EXISTS `Cells`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `Cells` (
    `row_index` int NOT NULL, `column_id` int NOT NULL, `cell_content` varchar(255) DEFAULT NULL, PRIMARY KEY (`row_index`, `column_id`), KEY `column_id` (`column_id`), CONSTRAINT `Cells_ibfk_1` FOREIGN KEY (`column_id`) REFERENCES `Columns` (`column_id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `Cells`
--

LOCK TABLES `Cells` WRITE;
/*!40000 ALTER TABLE `Cells` DISABLE KEYS */
;

INSERT INTO `Cells` VALUES (0, 49, 'asdasda');
/*!40000 ALTER TABLE `Cells` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `Columns`
--

DROP TABLE IF EXISTS `Columns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `Columns` (
    `column_id` int NOT NULL AUTO_INCREMENT, `subcategory_id` int NOT NULL, `column_name` varchar(255) NOT NULL, PRIMARY KEY (`column_id`), KEY `subcategory_id` (`subcategory_id`), CONSTRAINT `Columns_ibfk_1` FOREIGN KEY (`subcategory_id`) REFERENCES `Subcategories` (`subcategory_id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 50 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `Columns`
--

LOCK TABLES `Columns` WRITE;
/*!40000 ALTER TABLE `Columns` DISABLE KEYS */
;

INSERT INTO
    `Columns`
VALUES (41, 9, '4'),
    (42, 9, '5'),
    (43, 9, '6'),
    (44, 9, '7'),
    (45, 9, '1'),
    (46, 9, '2'),
    (47, 9, '3'),
    (48, 2, 'test2'),
    (49, 11, 'asd');
/*!40000 ALTER TABLE `Columns` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `Owners`
--

DROP TABLE IF EXISTS `Owners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `Owners` (
    `user_name` varchar(255) NOT NULL, `subcategory_id` int NOT NULL, PRIMARY KEY (`user_name`, `subcategory_id`), KEY `subcategory_id` (`subcategory_id`), CONSTRAINT `Owners_ibfk_1` FOREIGN KEY (`user_name`) REFERENCES `Users` (`user_name`) ON DELETE CASCADE, CONSTRAINT `Owners_ibfk_2` FOREIGN KEY (`subcategory_id`) REFERENCES `Subcategories` (`subcategory_id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `Owners`
--

LOCK TABLES `Owners` WRITE;
/*!40000 ALTER TABLE `Owners` DISABLE KEYS */
;

INSERT INTO
    `Owners`
VALUES ('abc', 1),
    ('abc', 2),
    ('abc', 3),
    ('abc', 4),
    ('abc', 5),
    ('abc', 9),
    ('abc', 10),
    ('abc', 11),
    ('abc', 12);
/*!40000 ALTER TABLE `Owners` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `Special_column_attr`
--

DROP TABLE IF EXISTS `Special_column_attr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `Special_column_attr` (
    `column_id` int NOT NULL, `start_date` date DEFAULT NULL, `default_value` varchar(255) DEFAULT NULL, PRIMARY KEY (`column_id`), CONSTRAINT `Special_column_attr_ibfk_1` FOREIGN KEY (`column_id`) REFERENCES `Columns` (`column_id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `Special_column_attr`
--

LOCK TABLES `Special_column_attr` WRITE;
/*!40000 ALTER TABLE `Special_column_attr` DISABLE KEYS */
;

INSERT INTO
    `Special_column_attr`
VALUES (41, NULL, NULL),
    (42, NULL, NULL),
    (43, NULL, NULL),
    (44, NULL, NULL),
    (45, NULL, NULL),
    (46, NULL, NULL),
    (47, NULL, NULL),
    (48, NULL, NULL),
    (49, NULL, NULL);
/*!40000 ALTER TABLE `Special_column_attr` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `Subcategories`
--

DROP TABLE IF EXISTS `Subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `Subcategories` (
    `subcategory_id` int NOT NULL AUTO_INCREMENT, `category_id` int NOT NULL, `subcategory_name` varchar(255) NOT NULL, `number_of_rows` int NOT NULL, PRIMARY KEY (`subcategory_id`), KEY `category_id` (`category_id`), CONSTRAINT `Subcategories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`category_id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 13 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `Subcategories`
--

LOCK TABLES `Subcategories` WRITE;
/*!40000 ALTER TABLE `Subcategories` DISABLE KEYS */
;

INSERT INTO
    `Subcategories`
VALUES (1, 1, 'Liegestuetze', 0),
    (2, 1, 'Situps', 1),
    (3, 2, 'Tools', 0),
    (4, 3, 'asdasd', 1),
    (5, 3, 'asdasdasd', 0),
    (9, 1, 'test', 0),
    (10, 1, 'test', 0),
    (11, 4, 'asdd', 3),
    (12, 4, 'asd', 0);
/*!40000 ALTER TABLE `Subcategories` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `Users` (
    `user_name` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `expired` tinyint(1) DEFAULT '1', PRIMARY KEY (`user_name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */
;

INSERT INTO
    `Users`
VALUES (
        'abc', '$2b$12$lCAhVmz1AvHEtTc916Ky4ee36cT6Tyirl3CZraIg8ZEvIhbvF5iqm', 0
    );
/*!40000 ALTER TABLE `Users` ENABLE KEYS */
;

UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */
;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */
;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */
;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */
;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */
;

-- Dump completed on 2024-01-21 22:06:04