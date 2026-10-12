package server

import (
	"context"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const defaultMongoDatabase = "wanqiyuan"

type MongoStore struct {
	client *mongo.Client
	db     *mongo.Database
	seed   *SeedStore
}

func NewStoreFromEnv(ctx context.Context) (Store, error) {
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		return NewSeedStore(), nil
	}

	database := os.Getenv("MONGO_DATABASE")
	if database == "" {
		database = defaultMongoDatabase
	}

	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return NewSeedStore(), nil
	}
	if err := client.Ping(ctx, nil); err != nil {
		_ = client.Disconnect(context.Background())
		return NewSeedStore(), nil
	}

	return &MongoStore{
		client: client,
		db:     client.Database(database),
		seed:   NewSeedStore(),
	}, nil
}

func (store *MongoStore) Status() StoreStatus {
	return StoreStatus{Name: "mongo", MongoConnected: true}
}

func (store *MongoStore) Dashboard(ctx context.Context) (Dashboard, error) {
	seed, _ := store.seed.Dashboard(ctx)

	listings, err := store.readMaps(ctx, "leads")
	if err != nil || len(listings) == 0 {
		listings = seed.ResidentListings
	}
	matches, err := store.readMaps(ctx, "matches")
	if err != nil || len(matches) == 0 {
		matches = seed.MasterMatches
	}
	messages, err := store.readMaps(ctx, "messages")
	if err != nil || len(messages) == 0 {
		messages = seed.Messages
	}

	categories := seed.Categories
	if rows, err := store.readMaps(ctx, "categories"); err == nil && len(rows) > 0 {
		categories = make([]string, 0, len(rows))
		for _, row := range rows {
			if name, ok := row["name"].(string); ok {
				categories = append(categories, name)
			}
		}
	}

	return Dashboard{
		ResidentListings: listings,
		MasterMatches:    matches,
		Messages:         messages,
		Categories:       categories,
		Credit:           seed.Credit,
	}, nil
}

func (store *MongoStore) CreateListing(ctx context.Context, input ListingInput) (map[string]any, error) {
	listing, _ := store.seed.CreateListing(ctx, input)
	listing["createdAt"] = time.Now().Format(time.RFC3339)
	_, err := store.db.Collection("leads").InsertOne(ctx, listing)
	return listing, err
}

func (store *MongoStore) UnlockMatch(ctx context.Context, input UnlockInput) (map[string]any, error) {
	unlock, _ := store.seed.UnlockMatch(ctx, input)
	unlock["createdAt"] = time.Now().Format(time.RFC3339)
	_, err := store.db.Collection("unlocks").InsertOne(ctx, unlock)
	return unlock, err
}

func (store *MongoStore) readMaps(ctx context.Context, collection string) ([]map[string]any, error) {
	cursor, err := store.db.Collection(collection).Find(ctx, bson.M{}, options.Find().SetLimit(50))
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var rows []map[string]any
	if err := cursor.All(ctx, &rows); err != nil {
		return nil, err
	}
	return rows, nil
}
