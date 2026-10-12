package server

import (
	"encoding/json"
	"errors"
	"net/http"
)

func NewHTTPHandler(store Store) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/healthz", func(response http.ResponseWriter, request *http.Request) {
		if request.Method != http.MethodGet {
			writeError(response, http.StatusMethodNotAllowed, "method_not_allowed")
			return
		}
		writeJSON(response, http.StatusOK, APIResponse{Code: 0, Message: "ok", Data: store.Status()})
	})

	mux.HandleFunc("/api/v1/dashboard", func(response http.ResponseWriter, request *http.Request) {
		if request.Method != http.MethodGet {
			writeError(response, http.StatusMethodNotAllowed, "method_not_allowed")
			return
		}
		dashboard, err := store.Dashboard(request.Context())
		if err != nil {
			writeError(response, http.StatusInternalServerError, err.Error())
			return
		}
		writeJSON(response, http.StatusOK, APIResponse{Code: 0, Message: "ok", Data: dashboard})
	})

	mux.HandleFunc("/api/v1/listings", func(response http.ResponseWriter, request *http.Request) {
		if request.Method != http.MethodPost {
			writeError(response, http.StatusMethodNotAllowed, "method_not_allowed")
			return
		}
		var input ListingInput
		if err := decodeJSON(request, &input); err != nil {
			writeError(response, http.StatusBadRequest, err.Error())
			return
		}
		listing, err := store.CreateListing(request.Context(), input)
		if err != nil {
			writeError(response, http.StatusInternalServerError, err.Error())
			return
		}
		writeJSON(response, http.StatusCreated, APIResponse{Code: 0, Message: "ok", Data: listing})
	})

	mux.HandleFunc("/api/v1/unlocks", func(response http.ResponseWriter, request *http.Request) {
		if request.Method != http.MethodPost {
			writeError(response, http.StatusMethodNotAllowed, "method_not_allowed")
			return
		}
		var input UnlockInput
		if err := decodeJSON(request, &input); err != nil {
			writeError(response, http.StatusBadRequest, err.Error())
			return
		}
		unlock, err := store.UnlockMatch(request.Context(), input)
		if err != nil {
			writeError(response, http.StatusInternalServerError, err.Error())
			return
		}
		writeJSON(response, http.StatusCreated, APIResponse{Code: 0, Message: "ok", Data: unlock})
	})

	return withCORS(mux)
}

func decodeJSON(request *http.Request, value any) error {
	if request.Body == nil {
		return errors.New("empty request body")
	}
	defer request.Body.Close()
	return json.NewDecoder(request.Body).Decode(value)
}

func writeJSON(response http.ResponseWriter, status int, payload APIResponse) {
	response.Header().Set("Content-Type", "application/json; charset=utf-8")
	response.WriteHeader(status)
	_ = json.NewEncoder(response).Encode(payload)
}

func writeError(response http.ResponseWriter, status int, message string) {
	writeJSON(response, status, APIResponse{Code: status, Message: message})
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		response.Header().Set("Access-Control-Allow-Origin", "*")
		response.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-Request-ID")
		response.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		if request.Method == http.MethodOptions {
			response.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(response, request)
	})
}
