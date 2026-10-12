package main

import (
	"context"
	"log"
	"net/http"
	"os"

	wanqiyuan "wanqiyuan/server"
)

func main() {
	addr := os.Getenv("SERVER_ADDR")
	if addr == "" {
		addr = ":8080"
	}

	store, err := wanqiyuan.NewStoreFromEnv(context.Background())
	if err != nil {
		log.Fatalf("init store: %v", err)
	}

	log.Printf("wanqiyuan api listening on %s with %s store", addr, store.Status().Name)
	if err := http.ListenAndServe(addr, wanqiyuan.NewHTTPHandler(store)); err != nil {
		log.Fatalf("serve api: %v", err)
	}
}
