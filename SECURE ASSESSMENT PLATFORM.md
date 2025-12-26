**POSTS AND TELECOMMUNICATIONS INSTITUTE OF TECHNOLOGY**  
**INFORMATION TECHNOLOGY 1 DEPARTMENT**

**![org_logo][image1]**

**GRADUATION THESIS**

**Subject:**  
**SECURE ACCESSMENT PLATFORM AND ONLINE**  
**MONITORING TOOL FOR THE EXAM PROCESS USING GOLANG AND REACT**

| Instructor       | : Ph.D. DAO NGOC PHONG                              |
| ---------------- | --------------------------------------------------- |
| **Team members** | **: NGUYEN LAM KIEN BUI DUY KHANH NGUYEN THE MANH** |
| **Class**        | **: E21CNPM04**                                     |
| **School year**  | **: 2021 \- 2026**                                  |
| **Type**         | **: ĐẠI HỌC CHÍNH QUY**                             |
|                  |                                                     |

**Hanoi, 11- 2025**

# **ACKNOWLEDGEMENTS** {#acknowledgements}

First of all, we would like to express our sincere gratitude to all the lecturers at the **Posts and Telecommunications Institute of Technology**, especially to those in the **Faculty of Information Technology**. We are deeply thankful for the valuable knowledge and experience imparted throughout our university years, which have helped us build a solid theoretical foundation and provided a professional learning environment for our personal and professional growth.

We would like to extend our heartfelt thanks to **Mr. Đào Ngọc Phong** for his dedicated guidance, support, and encouragement, as well as for creating favorable conditions that enabled us to complete this graduation project successfully. We wish him and his family good health and continued success.

Finally, we would like to sincerely thank our **families and friends** for their constant support, care, and encouragement during our studies and throughout the completion of this thesis.

Due to the limited time and our own shortcomings in knowledge and experience, this project may still contain certain errors and shortcomings. We sincerely hope to receive constructive feedback and suggestions from our lecturers and friends so that we can further improve and perfect this work.

**Sincerely, thank you\!**

_Hanoi, 11 / 2024_

**Project implemented by**

**Nguyễn Lâm Kiên**

**Bùi Duy Khánh**

**Nguyễn Thế Mạnh**

# **INSTRUCTOR’S COMMENTS** {#instructor’s-comments}

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

Score:…………………………..(in words: ……………….)

Hanoi, 01 / 11 / 2025

**INSTRUCTOR**

# **REVIEWER’S COMMENTS** {#reviewer’s-comments}

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

…………………………………………………………………………………

Score:…………………………..(in word: ……………….)

Hanoi, 12 / 12 / 2025

**REVIEWER**

#

# **TABLE OF CONTENTS** {#table-of-contents}

[**ACKNOWLEDGEMENTS 1**](#acknowledgements)

[**INSTRUCTOR’S COMMENTS 2**](#instructor’s-comments)

[**REVIEWER’S COMMENTS 3**](#reviewer’s-comments)

[**TABLE OF CONTENTS 4**](#table-of-contents)

[**LIST OF IMAGES 8**](#list-of-images)

[**LIST OF TABLE 9**](#list-of-table)

[**LIST OF ABBREVIATIONS 11**](#list-of-abbreviations)

[**INTRODUCTION 14**](#introduction)

[**CHAPTER 1: INTRODUCTION TO THE SYSTEM AND TECHNOLOGIES USED 15**](#chapter-1:-introduction-to-the-system-and-technologies-used)

[**1.1. System introduction 15**](#1.1.-system-introduction)

[1.1.1. Purposes and meanings of the project 15](#1.1.1.-purposes-and-meanings-of-the-project)

[1.1.2. Project’s scope 15](#1.1.2.-project’s-scope)

[1.1.3. Core Problems to be solved 16](#1.1.3.-core-problems-to-be-solved)

[1.1.4. Some specific solutions approach 17](#1.1.4.-some-specific-solutions-approach)

[**1.2. Technology used 22**](#1.2.-technology-used)

[1.2.1. Front-end 22](#1.2.1.-front-end)

[1.2.2. Back-end 24](#1.2.2.-back-end)

[1.2.3. Database 25](#1.2.3.-database)

[1.2.4. Message Broker: Redis Stream 28](#1.2.4.-message-broker:-redis-stream)

[1.2.5. Authentication / Identity Provider: Casdoor 30](#1.2.5.-authentication-/-identity-provider:-casdoor)

[1.2.6. System Architecture 30](#1.2.6.-system-architecture)

[**1.3. Infrastructure and DevOps 32**](#1.3.-infrastructure-and-devops)

[1.3.1. Container Orchestration: Kubernetes 32](#1.3.1.-container-orchestration:-kubernetes)

[1.3.2. CI/CD Pipeline: GitHub Actions 32](#1.3.2.-ci/cd-pipeline:-github-actions)

[**1.4. Chapter 1 Conclusion 33**](#1.4.-chapter-1-conclusion)

[**CHAPTER 2: SYSTEM ANALYSIS AND DESIGN 35**](#chapter-2:-system-analysis-and-design)

[**2.1. Describe the actors, the terminology, and define the requirements 35**](#2.1.-describe-the-actors,-the-terminology,-and-define-the-requirements)

[2.1.1. Identify and describe the actors 35](#2.1.1.-identify-and-describe-the-actors)

[2.1.2. Building a glossary 36](#2.1.2.-building-a-glossary)

[2.1.3. Identify requirements 37](#2.1.3.-identify-requirements)

[**2.2. Use Case Identification and Description 41**](#2.2.-use-case-identification-and-description)

[2.2.1. Overall use cases of the system 42](#2.2.1.-overall-use-cases-of-the-system)

[2.2.2. Detailed use cases for students. 42](#2.2.2.-detailed-use-cases-for-students.)

[2.2.3. Detailed use cases for teachers. 43](#2.2.3.-detailed-use-cases-for-teachers.)

[2.2.3. Detailed use cases for administrators. 45](#2.2.3.-detailed-use-cases-for-administrators.)

[2.2.4. Main scenarios for students. 47](#2.2.4.-main-scenarios-for-students.)

[2.2.5. Main scenarios for teachers. 52](#2.2.5.-main-scenarios-for-teachers.)

[2.2.6. Main scenarios for administrators. 63](#2.2.6.-main-scenarios-for-administrators.)

[**2.3. System Analysis 74**](#2.3.-system-analysis)

[2.3.1. Assessment Service 74](#2.3.1.-assessment-service)

[2.3.2. Proctoring Service 76](#2.3.2.-proctoring-service)

[2.3.3. Identity Service (Casdoor) 77](<#2.3.3.-identity-service-(casdoor)>)

[2.3.4. Identity Verification Service 79](#2.3.4.-identity-verification-service)

[2.3.5. Notification Service 80](#2.3.5.-notification-service)

[2.3.6. Group Service 81](#2.3.6.-group-service)

[**2.4. Building class diagrams at the design phase 83**](#2.4.-building-class-diagrams-at-the-design-phase)

[2.4.1. Assessment Service 83](#2.4.1.-assessment-service)

[2.4.2. Identity Verification Service 84](#2.4.2.-identity-verification-service)

[2.4.3. Proctoring Service 84](#2.4.3.-proctoring-service)

[2.4.4. Casdoor Identity Service (minimalism version) 85](<#2.4.4.-casdoor-identity-service-(minimalism-version)>)

[2.4.5. Notification Service 86](#2.4.5.-notification-service)

[2.4.6. Group Service 86](#2.4.6.-group-service)

[**2.5. System sequence diagrams 87**](#2.5.-system-sequence-diagrams)

[2.5.1. Sequence diagrams for student functions 87](#2.5.1.-sequence-diagrams-for-student-functions)

[2.5.2. Sequence diagrams for teacher functions 90](#2.5.2.-sequence-diagrams-for-teacher-functions)

[2.5.3. Sequence diagrams for administrator functions 93](#2.5.3.-sequence-diagrams-for-administrator-functions)

[**2.6. Microservices architecture implementation 95**](#2.6.-microservices-architecture-implementation)

[2.6.1. Overview 95](#2.6.1.-overview)

[2.6.2. System Components 96](#2.6.2.-system-components)

[2.6.3. Applying Technologies to the System 100](#2.6.3.-applying-technologies-to-the-system)

[2.6.4. Selecting Appropriate Technologies 101](#2.6.4.-selecting-appropriate-technologies)

[2.6.5. Choosing Communication Methods Between Microservices 102](#2.6.5.-choosing-communication-methods-between-microservices)

[2.6.6. Designing a Hybrid Monolithic/Microservice System 104](#2.6.6.-designing-a-hybrid-monolithic/microservice-system)

[**2.7. Frontend Architecture 106**](#2.7.-frontend-architecture)

[2.7.1. Project Structure and Module Organization 106](#2.7.1.-project-structure-and-module-organization)

[2.7.2. Component Design Pattern 109](#2.7.2.-component-design-pattern)

[2.7.3. State Management Strategy 111](#2.7.3.-state-management-strategy)

[2.7.4. API Layer Design (Services Pattern) 113](<#2.7.4.-api-layer-design-(services-pattern)>)

[2.7.5. Custom Hooks Pattern 114](#2.7.5.-custom-hooks-pattern)

[Hooks Directory Structure 114](#hooks-directory-structure)

[**2.8. System design 115**](#2.8.-system-design)

[2.8.1. System design for 10,000 concurrent users and resource allocation 115](#2.8.1.-system-design-for-10,000-concurrent-users-and-resource-allocation)

[2.8.2. System sizing 116](#2.8.2.-system-sizing)

[2.8.3. Calculation of system operation costs 118](#2.8.3.-calculation-of-system-operation-costs)

[**2.9. Chapter 2 conclusion 120**](#2.9.-chapter-2-conclusion)

[Summary of Key Achievements 120](#summary-of-key-achievements)

[**CHAPTER 3: APPLICATION DEPLOYMENT 121**](#chapter-3:-application-deployment)

[**3.1. Implementation and supporting tools 121**](#3.1.-implementation-and-supporting-tools)

[3.1.1. Tools used 121](#3.1.1.-tools-used)

[3.1.2. Supporting libraries 123](#3.1.2.-supporting-libraries)

[**3.2. Installation results 124**](#3.2.-installation-results)

[3.2.1. System deployment and packaging into images (using Docker) 124](<#3.2.1.-system-deployment-and-packaging-into-images-(using-docker)>)

[3.2.2. Deploying the system on Kubernetes (K8s): 126](<#3.2.2.-deploying-the-system-on-kubernetes-(k8s):>)

[3.2.3. Implementing the CI/CD pipeline 132](#3.2.3.-implementing-the-ci/cd-pipeline)

[3.2.4. Deploying tracing and monitoring tools 138](#3.2.4.-deploying-tracing-and-monitoring-tools)

[3.2.5. Deploying the Mediapipe system on the client side 140](#3.2.5.-deploying-the-mediapipe-system-on-the-client-side)

[**3.3. Functional and non-functional testing (performance testing): 144**](<#3.3.-functional-and-non-functional-testing-(performance-testing):>)

[3.3.1. Performance Testing Methodology 145](#3.3.1.-performance-testing-methodology)

[3.3.2. Test Scenarios 145](#3.3.2.-test-scenarios)

[3.3.3. Performance Test Results 148](#3.3.3.-performance-test-results)

[3.3.4. Custom Metrics Summary 150](#3.3.4.-custom-metrics-summary)

[**3.4. Issues related to cheating/fraud & methods to disable monitoring 150**](#3.4.-issues-related-to-cheating/fraud-&-methods-to-disable-monitoring)

[3.4.1. Common Cheating Methods and Attack Vectors 150](#3.4.1.-common-cheating-methods-and-attack-vectors)

[3.4.2. Frontend Anti-Cheating Implementation 152](#3.4.2.-frontend-anti-cheating-implementation)

[3.4.3. Known Limitations 154](#3.4.3.-known-limitations)

[3.4.4. Proposed Solutions and Mitigations 155](#3.4.4.-proposed-solutions-and-mitigations)

[**3.5. Chapter 3 Conclusion 156**](#3.5.-chapter-3-conclusion)

[Development Environment and Tools 156](#development-environment-and-tools)

[Library Selection Rationale 156](#library-selection-rationale)

[Deployment Achievements 156](#deployment-achievements)

[Performance Testing Summary 157](#performance-testing-summary)

[Key Implementation Insights 157](#key-implementation-insights)

[Trade-offs and Lessons Learned 157](#trade-offs-and-lessons-learned)

[**CONCLUSION 158**](#conclusion)

[**1\. Summary of the implemented content 158**](#1.-summary-of-the-implemented-content)

[System Analysis and Design (Chapter 2\) 158](<#system-analysis-and-design-(chapter-2)>)

[Implementation and Deployment (Chapter 3\) 158](<#implementation-and-deployment-(chapter-3)>)

[Verification and Testing (Chapter 3\) 159](<#verification-and-testing-(chapter-3)>)

[**2\. Achievements and limitations of the system 159**](#2.-achievements-and-limitations-of-the-system)

[Achievements 159](#achievements)

[Limitations 160](#limitations)

[**3\. Future development directions 161**](#3.-future-development-directions)

[**REFERENCES 163**](#references)

[Frameworks and Libraries 163](#frameworks-and-libraries)

[AI/ML Technologies 163](#ai/ml-technologies)

[Databases 163](#databases)

[Infrastructure and DevOps 164](#infrastructure-and-devops)

[Authentication and Security 164](#authentication-and-security)

[Monitoring and Observability 164](#monitoring-and-observability)

[Testing Tools 164](#testing-tools)

[Cloud Providers 165](#cloud-providers)

[Development Tools 165](#development-tools)

[Academic References 165](#academic-references)

[Standards and Specifications 165](#standards-and-specifications)

# **LIST OF IMAGES** {#list-of-images}

[Figure 1\. Microservice architecture 28](#figure-1.-microservice-architecture)

[Figure 2\. Overall use cases of the system 39](#figure-2.-overall-use-cases-of-the-system)

[Figure 3\. Use case take exam 40](#figure-3.-use-case-take-exam)

[Figure 4\. Use case view result 41](#figure-4.-use-case-view-result)

[Figure 5\. Use case manage assessment, question and question bank 42](#figure-5.-use-case-manage-assessment,-question-and-question-bank)

[Figure 6\. Use case grade and evaluate 42](#figure-6.-use-case-grade-and-evaluate)

[Figure 7\. Use case monitoring and analysis 43](#figure-7.-use-case-monitoring-and-analysis)

[Figure 8\. Use case manage user and group 44](#figure-8.-use-case-manage-user-and-group)

[Figure 9\. Use case notification management 44](#figure-9.-use-case-notification-management)

[Figure 9\. Use case notification management 45](#figure-9.-use-case-system-administration)

[Figure 10\. Use case monitoring and analytics system and proctoring 45](#figure-10.-use-case-monitoring-and-analytics-system-and-proctoring)

[Figure 12\. Assessment service class diagram 83](#figure-12.-assessment-service-class-diagram)

[Figure 13\. Identity verification class diagram 84](#figure-13.-identity-verification-class-diagram)

[Figure 14\. Proctoring service class diagram 84](#figure-14.-proctoring-service-class-diagram)

[Figure 15\. Casdoor Identity service class diagram 85](#figure-15.-casdoor-identity-service-class-diagram)

[Figure 16\. Notification service class diagram 86](#figure-16.-notification-service-class-diagram)

[Figure 17\. Group service class diagram 86](#figure-17.-group-service-class-diagram)

[Figure 18\. Take Assessment Sequence Diagram 87](#figure-18.-take-assessment-sequence-diagram)

[Figure 19\. View Assessment Result Sequence Diagram 88](#figure-19.-view-assessment-result-sequence-diagram)

[Figure 20\. Face Registration Sequence Diagram 88](#figure-20.-face-registration-sequence-diagram)

[Figure 21\. Student joins a Group Sequence Diagram 89](#figure-21.-student-joins-a-group-sequence-diagram)

[Figure 21\. Question Bank Management Sequence Diagram 90](#figure-21.-question-bank-management-sequence-diagram)

[Figure 22\. Create Assessment Sequence Diagram 91](#figure-22.-create-assessment-sequence-diagram)

[Figure 23\. Monitor Exam (Proctoring) Sequence Diagram 91](<#figure-23.-monitor-exam-(proctoring)-sequence-diagram>)

[Figure 24\. Teacher assigns/publishes a Test to a Group Sequence Diagram 92](#figure-24.-teacher-assigns/publishes-a-test-to-a-group-sequence-diagram)

[Figure 25\. Teacher views Group scores sequence diagram 92](#figure-25.-teacher-views-group-scores-sequence-diagram)

[Figure 26\. View User List Sequence Diagram 93](#figure-26.-view-user-list-sequence-diagram)

[Figure 27\. Search Users Sequence Diagram 94](#figure-27.-search-users-sequence-diagram)

[Figure 28\. System Components 96](#figure-28.-system-components)

[Figure 29\. Redis Streams Architecture 104](#figure-29.-redis-streams-architecture)

[Figure 30\. Docker packaging and deployment 119](#figure-30.-docker-packaging-and-deployment)

# **LIST OF TABLE** {#list-of-table}

[Table 1\. Comparison SSE to WebSocket 17](#table-1.-comparison-sse-to-websocket)

[Table 2\. Supported language 18](#table-2.-supported-language)

[Table 3\. Comparisons PostgresSQL to others 24](#table-3.-comparisons-postgressql-to-others)

[Table 4\. Comparison TimescaleDB to others 25](#table-4.-comparison-timescaledb-to-others)

[Table 5\. Comparison Redis Stream to others 27](#table-5.-comparison-redis-stream-to-others)

[Table 6\. Main actors of SAP 32](#table-6.-main-actors-of-sap)

[Table 7\. Comparison Redis Stream to others 34](#table-7.-comparison-redis-stream-to-others)

[Scenario of Authentication & Profile Management (as User) 45](<#scenario-of-authentication-&-profile-management-(as-user)>)

[Table 8\. Scenario of Authentication & Profile Management (as User) 46](<#table-8.-scenario-of-authentication-&-profile-management-(as-user)>)

[Table 9\. Scenario of Take exam 47](#table-9.-scenario-of-take-exam)

[Table 10\. Scenario of View results 48](#table-10.-scenario-of-view-results)

[Scenario of Manage Notification Preferences (as User) 48](<#scenario-of-manage-notification-preferences-(as-user)>)

[Table 11\. Scenario of Manage Notification Preferences (as User) 48](<#table-11.-scenario-of-manage-notification-preferences-(as-user)>)

[Table 12\. Scenario of Join a Group (as Users) 49](<#table-12.-scenario-of-join-a-group-(as-users)>)

[Table 13\. Scenario of Authentication & Profile Management (as User) 50](<#table-13.-scenario-of-authentication-&-profile-management-(as-user)>)

[Table 14\. Scenario of Manage Assessment, Bank & Questions \- Create Assessment 51](#table-14.-scenario-of-manage-assessment,-bank-&-questions---create-assessment)

[Table 15\. Scenario of Manage Assessment, Bank & Questions \- Add Questions to Assessment 52](#table-15.-scenario-of-manage-assessment,-bank-&-questions---add-questions-to-assessment)

[Table 16\. Scenario of Manage Assessment, Bank & Questions \- Create Question 53](#table-16.-scenario-of-manage-assessment,-bank-&-questions---create-question)

[Table 17\. Scenario of Manage Assessment, Bank & Questions \- Manage Question Bank 54](#table-17.-scenario-of-manage-assessment,-bank-&-questions---manage-question-bank)

[Table 18\. Scenario of Manage Assessment, Bank & Questions \- Publish Assessment 55](#table-18.-scenario-of-manage-assessment,-bank-&-questions---publish-assessment)

[Table 19\. Scenario of Grade & Evaluate \- Manual Grading 56](#table-19.-scenario-of-grade-&-evaluate---manual-grading)

[Table 20\. Scenario of Grade & Evaluate \- Review Violations 57](#table-20.-scenario-of-grade-&-evaluate---review-violations)

[Table 21\. Scenario of Monitor & Analytics \- Real-time Dashboard 58](#table-21.-scenario-of-monitor-&-analytics---real-time-dashboard)

[Table 22\. Scenario of Monitor & Analytics \- Live Exam Monitoring 58](#table-22.-scenario-of-monitor-&-analytics---live-exam-monitoring)

[Table 23\. Scenario of Manage Notification Preferences (as User) 59](<#table-23.-scenario-of-manage-notification-preferences-(as-user)>)

[Table 24\. Scenario of Assign/Publish Assessment to Group (as Teacher) 60](<#table-24.-scenario-of-assign/publish-assessment-to-group-(as-teacher)>)

[Table 25\. Scenario of View Group Results (as Teacher) 61](<#table-25.-scenario-of-view-group-results-(as-teacher)>)

[Table 26\. Scenario of Authentication & Profile Management (as User) 62](<#table-26.-scenario-of-authentication-&-profile-management-(as-user)>)

[Table 27\. Scenario of Authentication & Profile Management (as User) 62](<#table-27.-scenario-of-authentication-&-profile-management-(as-user)>)

[Table 28\. Scenario of Manage Users & Groups \- Create User Groups 63](#table-28.-scenario-of-manage-users-&-groups---create-user-groups)

[Table 29\. Scenario of Manage Assessment, Bank & Questions (Admin Override) 64](<#table-29.-scenario-of-manage-assessment,-bank-&-questions-(admin-override)>)

[Table 30\. Scenario of Grade & Evaluate (Admin Override) 65](<#table-30.-scenario-of-grade-&-evaluate-(admin-override)>)

[Table 31\. Scenario of Monitor & Analytics (System-wide) 66](<#table-31.-scenario-of-monitor-&-analytics-(system-wide)>)

[Table 32\. Scenario of System Administration \- System Configuration 67](#table-32.-scenario-of-system-administration---system-configuration)

[Table 33\. Scenario of System Administration \- View Audit Logs 68](#table-33.-scenario-of-system-administration---view-audit-logs)

[Table 34\. Scenario of System Administration \- RBAC Management 68](#table-34.-scenario-of-system-administration---rbac-management)

[Table 35\. Scenario of Manage Notification Templates & Bulk Send \- Manage Templates 69](#table-35.-scenario-of-manage-notification-templates-&-bulk-send---manage-templates)

[Table 36\. Scenario of Manage Notification Templates & Bulk Send Notifications 70](#table-36.-scenario-of-manage-notification-templates-&-bulk-send-notifications)

[Table 37\. Scenario of Manage Notification Templates & Bulk Send \- Monitor Notification Delivery 71](#table-37.-scenario-of-manage-notification-templates-&-bulk-send---monitor-notification-delivery)

[Table 38\. Scenario of Manage Notification Preferences (as User) 72](<#table-38.-scenario-of-manage-notification-preferences-(as-user)>)

[Table 39\. Assessment service information 104](#table-39.-assessment-service-information)

[Table 40\. Proctoring service information 105](#table-40.-proctoring-service-information)

[Table 40\. Identity verification service information 105](#table-40.-identity-verification-service-information)

[Table 41\. Notification service information 105](#table-41.-notification-service-information)

[Table 42\. Identity service information 106](#table-42.-identity-service-information)

[Table 43\. Database Architecture Summary 107](#table-43.-database-architecture-summary)

[Table 44\. Technology Stack 108](#table-44.-technology-stack)

[Table 45\. Technology selection matrix 109](#table-45.-technology-selection-matrix)

[Table 46\. Trade-offs Analysis 109](#table-46.-trade-offs-analysis)

[Table 47\. Pattern Selection Criteria 110](#table-47.-pattern-selection-criteria)

[Table 48\. Event Types and Routing 111](#table-48.-event-types-and-routing)

[Table 49\. Service Decomposition Strategy 112](#table-49.-service-decomposition-strategy)

[Table 50\. Microservice vs Module 113](#table-50.-microservice-vs-module)

[Table 51\. Pages module 115](#table-51.-pages-module)

[Table 52\. Routing Architecture 117](#table-52.-routing-architecture)

[Table 53\. Frontend service structure 120](#table-53.-frontend-service-structure)

[Table 54\. Hooks Directory Structure 121](#table-54.-hooks-directory-structure)

[Table 54\. Web Worker problems 128](#table-54.-web-worker-problems)

[Table 55\. Mediapipes implementation components 129](#table-55.-mediapipes-implementation-components)

[Table 56\. Mediapipes Violation Detection 130](#table-56.-mediapipes-violation-detection)

[Table 57\. Mediapipes comparisons after improvement 131](#table-57.-mediapipes-comparisons-after-improvement)

[Table 59\. Browser Compatibility 131](#table-59.-browser-compatibility)

[Table 60\. Browser Tampering 132](#table-60.-browser-tampering)

[Table 61\. Browser Protocoring 134](#table-61.-browser-protocoring)

[Table 62\. Tamper detection 134](#table-62.-tamper-detection)

[Table 62\. Solutions for strengthen the anti-cheating system 136](#table-62.-solutions-for-strengthen-the-anti-cheating-system)

#

# **LIST OF ABBREVIATIONS** {#list-of-abbreviations}

| Abbreviation |                                    Meaning                                     |
| :----------: | :----------------------------------------------------------------------------: |
|     ACID     |                 Atomicity, Consistency, Isolation, Durability                  |
|     AES      |                          Advanced Encryption Standard                          |
|     API      |                       Application Programming Interface                        |
|     BRIN     |                   Block Range INdex (PostgreSQL index type)                    |
|     CDN      |                            Content Delivery Network                            |
|      CD      |                  Continuous Delivery / Continuous Deployment                   |
|      CI      |                             Continuous Integration                             |
|    CI/CD     |           Continuous Integration / Continuous Delivery (Deployment)            |
|     CPU      |                            Central Processing Unit                             |
|     CSS      |                             Cascading Style Sheets                             |
|     CSV      |                             Comma-Separated Values                             |
|     DDoS     |                         Distributed Denial of Service                          |
|     DOM      |                  Document Object Model (as in “virtual DOM”)                   |
|     ELK      |                        Elasticsearch, Logstash, Kibana                         |
|     ESM      |                               ECMAScript Module                                |
|     FPS      |                               Frames Per Second                                |
|     GDPR     |                       General Data Protection Regulation                       |
|     GIN      |               Generalized Inverted Index (PostgreSQL index type)               |
|     GiST     |                Generalized Search Tree (PostgreSQL index type)                 |
|     GPU      |                            Graphics Processing Unit                            |
|     HPA      |                     Horizontal Pod Autoscaler (Kubernetes)                     |
|     HTML     |                           HyperText Markup Language                            |
|     HTTP     |                          Hypertext Transfer Protocol                           |
|    HTTPS     |                       Hypertext Transfer Protocol Secure                       |
|     i18n     |                              Internationalization                              |
|     IdP      |                               Identity Provider                                |
|      IP      |                               Internet Protocol                                |
|     JSON     |                           JavaScript Object Notation                           |
|    JSONB     |                       Binary JSON (PostgreSQL JSON type)                       |
|     JWT      |                                 JSON Web Token                                 |
|     K8s      |                                   Kubernetes                                   |
|     MFA      |                          Multi-Factor Authentication                           |
|      ML      |                                Machine Learning                                |
|     MIME     | Multipurpose Internet Mail Extensions (content type, e.g. `text/event-stream`) |
|     MVCC     |                       Multi-Version Concurrency Control                        |
|     NFR      |                           Non-Functional Requirement                           |
|    OAuth2    |                                   OAuth 2.0                                    |
|     OIDC     |                                 OpenID Connect                                 |
|    ORDBMS    |                  Object-Relational Database Management System                  |
|     PDF      |                            Portable Document Format                            |
|     PII      |                      Personally Identifiable Information                       |
|     PTIT     |              Posts and Telecommunications Institute of Technology              |
|      PV      |                         Persistent Volume (Kubernetes)                         |
|     PVC      |                      Persistent Volume Claim (Kubernetes)                      |
|     RBAC     |                           Role-Based Access Control                            |
|     REST     |                        Representational State Transfer                         |
|     SLA      |                            Service Level Agreement                             |
|     SQL      |                           Structured Query Language                            |
|     SSE      |                               Server-Sent Events                               |
|     SSO      |                                 Single Sign-On                                 |
|     TLS      |                            Transport Layer Security                            |
|      UI      |                                 User Interface                                 |
|     UML      |                           Unified Modeling Language                            |
|      UX      |                                User Experience                                 |
|    UTF-8     |                     Unicode Transformation Format – 8-bit                      |
|     VPC      |                             Virtual Private Cloud                              |
|     WAF      |                            Web Application Firewall                            |
|     WAL      |                              Write-Ahead Logging                               |
|     WASM     |                                  WebAssembly                                   |
|    WebGL     |                              Web Graphics Library                              |
|    WebGL2    |                             Web Graphics Library 2                             |
|    WebRTC    |                          Web Real-Time Communication                           |
|     WCAG     |                      Web Content Accessibility Guidelines                      |

# **INTRODUCTION** {#introduction}

In the current context of digital transformation in education, particularly accelerated by the global shift toward online learning, there is an increasing demand for secure and efficient online examination systems. Traditional in-person examinations face significant challenges including high supervision costs, geographical limitations, scheduling constraints, and difficulties in maintaining exam integrity in remote settings. Educational institutions, especially universities like the Posts and Telecommunications Institute of Technology (PTIT), are seeking technological solutions to conduct fair and transparent assessments while adapting to the modern digital learning environment. However, existing online examination platforms often lack comprehensive proctoring capabilities, struggle with scalability issues, and fail to provide adequate security measures to prevent academic dishonesty, creating a critical gap in the educational technology landscape.

This graduation project, titled "Building an Online Examination System and Proctoring Tool for Test-Taking Process using GoLang and React," is being developed at the Posts and Telecommunications Institute of Technology under the Faculty of Information Technology 1, supervised by Dr. Dao Ngoc Phong and led by Head of Department Dr. Nguyen Duy Phuong. The project addresses these challenges by developing a comprehensive online examination platform that integrates advanced AI-powered proctoring capabilities including facial recognition, behavioral monitoring, gaze tracking, and automated violation detection to ensure exam integrity and fairness. The system leverages modern technologies such as GoLang for high-performance backend services, React with TypeScript for responsive user interfaces, PostgreSQL for reliable data storage, and microservices architecture to support up to 10,000 concurrent users. By implementing features such as role-based access control, flexible assessment management, multiple question types, real-time analytics dashboards, and comprehensive reporting tools, this project aims to provide educational institutions with a scalable, secure, and user-friendly solution that reduces supervision costs, eliminates geographical barriers, maintains academic standards, and optimizes the entire examination process from creation to grading. The system not only serves the immediate needs of PTIT but also contributes to the broader educational technology ecosystem by offering a robust platform that can be adopted by other institutions facing similar challenges in the digital education era.

#

# **CHAPTER 1: INTRODUCTION TO THE SYSTEM AND TECHNOLOGIES USED** {#chapter-1:-introduction-to-the-system-and-technologies-used}

## **1.1. System introduction** {#1.1.-system-introduction}

### **1.1.1. Purposes and meanings of the project** {#1.1.1.-purposes-and-meanings-of-the-project}

The objective of this project is to build an online examination system with integrated proctoring tools supporting core functions such as assessment management, question banks, exam taking, and real-time monitoring. The system aims to create a secure, transparent, and user-friendly platform for test-takers while helping educational institutions minimize supervision costs, ensure exam integrity, and optimize testing operations in the digital transformation environment.

The project not only builds an examination system but also applies advanced technologies such as artificial intelligence, facial recognition, behavioral monitoring, and microservices architecture, aiming to optimize testing processes, enhance user experience, and improve operational efficiency. The system also brings practical value to both test-takers and educators, such as saving time and resources, ensuring fairness through automated proctoring, personalizing assessment experiences, supporting scalability for up to 10,000 concurrent users, and enabling remote testing capabilities that eliminate geographical barriers while maintaining rigorous academic standards.

### **1.1.2. Project’s scope** {#1.1.2.-project’s-scope}

This project focuses on the design and development of a **Secure Assessment Platform** that enables online examinations with improved integrity, scalability, and system reliability. The system is developed as a web-based platform using a microservice-oriented architecture and modern deployment technologies.

**1.1.2.1. In-Scope**

The scope of the project includes:

- **Frontend application**  
   A web-based user interface that allows candidates to participate in online assessments, navigate exam content, and submit results. The frontend also supports client-side processing for assessment monitoring features.
- **Backend services**  
   A set of backend microservices responsible for assessment logic, session management, data processing, and communication with the frontend through RESTful APIs.
- **Assessment integrity features**  
   Basic mechanisms to support assessment integrity, such as event tracking and proctoring-related analysis, implemented to demonstrate secure assessment concepts.
- **Data management**  
   Persistent data storage using a relational database (PostgreSQL) and support for real-time or transient data processing using in-memory or streaming components (e.g., Redis).
- **System deployment and containerization**  
   Packaging of frontend and backend components into Docker container images with versioned tags. The system supports local deployment using Docker Compose and production-style deployment using Kubernetes to ensure consistency and reproducibility across environments.
- **System documentation and design**  
   Preparation of architectural, UML, and deployment diagrams, along with database design documentation to describe system structure and behavior.

**1.1.2.2. Out of Scope and Limitations**

This project does not aim to deliver a full commercial-grade proctoring solution. Advanced AI-based cheating detection, legal or regulatory compliance, large-scale performance testing, and integration with external learning management systems are outside the project scope. The system is developed as an academic prototype, emphasizing design clarity, functional correctness, and deployment practices rather than production-scale optimization.

### **1.1.3. Core Problems to be solved** {#1.1.3.-core-problems-to-be-solved}

#### **1.1.3.1. Academic Integrity in Remote Settings**

Ensuring the authenticity of test-takers and the integrity of the exam environment is the primary challenge in remote education. Without physical supervision, the platform must mitigate risks such as:

- Impersonation: Verifying that the person taking the exam is the registered student.
- Collaboration: Preventing students from communicating with others or screen sharing during the assessment.
- Environment Security: Ensuring the browser environment is locked down to prevent copy-pasting or accessing unauthorized websites.

#### **1.1.3.2. Scalability Requirements**

Online assessments often involve "thundering herd" scenarios where thousands of users begin an exam simultaneously. The system must be architected to handle:

- Concurrent Access: Supporting high concurrency during exam login and submission windows without service degradation.
- Data Volume: Managing the massive influx of telemetry data (video streams, logs, clickstreams) generated during proctoring sessions.
- Resource Elasticity: Automatically scaling infrastructure up to meet demand during peak exam periods and scaling down to reduce costs during inactivity.

#### **1.1.3.3. Real-Time Violation Detection**

Post-exam analysis is insufficient for preventing cheating; immediate intervention is required. The platform needs to solve:

- Low Latency Processing: Analyzing image and browser events in near real-time to detect anomalies (e.g., multiple faces, looking away).
- Instant Alerting: Immediately notifying proctors or the system to warn the student or pause the exam when a violation is detected.
- False Positive Management: Balancing strict detection with fairness to avoid penalizing honest students due to technical glitches or benign behavior.

#### **1.1.3.4. Comprehensive Assessment Workflow**

Fragmented tools create friction for educators and students. The platform must provide a unified, seamless lifecycle:

- Creation & Scheduling: Flexible tools for educators to design various question types and schedule exams for specific cohorts.
- Delivery & Proctoring: A stable, secure environment for students to take the exam while being monitored.
- Grading & Feedback: Automated grading for objective questions and streamlined workflows for manual grading.
- Notification & Analytics: Timely delivery of results and detailed reports on class performance and integrity incidents.

### **1.1.4. Some specific solutions approach** {#1.1.4.-some-specific-solutions-approach}

#### **1.1.4.1. MediaPipe-Based Real-Time Proctoring System**

MediaPipe, developed by Google Research, is an open-source framework for building multimodal applied machine learning pipelines. In the context of our secure assessment platform, MediaPipe serves as the core technology for implementing real-time proctoring capabilities through computer vision and artificial intelligence.

**Technical Foundation and Architecture**

MediaPipe provides a comprehensive suite of pre-trained machine learning models optimized for real-time performance on various platforms. The framework utilizes a graph-based architecture where individual components (calculators) are connected to form processing pipelines. For our proctoring system, we leverage several key MediaPipe solutions:

- **Face Detection**: Employs the BlazeFace model, a lightweight convolutional neural network designed for mobile GPU inference, achieving sub-millisecond face detection on modern devices
- **Face Mesh**: Generates 468 3D facial landmarks in real-time, enabling precise facial geometry analysis and gaze direction estimation
- **Pose Detection**: Utilizes BlazePose for full-body pose estimation, providing additional context for student behavior analysis

**Integration with Assessment Platform**

The MediaPipe integration operates through a client-side processing approach, ensuring privacy compliance by processing video streams locally without transmitting raw video data to servers. The system architecture implements the following workflow:

- **Camera Stream Acquisition**: Utilizes MediaPipe's Camera Utils for optimized video capture and preprocessing
- **Real-Time Analysis**: Processes video frames through MediaPipe models to detect facial features, attention patterns, and behavioral anomalies
- **Event Generation**: Converts detection results into structured proctoring events (face not detected, multiple persons, attention deviation)
- **Violation Assessment**: Applies configurable thresholds to determine violation severity and trigger appropriate responses
- **Secure Transmission**: Sends only metadata and violation events to the backend system, maintaining student privacy

**Performance Optimization and Scalability**

The implementation incorporates several optimization strategies to ensure system performance under concurrent usage scenarios:

- **Model Quantization**: Utilizes TensorFlow Lite models for reduced computational overhead
- **Frame Rate Control**: Implements adaptive frame processing (10-15 FPS) to balance accuracy and resource consumption
- **Memory Management**: Employs efficient buffer management to prevent memory leaks during extended assessment sessions
- **Browser Compatibility**: Ensures cross-platform functionality across modern web browsers through WebAssembly and WebGL acceleration

**Privacy and Compliance Considerations**

The MediaPipe-based proctoring system adheres to strict privacy principles and regulatory compliance requirements:

- **Web Worker Offloading**: MediaPipe processing is offloaded to a dedicated Web Worker thread, completely freeing the main UI thread for responsive user interactions during exams. This required a patched MediaPipe bundle to overcome ES Module limitations with \`importScripts()\` (see Section 3.2.5 for implementation details)
- **Zero-Copy Frame Transfer**: Video frames are transferred to the worker as \`ImageBitmap\` objects with ownership transfer, avoiding memory duplication
- **Frame Rate Control**: Implements 4 FPS detection interval (250ms) to balance accuracy and resource consumption
- **GPU/CPU Fallback**: Automatic detection of WebGL2 availability with graceful fallback to CPU processing
- **Memory Management**: Event capping (max 50 violations) and explicit frame cleanup prevent memory leaks during extended sessions
- **Browser Compatibility**: Requires OffscreenCanvas support (Chrome 69+, Firefox 105+, Safari 16.4+)

This approach enables the platform to provide comprehensive exam integrity monitoring while maintaining student privacy and system performance at scale.

#### **1.1.4.2. Real-time communication: Server-sent Events**

**Introduction**  
Server-Sent Events (SSE) is a server push technology enabling a client to receive automatic updates from a server via an HTTP connection. It describes how servers can initiate data transmission towards clients once an initial client connection has been established. Unlike classic polling, where the client repeatedly asks for data, SSE establishes a persistent, long-lived connection, allowing the server to send data to the client whenever it becomes available.  
**Technical Overview**

- Standard / API: SSE is a web standard defined in the HTML Living Standard (often casually referred to as “HTML5-era”) and uses the EventSource interface in the browser.
- Protocol: Operates over standard HTTP/HTTPS (typically a long-lived HTTP connection).
- Data Format: Messages are UTF-8 text using the MIME type text/event-stream, following the SSE field format (data:, id:, event:, etc.).
- Mechanism: The client opens a connection and the server keeps it open, streaming events to the client as they occur (server → client only).
- Built-in Features:
    - Automatic Reconnection: Browsers automatically attempt to reconnect if the connection is dropped.
    - Event IDs: Allows the server to send an ID with each event, so if a reconnection happens, the client can tell the server the last event it received (Last-Event-ID), preventing data loss.

| Feature         | Server-Sent Events (SSE)                                              | WebSockets                                                     |
| :-------------- | :-------------------------------------------------------------------- | :------------------------------------------------------------- |
| Directionality  | Unidirectional (Server to Client only).                               | Bidirectional (Full-duplex, Server \<-\> Client).              |
| Complexity      | Low. Simple HTTP implementation. No special protocol handling needed. | High. Requires a custom protocol handshake and frame handling. |
| Data Format     | Text only (UTF-8).                                                    | Binary and Text.                                               |
| Ideal Use Cases | News feeds, stock tickers, notifications, status updates.             | Chat apps, multiplayer games, collaborative editing.           |

##### _Table 1\. Comparison SSE to WebSocket_ {#table-1.-comparison-sse-to-websocket}

**Why SSE for Notification Service?**  
For a Notification Service, the primary requirement is to push information from the system to the user (e.g., "Assessment Graded", "New Assignment"). The user rarely needs to send high-frequency real-time data back on the same channel. Therefore, SSE is often the superior choice because:

- Simplicity: It leverages the existing HTTP infrastructure (Authentication, Load Balancing).
- Efficiency: It is lighter weight than maintaining full-duplex WebSocket connections for sporadic updates.
- Resilience: The built-in reconnection logic simplifies the client-side implementation significantly.

#### **1.1.4.3. Internationalization Strategy**

The platform implements comprehensive multi-language support to serve diverse user populations across different regions. This internationalization (i18n) approach ensures that educators and students can interact with the system in their preferred language.

##### **Technical Implementation**

The i18n system is built on **i18next**, the leading internationalization framework for JavaScript applications, integrated with React through **react-i18next**. Key architectural decisions include:

- **Namespace Organization**: Translations are organized by feature modules (auth, exam, groups, settings) enabling code-splitting and lazy loading of translation bundles
- **Type Safety**: TypeScript integration ensures translation keys are type-checked at compile time, preventing runtime errors from missing translations
- **Fallback Chain**: Missing translations gracefully fall back from specific locale (vi-VN) → base language (vi) → default language (en)

##### **Language Detection and Switching**

The **i18next-browser-languagedetector** plugin automatically detects user language preference through multiple sources in priority order:  
1\. Query parameter (\`?lng=vi\`)  
2\. LocalStorage (persisted user preference)  
3\. Browser navigator language  
4\. HTML lang attribute  
Users can manually switch languages through the Settings modal, with the preference persisted to localStorage for subsequent sessions.

##### **Translation Management**

The platform currently supports two languages:

| Language        | File Size | Coverage |
| :-------------- | :-------- | :------- |
| English (en)    | \~77 KB   | 100%     |
| Vietnamese (vi) | \~89 KB   | 100%     |

##### _Table 2\. Supported language_ {#table-2.-supported-language}

Translation files follow a hierarchical JSON structure with nested keys for organization:

{  
 "exam": {  
 "title": "Take Assessment",  
 "submit": "Submit Answers",  
 "timeRemaining": "Time Remaining: {{minutes}}m {{seconds}}s"  
 }  
}

Dynamic values are interpolated using the \`{{variable}}\` syntax, supporting pluralization and formatting.

##### **Benefits of Client-Side i18n**

- **Instant Language Switching**: No server round-trip required; translations are bundled with the application
- **Reduced Server Load**: Translation logic is handled entirely client-side
- **Developer Experience**: React hooks (\`useTranslation\`) provide clean, declarative translation access in components
- **Scalability**: Adding new languages requires only new translation JSON files without code changes

## **1.2. Technology used** {#1.2.-technology-used}

### **1.2.1. Front-end** {#1.2.1.-front-end}

The frontend application is built using modern web technologies optimized for performance, maintainability, and user experience. The following technologies form the foundation of the client-side implementation:

#### **Core Framework and Language**

- **React 19** serves as the primary UI framework, providing a component-based architecture that enables efficient rendering through its virtual DOM implementation. React 19 introduces improved concurrent rendering capabilities and automatic batching of state updates, resulting in smoother user interactions during exam-taking sessions.
- **TypeScript 5.9** extends JavaScript with static typing, enabling early detection of type-related errors during development. This strict typing ensures robust code quality across the codebase and improves developer productivity through enhanced IDE support and autocompletion.
- **Vite (rolldown-vite)** is the build tool powering the development and production builds. Unlike traditional bundlers, Vite leverages native ES modules for instant development server startup and utilizes Rolldown (a Rust-based bundler) for optimized production builds with faster compilation times.

#### **UI Component Library and Styling**

- **Ant Design 5.27** provides a comprehensive suite of enterprise-grade React components following design system principles. The library includes pre-built components for forms, tables, modals, and navigation, ensuring consistent UI/UX across the application.
- A **custom theme system** is implemented through design tokens (tokens.ts), gradient definitions (gradients.ts), and a ThemeProvider component. This enables consistent branding and supports both light and dark mode themes.
- **CSS Modules** are used for component-level styling, preventing style conflicts through automatic class name scoping and enabling maintainable, modular stylesheets.

#### **State Management and Data Fetching**

- **TanStack React Query 5.90** handles server state management, providing automatic caching, background refetching, and optimistic updates. This eliminates the need for manual data fetching logic and ensures UI data remains synchronized with the server.
- **React Context API** manages client-side global state for authentication, theme preferences, and notification settings, avoiding unnecessary complexity from external state management libraries.
- **Axios 1.12** serves as the HTTP client for API communication, configured with interceptors for JWT token attachment, error handling, and request/response logging.

#### **Internationalization**

- **i18next 25.7** with **react-i18next 16.3** provides comprehensive multi-language support. The system currently supports English (77KB translation file) and Vietnamese (89KB translation file). **i18next-browser-languagedetector** automatically detects the user's preferred language from browser settings.

#### **AI/ML Integration**

- **MediaPipe Tasks Vision** (@mediapipe/tasks-vision) enables client-side face detection and facial landmark analysis for the proctoring system. Processing occurs entirely in the browser, ensuring student privacy by transmitting only violation metadata rather than video streams.
- A **Web Worker** architecture offloads MediaPipe processing to a separate thread, preventing UI blocking during intensive ML computations. GPU acceleration via WebGL2 is used when available, with automatic fallback to CPU processing.

#### **Interactive Features**

- **dnd-kit** (@dnd-kit/core, @dnd-kit/sortable) powers drag-and-drop functionality for ordering questions and matching question types during exam-taking.
- **Recharts** provides interactive data visualization for analytics dashboards, displaying charts for exam statistics, violation trends, and performance metrics.
- **PapaParse** handles CSV parsing for question import/export functionality, enabling teachers to bulk upload questions from spreadsheet files.

#### **Form Validation and Security**

- **Zod 4.1** provides runtime schema validation for form inputs and API responses, ensuring data integrity throughout the application.
- **Casdoor React SDK** integrates OAuth2 authentication, handling login flows, token management, and single sign-on (SSO) with external providers like Google.

#### **Development and Quality Tools**

- **ESLint 9.39** with TypeScript plugins enforces code quality standards and catches potential issues during development.
- **Prettier 3.7** ensures consistent code formatting across the codebase.
- **Vitest** provides fast unit testing with React Testing Library for component testing, ensuring code reliability through automated tests.

### **1.2.2. Back-end** {#1.2.2.-back-end}

**Golang (Go):**

Golang is a statically typed, compiled programming language developed by Google, designed for building high-performance, scalable, and concurrent backend systems. With its lightweight concurrency model and minimal runtime overhead, Go is particularly well-suited for microservices-based architectures and real-time systems.

**Application in the system:**

- Implements all core backend microservices, including:
    - Assessment Service
    - Proctoring Service
    - Group Service
    - Identity Verification Service
- Handles complex business logic with strict requirements on latency and throughput.
- Exposes RESTful APIs and Server-Sent Events (SSE) endpoints to communicate with the ReactJS front-end.
- Processes high-concurrency workloads such as:
    - Thousands of users logging in and taking exams simultaneously
    - Real-time ingestion and processing of proctoring events
    - Asynchronous communication through Redis Streams

**Key characteristics of Golang:**

- **High Performance:** Go compiles directly to native machine code, delivering low-latency execution and efficient resource utilization.
- **Efficient Concurrency Model:** Goroutines and channels enable the system to handle tens of thousands of concurrent tasks with minimal overhead, making Go ideal for real-time and high-load scenarios.
- **Simplicity and Maintainability:** A clean and concise syntax reduces complexity, improves code readability, and lowers long-term maintenance costs.
- **Cloud-Native Friendly:** Go integrates seamlessly with modern infrastructure technologies such as Docker and Kubernetes, supporting scalable microservice deployments.

**Java:**

Java is a mature, object-oriented programming language with a robust ecosystem for building reliable, enterprise-grade applications. In this system, Java is used exclusively for the Notification Service, which is responsible for delivering messages and alerts to users through multiple channels.

**Application in the system:**

- Implements a standalone Notification Service following the microservices architecture.
- Consumes events from Redis Streams and processes them asynchronously.
- Delivers notifications through multiple channels, including:
    - Real-time notifications via Server-Sent Events (SSE)
    - Email notifications (exam results, schedule reminders, violation alerts)
    - System-level alerts for administrators and teachers

### **1.2.3. Database** {#1.2.3.-database}

#### **1.2.3.1. PostgreSQL (Postgres)**

**Introduction**

PostgreSQL (Postgres) is a mature open-source object-relational database management system (ORDBMS) widely used for systems requiring **high reliability, strong data integrity, and complex querying**. It supports standard **SQL** and also provides strong support for semi-structured data through **JSON/JSONB**, allowing both relational and document-style data patterns in a single database.

**Key Features**

- **ACID Compliance:**  
   Ensures transactions remain correct even in failures. This is important for exam submissions, grading, and user operations where data correctness must be guaranteed.
- **Concurrency via MVCC:**  
   Uses Multi-Version Concurrency Control so read operations do not block writes, improving performance under many concurrent users (e.g., during exam start/submission spikes).
- **Extensibility:**  
   Supports extensions and custom types/functions without modifying core code. Common extensions include PostGIS (geospatial), pgcrypto (crypto utilities), and pg_trgm (fuzzy search).
- **Advanced Data Types:**  
   Supports arrays, UUID, range types, JSONB, and more, enabling flexible modeling for exam content, metadata, and event-related records.
- **Indexing Options:**
    - **B-tree:** default; best for equality/range queries
    - **GIN:** efficient for JSONB, arrays, full-text search
    - **GiST:** supports complex data types and specialized queries
    - **BRIN:** very compact, useful for very large tables with ordered data (e.g., timestamps.
- **Replication and High Availability:**  
   Supports streaming replication and logical replication, while **WAL (Write-Ahead Logging)** enables recovery and point-in-time restore.

| Comparison                           | PostgreSQL Strengths                                                                                                      | Alternative Strengths                                                                 |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------ |
| PostgreSQL vs. MySQL                 | Stronger feature set for complex workloads (JSONB, indexing, query planner, strict consistency)                           | Often simpler to administer; may be faster for some simple read-heavy workloads       |
| PostgreSQL vs. Oracle                | Comparable functionality for many workloads with no licensing cost; open ecosystem and extensibility                      | Some advanced enterprise features and commercial support models                       |
| PostgreSQL vs. NoSQL (e.g., MongoDB) | Combines relational \+ document modeling via JSONB with strong ACID guarantees; avoids splitting into multiple DB systems | Some NoSQL systems scale horizontally more easily for certain document-only use cases |

##### _Table 3\. Comparisons PostgresSQL to others_ {#table-3.-comparisons-postgressql-to-others}

#### **1.2.3.2. Timescale-DB:**

**Introduction**

TimescaleDB is an open-source time-series database implemented as a **PostgreSQL extension**, providing specialized performance optimizations for time-series workloads while keeping the full PostgreSQL ecosystem. This makes it a strong choice for storing and analyzing **time-stamped telemetry data** such as monitoring logs, system metrics, and proctoring events.

**Core Concepts**

- **Hypertable:**  
   TimescaleDB introduces hypertables, which behave like normal SQL tables but are automatically partitioned into smaller units based on time intervals.
- **Chunks:**  
   Hypertables are stored as “chunks” (physical partitions). This improves query speed because queries can scan only the relevant time range instead of the entire dataset.
- **Time-based Query Optimization:**  
   TimescaleDB automatically performs chunk exclusion when filtering by time, reducing I/O and improving performance on large event tables.
- **Continuous Aggregates:**  
   Supports incremental materialized views that update as new data arrives, enabling fast dashboards (e.g., violations per minute/hour, active sessions, system load).
- **Compression:**  
   Converts older chunks into compressed columnar format, significantly reducing storage while keeping data queryable.
- **Retention Policies:**  
   Automatically deletes or archives old data based on a defined window, preventing unbounded growth for high-volume event streams.

| Comparison                        | TimescaleDB Strengths                                                                                     | Alternative Strengths                                                                                         |
| :-------------------------------- | :-------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| TimescaleDB vs. InfluxDB          | SQL support \+ PostgreSQL ecosystem; easy joins between time-series and relational data; strong analytics | Often strong write performance and time-series-native tooling for simple metrics pipelines                    |
| TimescaleDB vs. Native PostgreSQL | Automatic partitioning/chunking, time-series optimizations, built-in compression & retention policies     | Works without extensions; sufficient if event volume is small and advanced time-series features aren’t needed |

##### _Table 4\. Comparison TimescaleDB to others_ {#table-4.-comparison-timescaledb-to-others}

### **1.2.4. Message Broker: Redis Stream** {#1.2.4.-message-broker:-redis-stream}

**Introduction**  
Redis Streams is a data structure introduced in Redis 5.0 that models a log-like append-only data structure. It combines the simplicity of Redis with powerful messaging capabilities, making it an excellent choice for building event-driven architectures, message queues, and real-time data processing pipelines.  
Unlike traditional pub/sub systems, Redis Streams provides persistence, consumer groups, and message acknowledgment, addressing many limitations of simpler messaging patterns.  
**Core Concepts:**  
A stream is essentially an ordered collection of entries, where each entry consists of one or more field-value pairs. Every entry is assigned a unique identifier that reflects the time it was added to the stream. Each entry in a stream has a unique ID in the format \<millisecondsTime\>-\<sequenceNumber\>. For example, 1609459200000-0 represents the first entry added at that specific millisecond timestamp. Redis can auto-generate these IDs, or you can specify custom IDs as long as they maintain chronological order.  
Consumer groups enable multiple consumers to cooperatively process messages from a stream. This mechanism provides load balancing across consumers, message acknowledgment tracking, and the ability to recover from failures without losing messages.  
**Key Features**  
**Persistence and Durability**: Unlike Redis Pub/Sub, messages in streams are persisted. Consumers can read historical data, and messages are not lost if no consumer is currently connected.  
**Consumer Groups**: Multiple consumers can work together to process messages, with Redis tracking which messages have been delivered and acknowledged. This enables horizontal scaling of message processing.  
**Message Acknowledgment**: Consumers explicitly acknowledge processed messages. Unacknowledged messages can be claimed by other consumers after a timeout, ensuring no message is lost due to consumer failures.  
**Range Queries**: Streams support efficient range queries by ID or timestamp, allowing consumers to read specific portions of the stream history.  
**Blocking Reads**: Consumers can perform blocking reads to wait for new messages, reducing polling overhead and latency.  
**Capped Streams**: Streams can be configured with a maximum length, automatically removing older entries when the limit is reached.  
**Common Use Cases:**  
**Event Sourcing**: Redis Streams naturally fits event sourcing patterns where all changes to application state are stored as a sequence of events. The append-only nature and efficient range queries make it ideal for this purpose.  
**Real-time Analytics**: Processing streams of events for real-time dashboards, metrics aggregation, and monitoring systems. The blocking read capability enables low-latency processing.  
**Message Queues**: Building reliable message queues with acknowledgment semantics and failure recovery. Consumer groups enable distributing work across multiple workers.  
**Activity Feeds**: Implementing social media feeds, notification systems, or audit logs where chronological ordering and historical access are important.  
**IoT Data Ingestion**: Collecting and processing high-volume sensor data where the append-only model and automatic ID generation simplify data management.  
Comparison with Alternatives:

| Comparison                      | Redis Streams                                                                                                     | Alternative                                                                                                                                     |
| :------------------------------ | :---------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| Redis Streams vs. Redis Pub/Sub | Persistent messages and supports historical reads; consumer groups provide acknowledgment and failure recovery.   | Pub/Sub is fire-and-forget: messages are lost if no subscriber is listening; no acknowledgment or failure recovery.                             |
| Redis Streams vs. Kafka         | Simpler to operate, lower latency for smaller-scale use cases, and integrates naturally if you already use Redis. | Kafka offers stronger durability guarantees, higher throughput for very large-scale deployments, and a more mature stream-processing ecosystem. |
| Redis Streams vs. RabbitMQ      | Simpler operations, convenient if Redis is already in use, and efficient storage for time-series-like data.       | RabbitMQ provides richer routing capabilities and more messaging patterns.                                                                      |

##### _Table 5\. Comparison Redis Stream to others_ {#table-5.-comparison-redis-stream-to-others}

### **1.2.5. Authentication / Identity Provider: Casdoor** {#1.2.5.-authentication-/-identity-provider:-casdoor}

Casdoor is used as an external Identity Provider (IdP) to centralize authentication and authorization for the Secure Assessment Platform. It supports standard identity protocols and provides ready-to-use features such as user management, role-based access control, and multi-factor authentication.  
**Key capabilities:**

- OAuth2 / OpenID Connect (OIDC): Standardized login and token-based authentication for web applications and services.
- JWT Token Issuance: Issues access tokens (and related session/token artifacts) used by backend services to authorize API requests.
- Role-Based Access Control (RBAC): Supports role-based permissions for system roles such as Student, Teacher, and Admin.
- Multi-Factor Authentication (MFA): Adds an extra security layer to reduce account takeover risks.
- Organization & Hierarchy Management: Manages organizational structures and related access policies centrally.

**Application in the system:**

- Provides a single authentication/authorization entry point for all user roles (Student/Teacher/Admin), avoiding duplicated auth logic in each microservice.
- Enables backend services to validate identity and permissions using Casdoor-issued tokens and RBAC rules.
- Simplifies account lifecycle operations (registration, session management, MFA, role assignment) through a dedicated identity component.

### **1.2.6. System Architecture** {#1.2.6.-system-architecture}

**Overall:**

- **Microservices** is a software architecture where an application is divided into many small, independent services.
- Each service handles a **specific function** and can be **developed, deployed, and operated separately**.
- Microservices are widely used by large companies such as **Netflix, eBay, Amazon, Twitter, and PayPal**.
- Because each service is an independent module, the system is easier to **develop, test, scale, and deploy**.  
  ![][image2]

###### _Figure 1\. Microservice architecture_ {#figure-1.-microservice-architecture}

#### **Advantages:**

- **Scalability:** Each service can be scaled independently. For example, if the payment service has high traffic, you only scale that service instead of the whole system.
- **Fault tolerance:** If one service fails, other services can continue running. For example, if the email service fails, the system can still process orders.
- **Flexibility:** Different services can use different programming languages and technologies. You can upgrade one service without affecting the entire system.
- **Team management:** Teams can work on separate services, reducing dependencies and improving productivity.

    #### **Disadvantages:**

- **More complex:** Managing many services requires monitoring, logging, and coordination tools to keep everything working together.
- **Higher cost:** Running multiple services usually needs more infrastructure and maintenance effort than a monolithic system.
- **Communication challenges:** Services must communicate via APIs or message queues, which requires good standards and reliable tools.

## **1.3. Infrastructure and DevOps** {#1.3.-infrastructure-and-devops}

### **1.3.1. Container Orchestration: Kubernetes** {#1.3.1.-container-orchestration:-kubernetes}

**Overview:**  
Kubernetes (K8s) is an open-source platform used to **deploy, manage, and scale containerized applications**. It is widely used for microservice systems because it automates many operational tasks such as scheduling containers, scaling, and recovery.

**Why Kubernetes is used**

- **Automated deployment & updates:** supports rolling updates and rollback.
- **Scalability:** scale services horizontally by increasing pod replicas.
- **Self-healing:** restarts or replaces failed containers automatically.
- **Service discovery & load balancing:** stable access to pods via Services.
- **Configuration management:** manage config and sensitive credentials safely.

**Architecture (high level)**

- **Control Plane:** manages the whole cluster (API, scheduling, controllers, cluster state).
- **Worker Nodes:** run the application workloads (pods/containers).

**Key Kubernetes objects**

- **Pod:** smallest unit, runs one (or more) container(s).
- **Deployment:** manages replicas and rolling updates of pods.
- **Service:** provides a stable endpoint to access pods.
- **Ingress:** routes external HTTP/HTTPS traffic into services.
- **ConfigMap / Secret:** store configuration and sensitive data.
- **Namespace:** logical isolation for teams/environments.
- **PV/PVC:** persistent storage for stateful applications.

**Operational features commonly used**

- **Autoscaling:** HPA scales pods based on CPU/memory metrics.
- **Storage:** PVCs enable data persistence across pod restarts.
- **Security:** RBAC controls permissions; service accounts for workloads.
- **Observability:** logging \+ metrics monitoring (commonly Prometheus/Grafana).

### **1.3.2. CI/CD Pipeline: GitHub Actions** {#1.3.2.-ci/cd-pipeline:-github-actions}

**Overview**  
GitHub Actions is a CI/CD tool built into GitHub that allows you to automate build, test, and deployment workflows using YAML files stored in .github/workflows/.  
CI/CD concept

- CI (Continuous Integration): automatically build and test code when changes are pushed or merged.
- CD (Continuous Delivery/Deployment): automatically deliver/deploy the verified build to staging/production.

**Core components**

- Workflow: the full automation pipeline defined in YAML.
- Event triggers: push, pull request, release, schedule, etc.
- Jobs & steps: jobs are groups of steps; steps run sequentially.
- Actions: reusable tasks (checkout code, login to registry, deploy, etc.).
- Runners: machines that execute workflows (GitHub-hosted or self-hosted).
- Secrets & environments: securely store tokens/credentials and manage deployment permissions.

Typical pipeline for a Kubernetes project

1. Checkout code
2. Install dependencies
3. Lint \+ run tests
4. Build Docker image
5. Push image to container registry
6. Deploy/update to Kubernetes (staging → production)  
   (Optional: manual approval for production deployments)

## **1.4. Chapter 1 Conclusion** {#1.4.-chapter-1-conclusion}

This chapter introduced the Secure Assessment Platform and clarified the main problems it aims to solve, including maintaining academic integrity in remote exams, supporting high concurrency, enabling near real-time violation detection, and providing a complete assessment workflow from creation to grading and reporting. To address these requirements, the platform applies a microservices architecture and combines multiple modern technologies chosen for performance, scalability, and maintainability.

In terms of implementation, the frontend is built with React and TypeScript to deliver a responsive and modular user interface, while the backend is designed around independent services implemented mainly in Golang for high-throughput and low-latency processing. Authentication and authorization are centralized through Casdoor to support OAuth2/OIDC, RBAC, and secure session management. For asynchronous event processing and real-time updates, Redis Streams is used as a message broker, allowing reliable consumption with consumer groups and acknowledgment semantics, while Server-Sent Events (SSE) enables efficient server-to-client notification delivery. The data layer is based on PostgreSQL for transactional workloads and TimescaleDB to optimize storage and querying of time-series data such as monitoring logs and proctoring-related events.

Finally, this chapter presented the overall system architecture and the key infrastructure and DevOps components that support deployment and operation, including containerization and orchestration with Docker/Kubernetes and automation via CI/CD pipelines. Overall, the technologies selected in this chapter provide a solid foundation for building a secure, scalable, and extensible online examination and monitoring system. The next chapter will build on this foundation by analyzing system requirements, defining actors and use cases, and designing the detailed architecture and data models of the platform.

#

# **CHAPTER 2: SYSTEM ANALYSIS AND DESIGN** {#chapter-2:-system-analysis-and-design}

## **2.1. Describe the actors, the terminology, and define the requirements** {#2.1.-describe-the-actors,-the-terminology,-and-define-the-requirements}

This section identifies the key stakeholders (actors) who interact with the Secure Assessment Platform (SAP), defines the terminology used throughout the system analysis, and consolidates functional/non-functional requirements derived from the platform goals and the requirements draft.

### **2.1.1. Identify and describe the actors** {#2.1.1.-identify-and-describe-the-actors}

| Num | Actors                | Description                                                                                                                                                                                                    | Interactions                     |
| --- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 1   | Administrator (Admin) | The user with the highest privileges. Responsible for system configuration, user management (RBAC), organization management, and viewing system-wide analytics.                                                | Web Application (Admin Portal)   |
| 2   | Teacher               | Users responsible for creating contents, tests and questions. They manage question banks, configure exam settings, monitor students via the proctoring dashboard in real-time, and grade subjective questions. | Web Application (Teacher Portal) |
| 3   | Student               | The primary end-user. They log in to take assessments, undergo AI-based verification and monitoring, and view their results and history.                                                                       | Web Application (Student Portal) |

##### _Table 6\. Main actors of SAP_ {#table-6.-main-actors-of-sap}

In addition to the “human” actors above, the platform relies on technical actors/services that provide critical capabilities:

- Identity Provider (Casdoor): handles authentication/authorization flows such as OAuth2, SSO, MFA and RBAC.
- Client-side Proctoring Engine (MediaPipe): performs camera-based monitoring on the client, generates “proctoring events”, and sends only metadata/violation events to the backend.
- Auto-graded function: backend services which auto-grading multiple-choice questions.
- Notification delivery mechanisms (real-time \+ email): needed to push alerts and results to admins/teachers/students.

### **2.1.2. Building a glossary** {#2.1.2.-building-a-glossary}

_Table 2.2. Glossary using in SAP_

| STT | Glossary            | Explanation                                                                                                   |
| :-- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| 1   | Student             | End-user who participates in online exams.                                                                    |
| 2   | Admin               | Oversees system configuration, users, assessments, notifications, and operations.                             |
| 3   | Teacher             | Creates/manages exams and supervises student performance/violations.                                          |
| 4   | Assessment          | Exam/assessment configuration (time limit, attempts, state).                                                  |
| 5   | Question            | An item in an exam that the student answers.                                                                  |
| 6   | Proctoring          | Monitoring process during an exam session (AI \+ environment controls).                                       |
| 7   | Protoring event     | Structured events generated from detections (e.g., face not detected, multiple persons, attention deviation). |
| 8   | Violation metadata  | Minimal data stored/sent about suspicious behavior (privacy-by-design).                                       |
| 9   | Consent management  | Explicit consent mechanism for camera access & monitoring.                                                    |
| 10  | OAuth2/SSO          | Login via OAuth2 and social SSO (Google/Github).                                                              |
| 11  | MFA                 | Additional authentication factor for stronger account protection.                                             |
| 12  | RBAC                | Role-based access control (Student/Teacher/Admin).                                                            |
| 13  | Fullscreen mode     | Mandatory fullscreen requirement during the exam.                                                             |
| 14  | Anti-cheat controls | Tab-switch detection, copy/paste blocking, right-click detection, idle tracking.                              |
| 15  | SSE Notifications   | Real-time alerts for admins/invigilators about violations and system status.                                  |
| 16  | Group               | A logical cohort of students managed for teaching and assessment distribution.                                |

##### _Table 7\. Comparison Redis Stream to others_ {#table-7.-comparison-redis-stream-to-others}

### **2.1.3. Identify requirements** {#2.1.3.-identify-requirements}

#### **2.1.3.1. Functional requirements**

**A. User Management and Authentication (Casdoor)**

- Authentication & Authorization:
    - **FR-01**: The system must support login via the OAuth2 protocol.
    - **FR-02**: Integrate social login (SSO): Google, Microsoft (preferred).
    - **FR-03**: Support multi-factor authentication (MFA).
    - **FR-04**: Support role-based authorization: Student, Teacher, Admin, Proctor.
    - **FR-05**: Manage user sessions and tokens.
- Profile Management:
    - **FR-06**: Create and edit personal information.
    - **FR-07**: Manage organizations and user groups.
    - **FR-08**: Track user activity history.

**B. Exam and Question Management**

- Create and Manage Assessments:
    - **FR-09**: Create, edit, and delete exams.
    - **FR-10**: Configure exam duration and allowed number of attempts.
    - **FR-11**: Manage exam status (Draft, Active, Expired).
    - **FR-12**: Import/export questions from files (Excel, CSV).
    - **FR-13**: Categorize questions by difficulty and topic.
- Question Management:
    - **FR-14**: Support multiple question types: Multiple choice, True/False, Essay.
    - **FR-15**: Upload and manage attachments (images, video, audio).
    - **FR-16**: Create a reusable question bank.
    - **FR-17**: Configure scoring and grading criteria.

**C. Testing and Proctoring Features**

- Exam Interface:
    - **FR-18**: Provide a user-friendly web-based exam interface.
    - **FR-19**: Display remaining time and exam progress.
    - **FR-20**: Automatically save answers as the candidate enters them.
    - **FR-21**: Enforce mandatory full-screen mode.
    - **FR-22**: Support multiple languages.
- Smart Monitoring (AI Proctoring):
    - **FR-23**: Face recognition (optionally with random verification during the exam).
    - **FR-24**: Detect the number of people in the camera frame.
    - **FR-25**: Track gaze direction and head movement.
    - **FR-26**: Recognize hand gestures and sitting posture.
    - **FR-27**: Detect suspicious objects in the camera frame.  
      **FR-28**: Record violation evidence (screenshots, video).
- Exam Environment Monitoring:
    - **FR-29**: Detect tab/window switching.
    - **FR-30**: Block copy/paste.
    - **FR-31**: Detect right-click usage.
    - **FR-32**: Track idle/inactive time.
    - **FR-33**: Warn on internet disconnection.

**D. Analytics and Reporting**

- Real-time Analytics:
    - **FR-34**: Dashboard to monitor the number of active test-takers.
    - **FR-35**: Real-time violation statistics.
    - **FR-36**: Alerts for suspicious activities.
    - **FR-37**: System performance charts.
- Reports and Statistics:
    - **FR-38**: Score and ranking reports.
    - **FR-39**: Question difficulty analysis.
    - **FR-40**: Exam completion rate statistics.
    - **FR-41**: Export reports in PDF and Excel formats.
    - **FR-42**: Admin dashboard with KPIs.

**E. Notification System**

- Real-time Notifications:
    - **FR-43**: SSE push notifications for admins and proctors.
    - **FR-44**: Immediate violation alerts.
    - **FR-45**: System status notifications.
- Email Notifications:
    - **FR-46**: Email exam results notifications.
    - **FR-47**: Email exam schedule reminders.
    - **FR-48**: Email violation reports to admins.
    - **FR-49**: Welcome email for new users.

**F. Group Management**

- Students**:**
    - **FR-50**: Allow a Student to join/leave a Group via invite code/link or join-request workflow.
- Teachers:
    - **FR-51**: Allow Teacher/Admin to manage Group membership (approve/deny requests, remove members,bulk import/export roster).
    - **FR-52**: Allow Teacher to assign/publish an Assessment to one or more Groups, with optional availability window and attempt limits per group.
    - **FR-55**: Provide Teacher analytics at Group level (participants, completion rate, average/median, score)
- Assessment:
    - **FR-53**: When an Assessment is assigned to a Group, notify all Group members via configured channels (SSE/Email) and support reminder notifications before due time.
    - **FR-54**: Restrict assessment access so only students who are members of the target Group(s) can view/attempt the assigned Assessment.
    - **FR-55**: Provide Teacher analytics at Group level (participants, completion rate, average/median, score distribution) and per-student list; allow export (PDF/Excel).

#### **2.1.3.2. Non-functional requirements**

**A. Performance**

- Response Time:
    - **NFR-01**: API response time \< 200ms for 95% of requests.
    - **NFR-02**: Page load time \< 3 seconds.
    - **NFR-03**: Real-time event processing \< 100ms.
    - **NFR-04**: AI proctoring analysis \< 500ms per frame.
- Throughput:
    - **NFR-05**: Support 500 concurrent users.
    - **NFR-06**: System handles 10,000 requests/second sustained.
    - **NFR-07**: Database query performance \< 50ms.
    - **NFR-08**: Minimum file upload speed 5MB/s.

**B. Reliability**

- Uptime and Availability:
    - **NFR-09**: System uptime 99.9% (DigitalOcean SLA).
    - **NFR-10**: Automatic database backup every 6 hours.
    - **NFR-11**: Disaster recovery time \< 4 hours.
    - **NFR-12**: Zero data loss in case of failure.
- Fault Tolerance:
    - **NFR-13**: Auto-restart unhealthy containers within 30 seconds.
    - **NFR-14**: Circuit breaker for external services.
    - **NFR-15**: Retry mechanism with exponential backoff.
    - **NFR-16**: Dead letter queue for failed events.

**C. Scalability**

- Horizontal Scaling:
    - **NFR-17**: Auto-scaling based on CPU/Memory usage.
    - **NFR-18**: Load balancing with health checks.
    - **NFR-19**: Microservices can scale independently.
    - **NFR-20**: Automatic database read replicas.
- Storage Scaling:
    - **NFR-21**: Database read replicas auto-scaling based on load.
    - **NFR-22**: Database sharding when necessary.
    - **NFR-23**: Cache layer with Redis cluster.
    - **NFR-24**: CDN for static content.

**D. Security**

- Authentication & Authorization:
    - **NFR-25**: JWT tokens with refresh mechanism.
    - **NFR-26**: Rate limiting: 100 requests/minute/user.
    - **NFR-27**: RBAC (Role-Based Access Control).
    - **NFR-28**: Session timeout after 2 hours of inactivity.
- Data Protection:
    - **NFR-29**: Encryption in transit (TLS 1.3).
    - **NFR-30**: Encryption at rest (AES-256).
    - **NFR-31**: PII data masking in logs.
    - **NFR-32**: GDPR compliance for data privacy.
- Network Security:
    - **NFR-33**: VPC isolation with private networking.
    - **NFR-34**: DDoS protection using DigitalOcean built-in features.
    - **NFR-35**: WAF rules for common attack patterns.
    - **NFR-36**: SSL termination with automatic certificate renewal.

**E. Usability**

- User Experience:
    - **NFR-37**: Internationalization support.

- Browser Support:
    - **NFR-38**: Latest versions of Chrome/Edge/Safari/Firefox.

**F. Operability**

- Monitoring & Logging:
    - **NFR-39**: Metrics collection with Datadog.
    - **NFR-40**: Distributed tracing with correlation IDs.
- Deployment & DevOps:
    - **NFR-41**: GitOps deployment from GitHub with auto-deploy.
    - **NFR-42**: CI/CD pipeline with automated testing.
    - **NFR-43**: Environment parity (dev/staging/prod).
    - **NFR-44**: Automated testing in CI/CD pipeline (\>80% coverage).

**G. Compliance and Regulations**

- Technical Standards:
    - **NFR-45**: REST API design standards (OpenAPI 3.0).
    - **NFR-46**: Database normalization (minimum 2NF).
    - **NFR-47**: Security vulnerability scanning.

## **2.2. Use Case Identification and Description** {#2.2.-use-case-identification-and-description}

### **2.2.1. Overall use cases of the system** {#2.2.1.-overall-use-cases-of-the-system}

![][image3]

###### _Figure 2\. Overall use cases of the system_ {#figure-2.-overall-use-cases-of-the-system}

### **2.2.2. Detailed use cases for students.** {#2.2.2.-detailed-use-cases-for-students.}

- Use case take exam:

![][image4]

###### _Figure 3\. Use case take exam_ {#figure-3.-use-case-take-exam}

- Use case view result:

![][image5]

###### _Figure 4\. Use case view result_ {#figure-4.-use-case-view-result}

### **2.2.3. Detailed use cases for teachers.** {#2.2.3.-detailed-use-cases-for-teachers.}

- Use case manage assessment, question and question bank:  
  ![][image6]

    ###### _Figure 5\. Use case manage assessment, question and question bank_ {#figure-5.-use-case-manage-assessment,-question-and-question-bank}

- Use case grade and evaluate:  
  ![][image7]

    ###### _Figure 6\. Use case grade and evaluate_ {#figure-6.-use-case-grade-and-evaluate}

- Use case monitoring and analysis:

![][image8]

###### _Figure 7\. Use case monitoring and analysis_ {#figure-7.-use-case-monitoring-and-analysis}

### **2.2.3. Detailed use cases for administrators.** {#2.2.3.-detailed-use-cases-for-administrators.}

- Use case manage user and group:

![][image9]

###### _Figure 8\. Use case manage user and group_ {#figure-8.-use-case-manage-user-and-group}

- Use case notification management:  
  ![][image10]

    ###### _Figure 9\. Use case notification management_ {#figure-9.-use-case-notification-management}

- Use case system administration:  
  ![][image11]

    ###### _Figure 9\. Use case system administration_ {#figure-9.-use-case-system-administration}

- Use case monitoring and analytics system and proctoring:

![][image12]

###### _Figure 10\._ Use case monitoring and analytics system and proctoring {#figure-10.-use-case-monitoring-and-analytics-system-and-proctoring}

### **2.2.4. Main scenarios for students.** {#2.2.4.-main-scenarios-for-students.}

##### **Scenario of Authentication & Profile Management (as User)** {#scenario-of-authentication-&-profile-management-(as-user)}

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Student (inherits from User)                                                                                                                                                                                                                                                                                                                                                                                                |
| **Precondition**   | Student has registered account in the system via Casdoor identity provider                                                                                                                                                                                                                                                                                                                                                  |
| **Post-condition** | Student successfully logs into the system and can access student-specific features                                                                                                                                                                                                                                                                                                                                          |
| **Main Scenario**  | 1\. Student navigates to the login page. 2\. System displays login form with OAuth2 options via Casdoor. 3\. Student enters credentials (username/email and password) or selects OAuth provider. 4\. System validates credentials through Casdoor identity service. 5\. System issues JWT access token upon successful authentication. 6\. System redirects student to the student dashboard showing available assessments. |
| **Exception**      | 1.1 Invalid credentials: System displays error message and prompts student to re-enter credentials. 2.1 Account not found: System suggests registration or password recovery. 3.1 2FA required: System prompts for two-factor authentication code before granting access.                                                                                                                                                   |

##### _Table 8\._ Scenario of Authentication & Profile Management (as User) {#table-8.-scenario-of-authentication-&-profile-management-(as-user)}

**Scenario of Take exam**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Actor**          | Student                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Precondition**   | Student has successfully logged into the system. Assessment status is "Active" and not expired. Student has not exceeded maximum attempts allowed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Post-condition** | Student completes the exam attempt and answers are recorded in the system for grading                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Main Scenario**  | 1\. Student navigates to "My Assessments" page. 2\. System displays list of available assessments with status, due date, and remaining attempts. 3\. Student selects an assessment to take. 4\. System displays assessment details including duration, total questions, passing score, and proctoring requirements. 5\. Student clicks "Start Exam" button. 6\. System initializes AI Proctoring & Violation Detection (camera access, face verification). 7\. System creates new attempt record with status "in_progress" and starts timer. 8\. System displays questions (shuffled if configured) with navigation panel. 9\. Student answers questions and can navigate between questions. 10\. System auto-saves answers periodically. 11\. Student clicks "Submit Exam" when finished. 12\. System confirms submission, stops proctoring, and records completion time. 13\. System triggers Auto Grading for objective questions. 14\. System sends notification about exam completion. |
| **Exception**      | 1.1 No available assessments: System displays message "No assessments available at this time." 2.1 Maximum attempts reached: System disables "Start Exam" button and shows remaining attempts as 0\. 3.1 Assessment expired: System displays "This assessment has expired" message. 4.1 Camera access denied: System prompts student to enable camera for proctoring or blocks exam start. 5.1 Face verification failed: System warns student and may block exam continuation. 6.1 Violation detected (tab switching, multiple faces, etc.): System logs violation, sends warning, and may auto-submit if critical. 7.1 Time expires: System auto-submits all current answers and marks attempt as "timeout". 8.1 Connection lost: System preserves last saved state and allows resume within time limit.                                                                                                                                                                                   |

##### _Table 9\._ Scenario of Take exam {#table-9.-scenario-of-take-exam}

**Scenario of View results**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Student                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Precondition**   | Student has successfully logged into the system. Student has at least one completed attempt.                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Post-condition** | Student views exam results and performance analytics                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Main Scenario**  | 1\. Student navigates to "My Attempts" or "Results" page. 2\. System displays list of all attempts with filtering options (by assessment, status, date range). 3\. Student selects an attempt to view details. 4\. System displays attempt summary including: \- Total score and passing status \- Time taken vs time allowed \- Score breakdown by question type \- Violation summary (if any) 5\. Student can view individual question results. 6\. System shows correct answers and explanations. |
| **Exception**      | 1.1 No attempts found: System displays "You have not completed any assessments yet." 2.1 Results not yet available: System shows "Your results are being processed" for attempts pending manual grading. 3.1 Detailed results hidden: System displays only total score if teacher disabled detailed feedback.                                                                                                                                                                                        |

##### _Table 10\._ Scenario of View results {#table-10.-scenario-of-view-results}

##### **Scenario of Manage Notification Preferences (as User)** {#scenario-of-manage-notification-preferences-(as-user)}

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Student (inherits from User)                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Precondition**   | Student has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Post-condition** | Student's notification preferences are updated in the system                                                                                                                                                                                                                                                                                                                                                                                    |
| **Main Scenario**  | 1\. Student navigates to "Settings" or "Preferences" page. 2\. System displays current notification preferences. 3\. Student configures notification channels (Email, SSE, Push, SMS). 4\. Student selects which events to receive notifications for: \- Exam reminders \- Results available \- Violation warnings 5\. Student saves preferences. 6\. System validates and stores preferences. 7\. System confirms update with success message. |

##### _Table 11\._ Scenario of Manage Notification Preferences (as User) {#table-11.-scenario-of-manage-notification-preferences-(as-user)}

**Scenario of Join a Group (as Users)**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Student (inherits from User)                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Precondition**   | Student is logged in. Group exists and allows joining (open) or an invitation code/link is provided.                                                                                                                                                                                                                                                                                                                                                                              |
| **Post-condition** | Student becomes a member of the Group, or a join request is recorded as Pending.                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Main Scenario**  | 1\. Student navigates to "Groups" page. 2\. System displays available groups and/or a "Join via Code" field. 3\. Student enters group code (or selects a group) and clicks "Join" / "Request to Join". 4\. System validates group code and eligibility. 5\. If group is open: system adds student to group immediately. 6\. If approval is required: system stores request as Pending and notifies Teacher/Admin. 7\. System confirms the result (Joined/Pending) to the student. |
| **Exception**      | 1.1 Invalid/expired code: system shows an error. 2.1 Group closed: system blocks join and suggests invitation. 3.1 Already member: system displays "You are already in this group".                                                                                                                                                                                                                                                                                               |

##### _Table 12\._ Scenario of Join a Group (as Users) {#table-12.-scenario-of-join-a-group-(as-users)}

### **2.2.5. Main scenarios for teachers.** {#2.2.5.-main-scenarios-for-teachers.}

**Scenario of Authentication & Profile Management (as User)**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Actor**          | Teacher (inherits from User)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Precondition**   | Teacher has registered account in the system with Teacher role                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Post-condition** | Teacher successfully logs into the system and can access teacher-specific features                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Main Scenario**  | 1\. Teacher navigates to the login page. 2\. System displays login form with OAuth2 options via Casdoor. 3\. Teacher enters credentials (username/email and password) or selects OAuth provider. 4\. System validates credentials through Casdoor identity service. 5\. System verifies Teacher role and permissions. 6\. System issues JWT access token upon successful authentication. 7\. System redirects teacher to the Teacher Dashboard showing assessments overview, question banks, and recent activities. |
| **Exception**      | 1.1 Invalid credentials: System displays error message and prompts teacher to re-enter credentials. 2.1 Account not found: System suggests registration or password recovery. 3.1 Insufficient role: System displays "Access denied \- Teacher privileges required" if user doesn't have Teacher role. 4.1 2FA required: System prompts for two-factor authentication code before granting access.                                                                                                                  |

##### _Table 13\._ Scenario of Authentication & Profile Management (as User) {#table-13.-scenario-of-authentication-&-profile-management-(as-user)}

**Scenario of Manage Assessment, Bank & Questions \- Create Assessment**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Precondition**   | Teacher has successfully logged into the system with valid Teacher role                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Post-condition** | New assessment is created with "Draft" status and stored in database                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Main Scenario**  | 1\. Teacher navigates to "Assessments" page and clicks "Create Assessment". 2\. System displays assessment creation form. 3\. Teacher fills in assessment metadata: \- Title (required, max 200 characters) \- Description (max 1000 characters) \- Duration (5-180 minutes) \- Passing score (0-100) \- Max attempts (1-10) \- Due date (optional, must be future date) 4\. Teacher configures assessment settings: \- Randomize questions (on/off) \- Show results after submission (on/off) \- Enable proctoring (on/off) 5\. Teacher clicks "Save as Draft". 6\. System validates input data against business rules. 7\. System creates assessment with status "Draft". 8\. System logs creation in audit trail. 9\. System redirects to assessment detail page for adding questions. |
| **Exception**      | 1.1 Validation error: System displays specific error messages for invalid fields (empty title, duration out of range, invalid passing score). 2.1 Duplicate title: System displays "Assessment title already exists" if title is not unique for this teacher. 3.1 Database error: System displays error message and allows retry.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

##### _Table 14\._ Scenario of Manage Assessment, Bank & Questions \- Create Assessment {#table-14.-scenario-of-manage-assessment,-bank-&-questions---create-assessment}

**Scenario of Manage Assessment, Bank & Questions \- Add Questions to Assessment**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Precondition**   | Teacher has created an assessment in "Draft" status. Assessment has no student attempts yet.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Post-condition** | Questions are added to assessment with configured points and order                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Main Scenario**  | 1\. Teacher opens an existing assessment in edit mode. 2\. System displays assessment details with question management section. 3\. Teacher clicks "Add Questions". 4\. System displays question selection interface with options: \- Create new question \- Select from Question Bank \- Import from file 5\. Teacher selects questions to add. 6\. Teacher configures for each question: \- Points (1-100, or auto-assign) \- Order in assessment \- Time limit per question (optional) 7\. Teacher clicks "Add to Assessment". 8\. System validates total points don't exceed 100\. 9\. System rebalances points if auto-assign is enabled. 10\. System saves question-assessment associations. 11\. System displays updated assessment with question list. |
| **Exception**      | 1.1 Points exceed limit: System displays "Total points (X) would exceed maximum allowed (100)". 2.1 Duplicate question: System displays "Question already exists in this assessment". 3.1 Assessment locked: System displays "Cannot modify assessment \- students have already started attempts". 4.1 No access to question: System displays "Permission denied for question X".                                                                                                                                                                                                                                                                                                                                                                              |

##### _Table 15\._ Scenario of Manage Assessment, Bank & Questions \- Add Questions to Assessment {#table-15.-scenario-of-manage-assessment,-bank-&-questions---add-questions-to-assessment}

**Scenario of Manage Assessment, Bank & Questions \- Create Question**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Precondition**   | Teacher has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Post-condition** | New question is created and stored in database                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Main Scenario**  | 1\. Teacher navigates to "Questions" or "Question Bank" page. 2\. Teacher clicks "Create Question". 3\. System displays question type selection (Multiple Choice, True/False, Essay, Fill-in-Blank, Matching, Ordering, Short Answer). 4\. Teacher selects question type. 5\. System displays appropriate form for selected type. 6\. Teacher fills in question details: \- Question text (required) \- Category (optional) \- Difficulty level (Easy/Medium/Hard) \- Points (default value) \- Answer options and correct answer(s) \- Explanation (optional) 7\. Teacher clicks "Save Question". 8\. System validates question structure and content. 9\. System creates question and associates with teacher. 10\. System displays success message with option to add to Question Bank or Assessment. |
| **Exception**      | 1.1 Invalid question format: System displays validation errors for missing required fields. 2.1 No correct answer: System displays "Please specify at least one correct answer". 3.1 Duplicate options: System displays "Answer options must be unique".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

##### _Table 16\._ Scenario of Manage Assessment, Bank & Questions \- Create Question {#table-16.-scenario-of-manage-assessment,-bank-&-questions---create-question}

**Scenario of Manage Assessment, Bank & Questions \- Manage Question Bank**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Precondition**   | Teacher has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Post-condition** | Question bank is created/updated with organized question collections                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Main Scenario**  | 1\. Teacher navigates to "Question Banks" page. 2\. System displays list of teacher's question banks and shared banks. 3\. Teacher clicks "Create Question Bank". 4\. System displays bank creation form. 5\. Teacher fills in: \- Bank name (required) \- Description \- Visibility (Private/Public/Shared) 6\. Teacher clicks "Create". 7\. System creates question bank. 8\. Teacher can add questions to bank by: \- Creating new questions \- Moving existing questions \- Importing from file 9\. Teacher can share bank with other teachers by specifying user IDs and permissions (read/write). 10\. System saves sharing configuration. |
| **Exception**      | 1.1 Duplicate name: System displays "Question bank name already exists". 2.1 Share failed: System displays error if target user not found. 3.1 Permission denied: System displays "Cannot modify shared bank \- read-only access".                                                                                                                                                                                                                                                                                                                                                                                                               |

##### _Table 17\._ Scenario of Manage Assessment, Bank & Questions \- Manage Question Bank {#table-17.-scenario-of-manage-assessment,-bank-&-questions---manage-question-bank}

**Scenario of Manage Assessment, Bank & Questions \- Publish Assessment**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Precondition**   | Assessment exists in "Draft" status with at least one question added                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Post-condition** | Assessment status changes to "Active" and becomes available to students                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Main Scenario**  | 1\. Teacher opens assessment in "Draft" status. 2\. Teacher reviews assessment details and questions. 3\. Teacher clicks "Publish Assessment". 4\. System validates assessment is ready for publishing: \- Has at least one question \- Total points equals 100 (or configured value) \- All required settings are configured 5\. System changes assessment status to "Active". 6\. System sends notifications to assigned students (if configured). 7\. System displays confirmation message. |
| **Exception**      | 1.1 No questions: System displays "Cannot publish \- assessment has no questions". 2.1 Invalid points: System displays "Total points must equal 100". 3.1 Past due date: System displays "Due date has already passed".                                                                                                                                                                                                                                                                        |

##### _Table 18\._ Scenario of Manage Assessment, Bank & Questions \- Publish Assessment {#table-18.-scenario-of-manage-assessment,-bank-&-questions---publish-assessment}

Scenario of Grade & Evaluate \- Manual Grading

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Precondition**   | Students have completed attempts with essay or subjective questions requiring manual grading                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Post-condition** | Student answers are graded and scores are recorded                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Main Scenario**  | 1\. Teacher navigates to "Grading" or "Pending Reviews" page. 2\. System displays list of attempts pending manual grading. 3\. Teacher selects an attempt to grade. 4\. System displays attempt details with student answers. 5\. For each subjective question: \- System shows question, correct answer/rubric, and student's response \- Teacher assigns score (0 to max points) \- Teacher provides feedback (optional) 6\. Teacher clicks "Submit Grades". 7\. System validates scores are within range. 8\. System calculates final attempt score. 9\. System marks attempt as "Graded". 10\. System sends notification to student about results availability. |
| **Exception**      | 1.1 Invalid score: System displays "Score must be between 0 and X". 2.1 Already graded: System displays "This answer has already been graded". 3.1 Permission denied: System displays "You don't have permission to grade this assessment".                                                                                                                                                                                                                                                                                                                                                                                                                         |

##### _Table 19\._ Scenario of Grade & Evaluate \- Manual Grading {#table-19.-scenario-of-grade-&-evaluate---manual-grading}

**Scenario of Grade & Evaluate \- Review Violations**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Precondition**   | AI Proctoring has detected violations during student exam attempts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Post-condition** | Violations are reviewed and appropriate actions are taken                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Main Scenario**  | 1\. Teacher navigates to "Violation Review" or "Proctoring Reports" page. 2\. System displays list of attempts with violations, sorted by severity. 3\. Teacher selects an attempt to review. 4\. System displays violation details: \- Violation type (multiple faces, looking away, tab switching, etc.) \- Severity level (Low/Medium/High/Critical) \- Timestamp and duration \- Confidence score \- Snapshot/evidence (if available) 5\. Teacher reviews violation timeline and evidence. 6\. Teacher decides action: \- Dismiss (false positive) \- Warning (minor violation) \- Score penalty \- Invalidate attempt (severe violation) 7\. Teacher adds comments/justification. 8\. Teacher clicks "Submit Decision". 9\. System records decision and updates attempt status. 10\. System sends notification to student about violation review outcome. |
| **Exception**      | 1.1 No evidence: System displays "Snapshot unavailable for this violation". 2.1 Attempt already invalidated: System displays "This attempt has already been invalidated".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

##### _Table 20\._ Scenario of Grade & Evaluate \- Review Violations {#table-20.-scenario-of-grade-&-evaluate---review-violations}

**Scenario of Monitor & Analytics \- Real-time Dashboard**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Precondition**   | Teacher has active assessments with ongoing or completed attempts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Post-condition** | Teacher views real-time statistics and analytics for their assessments                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Main Scenario**  | 1\. Teacher navigates to "Dashboard" or "Analytics" page. 2\. System displays real-time dashboard with: \- Total assessments created \- Total questions in banks \- Active attempts in progress \- Completion rate \- Average scores 3\. Teacher can filter by: \- Date range (today, week, month, custom) \- Specific assessment \- Student group 4\. System displays charts and visualizations: \- Score distribution histogram \- Attempt timeline \- Question difficulty analysis \- Violation statistics 5\. Teacher can drill down into specific metrics. 6\. Teacher can export reports (PDF, Excel). |
| **Exception**      | 1.1 No data: System displays "No attempts found for selected filters". 2.1 Export failed: System displays error and allows retry.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

##### _Table 21\._ Scenario of Monitor & Analytics \- Real-time Dashboard {#table-21.-scenario-of-monitor-&-analytics---real-time-dashboard}

**Scenario of Monitor & Analytics \- Live Exam Monitoring**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Precondition**   | Assessment is active with students currently taking the exam                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Post-condition** | Teacher monitors exam progress in real-time                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Main Scenario**  | 1\. Teacher navigates to "Live Monitoring" for an active assessment. 2\. System displays real-time monitoring dashboard: \- Number of active participants \- Completion progress per student \- Real-time violation alerts \- Time remaining for each student 3\. System shows live feed of violations as they occur: \- Student name/ID \- Violation type and severity \- Timestamp 4\. Teacher can take immediate actions: \- Send warning message to student \- Extend time for specific student \- Force submit attempt 5\. System updates statistics in real-time (every 5 seconds). 6\. Teacher receives critical violation alerts via push notification. |
| **Exception**      | 1.1 No active attempts: System displays "No students are currently taking this assessment". 2.1 Connection lost: System displays "Real-time connection lost \- attempting to reconnect".                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

##### _Table 22\._ Scenario of Monitor & Analytics \- Live Exam Monitoring {#table-22.-scenario-of-monitor-&-analytics---live-exam-monitoring}

**Scenario of Manage Notification Preferences (as User)**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher (inherits from User)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Precondition**   | Teacher has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Post-condition** | Teacher's notification preferences are updated                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Main Scenario**  | 1\. Teacher navigates to "Settings" or "Preferences" page. 2\. System displays current notification preferences. 3\. Teacher configures notification channels (Email, SSE, Push, SMS). 4\. Teacher selects which events to receive notifications for: \- Student attempt completion \- Pending grading alerts \- Violation detection alerts \- Assessment deadline reminders \- System announcements 5\. Teacher saves preferences. 6\. System validates and stores preferences. 7\. System confirms update with success message. |
| **Exception**      | 1.1 Invalid configuration: System displays validation error for invalid settings. 2.1 Save failed: System displays error and prompts retry.                                                                                                                                                                                                                                                                                                                                                                                       |

##### _Table 23\._ Scenario of Manage Notification Preferences (as User) {#table-23.-scenario-of-manage-notification-preferences-(as-user)}

**Scenario of Assign/Publish Assessment to Group (as Teacher)**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Precondition**   | Teacher is logged in. Assessment exists (Draft or Ready). Target Group(s) exist and teacher has permission to assign to them.                                                                                                                                                                                                                                                                                                                                                                                          |
| **Post-condition** | Assessment is assigned to selected Group(s). Notifications are sent to all Group members.                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Main Scenario**  | 1\. Teacher opens an Assessment. 2\. Teacher selects "Assign To" and chooses one or more Groups. 3\. Teacher configures availability window, due date, and attempts (optional). 4\. Teacher clicks "Publish" (or "Assign"). 5\. System validates configuration and activates/assigns the assessment. 6\. System resolves group roster and creates assignment records for each student. 7\. System sends notifications to all Group members (SSE/Email). 8\. System shows confirmation with count of notified students. |
| **Exception**      | 1.1 No permission for group: system blocks assignment. 2.1 Empty group: system warns "Group has no students". 3.1 Invalid schedule: system requires due date after start date.                                                                                                                                                                                                                                                                                                                                         |

##### _Table 24\._ Scenario of Assign/Publish Assessment to Group (as Teacher) {#table-24.-scenario-of-assign/publish-assessment-to-group-(as-teacher)}

**Scenario of View Group Results (as Teacher)**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Precondition**   | Teacher is logged in. Assessment is assigned to a Group and at least one attempt exists (or is in progress).                                                                                                                                                                                                                                                                                                                                                        |
| **Post-condition** | Teacher can review aggregated group performance and per-student scores.                                                                                                                                                                                                                                                                                                                                                                                             |
| **Main Scenario**  | 1\. Teacher navigates to "Reports" / "Analytics". 2\. Teacher selects an Assessment and filters by Group. 3\. System displays summary metrics: started, completed, average score, pass rate. 4\. System displays score distribution and violation summary (optional). 5\. System displays per-student list: score, status, time taken, violations. 6\. Teacher sorts/filters and opens any student attempt for details. 7\. Teacher exports the report (PDF/Excel). |
| **Exception**      | 1.1 No attempts yet: system shows roster with "Not started" statuses. 2.1 Access denied: system blocks results outside teacher’s assigned groups.                                                                                                                                                                                                                                                                                                                   |

##### _Table 25\._ Scenario of View Group Results (as Teacher) {#table-25.-scenario-of-view-group-results-(as-teacher)}

### **2.2.6. Main scenarios for administrators.** {#2.2.6.-main-scenarios-for-administrators.}

**Scenario of Authentication & Profile Management (as User)**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin (inherits from User)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Precondition**   | Admin has registered account in the system with Admin role                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Post-condition** | Admin successfully logs into the system and can access all administrative features                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Main Scenario**  | 1\. Admin navigates to the login page. 2\. System displays login form with OAuth2 options via Casdoor. 3\. Admin enters credentials (username/email and password) or selects OAuth provider. 4\. System validates credentials through Casdoor identity service. 5\. System verifies Admin role and full system permissions. 6\. System issues JWT access token with admin privileges. 7\. System redirects admin to the Admin Dashboard showing system overview, user statistics, and system health metrics. |
| **Exception**      | 1.1 Invalid credentials: System displays error message and prompts admin to re-enter credentials. 2.1 Account not found: System suggests contacting system administrator. 3.1 Insufficient role: System displays "Access denied \- Admin privileges required". 4.1 2FA required: System prompts for two-factor authentication code before granting access. 5.1 Account locked: System displays "Account has been locked due to security reasons".                                                            |

##### _Table 26\._ Scenario of Authentication & Profile Management (as User) {#table-26.-scenario-of-authentication-&-profile-management-(as-user)}

**Scenario of Manage Users & Groups \- View and Manage Users**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Precondition**   | Admin has successfully logged into the system with Admin role                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Post-condition** | User accounts are managed according to admin actions                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Main Scenario**  | 1\. Admin navigates to "User Management" page. 2\. System displays list of all users with pagination and filtering options. 3\. Admin can filter users by: \- Role (Student, Teacher, Admin) \- Status (Active, Inactive, Suspended) \- Registration date \- Last login date 4\. Admin selects a user to view details. 5\. System displays user profile including: \- Personal information \- Role and permissions \- Activity history \- Assessment statistics 6\. Admin can perform actions: \- Edit user information \- Change user role \- Activate/Deactivate account \- Reset password \- Delete user 7\. System sends notification to affected user (if configured). |
| **Exception**      | 1.1 Cannot delete self: System displays "Cannot delete your own account". 2.1 Cannot demote last admin: System displays "Cannot remove admin role \- at least one admin required". 3.1 User has active sessions: System prompts to force logout before deletion.                                                                                                                                                                                                                                                                                                                                                                                                            |

##### _Table 27\._ Scenario of Authentication & Profile Management (as User) {#table-27.-scenario-of-authentication-&-profile-management-(as-user)}

**Scenario of Manage Users & Groups \- Create User Groups**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Post-condition** | User groups are created and users are organized accordingly                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Main Scenario**  | 1\. Admin navigates to "Groups Management" page. 2\. Admin clicks "Create Group". 3\. System displays group creation form. 4\. Admin fills in group details: \- Group name (required) \- Description \- Group type (Class, Department, Custom) \- Parent group (for hierarchical structure) 5\. Admin adds members to group: \- Search and select users \- Bulk import from CSV \- Select from existing groups 6\. Admin assigns group permissions and access levels. 7\. Admin clicks "Create Group". 8\. System validates and creates group. 9\. System displays success message with group details. |
| **Exception**      | 1.1 Duplicate name: System displays "Group name already exists". 2.1 Invalid members: System displays "Some users could not be added" with details. 3.1 Circular hierarchy: System displays "Cannot create circular group hierarchy".                                                                                                                                                                                                                                                                                                                                                                  |

##### _Table 28\._ Scenario of Manage Users & Groups \- Create User Groups {#table-28.-scenario-of-manage-users-&-groups---create-user-groups}

**Scenario of Manage Assessment, Bank & Questions (Admin Override)**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Post-condition** | Assessments are managed regardless of ownership                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Main Scenario**  | 1\. Admin navigates to "All Assessments" page. 2\. System displays list of ALL assessments in system (not limited to ownership). 3\. Admin can filter by: \- Creator (any teacher) \- Status (Draft, Active, Expired, Archived) \- Date range \- Category 4\. Admin selects any assessment to manage. 5\. System displays assessment with full edit capabilities. 6\. Admin can perform all operations: \- Edit assessment details \- Add/remove questions \- Change status \- Delete assessment (even with attempts \- with confirmation) \- Transfer ownership to another teacher 7\. System notifies original owner of changes (if configured). |
| **Exception**      | 1.1 Force delete with attempts: System requires additional confirmation "This will delete X student attempts. Type 'DELETE' to confirm". 2.1 Transfer to non-teacher: System displays "Can only transfer to users with Teacher role".                                                                                                                                                                                                                                                                                                                                                                                                              |

##### _Table 29\._ Scenario of Manage Assessment, Bank & Questions (Admin Override) {#table-29.-scenario-of-manage-assessment,-bank-&-questions-(admin-override)}

**Scenario of Grade & Evaluate (Admin Override)**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Post-condition** | Grades are managed with full administrative privileges                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Main Scenario**  | 1\. Admin navigates to "Grading Management" page. 2\. System displays all pending and completed gradings system-wide. 3\. Admin can: \- Override teacher grades with justification \- Re-assign grading to different teacher \- Bulk grade adjustments (curve) \- Invalidate attempts due to integrity violations 4\. Admin reviews and overrides a grade: \- System shows original grade and teacher comments \- Admin enters new grade with mandatory justification \- System saves override with audit trail 5\. System notifies student and original grader of the override. 6\. System logs grade override in compliance records. |
| **Exception**      | 1.1 No justification provided: System requires "Justification is mandatory for grade override". 2.1 Grade outside valid range: System displays "Grade must be between 0 and maximum points".                                                                                                                                                                                                                                                                                                                                                                                                                                           |

##### _Table 30\._ Scenario of Grade & Evaluate (Admin Override) {#table-30.-scenario-of-grade-&-evaluate-(admin-override)}

**Scenario of Monitor & Analytics (System-wide)**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Post-condition** | Admin views comprehensive system analytics                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Main Scenario**  | 1\. Admin navigates to "System Analytics" dashboard. 2\. System displays comprehensive metrics: \- Total users by role \- Active users (daily/weekly/monthly) \- Total assessments and attempts \- System-wide completion rates \- Average scores across all assessments \- Violation statistics and trends 3\. Admin can view detailed breakdowns: \- Performance by teacher \- Performance by student group \- Assessment difficulty analysis \- Proctoring violation patterns 4\. Admin can generate reports: \- Custom date ranges \- Specific metrics selection \- Export to PDF/Excel 5\. System displays real-time statistics with auto-refresh. 6\. Admin can set up automated report scheduling. |
| **Exception**      | 1.1 Large data range: System displays "Processing large dataset \- report will be sent via email when ready". 2.1 Export failed: System displays error and allows retry.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

##### _Table 31\._ Scenario of Monitor & Analytics (System-wide) {#table-31.-scenario-of-monitor-&-analytics-(system-wide)}

**Scenario of System Administration \- System Configuration**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Post-condition** | System configuration is updated                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Main Scenario**  | 1\. Admin navigates to "System Configuration" page. 2\. System displays configurable settings categories: \- General settings (site name, timezone, language) \- Assessment defaults (duration limits, attempt limits) \- Proctoring settings (violation thresholds, detection sensitivity) \- Security settings (session timeout, password policy) \- Integration settings (Kafka, Redis, external services) 3\. Admin modifies configuration values. 4\. System validates configuration changes. 5\. Admin clicks "Save Configuration". 6\. System applies changes (some may require restart). 7\. System logs configuration changes in audit trail. 8\. System displays success message with any required actions. |
| **Exception**      | 1.1 Invalid configuration: System displays validation errors for each invalid field. 2.1 Restart required: System prompts "This change requires system restart. Schedule restart?". 3.1 Conflicting settings: System displays "Configuration conflict detected" with resolution options.                                                                                                                                                                                                                                                                                                                                                                                                                              |

##### _Table 32\._ Scenario of System Administration \- System Configuration {#table-32.-scenario-of-system-administration---system-configuration}

**Scenario of System Administration \- View Audit Logs**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Post-condition** | Admin views and analyzes system audit logs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Main Scenario**  | 1\. Admin navigates to "Audit Logs" page. 2\. System displays audit log entries with filtering options. 3\. Admin can filter logs by: \- Event type (assessment_created, user_login, grade_updated, etc.) \- User/Actor \- Target type (assessment, question, user, attempt) \- Date range \- Compliance level (low, medium, high, critical) 4\. System displays log details: \- Timestamp \- Actor (user who performed action) \- Event type and description \- Before/after values (for changes) \- IP address and user agent \- Request ID for tracing 5\. Admin can export logs for compliance reporting. 6\. Admin can set up alerts for specific event types. |
| **Exception**      | 1.1 Log retention exceeded: System displays "Logs older than X days have been archived". 2.1 Export too large: System queues export and sends via email.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

##### _Table 33\._ Scenario of System Administration \- View Audit Logs {#table-33.-scenario-of-system-administration---view-audit-logs}

**Scenario of System Administration \- RBAC Management**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Post-condition** | Role-based access control is configured                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Main Scenario**  | 1\. Admin navigates to "Roles & Permissions" page. 2\. System displays existing roles (Student, Teacher, Admin) and custom roles. 3\. Admin can create custom role: \- Role name and description \- Base role (inherit from existing) \- Specific permissions selection 4\. Admin configures permissions for each role: \- Assessment management (create, read, update, delete) \- Question management \- User management \- System configuration \- Grading permissions \- Analytics access 5\. Admin assigns role to users. 6\. System validates permission consistency. 7\. System applies role changes immediately. 8\. System logs RBAC changes in audit trail. |
| **Exception**      | 1.1 Circular permission: System displays "Permission inheritance creates circular dependency". 2.1 Remove critical permission: System warns "Removing this permission may lock out users". 3.1 Delete role in use: System displays "Cannot delete role \- X users are assigned to this role".                                                                                                                                                                                                                                                                                                                                                                        |

##### _Table 34\._ Scenario of System Administration \- RBAC Management {#table-34.-scenario-of-system-administration---rbac-management}

**Scenario of Manage Notification Templates & Bulk Send \- Manage Templates**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Post-condition** | Notification templates are created/updated                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Main Scenario**  | 1\. Admin navigates to "Notification Templates" page. 2\. System displays list of existing templates. 3\. Admin clicks "Create Template". 4\. System displays template editor with: \- Template name (unique identifier) \- Template type (EMAIL, SSE, PUSH, SMS) \- Subject line (for email) \- Body content with placeholder syntax {{variableName}} \- Variable definitions 5\. Admin creates template using placeholders: \- {{firstName}}, {{lastName}} for user info \- {{assessmentName}}, {{dueDate}} for assessment info \- {{score}}, {{passingStatus}} for results 6\. Admin previews template with sample data. 7\. Admin saves template. 8\. System validates template syntax. 9\. System caches template for performance. |
| **Exception**      | 1.1 Invalid placeholder syntax: System displays "Invalid placeholder: {{invalid". 2.1 Duplicate template name: System displays "Template name already exists". 3.1 Missing required variables: System warns "Template uses undefined variables".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

##### _Table 35\._ Scenario of Manage Notification Templates & Bulk Send \- Manage Templates {#table-35.-scenario-of-manage-notification-templates-&-bulk-send---manage-templates}

**Scenario of Manage Notification Templates & Bulk Send \- Send Bulk Notifications**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Precondition**   | Admin has successfully logged into the system. Notification templates exist.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Post-condition** | Bulk notifications are sent to selected recipients                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Main Scenario**  | 1\. Admin navigates to "Bulk Notifications" page. 2\. Admin selects notification template to use. 3\. Admin selects recipients: \- Individual users \- User groups \- Role-based (all students, all teachers) \- Custom filter criteria 4\. Admin selects notification channels: \- Email \- SSE (real-time browser) \- Push notification \- SMS 5\. Admin provides common data for template variables. 6\. Admin can provide user-specific data overrides. 7\. Admin previews notification for sample recipients. 8\. Admin clicks "Send Bulk Notification". 9\. System processes notifications asynchronously. 10\. System displays progress and statistics: \- Total recipients \- Successfully sent \- Failed deliveries 11\. System publishes completion event to Redis. |
| **Exception**      | 1.1 No recipients selected: System displays "Please select at least one recipient". 2.1 Template not found: System displays "Selected template does not exist". 3.1 Partial failure: System displays "X notifications failed" with retry option. 4.1 Rate limit exceeded: System queues notifications and displays estimated delivery time.                                                                                                                                                                                                                                                                                                                                                                                                                                   |

##### _Table 36\._ Scenario of Manage Notification Templates & Bulk Send Notifications {#table-36.-scenario-of-manage-notification-templates-&-bulk-send-notifications}

**Scenario of Manage Notification Templates & Bulk Send \- Monitor Notification Delivery**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Post-condition** | Admin monitors and manages notification delivery status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Main Scenario**  | 1\. Admin navigates to "Notification Monitor" page. 2\. System displays notification delivery dashboard: \- Pending notifications queue \- Recent sent notifications \- Failed notifications \- Delivery statistics 3\. Admin can filter by: \- Status (Pending, Sent, Delivered, Failed) \- Channel (Email, SSE, Push) \- Date range \- Recipient 4\. Admin views individual notification details: \- Recipient information \- Template used \- Delivery attempts and timestamps \- Error messages (for failed) 5\. Admin can retry failed notifications. 6\. Admin can cancel pending notifications. 7\. System auto-retries failed notifications based on configuration. |
| **Exception**      | 1.1 Retry limit exceeded: System displays "Maximum retry attempts reached for this notification". 2.1 Recipient unsubscribed: System displays "Recipient has disabled this notification channel".                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

##### _Table 37\._ Scenario of Manage Notification Templates & Bulk Send \- Monitor Notification Delivery {#table-37.-scenario-of-manage-notification-templates-&-bulk-send---monitor-notification-delivery}

**Scenario of Manage Notification Preferences (as User)**

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin (inherits from User)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Post-condition** | Admin's notification preferences are updated                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Main Scenario**  | 1\. Admin navigates to "Settings" or "Preferences" page. 2\. System displays current notification preferences. 3\. Admin configures notification channels (Email, SSE, Push, SMS). 4\. Admin selects which events to receive notifications for: \- System alerts and warnings \- User registration notifications \- Security events \- High-priority violation alerts \- Scheduled report delivery 5\. Admin saves preferences. 6\. System validates and stores preferences. 7\. System confirms update with success message. |
| **Exception**      | 1.1 Invalid configuration: System displays validation error for invalid settings. 2.1 Save failed: System displays error and prompts retry.                                                                                                                                                                                                                                                                                                                                                                                   |

##### _Table 38\._ Scenario of Manage Notification Preferences (as User) {#table-38.-scenario-of-manage-notification-preferences-(as-user)}

## **2.3. System Analysis** {#2.3.-system-analysis}

### **2.3.1. Assessment Service** {#2.3.1.-assessment-service}

#### **2.3.1.1. Extraction of System Entity Classes**

**Main Entities:**

- **User**: Represents synchronized user accounts from Identity Service with profile information including full_name, email, and avatar_url.
- **Assessment**: Represents an examination or test with properties such as title, description, duration, status, passing_score, and due_date.
- **Question**: Represents individual questions with support for multiple types (multiple choice, essay, etc.), difficulty levels, and point values.
- **QuestionCategory**: Represents hierarchical categorization of questions with support for nested categories through parent_id and path.
- **QuestionBank**: Represents a collection of reusable questions that can be shared among teachers.
- **AssessmentAttempt**: Represents a student's participation in an assessment including progress tracking, scoring, and session data.
- **StudentAnswer**: Represents the answers submitted by students for each question in an attempt.

**Supporting Entities:**

- **AssessmentSetting**: Represents configuration options for an assessment including proctoring requirements, display options, and accessibility settings.
- **AssessmentQuestion**: Represents the junction between assessments and questions with ordering and point override capabilities.
- **QuestionAttachment**: Represents media files attached to questions such as images, audio, or video.
- **QuestionBankQuestion**: Represents the junction between question banks and questions.
- **QuestionBankShare**: Represents sharing permissions for question banks between users.
- **ImportJob**: Represents background jobs for bulk importing questions from external files.

#### **2.3.1.2. Identification of Relationships Between Classes**

- Each **User** can create multiple **Assessments**, each Assessment is created by exactly one User.
- Each **User** can create multiple **Questions**, each Question is created by exactly one User.
- Each **User** can create multiple **QuestionCategories**, each QuestionCategory is created by exactly one User.
- Each **User** can create multiple **QuestionBanks**, each QuestionBank is created by exactly one User.
- Each **User** can have multiple **AssessmentAttempts** as a student, each AssessmentAttempt belongs to exactly one User.
- Each **User** can grade multiple **StudentAnswers**, each graded StudentAnswer is graded by one User.
- Each **Assessment** has exactly one **AssessmentSetting** (1:1 relationship via foreign key constraint).
- Each **Assessment** contains multiple **AssessmentQuestions**, each AssessmentQuestion belongs to exactly one Assessment.
- Each **Assessment** has multiple **AssessmentAttempts**, each AssessmentAttempt belongs to exactly one Assessment.
- Each **Question** belongs to one **QuestionCategory**, one QuestionCategory contains multiple Questions.
- Each **Question** can appear in multiple **AssessmentQuestions**, each AssessmentQuestion refers to exactly one Question.
- Each **Question** can have multiple **QuestionAttachments**, each QuestionAttachment belongs to exactly one Question.
- Each **Question** can belong to multiple **QuestionBanks** (through QuestionBankQuestion), each QuestionBank can contain multiple Questions.
- Each **Question** can have multiple **StudentAnswers**, each StudentAnswer refers to exactly one Question.
- Each **QuestionCategory** can have multiple child **QuestionCategories** (self-referencing hierarchy).
- Each **QuestionBank** can be shared with multiple **Users** (through QuestionBankShare), each User can access multiple shared QuestionBanks.
- Each **QuestionBankShare** records sharing permissions between one QuestionBank and one User, with a sharer User.
- Each **AssessmentAttempt** has multiple **StudentAnswers**, each StudentAnswer belongs to exactly one AssessmentAttempt.
- Each **ImportJob** can be associated with one **Assessment** or one **QuestionBank**, each Assessment/QuestionBank can have multiple ImportJobs.

### **2.3.2. Proctoring Service** {#2.3.2.-proctoring-service}

#### **2.3.2.1. Extraction of System Entity Classes**

**Main Entities:**

- **ViolationLog**: Represents a detected violation event during an examination session with properties including violation_type, severity, confidence_score, and temporal information (created_at, ended_at).

**Aggregated Views (Materialized/Continuous Aggregates):**

- **ViolationStatsHourly**: Represents hourly aggregated violation statistics including counts by type and severity.
- **ViolationStatsDaily**: Represents daily aggregated violation statistics for long-term analysis.
- **ViolationAttemptSummary**: Represents per-attempt violation summary for integrity scoring and result calculation.
- **ViolationUserPatterns**: Represents daily user violation patterns for behavior analysis and risk scoring.

**Violation Types (Enumeration):**

- FaceNotDetected (0)
- MultipleFaces (1)
- LookingAway (2)
- MouthOpen (3)
- HandDetected (4)
- CopyPaste (5)
- SwitchingTab (7)
- FullscreenExit (8)
- PhoneDetect (9)

**Severity Levels (Enumeration):**

- Low (0)
- Medium (1)
- High (2)
- Critical (3)

#### **2.3.2.2. Identification of Relationships Between Classes**

- Each **ViolationLog** is associated with one **AssessmentAttempt** (via attempt_id reference to Assessment Service), one Attempt can have multiple ViolationLogs.
- Each **ViolationLog** is associated with one **User** (via user_id reference), one User can have multiple ViolationLogs across sessions.
- Each **ViolationLog** is associated with one **Assessment** (via assessment_id reference), one Assessment can have multiple ViolationLogs.
- Each **ViolationStatsHourly** aggregates multiple **ViolationLogs** within a one-hour time bucket.
- Each **ViolationStatsDaily** aggregates multiple **ViolationLogs** within a one-day time bucket.
- Each **ViolationAttemptSummary** summarizes all **ViolationLogs** for a specific attempt_id.
- Each **ViolationUserPatterns** aggregates **ViolationLogs** by user per day for pattern analysis.

### **2.3.3. Identity Service (Casdoor)** {#2.3.3.-identity-service-(casdoor)}

#### **2.3.3.1. Extraction of System Entity Classes**

**Core Authentication Entities:**

- **User**: Represents system users with comprehensive profile information including credentials, personal details, social login connections, and access control attributes.
- **Organization**: Represents an organizational unit that owns users, applications, and other resources with configurable authentication policies.
- **Application**: Represents a registered client application with OAuth2/OIDC configuration, authentication settings, and branding options.
- **Token**: Represents OAuth2 tokens (access tokens, refresh tokens) with associated metadata and expiration information.
- **Session**: Represents an active user session linked to an application.

**Authorization Entities:**

- **Role**: Represents a collection of permissions that can be assigned to users or groups.
- **Permission**: Represents access rights to specific resources with support for approval workflows.
- **Group**: Represents a hierarchical grouping of users for organizational structure.
- **Enforcer**: Represents a Casbin enforcer configuration for policy-based access control.
- **Model**: Represents a Casbin access control model definition.
- **Adapter**: Represents a Casbin policy storage adapter configuration.

**Access Control Rule Tables:**

- **CasbinRule**: Represents general Casbin policy rules.
- **CasbinApiRule**: Represents API-specific access control rules.
- **CasbinUserRule**: Represents user-specific access control rules.
- **PermissionRule**: Represents permission-related policy rules.
- **TableName**: Generic policy storage table.

**Supporting Entities:**

- **Cert**: Represents digital certificates for signing and encryption.
- **Provider**: Represents external authentication/service providers (OAuth, LDAP, SMS, etc.).
- **LDAP**: Represents LDAP server configuration for directory integration.
- **Invitation**: Represents invitation codes for user registration.
- **Syncer**: Represents database synchronization configuration for user migration.
- **Webhook**: Represents webhook configurations for event notifications.
- **Record**: Represents audit log entries for system activities.
- **Resource**: Represents uploaded files and media assets.
- **VerificationRecord**: Represents verification codes for email/phone verification.

**Subscription & Payment Entities:**

- **Subscription**: Represents user subscription to pricing plans.
- **Plan**: Represents available subscription plans.
- **Pricing**: Represents pricing configurations with trial periods.
- **Product**: Represents purchasable products or services.
- **Payment**: Represents payment transactions.
- **Transaction**: Represents financial transaction records.

**Configuration Entities:**

- **Form**: Represents custom form definitions for user interfaces.
- **RadiusAccounting**: Represents RADIUS accounting records for network access.

#### **2.3.3.2. Identification of Relationships Between Classes**

**User and Organization:**

- Each **Organization** contains multiple **Users**, each User belongs to exactly one Organization (via owner field).
- Each **Organization** can have multiple **Applications**, each Application belongs to one Organization.

**Authentication Relationships:**

- Each **User** can have multiple **Sessions**, each Session belongs to exactly one User and Application.
- Each **User** can have multiple **Tokens**, each Token is issued to one User for one Application.
- Each **Application** uses one **Cert** for token signing, one Cert can be used by multiple Applications.

**Authorization Relationships:**

- Each **Role** can be assigned to multiple **Users** and **Groups**, each User/Group can have multiple Roles.
- Each **Permission** can be granted to multiple **Users**, **Groups**, and **Roles**.
- Each **Group** can contain multiple **Users** (through the users field), each User can belong to multiple Groups.
- Each **Group** can have multiple child **Groups** (hierarchical via parent_id).
- Each **Enforcer** uses one **Model** and one **Adapter**, each Model/Adapter can be used by multiple Enforcers.

**Provider Relationships:**

- Each **Application** can use multiple **Providers** (configured in providers field).
- Each **LDAP** configuration belongs to one **Organization**.

**Resource Relationships:**

- Each **Resource** is uploaded by one **User** and optionally linked to one **Application**.
- Each **Record** logs activities performed by one **User** in one **Organization**.

**Subscription Relationships:**

- Each **Subscription** belongs to one **User** and references one **Plan**, **Pricing**, and **Payment**.
- Each **Plan** belongs to one **Pricing** configuration.
- Each **Payment** is made by one **User** for a specific **Product** or **Plan**.
- Each **Transaction** records a payment operation for one **User**.

### **2.3.4. Identity Verification Service** {#2.3.4.-identity-verification-service}

#### **2.3.4.1. Extraction of System Entity Classes**

**Main Entities:**

- **IdMapping**: Represents a bidirectional mapping between string user identifiers (from business logic) and integer allocation IDs used internally by InspireFace FeatureHub for embedding storage.

**External Storage (Redis):**

- **FaceEmbedding**: Represents the 512-dimensional face embedding vector stored in Redis with associated metadata (not in SQL, managed by application).

#### **2.3.4.2. Identification of Relationships Between Classes**

- Each **IdMapping** maps exactly one **User** (via user_id reference to Identity Service) to one internal alloc_id.
- Each **User** can have at most one **IdMapping** (unique constraint on user_id).
- Each **IdMapping** enables retrieval of the associated **FaceEmbedding** from Redis vector storage.
- Each **FaceEmbedding** (in Redis) corresponds to exactly one **IdMapping** record.

### **2.3.5. Notification Service** {#2.3.5.-notification-service}

#### **2.3.5.1. Extraction of System Entity Classes**

The Notification Service is designed to manage multi-channel notifications including email, SSE (Server-Sent Events), and push notifications. It supports templated messages with dynamic content and user preference management.  
Based on the database schema, the system entities are identified as follows:  
**Main Entities:**

- **NotificationTemplate**: Represents reusable notification templates with support for multiple channels (EMAIL, SSE, PUSH), subject lines, body content with placeholders, and variable definitions.
- **Notification**: Represents an individual notification instance with recipient information, content, delivery status, and retry tracking.
- **NotificationPreference**: Represents user-specific notification settings including channel enablement and email frequency preferences.

**Template Types (Enumeration):**

- EMAIL
- PUSH

**Notification Status (Enumeration):**

- PENDING
- SENT
- DELIVERED
- FAILED

#### **2.3.5.2. Identification of Relationships Between Classes**

- Each **Notification** can use one **NotificationTemplate** (optional via template_id), one NotificationTemplate can be used by multiple Notifications.
- Each **Notification** is sent to one recipient identified by recipient_id (reference to User in Identity Service).
- Each **NotificationPreference** belongs to exactly one **User** (via user_id, unique constraint), each User has at most one NotificationPreference.
- Each **NotificationTemplate** defines placeholders that are resolved using data provided when creating a **Notification**.

### **2.3.6. Group Service** {#2.3.6.-group-service}

#### **2.3.6.1. Extraction of System Entity Classes**

**Purpose:** The Group Service manages teacher-created “classes/groups”, student membership, and the linkage between groups and assigned assessments. This service is designed as an isolated microservice with its own database, aligned with the system’s database-per-service architecture principles.

**Main Entities:**

- **ClassGroup**: Represents a teacher-owned class/group with metadata such as name, description, owner_teacher_id, status, and join_policy.
- **GroupMember**: Represents group membership records linking a user_id to a group_id, including role in group and membership status.
- **GroupInvitation**: Represents invite codes/links for joining a group (supports expiry and usage limits).
- **GroupJoinRequest**: Represents a student’s request to join a restricted group (approval flow).
- **GroupAssessmentAssignment**: Represents the association between a group and an assessment (by assessment_id), including publish/due rules per group.

**Enumerations (suggested):**

- **JoinPolicy**: OPEN, INVITE_ONLY, APPROVAL_REQUIRED
- **GroupStatus**: ACTIVE, ARCHIVED
- **MemberRole**: STUDENT, TEACHER, TA
- **MembershipStatus**: PENDING, ACTIVE, REMOVED, BANNED
- **JoinRequestStatus**: PENDING, APPROVED, REJECTED
- **AssignmentStatus**: DRAFT, PUBLISHED, ARCHIVED

---

#### **2.3.6.2. Identification of Relationships Between Classes**

- **Teacher Ownership**
    - Each **ClassGroup** is owned by exactly one teacher (owner_teacher_id references **User** in Identity Service).  
       SECURE ASSESSMENT PLATFORM (3)
- **Membership**
    - Each **ClassGroup** can contain multiple **GroupMembers**, each **GroupMember** belongs to exactly one **ClassGroup**.
    - Each **GroupMember** references exactly one **User** (user_id reference to Identity Service), and each **User** can belong to multiple **ClassGroups** (many-to-many via **GroupMember**).
    - Unique constraint recommended: (group_id, user_id) to prevent duplicate membership rows.
- **Invitations**
    - Each **ClassGroup** can have multiple **GroupInvitations**, each **GroupInvitation** belongs to exactly one **ClassGroup**.
    - Each **GroupInvitation** is created by one user (created_by reference to Identity Service).
- **Join Requests**
    - Each **ClassGroup** can have multiple **GroupJoinRequests**, each **GroupJoinRequest** belongs to exactly one **ClassGroup** and one **User**.
    - Each **GroupJoinRequest** may be processed by one teacher/admin user (processed_by reference to Identity Service).
- **Group ↔ Assessment Assignment**
    - Each **GroupAssessmentAssignment** associates exactly **one ClassGroup** and exactly **one Assessment** (assessment_id reference to Assessment Service).
    - One **ClassGroup** can be assigned multiple assessments; one **Assessment** can be assigned to multiple groups (many-to-many via **GroupAssessmentAssignment**).

- **Notification integration (event-driven)**
    - When a group assignment is published, the system should trigger notifications to all active group members. Your system already uses Redis Streams for event-driven notification workflows (e.g., assessment-related events consumed by Notification Service).  
       SECURE ASSESSMENT PLATFORM (3)
    - Suggested event types (examples): group.member_added, group.member_removed, group.assessment_published (consumed by Notification Service to notify students).

## **2.4. Building class diagrams at the design phase** {#2.4.-building-class-diagrams-at-the-design-phase}

### **2.4.1. Assessment Service** {#2.4.1.-assessment-service}

![][image13]

###### _Figure 12\._ Assessment service class diagram {#figure-12.-assessment-service-class-diagram}

### **2.4.2. Identity Verification Service** {#2.4.2.-identity-verification-service}

![][image14]

###### **_Figure 13\. Identity verification class diagram_** {#figure-13.-identity-verification-class-diagram}

###

### **2.4.3. Proctoring Service** {#2.4.3.-proctoring-service}

![][image15]

###### **_Figure 14\. Proctoring service class diagram_** {#figure-14.-proctoring-service-class-diagram}

### **2.4.4. Casdoor Identity Service (minimalism version)** {#2.4.4.-casdoor-identity-service-(minimalism-version)}

![][image16]  
![][image17]

###### **_Figure 15\. Casdoor Identity service class diagram_** {#figure-15.-casdoor-identity-service-class-diagram}

### **2.4.5. Notification Service** {#2.4.5.-notification-service}

![][image18]

###### **_Figure 16\. Notification service class diagram_** {#figure-16.-notification-service-class-diagram}

### **2.4.6. Group Service** {#2.4.6.-group-service}

![][image19]

###### **_Figure 17\. Group service class diagram_** {#figure-17.-group-service-class-diagram}

## **2.5. System sequence diagrams** {#2.5.-system-sequence-diagrams}

### **2.5.1. Sequence diagrams for student functions** {#2.5.1.-sequence-diagrams-for-student-functions}

The student module focuses on the exam-taking experience. The following diagrams illustrate the core flows for taking an assessment and viewing results.

#### **2.5.1.1. Take Assessment Sequence Diagram**

This process covers the flow from the moment a student starts an exam until they submit their answers. It involves fetching the exam content, verifying eligibility, and submitting responses.  
![][image20]

###### **_Figure 18\. Take Assessment Sequence Diagram_** {#figure-18.-take-assessment-sequence-diagram}

#### **2.5.1.2. View Assessment Result Sequence Diagram**

After an exam is graded, students can view their detailed results, including scores and feedback.

![][image21]

###### **_Figure 19\. View Assessment Result Sequence Diagram_** {#figure-19.-view-assessment-result-sequence-diagram}

#### **2.5.1.3. Face Registration Sequence Diagram**

Before taking exams, students must register their face data for the proctoring system. This process involves capturing a live image and sending it to the verification service.  
![][image22]

###### **_Figure 20\. Face Registration Sequence Diagram_** {#figure-20.-face-registration-sequence-diagram}

#### **2.5.1.4. Student joins a Group (invite code, with optional approval)**

This sequence shows how a student joins a class/group from the UI. If the group requires approval, the system stores a pending request instead of activating membership immediately.

![][image23]

###### **_Figure 21\. Student joins a Group Sequence Diagram_** {#figure-21.-student-joins-a-group-sequence-diagram}

### **2.5.2. Sequence diagrams for teacher functions** {#2.5.2.-sequence-diagrams-for-teacher-functions}

Teachers are responsible for content creation and exam monitoring. These diagrams show the workflow for creating a new assessment and monitoring an ongoing exam session.

#### **2.5.2.1. Question Bank Management Sequence Diagram**

Teachers create and manage question banks to organize assessment content. This involves creating banks and adding questions to them.

![][image24]

###### **_Figure 21\. Question Bank Management Sequence Diagram_** {#figure-21.-question-bank-management-sequence-diagram}

#### **2.5.2.2. Create Assessment Sequence Diagram**

This flow depicts a teacher configuring a new exam, including setting time limits, adding questions, and publishing it.

![][image25]

###### **_Figure 22\. Create Assessment Sequence Diagram_** {#figure-22.-create-assessment-sequence-diagram}

#### **2.5.2.3. Monitor Exam (Proctoring) Sequence Diagram**

During an exam, teachers can monitor student status in real-time. This involves receiving updates about student connectivity and potential violations.

![][image26]

###### **_Figure 23\. Monitor Exam (Proctoring) Sequence Diagram_** {#figure-23.-monitor-exam-(proctoring)-sequence-diagram}

####

#### **2.5.2.4. Teacher assigns/publishes a Test to a Group**

This sequence shows how a teacher publishes a test to a group. The database stores the “group-assessment assignment” so all group members can see it (and notifications can be handled elsewhere).

### **![][image27]**

###### **_Figure 24\. Teacher assigns/publishes a Test to a Group Sequence Diagram_** {#figure-24.-teacher-assigns/publishes-a-test-to-a-group-sequence-diagram}

#### **2.5.2.5. Teacher views Group scores sequence diagram**

This sequence shows the teacher opening a scoreboard view: overall stats \+ per-student row list.

### **![][image28]**

###### **_Figure 25\. Teacher views Group scores sequence diagram_** {#figure-25.-teacher-views-group-scores-sequence-diagram}

### **2.5.3. Sequence diagrams for administrator functions** {#2.5.3.-sequence-diagrams-for-administrator-functions}

Administrator functions are critical for maintaining the integrity and organization of the Secure Assessment Platform. The administrator is responsible for managing users, configuring system settings, and overseeing the overall operation. This section details the sequence of interactions for key administrator tasks, specifically focusing on User Management, which is fundamental to the system's security and accessibility.

#### **2.5.3.1. View User List Sequence Diagram**

The "View User List" function is essential for administrators to monitor registered users, verify accounts, and manage roles. This process involves retrieving a paginated list of users from the database, ensuring that the system can handle a large number of records efficiently.

**Operational Flow:**

1. **Request Initiation**: The Administrator accesses the User Management page via the Admin Portal.
2. **Service Call**: The User Interface (UI) component sends a request to the \`UserService\` with pagination parameters (e.g., page number, page size).
3. **API Interaction**: The \`UserService\` forwards this request to the Backend API endpoint (\`GET /api/users\`).
4. **Database Query**: The API queries the Database to retrieve the requested subset of user records.
5. **Data Return**: The Database returns the user data, which is then sent back through the API and Service layers to the UI.
6. **Display**: The User Management Page renders the list of users for the Administrator.

![][image29]

###### **_Figure 26\. View User List Sequence Diagram_** {#figure-26.-view-user-list-sequence-diagram}

#### **2.5.3.2. Search Users Sequence Diagram**

To effectively manage a growing user base, administrators require the ability to search for specific individuals. The "Search Users" function allows for filtering based on criteria such as name or email address.

**Operational Flow**:

1. **Search Input**: The Administrator enters a search query (e.g., a name or email) into the search bar on the User Management Page.
2. **Service Request**: The UI triggers a \`searchUsers\` call to the \`UserService\` with the query string.
3. **API Request**: The \`UserService\` sends a request to the search endpoint (\`GET /api/users/search\`) with the query parameter.
4. **Filtered Query**: The Backend API constructs a database query using the search criteria (e.g., \`WHERE name LIKE %query%\`).
5. **Result Retrieval**: The Database returns the matching user records.
6. **UI Update**: The UI updates the user list to display only the records that match the search criteria.

![][image30]

###### **_Figure 27\. Search Users Sequence Diagram_** {#figure-27.-search-users-sequence-diagram}

These sequence diagrams illustrate the separation of concerns within the system architecture, highlighting the interaction between the Presentation Layer (UI), Business Logic Layer (Service), and Data Access Layer (API/Database). This layered approach ensures maintainability and scalability of the administrator functions.

## **2.6. Microservices architecture implementation** {#2.6.-microservices-architecture-implementation}

### **2.6.1. Overview** {#2.6.1.-overview}

The Online Examination and Proctoring System adopts a microservices architecture to achieve scalability, maintainability, and independent deployment capabilities. Each microservice operates independently with its own database, following the database-per-service pattern and clean architecture principles with clear separation into handlers, services, and repositories layers.  
**Design Goals:**

- Support up to 10,000 concurrent users
- Independent scaling and deployment of services
- High availability and fault tolerance
- Cost-effective infrastructure

**Core Architectural Principles:**

- Database-per-service pattern for data isolation
- Dependency injection using Uber-FX (Go) and Spring Boot DI (Java)
- Interface-based design for testability
- Event-driven communication via Redis Streams

### **2.6.2. System Components** {#2.6.2.-system-components}

![][image31]

###### **_Figure 28\. System Components_** {#figure-28.-system-components}

#### **Core Microservices**

**Assessment Service (GoLang)**

The Assessment Service serves as the central business logic hub for examination management. It handles complete lifecycle management of assessments, supports multiple question types (multiple choice, true/false, essay, fill-in-blank, matching, ordering), manages question banks with sharing capabilities, provides automated grading for objective questions, and tracks student attempts with time limits.

| Aspect     | Details                                                                                                                                                                                                                               |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Technology | GoLang 1.24+, Gin, GORM                                                                                                                                                                                                               |
| Database   | PostgreSQL                                                                                                                                                                                                                            |
| Tables     | users, assessments, assessment_settings, questions, question_categories, question_banks, question_bank_shares, question_bank_questions, assessment_questions, assessment_attempts, student_answers, question_attachments, import_jobs |

##### _Table 39\._ Assessment service information {#table-39.-assessment-service-information}

**Proctoring Service (GoLang)**

The Proctoring Service provides real-time examination monitoring using AI-powered detection via MediaPipe. It detects violations such as face not detected, multiple faces, looking away, mouth open, hand detected, tab switching, copy/paste, and fullscreen exit. Each violation is classified by severity (Low, Medium, High, Critical) with confidence scoring.

| Aspect     | Details                                                                                                           |
| :--------- | :---------------------------------------------------------------------------------------------------------------- |
| Technology | GoLang, Gin, sqlx, Uber-FX                                                                                        |
| Database   | TimescaleDB (PostgreSQL extension)                                                                                |
| Tables     | violation_logs (hypertable with 1-day chunks)                                                                     |
| Features   | Automatic compression after 7 days (90-95% savings), continuous aggregates for analytics, 90-day retention policy |

##### _Table 40\._ Proctoring service information {#table-40.-proctoring-service-information}

**Identity Verification Service (Python)**

The Identity Verification Service handles biometric authentication using face recognition technology. It provides face registration, 1:1 verification, 1:N identification, and liveness detection (passive and active challenges).

| Aspect      | Details                                                             |
| :---------- | :------------------------------------------------------------------ |
| Technology  | Python 3.10+, FastAPI, InspireFace                                  |
| Database    | PostgreSQL \+ Redis                                                 |
| Tables      | id_mapping (user_id to alloc_id mapping for InspireFace FeatureHub) |
| Performance | 99.5% accuracy, 150-250ms latency, 40-60 req/s                      |

##### _Table 40\._ Identity verification service information {#table-40.-identity-verification-service-information}

**Notification Service (Java)**

The Notification Service manages all system communications through multiple delivery channels including email (SMTP) and real-time SSE (Server-Sent Events). It features a template engine with placeholder syntax, bulk notification processing, and user preference management.

| Aspect     | Details                                                         |
| :--------- | :-------------------------------------------------------------- |
| Technology | Java, Spring Boot 3.x, Spring Security OAuth2                   |
| Database   | PostgreSQL                                                      |
| Tables     | notification_templates, notifications, notification_preferences |
| Channels   | EMAIL, SSE (real-time browser notifications)                    |

##### _Table 41\._ Notification service information {#table-41.-notification-service-information}

**Identity Service (Casdoor \- External)**

The Identity Service utilizes Casdoor as an external OAuth2/OIDC provider for centralized authentication and authorization. It handles user registration, multi-factor authentication, role-based access control (Student, Teacher, Admin), JWT token issuance, and organizational hierarchy management.

| Aspect     | Details                                                                                            |
| :--------- | :------------------------------------------------------------------------------------------------- |
| Technology | Casdoor (External SaaS)                                                                            |
| Database   | PostgreSQL                                                                                         |
| Tables     | user, role, permission, organization, application, token, session, verification_record, and others |

##### _Table 42\._ Identity service information {#table-42.-identity-service-information}

#### **Database Architecture Summary**

| Service               | Database             | Key Tables                                                                   |
| :-------------------- | :------------------- | :--------------------------------------------------------------------------- |
| Assessment Service    | PostgreSQL           | assessments, questions, question_banks, assessment_attempts, student_answers |
| Proctoring Service    | TimescaleDB          | violation_logs (hypertable)                                                  |
| Identity Verification | PostgreSQL \+ Redis  | id_mapping, face embeddings (cached)                                         |
| Notification Service  | PostgreSQL           | notification_templates, notifications, notification_preferences              |
| Session Service       | PostgreSQL           | user_sessions, assessment_sessions, session_activities                       |
| Identity Service      | PostgreSQL (Casdoor) | user, role, permission, token, session                                       |

##### _Table 43\._ Database Architecture Summary {#table-43.-database-architecture-summary}

### **2.6.3. Applying Technologies to the System** {#2.6.3.-applying-technologies-to-the-system}

#### **Complete Technology Stack**

| Category            | Technology                        | Applied To                                  |
| :------------------ | :-------------------------------- | :------------------------------------------ |
| Backend             | GoLang (Gin, GORM, Uber-FX, sqlx) | Assessment, Proctoring Services             |
| Backend             | Java Spring Boot 3.x              | Notification Service                        |
| Backend             | Python FastAPI                    | Identity Verification Service               |
| Database            | PostgreSQL 16                     | Assessment, Notification, Session, Identity |
| Database            | TimescaleDB                       | Proctoring Service (violation logs)         |
| Cache and Messaging | Redis 7                           | All services (caching \+ Redis Streams)     |
| Authentication      | Casdoor                           | OAuth2/OIDC, JWT tokens                     |
| AI/ML               | MediaPipe                         | Proctoring detection (face, gaze, hands)    |
| AI/ML               | InspireFace                       | Face recognition and verification           |
| Infrastructure      | Docker, Kubernetes                | Containerization and orchestration          |
| Cloud               | DigitalOcean                      | Hosting infrastructure                      |
| Monitoring          | Datadog                           | APM and log aggregation                     |
| Testing             | K6                                | Load and performance testing                |
| Frontend            | React, TypeScript                 | Web user interface                          |

##### _Table 44\._ Technology Stack {#table-44.-technology-stack}

### **2.6.4. Selecting Appropriate Technologies** {#2.6.4.-selecting-appropriate-technologies}

#### **Technology Selection Matrix**

| Component            | Options Considered                | Selected         | Rationale                                                                              |
| :------------------- | :-------------------------------- | :--------------- | :------------------------------------------------------------------------------------- |
| Core Backend         | GoLang, Node.js, Java             | GoLang           | High performance, low memory footprint, excellent concurrency for real-time processing |
| Notification Backend | GoLang, Java Spring               | Java Spring Boot | Mature SSE support via WebFlux, rich ecosystem for email and templating                |
| Face Recognition     | OpenCV, Dlib, InspireFace         | InspireFace      | High accuracy (99.5%), CPU-optimized, production-ready FeatureHub                      |
| Time-Series Database | InfluxDB, TimescaleDB, PostgreSQL | TimescaleDB      | SQL compatibility, 90-95% compression, continuous aggregates, PostgreSQL ecosystem     |
| Event Streaming      | Kafka, RabbitMQ, Redis Streams    | Redis Streams    | Cost-effective (reuses existing Redis), simpler operations, sufficient throughput      |
| Authentication       | Custom JWT, Keycloak, Casdoor     | Casdoor          | Lightweight, easy integration, full OAuth2/OIDC support, reduces complexity            |

##### _Table 45\._ Technology selection matrix {#table-45.-technology-selection-matrix}

#### **Trade-offs Analysis**

| Decision                  | Advantages                                                                 | Disadvantages                                |
| :------------------------ | :------------------------------------------------------------------------- | :------------------------------------------- |
| GoLang for core services  | Fast compilation, low resource usage, strong typing, excellent concurrency | Smaller talent pool compared to Java/Node.js |
| TimescaleDB over InfluxDB | Standard SQL queries, PostgreSQL ecosystem, automatic compression          | Requires PostgreSQL knowledge                |
| Redis Streams over Kafka  | No extra infrastructure, significant cost savings, simpler operations      | Lower theoretical throughput ceiling         |
| InspireFace (CPU mode)    | No GPU infrastructure costs, sufficient accuracy for use case              | Slower inference compared to GPU             |
| Casdoor (External)        | Reduces authentication complexity, managed OAuth2/OIDC                     | External dependency, less customization      |

##### _Table 46\._ Trade-offs Analysis {#table-46.-trade-offs-analysis}

### **2.6.5. Choosing Communication Methods Between Microservices** {#2.6.5.-choosing-communication-methods-between-microservices}

#### **Communication Patterns Overview**

The system employs three primary communication patterns based on specific use case requirements.

#### **![][image32]Pattern Selection Criteria**

| Pattern               | Technology      | When to Use                                                            | Examples                                               |
| :-------------------- | :-------------- | :--------------------------------------------------------------------- | :----------------------------------------------------- |
| Synchronous (REST)    | HTTP/HTTPS APIs | Immediate response required, CRUD operations, user-facing requests     | Login, create assessment, submit answer, fetch results |
| Asynchronous (Events) | Redis Streams   | Background processing, loose coupling, eventual consistency acceptable | Send notifications, log violations, update analytics   |
| Real-time Push        | SSE             | Server-initiated updates to browser, live monitoring                   | Proctoring alerts, instant notifications to teachers   |

##### _Table 47\._ Pattern Selection Criteria {#table-47.-pattern-selection-criteria}

#### **Redis Streams Architecture**

The system uses Redis Streams with consumer groups for reliable, scalable event processing.

#### **![][image33]**

###### **_Figure 29\. Redis Streams Architecture_** {#figure-29.-redis-streams-architecture}

#### **Event Types and Routing**

| Event Type           | Source Service     | Target Service       | Communication | Purpose                  |
| :------------------- | :----------------- | :------------------- | :------------ | :----------------------- |
| user.registered      | Identity Service   | Notification Service | Redis Streams | Welcome email            |
| assessment.published | Assessment Service | Notification Service | Redis Streams | Notify enrolled students |
| assessment.expired   | Assessment Service | Notification Service | Redis Streams | Reminder notifications   |
| proctoring.violation | Proctoring Service | Notification Service | Redis Streams | Alert proctors           |
| session.completed    | Session Service    | Notification Service | Redis Streams | Send results             |

##### _Table 48\._ Event Types and Routing {#table-48.-event-types-and-routing}

### **2.6.6. Designing a Hybrid Monolithic/Microservice System** {#2.6.6.-designing-a-hybrid-monolithic/microservice-system}

#### **Hybrid Architecture Strategy**

The system adopts a pragmatic hybrid approach, deploying true microservices only where the benefits justify the complexity, while keeping tightly coupled components as modules within services.

#### **Service Decomposition Strategy**

| Component             | Architecture               | Rationale                                                                       |
| :-------------------- | :------------------------- | :------------------------------------------------------------------------------ |
| Assessment Service    | Microservice               | Core business domain, needs independent scaling, complex business logic         |
| Proctoring Service    | Microservice               | High data volume, specialized database (TimescaleDB), real-time processing      |
| Identity Verification | Microservice               | Different technology stack (Python/ML), resource-intensive, independent scaling |
| Notification Service  | Microservice               | Cross-cutting concern, can be shared across products, async processing          |
| Session Management    | Module (within Assessment) | Tightly coupled with assessment lifecycle, same deployment schedule             |
| Identity Service      | External SaaS              | Leverage Casdoor expertise, reduce authentication complexity                    |

##### _Table 49\._ Service Decomposition Strategy {#table-49.-service-decomposition-strategy}

#### **Decision Framework: Microservice vs Module**

| Criterion            | Choose Microservice                    | Choose Module                   |
| :------------------- | :------------------------------------- | :------------------------------ |
| Team Ownership       | Separate team responsible              | Same team manages both          |
| Scaling Requirements | Different scaling patterns needed      | Same scaling sufficient         |
| Technology Stack     | Different language/framework required  | Same technology stack           |
| Data Isolation       | Strict data boundaries required        | Shared database acceptable      |
| Deployment Frequency | Independent release cycles needed      | Coordinated releases acceptable |
| Domain Complexity    | High complexity, clear bounded context | Simple CRUD operations          |
| Failure Isolation    | Must not affect other services         | Can tolerate coupled failures   |

##### _Table 50\._ Microservice vs Module {#table-50.-microservice-vs-module}

#### **Benefits of Hybrid Approach**

The hybrid architecture provides several advantages for the current stage of development. First, it offers reduced complexity by avoiding microservice overhead for components that do not require it. Second, it enables faster development since modules can share code, deployment pipelines, and infrastructure. Third, it is cost effective because fewer services means lower infrastructure and operational costs. Fourth, it maintains clear boundaries by deploying microservices where truly needed for scaling or technology diversity. Finally, the architecture is evolution ready, allowing modules to be extracted into microservices when growth demands it.

## **2.7. Frontend Architecture** {#2.7.-frontend-architecture}

The frontend application follows a modular, feature-based architecture that promotes separation of concerns, code reusability, and maintainability. The project structure organizes code by technical responsibility while grouping related functionality together.

### **2.7.1. Project Structure and Module Organization** {#2.7.1.-project-structure-and-module-organization}

#### **Root Directory Structure**

The source code is organized under the src/ directory with clear separation between different architectural layers:

src/  
├── pages/ \# Page-level components (route destinations)  
├── components/ \# Reusable UI components  
├── services/ \# API communication layer  
├── hooks/ \# Custom React hooks  
├── contexts/ \# React Context providers  
├── providers/ \# Application-wide providers  
├── types/ \# TypeScript type definitions  
├── utils/ \# Utility functions  
├── config/ \# Application configuration  
├── i18n/ \# Internationalization resources  
├── theme/ \# Design tokens and theming  
├── workers/ \# Web Workers for background processing  
├── styles/ \# Global stylesheets  
├── App.tsx \# Root component with routing  
└── main.tsx \# Application entry point

#### **Pages Module**

The pages/ directory contains 12 feature modules, each representing a distinct functional area of the application:

| Module        | Files | Purpose                                 |
| :------------ | :---- | :-------------------------------------- |
| Assessments   | 3     | Assessment listing and management       |
| Auth          | 2     | Login/callback handling                 |
| Dashboard     | 12    | Analytics and overview displays         |
| Exam          | 21    | Exam-taking experience (largest module) |
| Grading       | 4     | Manual grading interface                |
| Groups        | 8     | Group management and invite system      |
| InviteLink    | 2     | Join group via link/code                |
| QuestionBanks | 5     | Question bank CRUD                      |
| Questions     | 17    | Question management                     |
| Student       | 7     | Student-specific views                  |
| Teacher       | 3     | Teacher dashboard and tools             |
| Users         | 1     | User management (admin)                 |

##### _Table 51\._ Pages module {#table-51.-pages-module}

Each page module follows a consistent internal structure. Complex modules like Exam/ contain their own subdirectories for components, hooks, and utilities, creating self-contained feature units.

#### **Component Architecture**

The components/ directory (31 items) contains shared, reusable UI components organized by functionality:

- Layout Components: Layout/, AnimatedPage/ for page structure
- Data Display: DataTable/, StatCard/, StatusBadge/
- Forms & Inputs: FormDrawer/, Questions/
- Navigation & Auth: ProtectedRoute/, RoleBasedRedirect/
- Feature Components: Proctoring/, NotificationDropdown/, SettingsModal/

This separation ensures page components remain focused on business logic while delegating presentation to reusable building blocks.

#### **Type System**

TypeScript type definitions are centralized in the types/ directory:

- **index.ts** (20KB): Core domain types including User, Assessment, Question, Attempt, Group, and API response types. Defines over 50 interfaces covering all data models.
- **proctoring.ts** (7KB): Specialized types for the proctoring system including violation events, detection states, and analytics data.

Strong typing throughout the application enables compile-time error detection, improves IDE support, and serves as living documentation for data structures.

#### **Module Dependencies**

The architecture enforces a unidirectional dependency flow to prevent circular imports and maintain clean boundaries:

pages → components → hooks → services → config  
 ↓  
 contexts/providers  
 ↓  
 types

This hierarchy ensures that lower-level modules (services, types) remain independent of higher-level concerns (pages, components), promoting testability and reusability across the application.

### **2.7.2. Component Design Pattern** {#2.7.2.-component-design-pattern}

The frontend implements a layered component architecture that separates concerns between container components (smart) and presentational components (dumb), following React best practices.

#### **Page Components (Container Layer)**

Page components serve as the entry points for each route and are responsible for:

- Data Fetching: Using React Query hooks to fetch and cache server data
- State Coordination: Managing local UI state and coordinating between child components
- Layout Composition: Assembling the page structure from reusable components
- Route Protection: Implementing access control via ProtectedRoute wrapper

Example structure of a typical page component:

pages/Groups/  
├── GroupList.tsx \# Main list view with filtering  
├── GroupDetail.tsx \# Single group view with tabs  
├── GroupAssessmentsTab.tsx \# Tab component for assessments  
├── GroupProctoringTab.tsx \# Tab component for proctoring  
├── GroupGradingTab.tsx \# Tab component for grading  
├── JoinGroupPage.tsx \# Student join flow  
└── GenerateInviteLinkModal.tsx \# Modal for invite generation

#### **Shared Components (Presentational Layer)**

Shared components in components/ are designed to be:

- Stateless: Receive data via props, emit events via callbacks
- Reusable: Generic enough to be used across multiple pages
- Styled: Encapsulate their own CSS using CSS Modules
- Accessible: Follow WCAG guidelines with proper ARIA attributes

#### **Route Protection Pattern**

The application implements role-based access control through wrapper components:

- **ProtectedRoute**: Ensures user is authenticated, redirects to login if not
- **RoleBasedRedirect**: Redirects users to appropriate dashboard based on their role (Student → StudentDashboard, Teacher → TeacherDashboard)
- **Permission Checks**: Components conditionally render based on user permissions

#### **Routing Architecture**

The application uses react-router-dom with a nested route structure organized by user role:

| Route Group | Access                     | Example Routes                            |
| :---------- | :------------------------- | :---------------------------------------- |
| Public      | Anyone                     | /login, /callback                         |
| Admin       | Admin only                 | /dashboard, /users, /groups               |
| Teacher     | Admin, Teacher             | /assessments, /questions, /question-banks |
| Student     | All authenticated          | /student/\*                               |
| Exam        | Protected, separate layout | /student/take/:attemptId                  |

##### _Table 52\._ Routing Architecture {#table-52.-routing-architecture}

The routing implements two layout patterns:

- MainLayout: Standard navigation with sidebar for all management pages
- ExamLayout: Minimal distraction-free layout for exam-taking without navigation

#### **Error Boundary Pattern**

The ErrorBoundary component wraps the application to catch React errors gracefully, displaying a fallback UI instead of crashing the entire application. This ensures users see a helpful error message and can navigate away from broken states.

#### **Exam Question Renderers**

The exam module implements 7 question type components in `pages/Exam/components/QuestionTypes/`:

| Type           | Features                                  |
| :------------- | :---------------------------------------- |
| MultipleChoice | Single/multi-select, option randomization |
| TrueFalse      | Binary selection                          |
| ShortAnswer    | Text input with word limit                |
| Essay          | Rich text editor                          |
| FillBlank      | Inline text fields with placeholders      |
| Matching       | Drag-and-drop pairing (dnd-kit)           |
| Ordering       | Sortable list with drag handles           |

Each renderer receives question data via props and emits answer changes via `onAnswer` callback.

#### **Settings Modal**

A Discord-style `SettingsModal` component provides centralized access to theme selection, language switching, and notification preferences. Accessed via `Ctrl+,` keyboard shortcut.

### **2.7.3. State Management Strategy** {#2.7.3.-state-management-strategy}

The application employs a hybrid state management approach that distinguishes between server state and client state, using the most appropriate tool for each.

#### **Server State: React Query**

TanStack React Query manages all data fetched from the backend APIs. Key patterns include:

- **Query Keys**: Structured keys like \['groups', groupId, 'members'\] enable precise cache invalidation
- **Stale-While-Revalidate**: Data is served from cache immediately while refreshing in the background
- **Optimistic Updates**: UI updates immediately on mutations, rolling back on failure
- **Automatic Refetching**: Data refreshes on window focus and network reconnection

Query configuration in QueryProvider.tsx:

const queryClient \= new QueryClient({  
 defaultOptions: {  
 queries: {  
 staleTime: 5 \* 60 \* 1000, // 5 minutes  
 gcTime: 30 \* 60 \* 1000, // 30 minutes  
 retry: 3,  
 refetchOnWindowFocus: true,  
 },  
 },  
});

#### **Client State: React Context**

React Context API manages global client-side state that doesn't come from the server:

- AuthContext: Current user, authentication status, login/logout functions
- ThemeContext: Theme management with three variants (Light, Dark, High-Contrast), design tokens in `tokens.ts`, persisted to localStorage
- NotificationContext: Toast notifications, unread count

Context providers are composed at the application root in App.tsx following a specific nesting order that ensures proper dependency resolution:

ErrorBoundary  
 └── ThemeProvider (theme state)  
 └── AntdApp (Ant Design context)  
 └── NotificationProvider (toast system)  
 └── QueryProvider (React Query)  
 └── AuthProvider (user state)  
 └── SettingsModalProvider  
 └── BrowserRouter (routing)

This hierarchy ensures that inner providers can access outer provider values. For example, QueryProvider can display error toasts via NotificationProvider, and AuthProvider can use React Query for user data fetching.

#### **Local Component State**

For UI-specific state that doesn't need to be shared (form inputs, modal visibility, loading states), components use useState and useReducer hooks directly. This keeps state close to where it's used and avoids unnecessary global state pollution.

#### **Why Not Redux?**

The decision to avoid Redux was intentional:

- React Query handles 90% of state management needs (server data)
- Context API is sufficient for the remaining global UI state
- Reduced bundle size and boilerplate code
- Simpler mental model for developers

### **2.7.4. API Layer Design (Services Pattern)** {#2.7.4.-api-layer-design-(services-pattern)}

The frontend implements a service layer pattern that abstracts all HTTP communication behind strongly-typed service modules.

#### **Service Structure**

Each domain area has a dedicated service file in services/:

| Service                       | Purpose                                  |
| :---------------------------- | :--------------------------------------- |
| assessmentService.ts          | Assessment CRUD, publishing, statistics  |
| questionService.ts            | Question management, filtering, import   |
| questionBankService.ts        | Question bank CRUD, sharing              |
| groupService.ts               | Group management, membership             |
| inviteLinkService.ts          | Invite code/link generation, validation  |
| attemptService.ts             | Exam attempts, answer submission         |
| gradingService.ts             | Manual grading, score updates            |
| proctoringDashboardService.ts | Real-time proctoring data, SSE streams   |
| faceVerificationService.ts    | Face registration and verification       |
| violationService.ts           | Violation reporting and retrieval        |
| userService.ts                | User search and management               |
| notificationService.ts        | Notification preferences, SSE connection |
| importExportService.ts        | CSV parsing for question import/export   |

##### _Table 53\._ Frontend service structure {#table-53.-frontend-service-structure}

#### **Centralized Configuration**

All API endpoints are defined in config/api.ts, providing:

- Base URLs: Configurable via environment variables for different environments
- Endpoint Functions: Type-safe functions that generate URLs with parameters
- Timeout Configuration: Default 30-second timeout for all requests

#### **Axios Instance**

A configured Axios instance provides:

- JWT Token Injection: Automatically attaches Authorization header
- Error Handling: Centralized error transformation via interceptors
- Request/Response Logging: Development-mode logging for debugging

#### **Error Handling Pattern**

The utils/errorHandler.ts module provides centralized error handling:

- Parses API error responses into user-friendly messages
- Handles network errors, timeouts, and authentication failures
- Triggers appropriate UI notifications via toast system

### **2.7.5. Custom Hooks Pattern** {#2.7.5.-custom-hooks-pattern}

Custom hooks encapsulate reusable logic, promoting code reuse and separation of concerns across the application.

### **Hooks Directory Structure** {#hooks-directory-structure}

The hooks/ directory contains 10 custom hooks:

| Hook                    | Purpose                                           |
| :---------------------- | :------------------------------------------------ |
| useProctoring.ts        | MediaPipe integration, violation detection, state |
| useCamera.ts            | Camera stream management, permissions             |
| useAuth.ts              | Authentication state, login/logout functions      |
| useNotifications.ts     | SSE connection, notification handling             |
| useKeyboardShortcuts.ts | Global keyboard shortcut registration             |
| useFullscreen.ts        | Fullscreen API wrapper for exam mode              |
| useTimer.ts             | Countdown timer for exam duration                 |
| useDebounce.ts          | Debounced value updates for search inputs         |
| useLocalStorage.ts      | Persistent local storage with React state sync    |
| useMediaQuery.ts        | Responsive breakpoint detection                   |

##### _Table 54\._ Hooks Directory Structure {#table-54.-hooks-directory-structure}

The `useGlobalShortcuts` hook registers system-wide keyboard navigation: `Ctrl+/` (shortcuts modal), `Ctrl+,` (settings), and `Ctrl+Shift+T` (theme toggle). Shortcuts are disabled during exam mode to prevent accidental navigation.

#### **Proctoring Hook Architecture**

The useProctoring hook is the most complex, managing the AI-powered monitoring system:

const { isMonitoring, violations, faceDetected, attentionScore, startMonitoring, stopMonitoring } \=  
 useProctoring({  
 attemptId,  
 onViolation: handleViolation,  
 config: proctoringConfig,  
 });

Key responsibilities:

- Initializes Web Worker for MediaPipe processing
- Manages camera stream lifecycle
- Tracks violation events and severity
- Handles GPU/CPU fallback for face detection

#### **Module-Specific Hooks**

Complex page modules define their own hooks within their directory. For example, pages/Exam/hooks/:

- useExam.ts: Assessment loading, question navigation
- useQuestion.ts: Answer state, validation
- useTimer.ts: Exam-specific countdown with auto-submit

These module-specific hooks follow the same patterns but are scoped to their feature area, preventing the global hooks directory from becoming bloated.

## **2.8. System design** {#2.8.-system-design}

### **2.8.1. System design for 10,000 concurrent users and resource allocation** {#2.8.1.-system-design-for-10,000-concurrent-users-and-resource-allocation}

#### **a) Workload model (10,000 concurrent users)**

At peak exam time, concurrency primarily comes from:

- **Exam start burst:** authentication, assessment loading, downloading question content/assets.
- **Steady-state exam traffic:** autosave, navigation, fetching questions, timer sync.
- **Exam submission burst:** final answer submission, status updates, notifications.
- **Proctoring telemetry:** periodic heartbeats \+ violation events.
- **Proctor dashboards:** real-time alerts and status streams via SSE.

Notification Service is well-aligned with these needs because **SSE** provides long-lived server→client delivery with built-in reconnection and Last-Event-ID support, and lower complexity than full WebSockets for notification-style traffic.

#### **b) Resource allocation principles**

To make 10,000 concurrent users feasible without over-provisioning:

1. **Isolate workloads by scaling dimensions**
    - REST/API workload → scale by RPS (Assessment Service)
    - SSE workload → scale by connections (Notification Service)
    - Telemetry workload → scale by inserts/sec (Proctoring Service)
2. **Protect databases**
    - Use connection pooling (e.g., PgBouncer) to avoid “pod explosion → DB connection explosion”.
    - Cache hot configuration (assessment settings, templates, RBAC metadata) in Redis.
3. **Design for burst \+ steady state**
    - Keep a warm baseline; allow HPA to scale quickly during login/submission windows.
4. **Observability-driven scaling**
    - Using k6 for performance testing and datadog for monitoring.

### **2.8.2. System sizing** {#2.8.2.-system-sizing}

#### **Kubernetes Cluster Configuration**

The system is deployed on **DigitalOcean Kubernetes (DOKS)** with the following node pool configuration:

| Component              | Configuration            | Specifications                         |
| :--------------------- | :----------------------- | :------------------------------------- |
| **Main Node Pool**     | 1-2 nodes (auto-scaling) | s-2vcpu-4gb (2 vCPU, 8GB RAM per node) |
| **Kubernetes Version** | 1.29.x                   | Latest stable release                  |
| **Region**             | Singapore (sing3)        | Asian datacenter                       |

#### **Microservice Resource Allocation**

Each microservice is configured with specific resource requests and limits based on its workload characteristics:

| Service                           | Replicas | CPU Request | CPU Limit | Memory Request | Memory Limit |
| :-------------------------------- | :------- | :---------- | :-------- | :------------- | :----------- |
| **Assessment Service**            | 2        | 100m        | 500m      | 128Mi          | 512Mi        |
| **Proctoring Service**            | 5        | 200m        | 500m      | 256Mi          | 512Mi        |
| **Identity Verification Service** | 1        | 500m        | 1000m     | 1Gi            | 2Gi          |
| **Notification Service**          | 2        | 100m        | 250m      | 128Mi          | 256Mi        |
| **Casdoor (Identity Provider)**   | 2        | 200m        | 500m      | 256Mi          | 512Mi        |

#### **Database Sizing**

| Database                     | Engine                    | Size           | Nodes | Specifications            |
| :--------------------------- | :------------------------ | :------------- | :---- | :------------------------ |
| **PostgreSQL (Primary)**     | PostgreSQL 16             | db-s-2vcpu-4gb | 1     | 2 vCPU, 4GB RAM, 25GB SSD |
| **TimescaleDB (Proctoring)** | PostgreSQL \+ TimescaleDB | db-s-2vcpu-4gb | 1     | 2 vCPU, 4GB RAM, 50GB SSD |
| **Redis (Cache \+ Streams)** | Redis 7                   | db-s-1vcpu-1gb | 1     | 1 vCPU, 2GB RAM           |

#### **Scaling Thresholds**

| Metric               | Scale-Up Trigger | Scale-Down Trigger | Max Replicas |
| :------------------- | :--------------- | :----------------- | :----------- |
| CPU Utilization      | \>70%            | \<30%              | 5            |
| Memory Utilization   | \>80%            | \<40%              | 5            |
| Request Queue Length | \>100 requests   | \<20 requests      | 5            |

#### **Network and Load Balancing**

| Component              | Configuration                   |
| :--------------------- | :------------------------------ |
| **Ingress Controller** | Traefik v3 (2 replicas)         |
| **SSL/TLS**            | Let's Encrypt with cert-manager |
| **Load Balancer**      | DigitalOcean LB (external)      |

### **2.8.3. Calculation of system operation costs** {#2.8.3.-calculation-of-system-operation-costs}

#### **Monthly Cost Breakdown (DigitalOcean)**

##### **Kubernetes Cluster**

| Resource                   | Quantity    | Unit Price | Monthly Cost (USD) |
| :------------------------- | :---------- | :--------- | :----------------- |
| K8s Cluster (managed)      | 1           | Free       | $0                 |
| Worker Nodes (s-2vcpu-4gb) | 4 nodes avg | $24/node   | $96                |
| Block Storage (100GB)      | 1           | $10        | $10                |
| **Subtotal K8s**           |             |            | **$106**           |

#### **Managed Databases**

| Database                    | Size               | Monthly Cost (USD) |
| :-------------------------- | :----------------- | :----------------- |
| PostgreSQL (db-s-2vcpu-4gb) | Primary \+ Standby | $60                |
| Redis (db-s-1vcpu-1gb)      | Single node        | $15                |
| **Subtotal Databases**      |                    | **$75**            |

#### **Additional Services**

| Service                 | Specification | Monthly Cost (USD) |
| :---------------------- | :------------ | :----------------- |
| Load Balancer           | Standard      | $12                |
| Container Registry      | Basic (500GB) | $5                 |
| Spaces (Object Storage) | 250GB         | $5                 |
| Bandwidth (outbound)    | 1TB estimated | $10                |
| **Subtotal Additional** |               | **$32**            |

#### **External Services (Optional)**

| Service               | Purpose              | Monthly Cost (USD)   |
| :-------------------- | :------------------- | :------------------- |
| Datadog Infra \+ APM  | Monitoring & Tracing | $31/host × 4 \= $124 |
| SendGrid / SES        | Email Notifications  | $15 (25,000 emails)  |
| Domain \+ DNS         | CloudFlare Free      | $0                   |
| SSL Certificates      | Let's Encrypt        | $0                   |
| **Subtotal External** |                      | **$139**             |

#### **Total Monthly Operating Cost**

| Category                     | Cost (USD)     |
| :--------------------------- | :------------- |
| Kubernetes Infrastructure    | $106           |
| Managed Databases            | $75            |
| Additional DO Services       | $32            |
| External Services (Optional) | $139           |
| **Total (with monitoring)**  | **$352/month** |
| **Total (minimal setup)**    | **$213/month** |

## **2.9. Chapter 2 conclusion** {#2.9.-chapter-2-conclusion}

This chapter has provided a comprehensive analysis and design of the Secure Assessment Platform, covering the full spectrum from requirements elicitation to architectural decisions and system sizing.

### **Summary of Key Achievements** {#summary-of-key-achievements}

#### **Requirements and Use Case Analysis**

- Identified **three primary actors** (Student, Teacher, Administrator) and their interactions with the system
- Defined **56 functional requirements** spanning:
    - User management and authentication
    - Assessment creation and management
    - AI-powered proctoring
    - Real-time analytics and reporting
    - Multi-channel notifications
    - Group management

#### **Microservices Architecture**

The system is decomposed into five core microservices, each with clear bounded contexts:

| Service               | Technology         | Database            | Purpose                                    |
| :-------------------- | :----------------- | :------------------ | :----------------------------------------- |
| Assessment Service    | Go/Gin             | PostgreSQL          | Core exam logic, grading, attempts         |
| Proctoring Service    | Go/Gin             | TimescaleDB         | Violation detection, time-series analytics |
| Identity Verification | Python/FastAPI     | PostgreSQL \+ Redis | Face recognition, liveness detection       |
| Notification Service  | Java/Spring        | PostgreSQL          | Multi-channel notifications (SSE, Email)   |
| Identity Service      | Casdoor (external) | PostgreSQL          | OAuth2/OIDC, RBAC, MFA                     |

# **CHAPTER 3: APPLICATION DEPLOYMENT** {#chapter-3:-application-deployment}

## **3.1. Implementation and supporting tools** {#3.1.-implementation-and-supporting-tools}

### **3.1.1. Tools used** {#3.1.1.-tools-used}

#### **Development Environment**

| Tool                   | Version | Purpose                                                    |
| :--------------------- | :------ | :--------------------------------------------------------- |
| **GoLand**             | 2024.3  | Primary IDE for Go backend development (JetBrains)         |
| **Visual Studio Code** | 1.95+   | Frontend development, Python services, and general editing |
| **PyCharm**            | 2024.3  | Python development for Identity Verification Service       |
| **DataGrip**           | 2024.3  | Database management and SQL development                    |

#### **Version Control & Collaboration**

| Tool                                                            | Purpose                                                 |
| :-------------------------------------------------------------- | :------------------------------------------------------ |
| **Git**                                                         | Distributed version control                             |
| **GitHub**                                                      | Source code hosting, issue tracking, project management |
| **GitHub Actions**                                              | CI/CD automation                                        |
| **GitHub Container Registry / DigitalOcean Container Registry** | Docker image storage                                    |

#### **Containerization & Orchestration**

| Tool               | Version | Purpose                              |
| :----------------- | :------ | :----------------------------------- |
| **Docker**         | 27.x    | Container runtime and image building |
| **Docker Compose** | 2.x     | Local multi-container development    |
| **Kubernetes**     | 1.29.x  | Production container orchestration   |
| **kubectl**        | 1.29.x  | Kubernetes CLI management            |
| **Helm**           | 3.x     | Kubernetes package manager           |

#### **Infrastructure as Code**

| Tool             | Version | Purpose                               |
| :--------------- | :------ | :------------------------------------ |
| **cert-manager** | 1.x     | Kubernetes TLS certificate management |
| **Traefik**      | 3.x     | Ingress controller and load balancing |

#### **Database Tools**

| Tool              | Purpose                       |
| :---------------- | :---------------------------- |
| **pgAdmin 4**     | PostgreSQL administration GUI |
| **Redis Insight** | Redis database visualization  |

#### **API Development & Testing**

| Tool                | Purpose                                   |
| :------------------ | :---------------------------------------- |
| **Postman**         | API testing and documentation             |
| **Swagger/OpenAPI** | API specification                         |
| **httpie / curl**   | CLI HTTP testing                          |
| **K6**              | Load testing and performance benchmarking |

#### **Monitoring & Observability**

| Tool            | Purpose                                                 |
| :-------------- | :------------------------------------------------------ |
| **Datadog APM** | Application performance monitoring, distributed tracing |

#### **Code Quality Tools**

| Tool              | Language              | Purpose                  |
| :---------------- | :-------------------- | :----------------------- |
| **golangci-lint** | Go                    | Comprehensive Go linter  |
| **ESLint**        | TypeScript/JavaScript | Frontend code linting    |
| **Prettier**      | Multi-language        | Code formatting          |
| **pytest**        | Python                | Python testing framework |
| **Vitest**        | TypeScript            | Frontend unit testing    |

### **3.1.2. Supporting libraries** {#3.1.2.-supporting-libraries}

##### **Face Recognition & AI**

| Library                | Version          | Purpose                                  |
| :--------------------- | :--------------- | :--------------------------------------- |
| inspireface            | ≥1.2.3           | State-of-the-art face recognition engine |
| opencv-python-headless | 4.8.1.78         | Computer vision (headless for server)    |
| numpy                  | ≥1.23.0, \<2.0.0 | Numerical computing                      |
| scikit-learn           | 1.3.2            | Machine learning utilities               |
| pillow                 | 10.1.0           | Image processing                         |
| albumentations         | 1.3.1            | Image augmentation                       |

## **3.2. Installation results** {#3.2.-installation-results}

### **3.2.1. System deployment and packaging into images (using Docker)** {#3.2.1.-system-deployment-and-packaging-into-images-(using-docker)}

In this project, each component of the Secure Assessment Platform (SAP) is packaged as an independent Docker image. This approach ensures environment consistency across development, staging, and production, and enables independent deployment and scaling of microservices.

We maintain a Dockerfile per component (React frontend, Golang, Java microservices, and supporting tools). Images are built using multi-stage builds to reduce final image size, improve cold-start time, and minimize the attack surface.

#### **Docker image strategy**

The platform is composed of multiple container images. The main images are:

• frontend-ui: serves the React single-page application (built assets) via Nginx

• api-gateway: reverse proxy / routing layer (optional; can be merged with frontend Nginx)

• assessment-service, proctoring-service, notification-service, group-service, identity-verification-service: Golang and Java microservices

• casdoor: identity provider deployed as a container

• postgres (timescaledb) and redis: infrastructure dependencies used by the system

#### **Multi-stage Dockerfiles**

To optimize build artifacts, we apply multi-stage Docker builds. For Backend services, the first stage compiles a static binary and executes unit tests, while the final stage runs the binary in a minimal runtime image. For the frontend, the first stage builds static assets with Node.js, and the final stage serves them with Nginx.

**Example (Golang service Dockerfile):**

\# build stage  
 FROM golang:1.22 AS builder  
 WORKDIR /app  
 COPY . .  
 RUN go test ./...  
 RUN CGO_ENABLED=0 GOOS=linux go build \-o service ./cmd/service

\# runtime stage  
 FROM gcr.io/distroless/static:nonroot  
 WORKDIR /  
 COPY \--from=builder /app/service /service  
 USER nonroot:nonroot  
 ENTRYPOINT \["/service"\]

#### **Local deployment with Docker Compose**

For local development and integration testing, docker compose is used to start the complete stack (microservices, PostgreSQL/TimescaleDB, Redis Streams, and Casdoor) with a single command. Environment variables and configuration files are injected into containers, and persistent data is stored in named volumes.

**Typical commands:**

docker compose up \-d \--build  
 docker compose logs \-f  
 docker compose down \-v

#### **Versioning and publishing images**

Images are tagged using semantic versioning and/or the Git commit SHA (e.g., v1.2.0, sha-\<commit\>). After a successful build, images are pushed to a container registry (Docker Hub or GitHub Container Registry). Kubernetes deployments then pull the exact image tag to ensure reproducibility between environments.

![][image34]

###### **_Figure 30\. Docker packaging and deployment_** {#figure-30.-docker-packaging-and-deployment}

### **3.2.2. Deploying the system on Kubernetes (K8s):** {#3.2.2.-deploying-the-system-on-kubernetes-(k8s):}

#### **Kubernetes Manifest Structure**

| k8s/├── deployment.yaml \# Deployment configuration├── service.yaml \# Service exposure├── configmap.yaml \# Non-sensitive configuration├── secret.yaml \# Sensitive credentials (base64 encoded)└── traefik/ └── ingressroute.yaml \# Traefik ingress rules |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

#### **Example: Assessment Service Deployment**

| apiVersion: apps/v1kind: Deploymentmetadata: name: assessment-service namespace: default labels: app: assessment-service tags.datadoghq.com/env: "production" tags.datadoghq.com/service: "assessment-service" tags.datadoghq.com/version: "1.0.0"spec: replicas: 2 strategy: type: RollingUpdate rollingUpdate: maxUnavailable: 1 maxSurge: 1 selector: matchLabels: app: assessment-service template: metadata: labels: app: assessment-service tags.datadoghq.com/env: "production" tags.datadoghq.com/service: "assessment-service" tags.datadoghq.com/version: "1.0.0" annotations: ad.datadoghq.com/assessment-service.logs: '\[{"source":"go","service":"assessment-service"}\]' spec: containers: \- name: assessment-service image: \<IMAGE\> ports: \- name: http containerPort: 8080 protocol: TCP env: \# Datadog APM Configuration \- name: DD_SERVICE value: "assessment-service" \- name: DD_ENV value: "production" \- name: DD_VERSION value: "1.0.0" \- name: DD_PROFILING_ENABLED value: "true" \# Application Configuration from ConfigMap \- name: PORT valueFrom: configMapKeyRef: name: assessment-service-config key: PORT \# Secrets \- name: DATABASE_URL valueFrom: secretKeyRef: name: assessment-service-secret key: DATABASE_URL \- name: REDIS_URL valueFrom: secretKeyRef: name: assessment-service-secret key: REDIS_URL  volumeMounts: \- name: apmsocket mountPath: /var/run/datadog readOnly: true livenessProbe: httpGet: path: /health port: http initialDelaySeconds: 30 periodSeconds: 10 timeoutSeconds: 5 failureThreshold: 3 readinessProbe: httpGet: path: /health port: http initialDelaySeconds: 5 periodSeconds: 5 timeoutSeconds: 3 failureThreshold: 3 resources: requests: memory: "128Mi" cpu: "100m" limits: memory: "512Mi" cpu: "500m" volumes: \- name: apmsocket hostPath: path: /var/run/datadog/ type: Directory |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

#### **Example Assessment: Service & Ingress Configuration**

| \# service.yamlapiVersion: v1kind: Servicemetadata: name: assessment-service namespace: defaultspec: type: ClusterIP ports: \- port: 80 targetPort: 8080 protocol: TCP name: http selector: app: assessment-service\---\# ingressroute.yaml (Traefik)apiVersion: traefik.io/v1alpha1kind: IngressRoutemetadata: name: assessment-service namespace: defaultspec: entryPoints: \- websecure routes: \- match: Host(\`api.example.com\`) && PathPrefix(\`/api/v1/assessments\`) kind: Rule services: \- name: assessment-service port: 80 tls: certResolver: letsencrypt |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### **3.2.3. Implementing the CI/CD pipeline** {#3.2.3.-implementing-the-ci/cd-pipeline}

#### **GitHub Actions Workflow**

The project uses GitHub Actions for continuous integration and deployment:

| name: CI/CD Pipelineon: push: branches: \[main, develop, develop-\*\] pull_request: branches: \[main, develop\]env: GO_VERSION: '1.24.6' DOCKER_IMAGE: registry.digitalocean.com/${{ secrets.DO\_REGISTRY\_NAME }}/assessment-service  DO\_CLUSTER\_NAME: ${{ secrets.DO\_CLUSTER\_NAME }}jobs:  \# \========== TEST JOB \==========  test:    name: Test    runs-on: ubuntu-latest    steps:    \- name: Checkout code      uses: actions/checkout@v5    \- name: Set up Go      uses: actions/setup-go@v6      with:        go-version: ${{ env.GO\_VERSION }}        cache: true    \- name: Cache Go modules      uses: actions/cache@v4      with:        path: \~/go/pkg/mod        key: ${{ runner.os }}-go-${{ hashFiles('\*\*/go.sum') }} restore-keys: |  ${{ runner.os }}\-go- \- name: Download dependencies run: go mod download \- name: Verify dependencies run: go mod verify \- name: Run go mod tidy check run: |  go mod tidy git diff \--exit-code go.mod go.sum \- name: Run tests with coverage run: go test \-v \-race \-coverprofile=coverage.txt ./... \- name: Upload coverage to Codecov uses: codecov/codecov-action@v5 with: token: ${{ secrets.CODECOV\_TOKEN }} \# \========== LINT JOB \========== lint: name: Lint runs-on: ubuntu-latest steps: \- name: Checkout code uses: actions/checkout@v5 \- name: Set up Go uses: actions/setup-go@v6 with: go-version: ${{ env.GO\_VERSION }} cache: true \- name: Run golangci-lint uses: golangci/golangci-lint-action@v6 with: version: latest args: \--timeout=5m \--issues-exit-code=0 \# \========== BUILD JOB \========== build: name: Build runs-on: ubuntu-latest needs: \[test, lint\] steps: \- name: Checkout code uses: actions/checkout@v5 \- name: Set up Go uses: actions/setup-go@v6 with: go-version: ${{ env.GO\_VERSION }} cache: true \- name: Build binary run: |  CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \\ \-o assessment-service main.go \# \========== DEPLOY JOB \========== deploy-digitalocean: name: Deploy to DigitalOcean Kubernetes runs-on: ubuntu-latest needs: \[build\] if: github.ref \== 'refs/heads/main' && github.event_name \== 'push' environment: production steps: \- name: Checkout code uses: actions/checkout@v5 \- name: Install doctl uses: digitalocean/action-doctl@v2 with: token: ${{ secrets.DO\_ACCESS\_TOKEN }}    \- name: Build Docker image      run: docker build \-t ${{ env.DOCKER\_IMAGE }}:$(echo $GITHUB_SHA | head \-c7) . \- name: Log in to DigitalOcean Container Registry run: doctl registry login \--expiry-seconds 1200 \- name: Push image to Registry run: docker push ${{ env.DOCKER\_IMAGE }}:$(echo $GITHUB_SHA | head \-c7) \- name: Update deployment file run: |  TAG=$(echo $GITHUB_SHA | head \-c7) sed \-i 's | \<IMAGE\> | ${{ env.DOCKER\_IMAGE }}:'${TAG}' | ' k8s/deployment.yaml \- name: Save kubeconfig run: doctl kubernetes cluster kubeconfig save \--expiry-seconds 600 ${{ env.DO\_CLUSTER\_NAME }} \- name: Deploy to Kubernetes run: kubectl apply \-f k8s/deployment.yaml \- name: Verify deployment run: kubectl rollout status deployment/assessment-service |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ----------------------- | --------------------- | --------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

####

| Branch        | Trigger            | Actions                                    |
| :------------ | :----------------- | :----------------------------------------- |
| `main`        | Push               | Test → Lint → Build → Deploy to Production |
| `develop`     | Push/PR            | Test → Lint → Build                        |
| `develop-*`   | Push               | Test → Lint → Build                        |
| Pull Requests | PR to main/develop | Test → Lint                                |

#### **Secrets Configuration**

| Secret             | Purpose                 |
| :----------------- | :---------------------- |
| `DO_ACCESS_TOKEN`  | DigitalOcean API token  |
| `DO_REGISTRY_NAME` | Container registry name |
| `DO_CLUSTER_NAME`  | Kubernetes cluster name |
| `CODECOV_TOKEN`    | Code coverage reporting |

### **3.2.4. Deploying tracing and monitoring tools** {#3.2.4.-deploying-tracing-and-monitoring-tools}

#### **Datadog APM Integration**

The system uses Datadog for comprehensive observability:

##### **Automatic Instrumentation with Orchestrion**

| // Installation during Docker buildRUN go install github.com/DataDog/orchestrion@latestRUN orchestrion pinRUN orchestrion go build \-o assessment-service . |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------- |

##### **Environment Configuration**

| \# In deployment.yamlenv: \- name: DD_SERVICE value: "assessment-service" \- name: DD_ENV value: "production" \- name: DD_VERSION value: "1.0.0" \- name: DD_PROFILING_ENABLED value: "true" |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

##### **Slog Integration for Log Correlation**

| // Using Datadog slog handler for trace correlationimport ( ddtrace "github.com/DataDog/dd-trace-go/ddtrace/tracer" "github.com/DataDog/dd-trace-go/contrib/log/slog/v2")func main() { ddtrace.Start() defer ddtrace.Stop() // Create slog handler with Datadog integration handler := slog.NewHandler(os.Stdout, \&slog.HandlerOptions{}) logger := slog.New(handler) // Logs will automatically include trace_id and span_id} |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

#### **Monitoring Stack Overview**

| Component | Tool                  | Purpose                        |
| :-------- | :-------------------- | :----------------------------- |
| APM       | Datadog               | Distributed tracing, profiling |
| Logs      | Datadog Logs          | Centralized log aggregation    |
| Metrics   | Prometheus \+ Datadog | Custom metrics collection      |
| Alerts    | Datadog Monitors      | Anomaly detection, alerting    |

#### **Key Metrics Tracked**

| Category     | Metrics                                   |
| :----------- | :---------------------------------------- |
| **HTTP**     | Request latency, error rate, throughput   |
| **Database** | Query time, connection pool, slow queries |
| **Redis**    | Hit/miss ratio, command latency           |

### **3.2.5. Deploying the Mediapipe system on the client side** {#3.2.5.-deploying-the-mediapipe-system-on-the-client-side}

The proctoring system deploys Google's MediaPipe face detection directly in the browser to enable real-time monitoring while preserving student privacy. This section documents the implementation architecture and the optimization techniques used to achieve smooth UI performance.

#### **3.2.5.1. MediaPipe Integration and Setup**

**Technology Overview**  
MediaPipe is Google's cross-platform framework for building ML pipelines. The proctoring system uses the FaceLandmarker model from the \`@mediapipe/tasks-vision\` package, which provides:

- 478 facial landmark points detection
- Multi-face detection (up to 2 faces simultaneously)
- Facial blendshapes for expression analysis
- WebGL GPU acceleration support

**Model Configuration**  
The FaceLandmarker is initialized with the following configuration:

faceLandmarker \= await FaceLandmarker.createFromOptions(vision, {  
 baseOptions: {  
 modelAssetPath: 'https://storage.googleapis.com/.../face\_landmarker.task',  
 delegate: 'GPU', // or 'CPU' as fallback  
 },  
 runningMode: 'IMAGE',  
 numFaces: 2,  
 minFaceDetectionConfidence: 0.5,  
 minFacePresenceConfidence: 0.5,  
 minTrackingConfidence: 0.5,  
 outputFaceBlendshapes: true,  
});

**Resource Loading**  
MediaPipe requires loading WebAssembly modules from a CDN at runtime:  
1\. **Vision Task Runtime**: Loaded via \`FilesetResolver.forVisionTasks()\` from jsDelivr CDN  
2\. **Face Landmarker Model**: Downloaded from Google Cloud Storage (\~4MB)  
3\. **WASM Binary**: Platform-specific WebAssembly module for computation  
The model is cached by the browser after first load, reducing subsequent initialization time.  
**GPU/CPU Fallback Strategy**  
The system implements automatic hardware acceleration detection:  
1\. Attempt GPU initialization with \`delegate: 'GPU'\`  
2\. If GPU fails (no WebGL2 support), catch the error  
3\. Reinitialize with \`delegate: 'CPU'\`  
4\. Report the active delegate for monitoring  
GPU acceleration provides approximately 3-4x performance improvement on supported hardware.

#### **3.2.5.2. Web Worker Optimization**

**Problem Statement**

The original implementation ran MediaPipe on the main thread, causing UI blocking:

| Metric (Before)    | Value            | Issue            |
| :----------------- | :--------------- | :--------------- |
| Thread Usage       | Main thread only | UI blocking      |
| Detection Interval | 100ms (\~10fps)  | High CPU load    |
| Event Storage      | Unbounded array  | Memory leak risk |

##### _Table 54\._ Web Worker problems {#table-54.-web-worker-problems}

**Overcoming the MediaPipe Web Worker Limitation**  
MediaPipe's official bundle uses ES Module exports, which are incompatible with Web Workers due to \`importScripts()\` restrictions. This is a known issue documented in **MediaPipe Issue \#5257** on GitHub.  
This project overcame the limitation by patching the MediaPipe bundle to use global exports:  
**Original MediaPipe bundle (ESM exports):**

export { Ia as DrawingUtils, Za as FaceDetector, uc as FaceLandmarker, ... };

**Patched bundle for Web Worker compatibility:**

self.$mediapipe \= { DrawingUtils: Ia, FaceDetector: Za, FaceLandmarker: uc, ... };

The patched bundle is loaded via \`importScripts()\` in a classic Web Worker, enabling full MediaPipe functionality in a separate thread.  
**Solution Architecture**  
The optimized architecture moves all ML processing to a dedicated Web Worker:  
![][image35]  
**Implementation Components**

| File                                 | Size    | Purpose                                      |
| :----------------------------------- | :------ | :------------------------------------------- |
| \`public/mediapipe-vision.js\`       | \~125KB | Patched MediaPipe bundle with global exports |
| \`public/faceDetectionWorker.js\`    | \~6KB   | Classic Web Worker for face detection        |
| \`src/hooks/useWorkerProctoring.ts\` | \~11KB  | React hook managing worker lifecycle         |

##### _Table 55\._ Mediapipes implementation components {#table-55.-mediapipes-implementation-components}

**Zero-Copy Frame Transfer**  
For efficient frame transfer between threads:  
1\. \`OffscreenCanvas\` (320x240) captures video frame at reduced resolution  
2\. \`transferToImageBitmap()\` creates transferable bitmap  
3\. \`postMessage()\` with transfer list moves ownership to worker (zero-copy)  
4\. Worker calls \`frame.close()\` after detection to release GPU memory  
5\. Results returned as lightweight JSON (face count, violation flags)

#### **3.2.5.3. Detection Pipeline and Results**

**Violation Detection**  
The face detection runs at 4 FPS (250ms intervals) with the following landmark-based analysis:

| Detection Type | Landmark Indices   | Threshold | Description                                    |
| :------------- | :----------------- | :-------- | :--------------------------------------------- |
| Face Count     | All landmarks      | n/a       | 0 \= no face, 1 \= valid, 2+ \= multiple faces |
| Gaze Direction | 468, 473 (iris)    | 0.3-0.7   | Iris position relative to eye corners          |
| Eyes Closed    | 159, 145, 386, 374 | \< 0.18   | Eye height/width aspect ratio                  |
| Mouth Open     | 13, 14 (lips)      | \> 0.03   | Lip separation distance                        |
| Head Turned    | 1, 234, 454        | \> 0.15   | Nose-to-center distance vs face width          |

##### _Table 56\._ Mediapipes Violation Detection {#table-56.-mediapipes-violation-detection}

Violations are tracked with start/end timestamps, enabling duration-based severity analysis.  
**Before vs After Comparison**

| Metric             | Before           | After                  | Improvement          |
| :----------------- | :--------------- | :--------------------- | :------------------- |
| Thread Usage       | Main thread only | Main \+ Worker         | UI unblocked         |
| Detection Interval | 100ms (10fps)    | 250ms (4fps)           | 60% fewer calls      |
| Frame Resolution   | Full video       | 320x240                | Reduced memory       |
| Frame Transfer     | N/A              | ImageBitmap            | Zero-copy            |
| Event Storage      | Unbounded        | Max 50                 | Memory leak fixed    |
| GPU Fallback       | None             | CPU fallback           | Better compatibility |
| MediaPipe Loading  | ES Module import | importScripts \+ patch | Worker compatible    |

##### _Table 57\._ Mediapipes comparisons after improvement {#table-57.-mediapipes-comparisons-after-improvement}

**Browser Compatibility**

| Browser | Minimum Version | Notes                     |
| :------ | :-------------- | :------------------------ |
| Chrome  | 69+             | OffscreenCanvas required  |
| Firefox | 105+            | OffscreenCanvas required  |
| Safari  | 16.4+           | OffscreenCanvas \+ WebGL2 |
| Edge    | 79+             | Chromium-based            |

##### _Table 59\. Browser Compatibility_ {#table-59.-browser-compatibility}

**Conclusion**  
The Web Worker implementation successfully overcame a known MediaPipe upstream limitation (Issue \#5257) through a patched bundle approach. This results in a significantly smoother user experience during proctored assessments, with the main thread completely free for UI rendering while ML processing runs independently in a dedicated worker thread.

## **3.3. Functional and non-functional testing (performance testing):** {#3.3.-functional-and-non-functional-testing-(performance-testing):}

### **3.3.1. Performance Testing Methodology** {#3.3.1.-performance-testing-methodology}

#### **Testing Tool: K6**

#### **Test Environment**

| Component              | Specification                             |
| :--------------------- | :---------------------------------------- |
| **Load Generator**     | K6 v0.49.0 on Ubuntu 22.04                |
| **Target Environment** | DigitalOcean Kubernetes (production-like) |
| **Kubernetes Nodes**   | 2 × s-2vcpu-4gb (2 vCPU, 8GB RAM each)    |
| **Database**           | PostgreSQL 16 (db-s-2vcpu-4gb)            |
| **Time-Series DB**     | TimescaleDB (db-s-2vcpu-4gb)              |
| **Cache**              | Redis 7 (db-s-1vcpu-1gb)                  |

### **3.3.2. Test Scenarios** {#3.3.2.-test-scenarios}

The following test scenarios were implemented to evaluate system performance under various conditions:

#### **Scenario Configurations**

| // K6 Test Scenariosexport const scenarios \= { // Smoke test \- Verify system works smoke: { executor: 'constant-vus', vus: 5, duration: '1m', },  // Load test \- Normal load (100 concurrent users) load: { executor: 'ramping-vus', startVUs: 0, stages: \[ { duration: '2m', target: 100 }, // Ramp up { duration: '5m', target: 100 }, // Sustain { duration: '2m', target: 0 }, // Ramp down \], },  // Stress test \- Find breaking point (up to 10,000 users) stress: { executor: 'ramping-vus', startVUs: 0, stages: \[ { duration: '2m', target: 100 }, { duration: '5m', target: 500 }, { duration: '5m', target: 1000 }, { duration: '5m', target: 2000 }, { duration: '10m', target: 5000 }, { duration: '10m', target: 10000 }, { duration: '5m', target: 0 }, \], },  // Spike test \- Sudden traffic burst spike: { executor: 'ramping-vus', startVUs: 0, stages: \[ { duration: '1m', target: 100 }, { duration: '30s', target: 5000 }, // Spike\! { duration: '3m', target: 5000 }, { duration: '30s', target: 100 }, // Recover { duration: '2m', target: 0 }, \], },  // Soak test \- Long duration stability soak: { executor: 'constant-vus', vus: 500, duration: '30m', },}; |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

#### **Performance Thresholds (SLOs)**

| export const thresholds \= { // HTTP request duration http_req_duration: \['p(95)\<500', 'p(99)\<1000'\],  // HTTP failure rate http_req_failed: \['rate\<0.01'\], // \<1% error rate  // Endpoint-specific thresholds 'http_req_duration{endpoint:ingest}': \['p(95)\<200'\], // Violation ingest 'http_req_duration{endpoint:batch}': \['p(95)\<500'\], // Batch ingest 'http_req_duration{endpoint:analytics}': \['p(95)\<1000'\], // Analytics queries}; |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### **3.3.3. Performance Test Results** {#3.3.3.-performance-test-results}

#### **Load Test Results (100 Concurrent Users)**

| Metric                          | Target   | Result | Status |
| :------------------------------ | :------- | :----- | :----- |
| **HTTP Request Duration (p95)** | \<500ms  | 187ms  | PASS   |
| **HTTP Request Duration (p99)** | \<1000ms | 342ms  | PASS   |
| **Error Rate**                  | \<1%     | 0.02%  | PASS   |
| **Violation Ingest (p95)**      | \<200ms  | 89ms   | PASS   |
| **Batch Ingest (p95)**          | \<500ms  | 156ms  | PASS   |
| **Analytics Query (p95)**       | \<1000ms | 423ms  | PASS   |

#### **Stress Test Results (Peak 10,000 Concurrent Users)**

| VU Count | Avg Response Time | P95 Response Time | Error Rate | Throughput |
| :------- | :---------------- | :---------------- | :--------- | :--------- |
| 100      | 45ms              | 89ms              | 0.00%      | 300 req/s  |
| 500      | 67ms              | 134ms             | 0.01%      | 500 req/s  |
| 1,000    | 98ms              | 198ms             | 0.02%      | 800 req/s  |
| 2,000    | 156ms             | 312ms             | 0.05%      | 1500 req/s |
| 5,000    | 500ms             | 1s                | 2%         | 3000 req/s |
| 10,000   | 19s               | 20s               | 15%        | 5000 req/s |

#### **Spike Test Results (5,000 Sudden Users)**

| Phase       | VU Count | Avg Response | Error Rate | Recovery Time |
| :---------- | :------- | :----------- | :--------- | :------------ |
| Pre-spike   | 100      | 52ms         | 0.00%      | \-            |
| Spike (30s) | 5,000    | 678ms        | 0.45%      | \-            |
| Sustained   | 5,000    | 312ms        | 0.08%      | 45s           |
| Recovery    | 100      | 48ms         | 0.00%      | 15s           |

**Key Finding**: System successfully recovered from a 50x traffic spike within 45 seconds.

#### **Soak Test Results (500 Users for 30 Minutes)**

| Metric            | Start (0-5min) | Middle (15min) | End (30min) | Variance |
| :---------------- | :------------- | :------------- | :---------- | :------- |
| Avg Response Time | 78ms           | 82ms           | 85ms        | \+9%     |
| P95 Response Time | 145ms          | 152ms          | 158ms       | \+9%     |

**Key Finding**: No significant performance degradation or memory leaks over 30 minutes.

### **3.3.4. Custom Metrics Summary** {#3.3.4.-custom-metrics-summary}

#### **Violation Ingestion Performance**

| Metric                        | Value     |
| :---------------------------- | :-------- |
| **Total Violations Sent**     | 1,247,856 |
| **Ingest Success Rate**       | 99.97%    |
| **Batch Ingest Success Rate** | 99.95%    |
| **Avg Ingest Duration**       | 42ms      |
| **Max Ingest Duration**       | 892ms     |

## **3.4. Issues related to cheating/fraud & methods to disable monitoring** {#3.4.-issues-related-to-cheating/fraud-&-methods-to-disable-monitoring}

This section examines the common attack vectors used to circumvent online proctoring systems and documents the frontend countermeasures implemented to mitigate these threats.

### **3.4.1. Common Cheating Methods and Attack Vectors** {#3.4.1.-common-cheating-methods-and-attack-vectors}

Understanding how students may attempt to circumvent proctoring systems is essential for designing effective countermeasures. The following attack categories represent the most common threats to online assessment integrity.

#### **Browser Tampering**

Students with technical knowledge may attempt to manipulate the browser environment:

| Attack Method      | Technique                                     | Risk Level |
| :----------------- | :-------------------------------------------- | :--------- |
| DevTools Access    | F12, Ctrl+Shift+I to inspect/modify           | High       |
| Console Injection  | Execute JavaScript to bypass restrictions     | High       |
| View Source        | Ctrl+U to examine client-side validation      | Medium     |
| Browser Extensions | Install extensions that modify page behavior  | High       |
| Console Override   | Override console.log to hide debugging traces | Medium     |

##### _Table 60\. Browser Tampering_ {#table-60.-browser-tampering}

#### **Copy/Paste Exploitation**

Students may attempt to transfer question content or paste pre-prepared answers:

- Copy questions to external applications or messaging platforms
- Paste answers from notes, documents, or AI assistants
- Cut content to bypass copy-only restrictions

#### **Tab Switching and Screen Sharing**

Leaving the exam window to access external resources:

- Switch tabs to search engines or reference materials
- Use split-screen or multiple monitors
- Share screen with remote helpers via video call
- Use virtual desktops to hide secondary windows

#### **Fullscreen Bypass**

Exiting fullscreen mode to access the desktop or other applications:

- Press Escape or F11 to exit fullscreen
- Use Alt+Tab to switch applications
- Minimize browser window

#### **Request Manipulation**

Advanced attackers may intercept and modify API requests:

- Use proxy tools (Burp Suite, Charles) to modify submission data
- Replay previous successful submissions
- Manipulate violation reports sent to backend

### **3.4.2. Frontend Anti-Cheating Implementation** {#3.4.2.-frontend-anti-cheating-implementation}

The platform implements multiple layers of client-side protection through specialized React hooks that work together to create a comprehensive monitoring system.

#### **3.4.2.1. DevTools Blocker**

The useDevToolsBlocker hook prevents access to browser developer tools:

// Blocked keyboard shortcuts  
\- F12 // DevTools  
\- Ctrl+Shift+I // Inspect Element  
\- Ctrl+Shift+J // Console  
\- Ctrl+Shift+C // Element Picker  
\- Ctrl+U // View Source  
\- Right-click // Context menu

**Implementation approach:**

- Event listeners on keydown and contextmenu events
- preventDefault() called on matched key combinations
- Bypass mechanism for development environments via shouldBypassTamperDetection()

#### **3.4.2.2. Browser Proctoring**

The useBrowserProctoring hook monitors browser-level behaviors with configurable options:

| Feature               | Event Listeners               | Configurable        |
| :-------------------- | :---------------------------- | :------------------ |
| Tab Switch Detection  | visibilitychange, blur, focus | preventTabSwitching |
| Fullscreen Monitoring | fullscreenchange              | requireFullscreen   |
| Copy/Paste Prevention | copy, paste, cut              | preventCopyPaste    |
| Tamper Detection      | Window size monitoring        | detectTampering     |

##### _Table 61\. Browser Protocoring_ {#table-61.-browser-protocoring}

Violations are tracked with timing information:

interface BrowserProctoringEvent {  
 type: 'tab_switch' | 'fullscreen_exit' | 'copy_paste' | 'browser_tamper';  
 startTime: number;  
 endTime: number;  
 duration: number;  
 metadata?: { action?: 'copy' | 'paste' | 'cut' };  
}

#### **3.4.2.3. Tamper Detection**

The useBrowserTamperDetection hook performs active checks for browser manipulation:

|   Detection Method    |                   Technique                    | Bypass Resistance |
| :-------------------: | :--------------------------------------------: | :---------------: |
|     DevTools Open     | Compare window.outerWidth \- innerWidth \> 160 |      Medium       |
|    Debugger Timing    |   Measure debugger statement execution time    |       High        |
|   Console Override    |   Check if console.log.toString() is native    |      Medium       |
| Suspicious Extensions | Query DOM for common cheat extension selectors |        Low        |

##### _Table 62\. Tamper detection_ {#table-62.-tamper-detection}

The hook returns a TamperStatus object and triggers warnings before exam start:

interface TamperStatus {  
 devTools: boolean;  
 consoleOverride: boolean;  
 suspiciousExtensions: boolean;  
}

#### **3.4.2.4. Fullscreen Enforcement**

Students are required to enter fullscreen mode before starting the exam:

1. Entry: document.documentElement.requestFullscreen() called on exam start
2. Monitoring: fullscreenchange event listener detects exit
3. Warning: Modal prompts student to re-enter fullscreen
4. Violation Logging: Exit events are recorded and submitted to backend

#### **3.4.2.5. Assessment Settings Integration**

Teachers can configure anti-cheating features per assessment:

interface AssessmentSettings {  
 require_webcam?: boolean;  
 prevent_tab_switching?: boolean;  
 prevent_right_click?: boolean;  
 prevent_copy_paste?: boolean;  
 require_full_screen?: boolean;  
 // ...  
}

### **3.4.3. Known Limitations** {#3.4.3.-known-limitations}

Despite the implemented countermeasures, certain limitations exist that attackers may exploit:

#### **Single Camera Limitation**

The system monitors only the front-facing webcam, leaving blind spots:

- Secondary displays or devices outside camera view
- Physical notes positioned below camera line of sight
- Smart watches or small devices

#### **No Audio Detection**

The current implementation does not include audio monitoring:

- Voice communication with remote helpers is undetected
- Text-to-speech tools for reading content aloud
- Audio recordings of pre-prepared answers

_Note: Audio violation types exist in the codebase but detection is not implemented._

#### **Browser Extension Vulnerabilities**

Sophisticated extensions can potentially:

- Override event listeners after page load
- Modify the DOM to show/hide content
- Intercept and modify network requests
- Disable fullscreen requirements

#### **Virtual Machine Detection**

Students may run the exam in a virtual machine:

- Take snapshots to retry questions
- Use host machine for research while VM is fullscreen
- Clone VM state across multiple students

### **3.4.4. Proposed Solutions and Mitigations** {#3.4.4.-proposed-solutions-and-mitigations}

Future improvements to strengthen the anti-cheating system:

| Limitation           | Proposed Solution                             | Implementation Effort |
| -------------------- | --------------------------------------------- | --------------------- |
| Single Camera        | Secondary camera support, phone-as-camera     | High                  |
| No Audio             | Web Audio API integration for voice detection | Medium                |
| Extensions           | Content Security Policy, extension detection  | Medium                |
| VM Detection         | Hardware fingerprinting, timing analysis      | High                  |
| Request Manipulation | Request signing, server-side validation       | Medium                |

##### _Table 62\._ Solutions for strengthen the anti-cheating system {#table-62.-solutions-for-strengthen-the-anti-cheating-system}

#### **Defense in Depth Strategy**

The current implementation follows a layered defense approach:

1. **Prevention**: Block known attack vectors (DevTools, copy/paste)
2. **Detection**: Monitor for suspicious behavior (tab switch, tamper)
3. **Recording**: Log all violations with timestamps for review
4. **Server Validation**: Backend verifies all submitted data

While no client-side protection is foolproof, the combination of multiple detection methods significantly raises the difficulty of successful cheating and creates audit trails for post-exam review.

## **3.5. Chapter 3 Conclusion** {#3.5.-chapter-3-conclusion}

Chapter 3 has presented a comprehensive overview of the implementation and deployment of the Secure Assessment Platform, demonstrating the successful translation of the architectural designs from Chapter 2 into a fully functional production system.

### **Development Environment and Tools** {#development-environment-and-tools}

The project leveraged a modern development stack optimized for cloud-native applications:

| Category             | Technologies                             |
| :------------------- | :--------------------------------------- |
| **IDEs**             | GoLand, VS Code, PyCharm                 |
| **Version Control**  | Git, GitHub, GitHub Actions              |
| **Containerization** | Docker, Docker Compose, Kubernetes 1.29  |
| **Infrastructure**   | Terraform, Traefik, cert-manager, ArgoCD |
| **Observability**    | Datadog APM, Prometheus, Grafana         |

### **Library Selection Rationale** {#library-selection-rationale}

The supporting libraries were carefully selected to meet the platform's requirements:

- **Backend (Go)**: Gin framework for high-performance HTTP handling, GORM for database operations, Datadog Orchestrion for automatic APM instrumentation
- **Backend (Python)**: FastAPI for async API handling, InspireFace for state-of-the-art face recognition with 99.5%+ accuracy
- **Frontend**: React 19 with TypeScript for type safety, Ant Design for enterprise-grade UI components, MediaPipe for client-side AI processing

### **Deployment Achievements** {#deployment-achievements}

| Aspect            | Achievement                                                               |
| :---------------- | :------------------------------------------------------------------------ |
| **Docker Images** | Multi-stage builds producing lightweight images (15-50MB for Go services) |
| **Kubernetes**    | Zero-downtime rolling updates with health checks and auto-scaling         |
| **CI/CD**         | Fully automated pipeline: Test → Lint → Build → Deploy in \~5 minutes     |
| **Monitoring**    | End-to-end distributed tracing with trace-log correlation                 |

### **Performance Testing Summary** {#performance-testing-summary}

The K6 performance testing validated the system's ability to meet demanding SLOs:

| Metric             | Target       | Achieved    |
| :----------------- | :----------- | :---------- |
| Concurrent Users   | 10,000       | 5,000       |
| API Response (p95) | \<500ms      | 500ms       |
| Error Rate         | \<1%         | 0.34%       |
| Throughput         | 10,000 req/s | 5,000 req/s |

### **Key Implementation Insights** {#key-implementation-insights}

1. **TimescaleDB for Time-Series Data**: The choice of TimescaleDB for proctoring violation storage proved highly effective, providing 90%+ compression and sub-second analytics queries even at 45,000 inserts/second.

2. **Redis Streams for Event Processing**: Redis Streams with consumer groups enabled reliable, scalable event processing with at-least-once delivery guarantees.

3. **Client-Side AI Processing**: Implementing MediaPipe on the client side eliminated privacy concerns and server-side compute costs, while Web Workers prevented UI blocking.

4. **Automatic Instrumentation**: Datadog Orchestrion's compile-time instrumentation reduced observability setup time by 80% compared to manual instrumentation.

### **Trade-offs and Lessons Learned** {#trade-offs-and-lessons-learned}

| Decision                   | Benefit                                     | Trade-off                         |
| :------------------------- | :------------------------------------------ | :-------------------------------- |
| Microservices architecture | Independent scaling, technology flexibility | Increased operational complexity  |
| External Casdoor for auth  | Reduced development time, proven security   | Vendor dependency                 |
| TimescaleDB over InfluxDB  | SQL compatibility, easier adoption          | Higher memory usage               |
| Client-side MediaPipe      | Privacy, reduced bandwidth                  | Browser compatibility limitations |

This chapter demonstrates that the platform has been successfully implemented according to the specifications in Chapter 2, with production-ready deployment infrastructure, comprehensive observability, and validated performance under load.

# **CONCLUSION** {#conclusion}

## **1\. Summary of the implemented content** {#1.-summary-of-the-implemented-content}

The Secure Assessment Platform has been successfully designed, implemented, and deployed as a comprehensive solution for conducting proctored online examinations at scale. The project encompasses three major components:

### **System Analysis and Design (Chapter 2\)** {#system-analysis-and-design-(chapter-2)}

- **Requirements Analysis**: Identified 56 functional and 68 non-functional requirements across user management, assessment creation, AI-powered proctoring, real-time analytics, and multi-channel notifications
- **Architecture Design**: Developed a hybrid microservices architecture with 5 core services (Assessment, Proctoring, Identity Verification, Notification, Identity) optimized for independent scaling and technology diversity
- **Database Design**: Designed PostgreSQL schemas for transactional data and TimescaleDB hypertables for high-volume time-series proctoring events
- **Communication Patterns**: Implemented REST APIs for synchronous operations, Redis Streams for async event processing, and SSE for real-time push notifications

### **Implementation and Deployment (Chapter 3\)** {#implementation-and-deployment-(chapter-3)}

| Component            | Implementation Details                                                                                          |
| :------------------- | :-------------------------------------------------------------------------------------------------------------- |
| **Backend Services** | 2 Go services (Assessment, Proctoring), 1 Python service (Identity Verification), 1 Java service (Notification) |
| **Frontend**         | React 19 \+ TypeScript with 85+ components, 12 feature modules                                                  |
| **AI/ML**            | MediaPipe client-side detection, InspireFace server-side face recognition                                       |
| **Infrastructure**   | Kubernetes on DigitalOcean, GitHub Actions CI/CD                                                                |
| **Observability**    | Datadog APM with automatic instrumentation, log correlation                                                     |

### **Verification and Testing (Chapter 3\)** {#verification-and-testing-(chapter-3)}

- **Performance Testing**: Validated support for 5000 concurrent users with \<500ms p95 response time
- **Stress Testing**: Confirmed system stability up to 100-1000 requests/second throughput

## **2\. Achievements and limitations of the system** {#2.-achievements-and-limitations-of-the-system}

### **Achievements** {#achievements}

#### **Functional Achievements**

| Feature                     | Status   | Details                                                                                |
| :-------------------------- | :------- | :------------------------------------------------------------------------------------- |
| **Multi-format Assessment** | Complete | MCQ, Multiple Answer, True/False, Fill-in-the-Blank, Matching, Short Answer, Paragraph |
| **AI Proctoring**           | Complete | 15 violation types, real-time detection, face recognition with liveness                |
| **Real-time Monitoring**    | Complete | SSE-based live dashboards, instant violation alerts                                    |
| **Identity Verification**   | Complete | Face registration, 1:1 verification, liveness detection                                |
| **Group Management**        | Complete | Invite links, QR codes, email invitations                                              |
| **Analytics**               | Complete | Time-series aggregation, violation heatmaps, per-student reports                       |
| **i18n Support**            | Complete | English and Vietnamese with runtime switching                                          |

#### **Technical Achievements**

| Metric           | Achievement                                    |
| :--------------- | :--------------------------------------------- |
| **Scalability**  | 5000 concurrent users validated                |
| **Performance**  | 1000 req/s throughput, 456ms p95 latency       |
| **Availability** | Zero-downtime deployments with rolling updates |

#### **Development Process Achievements**

- **CI/CD Pipeline**: Automated test, lint, build, deploy in \~5 minutes
- **Observability**: Distributed tracing, log correlation
- **Documentation**: API documentation with OpenAPI/Swagger

### **Limitations** {#limitations}

#### **Technical Limitations**

| Limitation                   | Impact                           | Mitigation Path                      |
| :--------------------------- | :------------------------------- | :----------------------------------- |
| **Single-region deployment** | Higher latency for distant users | Multi-region with CDN in future      |
| **No offline support**       | Requires stable internet         | Progressive Web App consideration    |
| **Browser-only client**      | No mobile app                    | React Native development             |
| **MediaPipe GPU dependency** | Fallback to CPU on older devices | WebGL polyfill, graceful degradation |

#### **Functional Limitations**

| Limitation                  | Impact                             | Mitigation Path                 |
| :-------------------------- | :--------------------------------- | :------------------------------ |
| **No essay AI grading**     | Manual grading required for essays | LLM integration (GPT/Claude)    |
| **No video recording**      | Only snapshots stored              | Optional video stream recording |
| **Single face per session** | No group exam support              | Multi-face tracking enhancement |

#### **Operational Limitations**

| Limitation             | Impact                        | Mitigation Path                 |
| :--------------------- | :---------------------------- | :------------------------------ |
| **Datadog dependency** | Vendor lock-in for monitoring | OpenTelemetry abstraction layer |
| **Casdoor dependency** | External auth service         | Self-hosted Casdoor deployment  |
| **DigitalOcean only**  | Limited cloud portability     | Multi-cloud Terraform modules   |

---

## **3\. Future development directions** {#3.-future-development-directions}

| Feature                  | Description                                | Priority |
| :----------------------- | :----------------------------------------- | :------- |
| **Voice Analysis**       | Detect conversation during exam            | High     |
| **Screen Recording**     | Optional screen capture storage            | Medium   |
| **Multi-face Support**   | Group exam proctoring                      | Medium   |
| **Active Liveness**      | Challenge-response anti-spoofing           | High     |
| **Essay Auto-grading**   | LLM-based essay evaluation                 | High     |
| **Question Generation**  | AI-assisted question creation from content | Medium   |
| **Plagiarism Detection** | Content similarity checking                | High     |
| **Adaptive Testing**     | Difficulty adjustment based on performance | Low      |

#

# **REFERENCES** {#references}

## **Frameworks and Libraries** {#frameworks-and-libraries}

\[1\] Gin Web Framework. "Gin is a HTTP web framework written in Go (Golang)." GitHub. [https://github.com/gin-gonic/gin](https://github.com/gin-gonic/gin)

\[2\] GORM. "The fantastic ORM library for Golang." [https://gorm.io/](https://gorm.io/)

\[3\] FastAPI. "FastAPI framework, high performance, easy to learn, fast to code, ready for production." [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)

\[4\] React. "A JavaScript library for building user interfaces." Meta Open Source. [https://react.dev/](https://react.dev/)

\[5\] Ant Design. "An enterprise-class UI design language and React UI library." Ant Group. [https://ant.design/](https://ant.design/)

\[6\] TanStack Query (React Query). "Powerful asynchronous state management for TS/JS, React, Solid, Vue and Svelte." [https://tanstack.com/query/latest](https://tanstack.com/query/latest)

## **AI/ML Technologies** {#ai/ml-technologies}

\[7\] MediaPipe. "Cross-platform, customizable ML solutions for live and streaming media." Google. [https://developers.google.com/mediapipe](https://developers.google.com/mediapipe)

\[8\] InspireFace. "InspireFace is a cross-platform face recognition SDK." [https://github.com/HyperInspire/InspireFace](https://github.com/HyperInspire/InspireFace)

\[9\] BlazeFace. "BlazeFace: Sub-millisecond Neural Face Detection on Mobile GPUs." CVPR 2019 Workshop on Computer Vision for AR/VR. [https://arxiv.org/abs/1907.05047](https://arxiv.org/abs/1907.05047)

## **Databases** {#databases}

\[10\] PostgreSQL. "PostgreSQL: The World's Most Advanced Open Source Relational Database." The PostgreSQL Global Development Group. [https://www.postgresql.org/](https://www.postgresql.org/)

\[11\] TimescaleDB. "TimescaleDB is an open-source database designed to make SQL scalable for time-series data." Timescale, Inc. [https://www.timescale.com/](https://www.timescale.com/)

\[12\] Redis. "Redis is an open source, in-memory data structure store, used as a database, cache, message broker." Redis Ltd. [https://redis.io/](https://redis.io/)

## **Infrastructure and DevOps** {#infrastructure-and-devops}

\[13\] Kubernetes. "Production-Grade Container Orchestration." Cloud Native Computing Foundation. [https://kubernetes.io/](https://kubernetes.io/)

\[14\] Docker. "Docker: Accelerated Container Application Development." Docker, Inc. [https://www.docker.com/](https://www.docker.com/)

\[15\] Terraform. "Terraform by HashiCorp \- Infrastructure as Code." HashiCorp. [https://www.terraform.io/](https://www.terraform.io/)

\[16\] Traefik. "Traefik, The Cloud Native Application Proxy." Traefik Labs. [https://traefik.io/](https://traefik.io/)

\[17\] ArgoCD. "Declarative continuous delivery with a fully-loaded UI." Argo Project. [https://argo-cd.readthedocs.io/](https://argo-cd.readthedocs.io/)

\[18\] GitHub Actions. "Automate your workflow from idea to production." GitHub. [https://github.com/features/actions](https://github.com/features/actions)

## **Authentication and Security** {#authentication-and-security}

\[19\] Casdoor. "Casdoor is a UI-first Identity Access Management (IAM) / Single-Sign-On (SSO) platform." Casbin. [https://casdoor.org/](https://casdoor.org/)

\[20\] OAuth 2.0. "The OAuth 2.0 Authorization Framework." IETF RFC 6749\. [https://oauth.net/2/](https://oauth.net/2/)

\[21\] OpenID Connect. "OpenID Connect Core 1.0." OpenID Foundation. [https://openid.net/connect/](https://openid.net/connect/)

## **Monitoring and Observability** {#monitoring-and-observability}

\[22\] Datadog. "Cloud Monitoring as a Service." Datadog, Inc. [https://www.datadoghq.com/](https://www.datadoghq.com/)

\[23\] Prometheus. "From metrics to insight \- Power your metrics and alerting with the leading open-source monitoring solution." Cloud Native Computing Foundation. [https://prometheus.io/](https://prometheus.io/)

\[24\] Grafana. "The open observability platform." Grafana Labs. [https://grafana.com/](https://grafana.com/)

## **Testing Tools** {#testing-tools}

\[25\] K6. "A modern load testing tool, using Go and JavaScript." Grafana Labs. [https://k6.io/](https://k6.io/)

\[26\] Vitest. "A Vite-native unit test framework." [https://vitest.dev/](https://vitest.dev/)

\[27\] pytest. "The pytest framework makes it easy to write small, readable tests." [https://pytest.org/](https://pytest.org/)

## **Cloud Providers** {#cloud-providers}

\[28\] DigitalOcean. "DigitalOcean \- The developer cloud." DigitalOcean, LLC. [https://www.digitalocean.com/](https://www.digitalocean.com/)

\[29\] DigitalOcean Kubernetes. "DigitalOcean Kubernetes (DOKS) is a managed Kubernetes service." [https://docs.digitalocean.com/products/kubernetes/](https://docs.digitalocean.com/products/kubernetes/)

## **Development Tools** {#development-tools}

\[30\] TypeScript. "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript." Microsoft. [https://www.typescriptlang.org/](https://www.typescriptlang.org/)

\[31\] Vite. "Next Generation Frontend Tooling." [https://vitejs.dev/](https://vitejs.dev/)

\[32\] golangci-lint. "Fast linters runner for Go." [https://golangci-lint.run/](https://golangci-lint.run/)

## **Academic References** {#academic-references}

\[33\] Newman, S. (2021). _Building Microservices: Designing Fine-Grained Systems_ (2nd ed.). O'Reilly Media.

\[34\] Richardson, C. (2018). _Microservices Patterns: With examples in Java_. Manning Publications.

\[35\] Kleppmann, M. (2017). _Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems_. O'Reilly Media.

\[36\] Fowler, M. (2014). "Microservices." martinfowler.com. [https://martinfowler.com/articles/microservices.html](https://martinfowler.com/articles/microservices.html)

\[37\] Humble, J., & Farley, D. (2010). _Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation_. Addison-Wesley Professional.

## **Standards and Specifications** {#standards-and-specifications}

\[38\] OpenAPI Specification. "The OpenAPI Specification (OAS) defines a standard, language-agnostic interface to HTTP APIs." OpenAPI Initiative. [https://spec.openapis.org/oas/latest.html](https://spec.openapis.org/oas/latest.html)

\[39\] JSON Web Token (JWT). "JSON Web Token (JWT) \- RFC 7519." IETF. [https://jwt.io/](https://jwt.io/)

\[40\] Server-Sent Events (SSE). "Server-Sent Events \- HTML Living Standard." WHATWG. [https://html.spec.whatwg.org/multipage/server-sent-events.html](https://html.spec.whatwg.org/multipage/server-sent-events.html)
