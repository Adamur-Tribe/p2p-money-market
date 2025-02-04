package main

import (
	"log"
	"net/http"

	"p2p-money-market/database"
	"p2p-money-market/handlers"
)

func main() {
	// Initialize the database
	db, err := database.InitializeDb("database.db")
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	handlers.DB = db

	// Initialize templates
	handlers.InitTemplates("template")

	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	http.HandleFunc("/", handlers.HandleLandingPage)
	http.HandleFunc("/register", handlers.RegisterUserHandler)
	http.HandleFunc("/login", handlers.LoginHandler)
	http.HandleFunc("/account", handlers.HandleBankAccount)

	log.Println("server started at port: http://localhost:1234")
	log.Fatal(http.ListenAndServe(":1234", nil))
}
