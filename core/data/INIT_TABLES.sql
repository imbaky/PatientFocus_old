CREATE TABLE IF NOT EXISTS pfuser (
       id SERIAL NOT NULL PRIMARY KEY,
       fname TEXT NOT NULL,
       lname TEXT NOT NULL,
       password TEXT NOT NULL,
       email TEXT NOT NULL,
       address TEXT,
       date_created DATE NOT NULL default CURRENT_DATE,
       date_modified DATE
);

CREATE TABLE IF NOT EXISTS patient (
       id SERIAL NOT NULL PRIMARY KEY,
       pfuser INTEGER REFERENCES pfuser(id),
       race TEXT NOT NULL,
       gender TEXT NOT NULL,
       dob TIMESTAMP NOT NULL,
       language TEXT NOT NULL,
       smoke BOOLEAN NOT NULL,
       problem_list TEXT[],
       meds_list TEXT[],
       allergy_list TEXT[],
       date_created DATE NOT NULL default CURRENT_DATE,
       date_modified DATE
);

CREATE TABLE IF NOT EXISTS doctor (
       id SERIAL NOT NULL PRIMARY KEY,
       pfuser INTEGER REFERENCES pfuser(id),
       specialization TEXT NOT NULL,
       license INTEGER,
       date_created DATE NOT NULL default CURRENT_DATE,
       date_modified DATE
);


CREATE TABLE IF NOT EXISTS document (
       id SERIAL NOT NULL PRIMARY KEY,
       url TEXT NOT NULL,
       description TEXT NOT NULL,
       date_created DATE NOT NULL default CURRENT_DATE,
       date_modified DATE
);
