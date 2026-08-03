# XELARVIS Website Information Architecture (Final Version)

> **Consolidated Live IA (aligned)** — public site sync with this document. UI redesigns (glass / dual-theme) stay as-is unless content requires layout change.

## Live IA (shipped)

```
XELARVIS Website
│
├── Home (/)
│
├── About (/about)  [mega]
│     ├── Company Overview
│     ├── Vision & Mission
│     ├── Leadership
│     ├── Technology & Innovation
│     ├── Our Approach
│     ├── Research Philosophy
│     ├── Why XELARVIS
│     └── Global Presence
│
├── Services (/services)  [mega]
│     └── 5 pillars (sub-capabilities as in-page sections, not nested URLs)
│
├── Solutions (/solutions)  [mega]
│     └── each solution page includes Technology Stack (solution-specific) → link to /technologies
│
├── Technologies (/technologies)  [main nav]
│     └── overall AI / clinical / cloud / data capability catalog
│
├── Industries (/industries)  [mega]
│     └── Healthcare & Life Sciences, Pharmaceutical, Biotechnology,
│         Banking & Finance, Manufacturing, Retail, Logistics,
│         Education Technology, Enterprise Technology
│
├── Research & Innovation (/ai-research-lab)  [mega]
│     ├── Overview · Research Areas · Publications
│     ├── Innovation Projects · Open Source · Collaborations
│     └── Technologies (/technologies) linked from mega
│
├── Insights (/insights)  [mega]
│     ├── Case Studies (/case-studies)
│     ├── Blogs · White Papers · News · Resources
│     └── Reports & Research Briefs (stub page)
│
├── Careers (/careers)
│     ├── Why Join · Life at XELARVIS · Hiring Process
│     ├── Open Positions · Internship · Graduate Programs
│     └── Research Opportunities · Benefits · Apply
│
└── Contact (/contact)  [header CTA]
      ├── Business Enquiry
      ├── Research Collaboration
      ├── Career Enquiry
      └── General Contact
```

### Primary nav (live)

Services · Solutions · Technologies · Industries · Research & Innovation · Insights · Careers · About · **Contact Us** (CTA)

- **Technologies** (`/technologies`) — overall capability stack (site-wide catalog).
- **Solutions → Technology Stack** — solution-specific tools on each `/solutions/[slug]` page, with a link to the full Technologies page.

### Gap log

| Area                                                    | Status                   |
| ------------------------------------------------------- | ------------------------ |
| 5 service pillars + process/benefits                    | Done                     |
| Careers Why Join + Hiring Process + job apply           | Done                     |
| Dual-theme marketing UI                                 | Done                     |
| Nav: About + Research mega + Insights→Cases             | Synced this pass         |
| About: Tech & Innovation, Approach, Research Philosophy | Synced this pass         |
| Solutions/industries title alignment                    | Synced this pass         |
| Careers Life at XELARVIS + Graduate Programs            | Synced this pass         |
| Contact four intents                                    | Synced this pass         |
| Nested service child URLs                               | Deferred (in-page chips) |
| Events & Webinars CMS                                   | Deferred (Phase 2)       |
| Full HR ATS dashboard                                   | Deferred (Phase 2)       |

### Phase 2 (deferred)

Full recruitment ATS: application statuses UI, interview scheduling, email templates, Super Admin / HR / Hiring Manager roles beyond current Payload admin. Events & Webinars CMS. Deep nested service URLs per sub-capability.

---

## Source IA (original Mainplan tree)

XELARVIS Website

│
├── Home
│
├── About XELARVIS
│ │
│ ├── Company Overview
│ ├── Vision & Mission
│ ├── Leadership Team
│ ├── Technology & Innovation
│ ├── Our Approach
│ └── Research Philosophy
│
│
├── Services
│ │
│ ├── Artificial Intelligence & AI Research
│ │ ├── Generative AI
│ │ ├── Machine Learning Solutions
│ │ ├── Natural Language Processing
│ │ ├── Computer Vision
│ │ └── AI Model Development
│ │
│ ├── Data Science & Advanced Analytics
│ │ ├── Predictive Analytics
│ │ ├── Data Visualisation
│ │ ├── Statistical Analysis
│ │ └── Business Intelligence
│ │
│ ├── Clinical Data Science & Healthcare AI
│ │ ├── Clinical SAS Programming
│ │ ├── SDTM & ADaM Automation
│ │ ├── TLF Generation
│ │ ├── Clinical Analytics
│ │ └── AI in Healthcare Research
│ │
│ ├── IT Consulting & Digital Transformation
│ │ ├── Enterprise Software Consulting
│ │ ├── Digital Strategy
│ │ ├── Application Development
│ │ └── Technology Consulting
│ │
│ └── Data Engineering & Cloud Solutions
│ ├── Data Platforms
│ ├── Cloud Migration
│ ├── Data Pipelines
│ └── MLOps & Deployment
│
│
├── Solutions
│ │
│ ├── Enterprise AI Solutions
│ ├── AI Agents & Intelligent Automation
│ ├── Healthcare AI Platforms
│ ├── Predictive Analytics Solutions
│ ├── Business Intelligence Solutions
│ ├── Custom Software Solutions
│ └── AI-Powered Digital Products
│
│
├── Industries
│ │
│ ├── Healthcare & Life Sciences
│ ├── Banking & Financial Services
│ ├── Manufacturing
│ ├── Retail & E-Commerce
│ ├── Education Technology
│ └── Enterprise Technology
│
│
├── Research & Innovation
│ │
│ ├── AI Research Lab
│ │ ├── Research Areas
│ │ ├── AI Experiments
│ │ ├── Research Projects
│ │ └── AI Prototypes
│ │
│ ├── Publications
│ │ ├── Research Papers
│ │ ├── Conference Papers
│ │ └── Technical Publications
│ │
│ ├── Open Source Contributions
│ │
│ ├── Academic Collaborations
│ │
│ └── Innovation Programs
│
│
├── Insights
│ │
│ ├── Case Studies
│ │ ├── AI Implementation Stories
│ │ ├── Healthcare AI Projects
│ │ └── Business Transformation Stories
│ │
│ ├── Blogs
│ │
│ ├── White Papers
│ │
│ ├── Industry Insights
│ │
│ ├── Reports & Research Briefs
│ │
│ ├── News & Announcements
│ │
│ ├── Events & Webinars
│ │
│ └── Resources
│ ├── Downloads
│ ├── FAQs
│ ├── Brochures
│ └── Technical Documents
│
│
├── Careers
│ │
│ ├── Life at XELARVIS
│ ├── Open Positions
│ ├── Internship Programs
│ ├── Graduate Programs
│ ├── Hiring Process
│ └── Apply Now
│
│
├── Collaborations
│ │
│ ├── Research Collaborations
│ ├── University Partnerships
│ ├── Industry Collaborations
│ └── Technology Ecosystem
│
│
└── Contact
│
├── Business Enquiry
├── Research Collaboration
├── Career Enquiry
└── General Contact

# **Top Navigation (Main Menu)**

Home
About
Services
Solutions
Industries
Research & Innovation
Insights
Careers
Contact

# Company Overview

Hero Heading

**Engineering Intelligent Solutions for Healthcare, AI, and Digital Transformation**

XELARVIS PRIVATE LIMITED is an IT Consulting and Artificial Intelligence Research company delivering innovative solutions in AI, Machine Learning, Data Science, Healthcare Analytics, Clinical Data Science, Cloud Technologies, and Enterprise Software Development. We help organizations transform data into intelligence, accelerate innovation, and build scalable digital solutions

## 1. About the Company

**XELARVIS PRIVATE LIMITED** is an **IT Consulting and Artificial Intelligence Research Company** specializing in Healthcare AI, Clinical Data Science, Machine Learning, Data Science, Advanced Analytics, and Enterprise Software Solutions.

We help organizations transform complex data into intelligent solutions through innovative technologies, research-driven methodologies, and scalable digital platforms.

Our mission is to bridge the gap between healthcare, artificial intelligence, and enterprise technology by delivering reliable, secure, and future-ready solutions

# Section 3 – Our Core Services

### Artificial Intelligence & AI Research

Develop intelligent systems using machine learning, generative AI, computer vision, NLP, and AI agents.

**Learn More**

---

### 📊 Data Science & Advanced Analytics

Transform data into actionable insights with predictive analytics, business intelligence, statistical modeling, and visualization.

**Learn More**

---

### 💼 IT Consulting & Digital Transformation

Modernize business operations through technology consulting, software engineering, cloud adoption, and automation.

**Learn More**

---

### 🏥 Clinical Data Science & Healthcare AI

Support healthcare innovation through Clinical SAS Programming, CDISC standards, healthcare analytics, and AI-powered research solutions.

**Learn More**

---

### ☁️ Data Engineering & Cloud Solutions

Design scalable cloud platforms, data pipelines, AI infrastructure, and enterprise data architectures

# 1. Artificial Intelligence & AI Research

## Engineering Intelligent Solutions Through Artificial Intelligence

Artificial Intelligence is transforming the way organizations operate, make decisions, and deliver services. At **XELARVIS PRIVATE LIMITED**, we combine AI research with practical engineering to develop intelligent, scalable, and business-focused solutions.

Our AI team works closely with clients to understand their business challenges, identify opportunities for automation and intelligence, and build AI-powered applications that improve efficiency, reduce operational costs, and create measurable business value.

---

## Our AI Development Process

### Step 1 – Business Discovery & AI Strategy

Every AI project begins with understanding the client's objectives, existing systems, data availability, and business challenges. We assess whether AI is the right solution and define a roadmap aligned with the organization's goals.

**Activities**

- Business requirement analysis
- AI opportunity assessment
- Technical feasibility study
- Data readiness evaluation
- AI solution roadmap

---

### Step 2 – Data Collection & Preparation

The quality of AI depends on the quality of data. We collect, integrate, clean, and prepare structured and unstructured datasets to create a reliable foundation for model development.

**Activities**

- Data acquisition
- Data integration
- Data cleaning
- Feature engineering
- Data labeling
- Data validation

---

### Step 3 – AI Model Research & Development

Our AI specialists research, design, and develop machine learning and deep learning models tailored to the client's requirements.

Depending on the business problem, we develop:

- Predictive Models
- Recommendation Systems
- Computer Vision Models
- NLP Applications
- Generative AI Solutions
- AI Agents
- Decision Support Systems

---

### Step 4 – Model Training & Optimization

The selected AI models are trained using historical and real-time data. Multiple algorithms are evaluated to identify the most accurate and efficient solution.

Activities include:

- Model training
- Hyperparameter tuning
- Performance optimization
- Explainability analysis
- Bias evaluation

---

### Step 5 – AI Solution Development

The trained models are integrated into business applications, dashboards, APIs, mobile applications, or enterprise platforms to deliver practical business solutions.

Examples include:

- AI Chatbots
- Intelligent Search
- Medical AI Applications
- AI-powered Automation
- Document Intelligence
- AI Recommendation Engines

---

### Step 6 – Testing & Quality Assurance

Every AI solution undergoes extensive testing to ensure accuracy, reliability, scalability, and security before deployment.

---

### Step 7 – Deployment & Continuous Improvement

We deploy AI solutions in cloud or on-premises environments and continuously monitor performance to improve accuracy and adapt to changing business needs.

---

## AI Services

- Artificial Intelligence Consulting
- AI Strategy Development
- Machine Learning Solutions
- Deep Learning Solutions
- Generative AI Applications
- AI Agents
- Natural Language Processing
- Computer Vision
- Intelligent Automation
- AI Research & Innovation

---

## Technologies

Python • TensorFlow • PyTorch • OpenAI • Hugging Face • LangChain • LlamaIndex • ONNX

---

# 2. Data Science & Advanced Analytics

## Transforming Data into Strategic Business Intelligence

Data is one of the most valuable assets for any organization. XELARVIS helps businesses convert raw data into meaningful insights that improve decision-making, optimize operations, and uncover growth opportunities.

---

## Our Data Science Delivery Process

### Step 1 – Business Understanding

We identify business objectives, key performance indicators (KPIs), and analytical requirements.

---

### Step 2 – Data Assessment

We evaluate data quality, completeness, and availability from multiple sources.

---

### Step 3 – Data Engineering

We prepare and transform data into an analysis-ready format.

---

### Step 4 – Statistical Analysis

We apply statistical methods to discover patterns, trends, and relationships within the data.

---

### Step 5 – Machine Learning & Predictive Analytics

We develop predictive models that forecast future outcomes and support data-driven decisions.

---

### Step 6 – Visualization & Reporting

We build interactive dashboards and executive reports that present insights clearly.

---

### Step 7 – Business Recommendations

We translate analytical findings into practical recommendations for business improvement.

---

## Services

- Data Science Consulting
- Predictive Analytics
- Statistical Analysis
- Business Intelligence
- Dashboard Development
- Exploratory Data Analysis
- Forecasting
- Customer Analytics
- Risk Analytics
- Healthcare Analytics

---

## Technologies

Python • R • SQL • Power BI • Tableau • Apache Spark

---

# 3. IT Consulting & Digital Transformation

## Enabling Business Transformation Through Technology

Technology is at the core of modern business. XELARVIS provides consulting services that help organizations modernize infrastructure, improve operational efficiency, and implement innovative digital solutions.

---

## Our Consulting Process

### Step 1 – Business Assessment

Understand business processes and identify technology challenges.

---

### Step 2 – Solution Architecture

Design scalable, secure, and future-ready technology solutions.

---

### Step 3 – Technology Selection

Recommend the most suitable technologies, frameworks, cloud platforms, and tools.

---

### Step 4 – Software Development

Develop enterprise applications, web platforms, APIs, and cloud solutions.

---

### Step 5 – Integration

Integrate applications with existing business systems.

---

### Step 6 – Quality Assurance

Conduct functional, performance, security, and user acceptance testing.

---

### Step 7 – Deployment & Support

Deploy solutions and provide ongoing maintenance, enhancements, and technical support.

---

## Services

- IT Consulting
- Technology Strategy
- Digital Transformation
- Enterprise Software Development
- Web Applications
- API Development
- Cloud Migration
- Process Automation
- System Integration
- Software Modernization

---

## Technologies

Java • Python • React • Node.js • .NET • Docker • Kubernetes • AWS • Azure

---

# 4. Clinical Data Science & Healthcare AI

## Accelerating Healthcare Innovation Through Data, Analytics & Artificial Intelligence

XELARVIS combines expertise in clinical research, statistical programming, artificial intelligence, and healthcare analytics to support pharmaceutical companies, biotechnology organizations, CROs, hospitals, and healthcare innovators.

Our solutions enable organizations to manage clinical data efficiently, comply with industry standards, generate regulatory-ready outputs, and apply AI to improve research and healthcare outcomes.

---

## Our Healthcare Project Delivery Process

### Step 1 – Clinical Study Assessment

We review the clinical protocol, Statistical Analysis Plan (SAP), data standards, and regulatory requirements to define the project scope.

---

### Step 2 – Clinical Data Acquisition & Standardization

Clinical data is collected from Electronic Data Capture (EDC) systems, laboratory systems, and other validated sources. The data is cleaned, validated, and standardized using CDISC standards such as SDTM and ADaM.

---

### Step 3 – Statistical Programming & Clinical Analytics

Our team develops validated clinical datasets, performs statistical programming, and generates Tables, Listings, and Figures (TLFs) to support clinical study reporting and regulatory submissions.

---

### Step 4 – Healthcare AI & Advanced Analytics

Where appropriate, we apply AI and machine learning to enhance healthcare insights. Solutions include predictive models, medical document analysis, Natural Language Processing (NLP), patient risk assessment, and Real-World Evidence (RWE) analytics.

---

### Step 5 – Quality Control & Validation

Independent quality control is performed to verify data integrity, programming accuracy, and compliance with applicable industry standards and project requirements.

---

### Step 6 – Regulatory & Business Deliverables

We prepare validated outputs, reports, dashboards, and analytical solutions that support research teams, healthcare organizations, and decision-makers.

---

### Step 7 – Continuous Support & Innovation

After project delivery, we provide maintenance, enhancements, and consulting to help clients adopt emerging technologies and continuously improve their clinical and healthcare analytics capabilities.

---

## Services

### Clinical Statistical Programming

- SAS Programming
- SDTM Development
- ADaM Development
- TLF Programming
- Define.xml Support
- QC Programming
- SAS Automation

### Clinical Data Analytics

- Clinical Data Visualization
- Real-World Evidence (RWE) Analytics
- Patient Analytics
- Clinical Trial Dashboards
- Healthcare Reporting

### Healthcare AI Solutions

- Medical Natural Language Processing (NLP)
- Clinical Document Intelligence
- Healthcare Predictive Analytics
- AI-Assisted Research Solutions
- Intelligent Clinical Decision Support

---

## Technologies

SAS • SAS Viya • Python • R • SQL • CDISC Standards • Pinnacle 21 • Power BI • Tableau • TensorFlow • PyTorch • OpenAI Technologies

---

# 5. Data Engineering & Cloud Solutions

## Building the Foundation for Data-Driven Enterprises

Modern organizations require scalable and secure data platforms to support analytics, AI, and business operations. XELARVIS designs and implements cloud-native data architectures that enable organizations to collect, process, store, and analyze data efficiently.

---

## Our Delivery Process

### Step 1 – Data Architecture Assessment

Evaluate existing systems, data sources, and business requirements.

---

### Step 2 – Data Platform Design

Design modern data lakes, warehouses, and scalable data architectures.

---

### Step 3 – Data Pipeline Development

Build automated ETL/ELT pipelines for reliable data movement and transformation.

---

### Step 4 – Cloud Implementation

Deploy secure and scalable cloud infrastructure for data storage, analytics, and AI workloads.

---

### Step 5 – MLOps & AI Infrastructure

Implement CI/CD pipelines, model deployment, monitoring, and governance for machine learning solutions.

---

### Step 6 – Security & Governance

Apply data governance, access controls, encryption, backup strategies, and monitoring to protect enterprise data.

---

### Step 7 – Managed Services

Provide ongoing monitoring, optimization, maintenance, and support to ensure long-term reliability and performance.

---

## Services

- Data Engineering
- ETL/ELT Development
- Data Warehousing
- Cloud Migration
- Data Lakes
- MLOps
- Cloud-Native Applications
- Data Governance
- Data Security
- Managed Cloud Services

---

# PROCESS OF SERVICE 4

# Clinical Data Science & Healthcare AI

## Transforming Clinical Data into Intelligent Healthcare Solutions

Clinical research generates vast amounts of complex data that must be standardized, validated, analyzed, and reported in compliance with global regulatory standards. XELARVIS combines Clinical Data Science, Statistical Programming, Artificial Intelligence, and Healthcare Analytics to help life sciences organizations accelerate clinical development and improve research outcomes.

We support pharmaceutical companies, biotechnology firms, contract research organizations (CROs), healthcare providers, and medical research institutions by delivering secure, scalable, and high-quality clinical data solutions.

---

# Business Challenges

Healthcare organizations commonly face challenges such as:

- Managing large volumes of clinical trial data
- Meeting regulatory submission requirements
- Maintaining data quality and consistency
- Reducing manual programming effort
- Accelerating clinical study timelines
- Generating accurate statistical reports
- Leveraging AI for healthcare insights
- Extracting information from unstructured medical documents
- Improving patient outcome analysis

XELARVIS addresses these challenges through standardized programming practices, intelligent automation, and AI-powered analytics.

---

# Our Project Delivery Methodology

## Phase 1 — Clinical Study Assessment

We begin by understanding the client's research objectives, clinical protocol, Statistical Analysis Plan (SAP), regulatory requirements, and data standards.

### Activities

- Requirement Gathering
- Protocol Review
- SAP Review
- CDISC Standards Assessment
- Risk Analysis
- Project Planning

### Deliverables

- Project Plan
- Technical Architecture
- Timeline
- Resource Plan

---

## Phase 2 — Clinical Data Management

Clinical data is collected from validated healthcare systems and prepared for downstream analysis.

### Activities

- Data Collection
- Data Cleaning
- Data Validation
- Missing Data Review
- Duplicate Detection
- Data Transformation

### Tools

- SAS
- SQL
- Python
- R

### Deliverables

- Clean Clinical Dataset
- Data Validation Report

---

## Phase 3 — Clinical Data Standardization

We convert raw datasets into internationally accepted CDISC standards.

### Services

#### SDTM Development

Organizing clinical trial data into standardized submission domains.

Examples:

- DM
- AE
- CM
- LB
- VS
- EX

#### ADaM Development

Creating analysis-ready datasets for statistical analysis.

Examples:

- ADSL
- ADAE
- ADLB
- ADVS

### Tools

- SAS
- Pinnacle 21
- CDISC Library

### Deliverables

- SDTM Package
- ADaM Package
- Define.xml
- Validation Reports

---

## Phase 4 — Statistical Programming

Develop statistical outputs that support clinical reporting and regulatory submissions.

### Services

- TLF Programming
- CSR Outputs
- Safety Reports
- Efficacy Reports
- Interim Analysis
- QC Programming

### Tools

- SAS
- SAS Macro
- PROC REPORT
- PROC SQL

### Deliverables

- Tables
- Listings
- Figures
- Statistical Reports

---

## Phase 5 — Healthcare AI & Advanced Analytics

This phase transforms clinical data into predictive intelligence.

### AI Solutions

#### Healthcare Predictive Analytics

Examples:

- Disease Risk Prediction
- Patient Outcome Prediction
- Readmission Prediction

#### Medical NLP

Examples:

- Medical Report Analysis
- Clinical Note Processing
- Research Paper Summarization

#### Clinical Document Intelligence

Examples:

- Protocol Analysis
- Trial Document Search
- Information Extraction

#### AI Research

Examples:

- Healthcare LLM Applications
- Clinical AI Assistants
- Research Automation

### Tools

- Python
- TensorFlow
- PyTorch
- Hugging Face
- LangChain
- OpenAI Models

### Deliverables

- AI Models
- Dashboards
- Prediction Reports
- Research Platforms

---

## Phase 6 — Quality Assurance & Validation

Every solution undergoes independent verification before delivery.

### Activities

- QC Programming
- Code Review
- Dataset Validation
- AI Model Evaluation
- Security Review
- Performance Testing

### Deliverables

- Validation Report
- QC Documentation
- Test Report

---

## Phase 7 — Deployment & Support

Solutions are deployed securely and monitored continuously.

### Services

- Cloud Deployment
- API Integration
- Dashboard Publishing
- User Training
- Maintenance
- Performance Monitoring

### Deliverables

- Production Deployment
- User Documentation
- Technical Documentation
- Support Plan

---

# Technology Stack

## Clinical Technologies

- SAS 9.4
- SAS Viya
- SAS Studio
- SAS Enterprise Guide
- CDISC SDTM
- CDISC ADaM
- Pinnacle 21

---

## Data Science

- Python
- R
- SQL
- Jupyter Notebook
- RStudio

---

## Artificial Intelligence

- TensorFlow
- PyTorch
- Scikit-learn
- Hugging Face
- LangChain
- OpenAI APIs

---

## Business Intelligence

- Power BI
- Tableau
- R Shiny
- Plotly

---

## Cloud

- AWS
- Azure
- Google Cloud
- Databricks
- Snowflake

---

# What Clients Receive

After project completion, clients receive:

- Standardized clinical datasets
- Regulatory-ready deliverables
- Statistical reports
- AI-powered analytics
- Interactive dashboards
- Technical documentation
- Source code (if agreed)
- Validation documentation
- Deployment support
- Post-implementation maintenance

---

# Industries We Serve

- Pharmaceutical Companies
- Biotechnology Companies
- Contract Research Organizations (CROs)
- Hospitals
- Healthcare Providers
- Medical Device Companies
- Universities
- Research Institutions
- Public Health Organizations

## Technologies

Apache Spark • Apache Kafka • Apache Airflow • Snowflake • Databricks • AWS • Microsoft Azure • Google Cloud Platform • Docker • Kubernetes

# Section 4 – Industries We Serve

### Healthcare & Life Sciences

Clinical research, pharmaceutical, biotechnology, medical devices, hospitals.

### Banking & Finance

Risk analytics, fraud detection, automation.

### Retail & E-commerce

Customer intelligence, forecasting, recommendation systems.

### Manufacturing

Predictive maintenance, quality analytics.

### Logistics

Supply chain analytics and optimization.

### Technology & Startups

AI product development and digital transformation.

# CAREER PAGE - TAB

Careers
│
├── Why Join XELARVIS
├── Life at XELARVIS
├── Hiring Process
├── Open Positions
├── Internship Program
├── Research Opportunities
├── Employee Benefits
└── Apply Now

# 1. Careers Landing Page

## Hero Section

**Build the Future with AI, Healthcare, and Technology**

Join XELARVIS and work on innovative projects in Artificial Intelligence, Clinical Data Science, Healthcare Analytics, Enterprise Software, and Cloud Technologies.

**Buttons**

- View Open Positions
- Join Our Talent Network

---

# Why Join XELARVIS

- Work on AI and Healthcare projects
- Research-driven environment
- Learning and certification support
- Flexible work opportunities
- Global collaboration
- Career growth and mentorship
- Modern technologies
- Inclusive workplace

---

# Hiring Process

Display this as a timeline.

### Step 1

Application Submission

↓

### Step 2

Application Review

↓

### Step 3

HR Screening

↓

### Step 4

Technical Assessment (if required)

↓

### Step 5

Technical Interview

↓

### Step 6

Manager/Final Interview

↓

### Step 7

Offer & Background Verification

↓

### Step 8

Onboarding

Each step should include a brief explanation so applicants know what to expect.

---

# Open Positions

Every vacancy should be created and managed by **HR or an Administrator** from the admin dashboard.

Each job card should display:

- Job Title
- Department
- Employment Type
- Location
- Experience Required
- Work Mode (On-site / Hybrid / Remote)
- Posted Date
- Application Deadline
- Number of Openings

Example:

---

## AI Engineer

Department

Artificial Intelligence

Experience

2–5 Years

Employment Type

Full-Time

Location

Hyderabad / Remote

---

Button

**View Details**

---

# Job Details Page

Each position should include:

## About the Role

Overview of responsibilities and objectives.

---

## Responsibilities

Examples:

- Design AI models
- Develop APIs
- Train ML models
- Deploy solutions
- Collaborate with clients

---

## Required Skills

Examples:

- Python
- Machine Learning
- SQL
- Cloud Platforms
- Git

---

## Preferred Skills

Examples:

- TensorFlow
- LangChain
- Azure AI
- Docker

---

## Qualifications

Bachelor's or Master's degree in Computer Science, Data Science, AI, Statistics, or related field (adjust per role).

---

## Benefits

- Flexible work
- Learning budget
- Paid leave
- Health benefits (if applicable)
- Research opportunities

---

Button

**Apply for this Position**

---

# Application Form

Keep it straightforward but complete.

### Personal Information

- First Name *
- Last Name *
- Email Address *
- Mobile Number *
- Country *
- Current City *

---

### Professional Information

- LinkedIn Profile (optional)
- Portfolio / GitHub (optional)
- Current Company (optional)
- Current Designation
- Total Experience
- Relevant Experience
- Current Salary (optional)
- Expected Salary (optional)
- Notice Period
- Work Authorization / Visa Status (if relevant)

---

### Education

- Highest Qualification
- University
- Graduation Year

---

### Skills

Multi-select or tags.

Examples:

- Python
- SAS
- R
- Java
- SQL
- AI
- Machine Learning
- Azure
- AWS

---

### Resume Upload

Accept:

- PDF
- DOC
- DOCX

Maximum size (e.g., 5–10 MB).

---

### Cover Letter

Optional.

---

### Additional Questions

- Why do you want to join XELARVIS?
- Are you willing to relocate?
- Earliest joining date
- Have you worked in healthcare or clinical research before?

---

### Consent

Checkbox confirming the candidate agrees to the processing of their application data according to the Privacy Policy.

---

Button

**Submit Application**

---

# Candidate Confirmation

After submission:

> Thank you for applying to XELARVIS. Your application has been received successfully. Our recruitment team will review your profile and contact you if your qualifications match our current requirements.

Provide a reference number, for example:

**Application ID:** XEL-2026-000123

---

# Admin / HR Recruitment Dashboard

Only Admin or HR users should access this area.

## Dashboard Features

### Job Management

- Create Job
- Edit Job
- Publish / Unpublish
- Archive Job
- Duplicate Job

---

### Candidate Management

For each application:

- Candidate Name
- Job Applied
- Email
- Phone
- Resume Download
- Cover Letter
- Skills
- Experience
- Application Date
- Current Status

Statuses:

- New
- Under Review
- Shortlisted
- Interview Scheduled
- Technical Assessment
- Final Interview
- Offered
- Hired
- Rejected
- Withdrawn

---

### Search & Filters

Filter by:

- Department
- Job Title
- Status
- Experience
- Location
- Date Applied

---

### Candidate Profile

Clicking a candidate opens:

- Personal Details
- Resume
- Cover Letter
- Skills
- Education
- Work Experience
- Interview Notes
- Recruiter Comments
- Attachments

---

### Interview Scheduling

HR should be able to:

- Schedule interviews
- Assign interviewers
- Select interview type (Online / On-site)
- Add meeting link
- Send invitation email
- Reschedule if needed

---

### Email Templates

Examples:

- Application Received
- Shortlisted
- Interview Invitation
- Assessment Request
- Offer Letter
- Rejection
- Position Closed

---

# User Roles

## Super Admin

- Manage users and permissions
- Configure careers module
- View all jobs and applications
- Reports and analytics

---

## HR Manager

- Create and publish jobs
- Review applications
- Schedule interviews
- Update candidate status
- Send emails

---

## Hiring Manager

- View assigned candidates
- Add interview feedback
- Recommend hiring decisions

---

# Future Enhancements

As XELARVIS grows, you could add:

- Employee referral portal
- Campus recruitment module
- Internship applications
- AI-powered resume screening
- Skills matching and ranking
- Talent pool database
- Offer letter generation
- Onboarding checklist and document collection
- Recruitment analytics dashboard
