# **DeBank - Decentralized Money Market (P2P) DAO Web App**   🚀 

## **📌 Overview**  
**DeBank** is a **Decentralized Autonomous Organization (DAO)** powered **P2P money market** that allows users to:  
- Join and participate in decentralized finance (DeFi) investments.  
- Deposit funds into **fixed or non-fixed money market accounts**.  
- Earn **interest** over time based on deposited amounts.  
- Conduct **peer-to-peer transactions** securely using **blockchain technology**.  

This project leverages **Go (Golang)** for backend processing, **blockchain integration** for security, and **JSON-based storage** for transactions and users.  

---

## **🚀 Features**  
### ✅ **User Management**  
- User registration & authentication (hashed passwords).  
- Secure wallet generation.  
- Personalized **user dashboard** to manage funds.  

### 💰 **P2P Transactions**  
- Users can **send & receive funds** securely using **wallet addresses**.  
- Transactions are stored in a **blockchain-based ledger**.  

### 🏦 **Money Market Accounts**  
- **Fixed & Non-Fixed deposit accounts** with interest calculations.  
- Users can **view market trends** dynamically.  
- **Interest accrual every minute** (for testing).  

### 🔗 **Blockchain Integration**  
- Transactions stored **on-chain** using a **custom mempool blockchain**.  
- Blocks **mined automatically** when transactions meet the threshold.  
- **Proof-of-Work (PoW) inspired hashing** for security.  

### 📊 **Market Trends & Analytics**  
- **Real-time graphs** of the **total assets in the money market**.  
- View **user participation growth** over time.  

---

## **🛠️ Tech Stack**
### **Backend**  
- **Go (Golang)**  
- **Blockchain (Custom Mempool Implementation)**  
- **JSON Database for Storage**  
- **HTML/CSS & JavaScript (Frontend Integration)**  

### **Frontend**  
- **HTML, CSS, JavaScript** (Minimal for UI)  
- **Chart.js** *(for real-time graphs in Market Trends page)*  

---

## **📂 Project Structure**
```
p2p-money-market/
│── blockchain/             # Blockchain logic (mempool, mining, hashing)
│── handlers/               # Route handlers for API endpoints
│── templates/              # HTML templates (index, dashboard, money market, trends)
│── utils/                  # Helper functions (wallets, transactions, calculations)
│── static/                 # CSS, JavaScript & assets
│── users.json              # User database (JSON storage)
│── transactions.json       # Transactions history (JSON storage)
│── blockchain.json         # Blockchain data (stored transactions)
│── main.go                 # Entry point (server & routes)
│── README.md               # Documentation
```

---

## **📥 Installation & Setup**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/VictorPaulArony/p2p-money-market.git
cd p2p-money-market
```

### **2️⃣ Install Dependencies**
Ensure you have **Go (1.18+)** installed.  
```sh
go mod tidy  # Install dependencies
```

### **3️⃣ Run the Server**
```sh
go run main.go
```
> Server starts at `http://localhost:8080/` 🚀  

---

## **🛠️ API Endpoints**
### **User Management**
| Endpoint            | Method | Description                      |
|---------------------|--------|----------------------------------|
| `/register`        | `POST` | Register a new user              |
| `/login`           | `POST` | Authenticate user                |
| `/dashboard`       | `GET`  | View user dashboard              |

### **Transactions**
| Endpoint           | Method | Description                     |
|--------------------|--------|---------------------------------|
| `/transactions`    | `POST` | Initiate a P2P transaction      |
| `/transactions`    | `GET`  | View transaction history        |

### **Money Market**
| Endpoint             | Method | Description                      |
|----------------------|--------|----------------------------------|
| `/money-market`      | `GET`  | View money market dashboard      |
| `/money-market/join` | `POST` | Join fixed/non-fixed account     |

### **Blockchain**
| Endpoint            | Method | Description                     |
|---------------------|--------|---------------------------------|
| `/blockchain`      | `GET`  | View entire blockchain ledger  |
| `/mine`           | `POST` | Mine a new block manually      |

---

## **📊 Market Trends & Interest Calculation**
- Interest is calculated **every 1 minute** (for testing).  
- Fixed deposits **mature after 1 year** (default setting).  
- **Graphical Trends** are dynamically updated.  

### **Interest Calculation Example**
| Account Type  | Initial Deposit | Interest Rate | Maturity |
|--------------|----------------|--------------|----------|
| Fixed        | $1000           | 5% (Yearly) | 1 Year   |
| Non-Fixed    | $500            | 3% (Monthly) | Ongoing  |

✅ **Total balance updates dynamically upon maturity!**  

---

## **🔒 Security Features**
- **SHA-256 password hashing** for authentication.  
- **Blockchain ledger prevents tampering**.  
- **Mempool stores transactions before mining**.  
- **User authentication via cookies**.  

---

## **📌 Roadmap & Future Enhancements**
### ✅ **Phase 1 - Core Features (Done!)**
✔️ User Registration & Login  
✔️ P2P Transactions  
✔️ Money Market & Interest Calculation  
✔️ Blockchain-based ledger  

### 🚀 **Phase 2 - Upcoming Features**
🔹 **Switch from JSON DB to PostgreSQL/MongoDB**  
🔹 **Smart Contract Integration (Hyperledger)**  
🔹 **Support for Crypto Wallets (MetaMask, Ledger, etc.)**  

---

## **👨‍💻 Contributing**
Contributions are welcome! To contribute:
1. **Fork the repo**  
2. **Create a feature branch** (`feature-xyz`)  
3. **Commit your changes** (`git commit -m "Added feature xyz"`)  
4. **Push to GitHub** (`git push origin feature-xyz`)  
5. **Create a pull request**  

---

## **📄 License**
This project is licensed under the **MIT License**.

---

## **📞 Contact**
🔗 **GitHub**: [VictorPaulArony](https://github.com/VictorPaulArony)  
📧 **Email**: [victorpaularony@gmail.com](victorpaularony@gmail.com)

---

🚀 **Enjoy using DeBank - The Future of Decentralized Banking!** 🚀  

---

😃
