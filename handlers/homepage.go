package handlers

import (
	"net/http"
)

// /function to handle the main landing page
func HandleLandingPage(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		ErrorHandler(w, http.StatusNotFound)
		return
	}
	if r.Method == http.MethodGet {
		RenderTemplates(w, "index.html", nil)
		return
	}
	// temp, err := template.ParseFiles("template/index.html")
	// if err != nil {
	// 	ErrorHandler(w, http.StatusInternalServerError)
	// 	return
	// }
	// temp.Execute(w, nil)
}

// function to handle the bank interface
func HandleBankAccount(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		RenderTemplates(w, "accountPage.html", nil)
		return
	}
	if r.Method == http.MethodPost {
	}
}
