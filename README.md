# 🧠 MANAS360 Database Setup

This repository contains the complete database setup package for the **MANAS360** mental health platform. It includes schema definitions, test data, and automated loading scripts.

## 📂 Project Structure

```text
.
├── final database/             # Main setup package
│   ├── setup_database.py       # 🛠️ Database creation script
│   ├── load_test_data.py       # 📊 Data population tool
│   ├── mans360_test_seed.sql   # 📜 SQL schema & data
│   ├── README.md               # 📖 Detailed instructions
│   └── ...                     # Other utilities
└── README.md                   # This file
```

## 🚀 Quick Setup

1.  **Configure Environment**:
    Navigate to the `final database` folder and create a `.env` file (copy from `.env.template`).
    ```bash
    cd "final database"
    cp .env.template .env
    ```

2.  **Create Database**:
    Run the database setup script:
    ```bash
    python setup_database.py
    ```

3.  **Populate Data**:
    Load the test data into your local or cloud database:
    ```bash
    python load_test_data.py --mode sql
    ```

## 📖 Documentation

For detailed configuration options, test scenarios, and troubleshooting, please refer to the [Detailed README](file:///c:/Users/Shivamani L/Downloads/final database/final database/README.md).

---
**MANAS360** - Advanced Mental Health Platform
