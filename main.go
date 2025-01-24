package main

import (
	"log"
	"net/http"

	"p2p-money-market/handlers"
)

func main() {
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	http.HandleFunc("/", handlers.HandleLandingPage)

	log.Println("server started at port: http://localhost:1234")
	log.Fatal(http.ListenAndServe(":1234", nil))
}
