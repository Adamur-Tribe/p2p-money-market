package handlers

import (
	"database/sql"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

var DB *sql.DB

// function to handle the login of the users in the system
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	// Handle POST request only
	if r.Method == http.MethodGet {
		w.Header().Set("Content-Type", "application/json")
		http.Error(w, `{"error": "Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	// Parse the form data
	if err := r.ParseForm(); err != nil {
		http.Error(w, `{"error": "Invalid form data"}`, http.StatusBadRequest)
		return
	}

	// Extract user input from form
	userName := r.FormValue("userName")
	password := r.FormValue("password")

	// // Debugging: Log the received form values
	// fmt.Println("Received username:", userName)
	// fmt.Println("Received password:", password)

	var hashedPassword string
	var userId string

	// Query the database for user information
	err := DB.QueryRow("SELECT id, password FROM users WHERE username = ?", userName).Scan(&userId, &hashedPassword)
	if err == sql.ErrNoRows {
		http.Error(w, `{"error": "Invalid username or password"}`, http.StatusUnauthorized)
		return
	} else if err != nil {
		http.Error(w, `{"error": "Error retrieving user"}`, http.StatusInternalServerError)
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password)); err != nil {
		http.Error(w, `{"error": "Invalid password"}`, http.StatusUnauthorized)
		return
	}

	// Generate session token
	session := uuid.New().String()
	http.SetCookie(w, &http.Cookie{
		Name:     "session_Token",
		Value:    session,
		Path:     "/",
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,
		SameSite: http.SameSiteDefaultMode,
	})

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Login successful"}`))
}

// function to render the html templates pages
func RenderTemplates(w http.ResponseWriter, fileName string, data interface{}) {
	if err := templates.ExecuteTemplate(w, fileName, data); err != nil {
		ErrorHandler(w, http.StatusInternalServerError)
		log.Println("Templates failed to execute:", err)
		return
	}
}
