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
