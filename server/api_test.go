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

func TestVoiceDemandMatchesResourcePoolAndNotifiesResourceSide(t *testing.T) {
	handler := NewHTTPHandler(NewSeedStore())
	body := strings.NewReader(`{"transcript":"我在成都高新区，急需500平米冷库","userId":"user-01","durationSeconds":6}`)
	request := httptest.NewRequest(http.MethodPost, "/api/v1/voice-demands", body)
	request.Header.Set("Content-Type", "application/json")
	response := httptest.NewRecorder()

	handler.ServeHTTP(response, request)

	if response.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d", response.Code)
	}
	data := getData(t, decodeBody(t, response.Body))
	if data["status"] != "matched" {
		t.Fatalf("expected matched status, got %#v", data["status"])
	}
	if data["category"] != "设备租赁" {
		t.Fatalf("expected inferred category, got %#v", data["category"])
	}
	if data["district"] != "高新区" {
		t.Fatalf("expected inferred district, got %#v", data["district"])
	}
	matches := data["matches"].([]any)
	if len(matches) == 0 {
		t.Fatalf("expected resource matches, got %#v", matches)
	}
	first := matches[0].(map[string]any)
	if first["resourceId"] == "" {
		t.Fatalf("expected resource id in match, got %#v", first)
	}
	if first["notificationStatus"] != "queued" {
		t.Fatalf("expected queued notification, got %#v", first["notificationStatus"])
	}
	if strings.Contains(first["phone"].(string), "138") {
		t.Fatalf("resource phone should stay masked or absent, got %#v", first["phone"])
	}
}

func TestVoiceDemandWaitsWhenNoResourceMatches(t *testing.T) {
	handler := NewHTTPHandler(NewSeedStore())
	body := strings.NewReader(`{"transcript":"我在成都需要潜水设备维护","userId":"user-01"}`)
	request := httptest.NewRequest(http.MethodPost, "/api/v1/voice-demands", body)
	request.Header.Set("Content-Type", "application/json")
	response := httptest.NewRecorder()

	handler.ServeHTTP(response, request)

	if response.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d", response.Code)
	}
	data := getData(t, decodeBody(t, response.Body))
	if data["status"] != "waiting" {
		t.Fatalf("expected waiting status, got %#v", data["status"])
	}
	if data["message"] != "暂时没有合适资源，已进入等待匹配" {
		t.Fatalf("unexpected message: %#v", data["message"])
	}
	matches := data["matches"].([]any)
	if len(matches) != 0 {
		t.Fatalf("expected no matches, got %#v", matches)
	}
}

func TestVoiceDemandRejectsEmptyTranscript(t *testing.T) {
	handler := NewHTTPHandler(NewSeedStore())
	body := strings.NewReader(`{"audioUrl":"https://example.invalid/voice.mp3"}`)
	request := httptest.NewRequest(http.MethodPost, "/api/v1/voice-demands", body)
	request.Header.Set("Content-Type", "application/json")
	response := httptest.NewRecorder()

	handler.ServeHTTP(response, request)

	if response.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", response.Code)
	}
	payload := decodeBody(t, response.Body)
	if !strings.Contains(payload["message"].(string), "transcript") {
		t.Fatalf("expected transcript error, got %#v", payload)
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
