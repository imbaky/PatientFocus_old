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
       user INTEGER REFERENCES user(id),
       race TEXT NOT NULL,
       gender TEXT NOT NULL,
       dob TIMESTAMP NOT NULL,
       language TEXT NOT NULL,
       smoke BOOLEAN NOT NULL,
       problem_list TEXT[],
       meds_list TEXT[],
       allergy_list TEXT[],
       date_created DATE NOT NULL default CURRENT_DATE,
       date_modified clock_timestamp()
}
