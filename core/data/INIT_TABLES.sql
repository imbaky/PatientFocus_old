       CREATE TABLE IF NOT EXISTS patient (
       id SERIAL NOT NULL PRIMARY KEY,
       fname TEXT NOT NULL,
       lname TEXT NOT NULL,
       dob TEXT NOT NULL,
       address TEXT NOT NULL,
       email TEXT NOT NULL,
       sex TEXT NOT NULL,
       role TEXT NOT NULL
       );