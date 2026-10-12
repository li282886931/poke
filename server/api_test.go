package server

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func decodeBody(t *testing.T, body *bytes.Buffer) map[string]any {
	t.Helper()

	var payload map[string]any
	if err := json.NewDecoder(body).Decode(&payload); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	return payload
}

func getData(t *testing.T, payload map[string]any) map[string]any {
	t.Helper()

	if payload["code"] != float64(0) {
		t.Fatalf("expected success response, got %#v", payload)
	}
	data, ok := payload["data"].(map[string]any)
	if !ok {
		t.Fatalf("expected data object, got %#v", payload["data"])
	}
	return data
}

func TestHealthzReportsSeedStoreWhenMongoIsNotConfigured(t *testing.T) {
	handler := NewHTTPHandler(NewSeedStore())
	request := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	response := httptest.NewRecorder()

	handler.ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", response.Code)
	}
	data := getData(t, decodeBody(t, response.Body))
	if data["store"] != "seed" {
		t.Fatalf("expected seed store, got %#v", data["store"])
	}
	if data["mongoConnected"] != false {
		t.Fatalf("expected mongoConnected=false, got %#v", data["mongoConnected"])
	}
}

func TestDashboardReturnsMiniappCompatiblePayload(t *testing.T) {
	handler := NewHTTPHandler(NewSeedStore())
	request := httptest.NewRequest(http.MethodGet, "/api/v1/dashboard", nil)
	response := httptest.NewRecorder()

	handler.ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", response.Code)
	}
	data := getData(t, decodeBody(t, response.Body))
	for _, field := range []string{"residentListings", "masterMatches", "messages", "categories"} {
		items, ok := data[field].([]any)
		if !ok || len(items) == 0 {
			t.Fatalf("expected non-empty %s array, got %#v", field, data[field])
		}
	}
	if data["credit"] != float64(36) {
		t.Fatalf("expected credit 36, got %#v", data["credit"])
	}
}

func TestCreateListingReturnsPendingReviewListing(t *testing.T) {
	handler := NewHTTPHandler(NewSeedStore())
	body := strings.NewReader(`{"title":"测试发布","category":"家电维修","district":"高新区","description":"空调需要检修"}`)
	request := httptest.NewRequest(http.MethodPost, "/api/v1/listings", body)
	request.Header.Set("Content-Type", "application/json")
	response := httptest.NewRecorder()

	handler.ServeHTTP(response, request)

	if response.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d", response.Code)
	}
	data := getData(t, decodeBody(t, response.Body))
	if !strings.HasPrefix(data["id"].(string), "lead-") {
		t.Fatalf("expected generated lead id, got %#v", data["id"])
	}
	if data["status"] != "pending_review" {
		t.Fatalf("expected pending_review, got %#v", data["status"])
	}
}

func TestUnlockMatchReturnsContactAndCreditSummary(t *testing.T) {
	handler := NewHTTPHandler(NewSeedStore())
	body := strings.NewReader(`{"matchId":"match-001","masterId":"master-01"}`)
	request := httptest.NewRequest(http.MethodPost, "/api/v1/unlocks", body)
	request.Header.Set("Content-Type", "application/json")
	response := httptest.NewRecorder()

	handler.ServeHTTP(response, request)

	if response.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d", response.Code)
	}
	data := getData(t, decodeBody(t, response.Body))
	if !strings.HasPrefix(data["unlockId"].(string), "unlock-") {
		t.Fatalf("expected generated unlock id, got %#v", data["unlockId"])
	}
	if data["status"] != "unlocked" {
		t.Fatalf("expected unlocked, got %#v", data["status"])
	}
	contact := data["contact"].(map[string]any)
	if contact["phone"] == "" {
		t.Fatalf("expected masked phone contact, got %#v", contact)
	}
	if data["creditDelta"] != float64(-8) {
		t.Fatalf("expected credit delta -8, got %#v", data["creditDelta"])
	}
}

func TestNewStoreFromEnvFallsBackToSeedWithoutMongoURI(t *testing.T) {
	t.Setenv("MONGO_URI", "")
	t.Setenv("MONGO_DATABASE", "")

	store, err := NewStoreFromEnv(context.Background())
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if store.Status().Name != "seed" {
		t.Fatalf("expected seed store, got %s", store.Status().Name)
	}
}
