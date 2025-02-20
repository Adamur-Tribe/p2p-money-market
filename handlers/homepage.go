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
//function to handle the wallet page 
func HandleWallet(w http.ResponseWriter, r *http.Request){
	if r.Method == http.MethodGet {
		RenderTemplates(w, "wallet.html", nil)
		return
	}
}

//function to handle the assets page
func HandleAssets(w http.ResponseWriter, r *http.Request){
	if r.Method == http.MethodGet {
		RenderTemplates(w, "assets.html", nil)
		return
	}
}
func HandleChamas(w http.ResponseWriter, r *http.Request){
	if r.Method == http.MethodGet {
		RenderTemplates(w, "chamas.html", nil)
		return
	}
}
func HandleFunds(w http.ResponseWriter, r *http.Request){
	if r.Method == http.MethodGet {
		RenderTemplates(w, "funds.html", nil)
		return
	}
}
func HandleTransactions(w http.ResponseWriter, r *http.Request){
	if r.Method == http.MethodGet {
		RenderTemplates(w, "transactions.html", nil)
		return
	}
}
func HandleLoans(w http.ResponseWriter, r *http.Request){
	if r.Method == http.MethodGet {
		RenderTemplates(w, "loans.html", nil)
		return
	}
}

