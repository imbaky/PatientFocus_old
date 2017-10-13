package data

import (
	"fmt"
	"strconv"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/imbaky/PatientFocus/core/domain/model"
)

//GetSession creates a session token from the id of the passed user
func GetSession(user *model.User) (string, error) {
	mySigningKey := []byte("alrkkjfdvouihregtlkjhiuwer")
	token := jwt.New(jwt.SigningMethodHS256)
	id := strconv.Itoa(user.ID)
	claims := token.Claims.(jwt.MapClaims)
	claims["id"] = id
	claims["exp"] = time.Now().Add(time.Hour * 2).Unix()
	tokenString, err := token.SignedString(mySigningKey)
	return tokenString, err
}

// CheckSession validates the session token
func CheckSession(tokenString string) error {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte("alrkkjfdvouihregtlkjhiuwer"), nil
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
