package midware

import (
	"net/http"
	"strings"

	"github.com/imbaky/PatientFocus/core/data"
)

//Middleware is a wrapper to http handlers. i.e Middleware
type Middleware func(http.HandlerFunc) http.HandlerFunc

// Chain applies middlewares to a http.HandlerFunc
func Chain(f http.HandlerFunc, middlewares ...Middleware) http.HandlerFunc {
	for _, m := range middlewares {
		f = m(f)
	}
	return f
}

//CheckSession is a middleware that wraps an http handler and checks the session token, continuing if successful and return 401 if failed
func CheckSession() Middleware {
	return func(h http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			tkn := strings.Replace(r.Header.Get("Authorization"), "Bearer ", "", -1)
			if err := data.CheckSession(tkn); err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			h(w, r)
		}
	}
}
