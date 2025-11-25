
# 📊 NIRF Research Score Calculator (2024 Edition)

A **web-based tool** to calculate, analyze, and visualize the **Research and Professional Practice (RP)** score for Indian Universities based on the **National Institutional Ranking Framework (NIRF)** 2024 scoring methodology.

---

## 🚀 Key Features

### 🔢 Relative Scoring Engine

Uses **relative** scoring based on *National Topper* benchmarks instead of absolute values.

### ⏱ Real-Time Calculation

Automatically updates scores for:

* **PU** – Combined Publications Score
* **QP** – Quality of Publications
* **IPR** – Intellectual Property Rights (Patents)
* **FPPP** – Research Funding & Consultancy

### 📊 Visual Insights

* **Radar Chart**: Shape-based comparison vs. Topper scores
* **Bar Charts**: Score contribution breakdown
* **Smart Recommendations**: Highlights weak areas like low funding or faculty dilution affecting rankings

---

## 🧮 Scoring Methodology

Reverse-engineered from **NIRF 2024 official ranking data**.

### 1️⃣ PU – Publications Score (30 Marks)

```math
PU = 30 × ( (P / FRQ) / (P_topper / FRQ_topper) )
```

### 2️⃣ QP – Quality of Publications (30 Marks)

```math
QP = 15 × ( (CC / FRQ) / Benchmark_CC ) + 15 × ( TOP25P% / Benchmark_Q1 )
```

### 3️⃣ IPR – Patents Score (15 Marks)

```math
IPR = 15 × (Patents_Granted + Patents_Published) / Benchmark_Patents
```

### 4️⃣ FPPP – Research Funding (15 Marks)

```math
FPPP = 15 × ( AvgFunding / Benchmark_Funding )
```


## 🚀 Quick Start

```bash
git clone https://github.com/yourusername/nirf-calculator.git
```

### Run the tool:

1. Open **`index.html`** in any browser (Chrome / Firefox / Edge)
2. Enter your institution’s research statistics
3. (Optional) Open **Edit Topper Benchmarks** for category-wise customization (Engineering / Medical / University / Pharmacy etc.)

---

## 💡 Use Cases

* University Research & Ranking Analytics Teams
* College Accreditation & Ranking Cells
* NIRF Performance Strategy Planning
* Comparative Institutional Research

---

## 📝 License

This project is open source and available under the **MIT License**.

---

## 🌟 Contribute

Contributions are always welcome!

1. Fork the repo
2. Create a feature branch
3. Submit a PR

---

## 🙌 Acknowledgements

* MHRD & NIRF Ranking Framework (2024)
* Indian academic research analytics community

---


Would you like me to generate a landing page design or deploy version also? 🚀
