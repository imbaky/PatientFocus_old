//Package security is used to encrypt any sensitive data
package security

import (
	"crypto/sha512"
	"encoding/base64"

	"github.com/imbaky/PatientFocus/core/domain/model"
)

//EncryptPassword encrypts the Password using SHA-512 encryption
func EncryptPassword(user *model.User) {
	hasher := sha512.New()
	user.Password = user.Password + "change to something or get from somewhere"
	hasher.Write([]byte(user.Password))
	encrypted := base64.URLEncoding.EncodeToString(hasher.Sum(nil))
	user.Password = encrypted
}
