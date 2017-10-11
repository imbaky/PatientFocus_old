CREATE TABLE IF NOT EXISTS user (
       id SERIAL NOT NULL PRIMARY KEY,
       fname TEXT NOT NULL,
       lname TEXT NOT NULL,
       address TEXT NOT NULL,
       email TEXT NOT NULL,
       date_created DATE NOT NULL default CURRENT_DATE,
       date_modified DATE
);

CREATE TABLE IF NOT EXISTS patient {
       id SERIAL NOT NULL PRIMARY KEY,
       race TEXT NOT NULL,
       gender TEXT NOT NULL,
       dob TEXT NOT NULL,
       language TEXT NOT NULL,
       smoke BOOLEAN NOT NULL,
       date_created DATE NOT NULL default CURRENT_DATE,
       date_modified DATE
}