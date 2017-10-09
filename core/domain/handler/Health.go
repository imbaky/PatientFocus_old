package handlers

import (
    "net/http"
)

/*
 * Returns health of service
 */
func Health(w http.ResponseWriter, req *http.Request) {
     // A very simple health check.
    w.WriteHeader(http.StatusOK)
    w.Header().Set("Content-Type", "application/json")
}
