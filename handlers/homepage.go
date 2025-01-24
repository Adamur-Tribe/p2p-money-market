package handlers

import (
	"log"
	"net/http"
	"text/template"

	"p2p-money-market/structs"
)

// /function to handle the main landing page
func HandleLandingPage(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		ErrorHandler(w, http.StatusNotFound)
		return
	}
	temp, err := template.ParseFiles("template/index.html")
	if err != nil {
		ErrorHandler(w, http.StatusInternalServerError)
		return
	}
	temp.Execute(w, nil)
}

// function to handle the errors and error pages
func ErrorHandler(w http.ResponseWriter, code int) {
	w.WriteHeader(code)
	temp, err := template.ParseFiles("template/error.html")
	if err != nil {
		log.Fatalln(err)
		return
	}

	data := structs.Codes{
		Code: code,
	}
	temp.Execute(w, data)
}
