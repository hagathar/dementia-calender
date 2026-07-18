CREATE DATABASE Tasks_database;
USE Tasks_database;

CREATE TABLE Tasks_Table(

TaskID int PRIMARY KEY NOT NULL AUTO_INCREMENT,
TaskName varchar(255),
TaskDate DATE NOT NULL,
TaskTime TIME,
TaskDescription varchar(255),
TaskComplete varchar(255),
AccAssigned varchar(255)

);
CREATE TABLE Lists_Table(

ListItems varchar(255),
ListID 

);
