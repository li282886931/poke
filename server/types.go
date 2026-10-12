package server

import "context"

type APIResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

type StoreStatus struct {
	Name           string `json:"store"`
	MongoConnected bool   `json:"mongoConnected"`
}

type Store interface {
	Status() StoreStatus
	Dashboard(ctx context.Context) (Dashboard, error)
	CreateListing(ctx context.Context, input ListingInput) (map[string]any, error)
	UnlockMatch(ctx context.Context, input UnlockInput) (map[string]any, error)
	SubmitVoiceDemand(ctx context.Context, input VoiceDemandInput) (VoiceDemandResult, error)
}

type Dashboard struct {
	ResidentListings []map[string]any `json:"residentListings"`
	MasterMatches    []map[string]any `json:"masterMatches"`
	Messages         []map[string]any `json:"messages"`
	Categories       []string         `json:"categories"`
	Credit           int              `json:"credit"`
}

type ListingInput struct {
	Title       string `json:"title"`
	Category    string `json:"category"`
	District    string `json:"district"`
	Description string `json:"description"`
	Time        string `json:"time"`
}

type UnlockInput struct {
	MatchID  string `json:"matchId"`
	MasterID string `json:"masterId"`
}

type VoiceDemandInput struct {
	UserID          string `json:"userId"`
	Transcript      string `json:"transcript"`
	AudioURL        string `json:"audioUrl"`
	DurationSeconds int    `json:"durationSeconds"`
	City            string `json:"city"`
	District        string `json:"district"`
}

type VoiceDemandResult struct {
	LeadID     string          `json:"leadId"`
	Status     string          `json:"status"`
	Message    string          `json:"message"`
	Transcript string          `json:"transcript"`
	Category   string          `json:"category"`
	City       string          `json:"city"`
	District   string          `json:"district"`
	Matches    []ResourceMatch `json:"matches"`
}

type ResourceProfile struct {
	ID          string
	Name        string
	Category    string
	City        string
	Districts   []string
	Keywords    []string
	PhoneMasked string
}

type ResourceMatch struct {
	ResourceID         string   `json:"resourceId"`
	Name               string   `json:"name"`
	Category           string   `json:"category"`
	District           string   `json:"district"`
	Score              int      `json:"score"`
	Reasons            []string `json:"reasons"`
	NotificationStatus string   `json:"notificationStatus"`
	Phone              string   `json:"phone"`
}
