package data

import (
	"fmt"
	"strconv"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/imbaky/PatientFocus/backend/domain/models"
)

const (
	S_KEY = "alrkkjfdvouihregtlkjhiuwer"
)

//GetSession creates a session token from the id of the passed user
func GetSession(user *models.PFUser) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	id := strconv.Itoa(user.Uid)
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = id
	claims["role"] = user.Role
	claims["role_id"] = id
	if user.Role == "patient" && user.Patient != nil {
		claims["role_id"] = strconv.Itoa(user.Patient.Ptid)
	}
	if user.Role == "doctor" && user.Doctor != nil {
		claims["role_id"] = strconv.Itoa(user.Doctor.Did)
	}
	claims["exp"] = time.Now().Add(time.Hour * 2).Unix()
	tokenString, err := token.SignedString([]byte(S_KEY))
	return tokenString, err
}

// CheckSession validates the session token
func CheckSession(tokenString string) error {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(S_KEY), nil
	})
	if err != nil {
		return fmt.Errorf("could not parse session token %v", err)
	}

	_, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return fmt.Errorf("session token not ok or invalid")
	}
	return nil
}

//GetIdFromSession gets the id from the session token
func GetIdFromSession(tokenString string) (int, string, int, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(S_KEY), nil
	})
	if err != nil {
		return 0, "", -1, fmt.Errorf("could not parse session token %v", err)
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return 0, "", -1, fmt.Errorf("session token not ok or invalid")
	}

	id := claims["user_id"].(string)
	uid, err := strconv.Atoi(id)
	if err != nil {
		return 0, "", -1, fmt.Errorf("session token could not be converted")
	}

	srid := claims["role_id"].(string)
	rid, err := strconv.Atoi(srid)
	if err != nil {
		return 0, "", -1, fmt.Errorf("session token could not be converted")
	}

	role := claims["role"].(string)
	if err != nil {
		return 0, "", -1, fmt.Errorf("session token could not be converted")
	}

	return uid, role, rid, nil
}
