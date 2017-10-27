package midware

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/imbaky/PatientFocus/core/data"
)

//Middleware is a wrapper to http handlers. i.e Middleware
type Middleware func(http.HandlerFunc) http.HandlerFunc

// Chain applies middlewares to a http.HandlerFunc
func Chain(f http.HandlerFunc, middlewares ...Middleware) http.HandlerFunc {
	for i := len(middlewares) - 1; i >= 0; i-- {
		f = middlewares[i](f)
	}
	return f
}

//CheckSession is a middleware that wraps an http handler and checks the session token, continuing if successful and return 401 if failed
func CheckSession() Middleware {
	return func(h http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			fmt.Println("session mid")
			tkn := strings.Replace(r.Header.Get("Authorization"), "Bearer ", "", -1)
			if err := data.CheckSession(tkn); err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			h(w, r)
		}
	}
}

//LogInfo is a middleware that wraps an http handler and logs the id, url, start and end times of the request
func LogInfo() Middleware {
	return func(h http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			fmt.Println("log mid")
			h(w, r)
			end := time.Now()
			request := r.URL
			tkn := strings.Replace(r.Header.Get("Authorization"), "Bearer ", "", -1)
			id, _ := data.GetIdFromSession(tkn)
			f, _ := os.OpenFile("logfile.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
			defer f.Close()
			log.SetOutput(f)
			log.Printf("id : %v, request : %v, start : %v, end : %v\n", id, request, start, end)
		}
	}
}
