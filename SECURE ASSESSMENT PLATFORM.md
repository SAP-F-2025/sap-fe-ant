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

# **INDEX** {#index}

[**ACKNOWLEDGEMENTS 1**](#acknowledgements)

[**INSTRUCTOR’S COMMENTS 2**](#instructor’s-comments)

[**REVIEWER’S COMMENTS 3**](#reviewer’s-comments)

[**INDEX 4**](#index)

[**LIST OF IMAGES 5**](#list-of-images)

[**LIST OF TABLE 6**](#list-of-table)

[**LIST OF ABBREVIATIONS 7**](#list-of-abbreviations)

[**INTRODUCTION 8**](#introduction)

[**CHAPTER 1: INTRODUCTION TO THE SYSTEM AND TECHNOLOGIES USED 10**](#chapter-1:-introduction-to-the-system-and-technologies-used)

[**1.1. System introduction 10**](#1.1.-system-introduction)

[1.2. Technology used 11](#1.2.-technology-used)

[1.3. Some specific solutions approach 14](#1.3.-some-specific-solutions-approach)

[1.4. Architectural Patterns 36](#1.4.-architectural-patterns)

[**CHAPTER 2: SYSTEM ANALYSIS AND DESIGN 41**](#chapter-2:-system-analysis-and-design)

[**2.1. Describe the actors, the terminology, and define the requirements 41**](#2.1.-describe-the-actors,-the-terminology,-and-define-the-requirements)

[2.2. Use Case Identification and Description 48](#2.2.-use-case-identification-and-description)

[2.3. System Analysis 82](#2.3.-system-analysis)

[2.4. Building class diagrams at the design phase 91](#2.4.-building-class-diagrams-at-the-design-phase)

[2.5. System sequence diagrams 94](#2.5.-system-sequence-diagrams)

[2.6. Database design 109](#2.6.-database-design)

[2.7. Microservices architecture implementation 109](#2.7.-microservices-architecture-implementation)

[2.8. System design 120](#2.9.-system-design)

[2.9. Chapter 2 conclusion 121](#2.10.-chapter-2-conclusion)

[**CHAPTER 3: APPLICATION DEPLOYMENT 122**](#chapter-3:-application-deployment)

[**3.1. Tools 122**](#3.1.-tools)

[3.2. Installation results 122](#3.2.-installation-results)

[3.3. Applying production standards to the product 122](#3.3.-applying-production-standards-to-the-product)

[3.4. Functional and non-functional testing (performance testing) 122](<#3.4.-functional-and-non-functional-testing-(performance-testing)>)

[3.5. Issues related to cheating/fraud & methods to disable monitoring 122](#heading)

[**CONCLUSION 124**](#conclusion)

[**1\. Summary of the implemented content 124**](#1.-summary-of-the-implemented-content)

[**2\. Achievements and limitations of the system 124**](#2.-achievements-and-limitations-of-the-system)

[**3\. The direction of future development 124**](#3.-the-direction-of-future-development)

[**REFERENCES 125**](#references)

# **LIST OF IMAGES** {#list-of-images}

[Hình 1\. 1\. Kiến trúc microservice 20](#heading=h.r5vu88hiixrq)

[Hình 2\. 1\. Usecase tổng quát hệ thống 35](#heading=h.720grugpm3ad)

[Hình 3\. 1\. Giao diện home của người dung(1) 73](#heading=h.rbxijz3pii4e)

# **LIST OF TABLE** {#list-of-table}

Table 2.1

#

# **LIST OF ABBREVIATIONS** {#list-of-abbreviations}

| Abbreviations |             Meanings              |
| :-----------: | :-------------------------------: |
|      API      | Application Programming Interface |
|      CSS      |       Cascading Style Sheet       |
|     HTML      |     HyperText Markup Language     |
|      IP       |         Internet Protocol         |
|     REST      |  Representational Stat Transfer   |
|      SSE      |        Server-sent events         |

# **INTRODUCTION** {#introduction}

In the current context of digital transformation in education, particularly accelerated by the global shift toward online learning, there is an increasing demand for secure and efficient online examination systems. Traditional in-person examinations face significant challenges including high supervision costs, geographical limitations, scheduling constraints, and difficulties in maintaining exam integrity in remote settings. Educational institutions, especially universities like the Posts and Telecommunications Institute of Technology (PTIT), are seeking technological solutions to conduct fair and transparent assessments while adapting to the modern digital learning environment. However, existing online examination platforms often lack comprehensive proctoring capabilities, struggle with scalability issues, and fail to provide adequate security measures to prevent academic dishonesty, creating a critical gap in the educational technology landscape.

This graduation project, titled "Building an Online Examination System and Proctoring Tool for Test-Taking Process using GoLang and React," is being developed at the Posts and Telecommunications Institute of Technology under the Faculty of Information Technology 1, supervised by Dr. Dao Ngoc Phong and led by Head of Department Dr. Nguyen Duy Phuong. The project addresses these challenges by developing a comprehensive online examination platform that integrates advanced AI-powered proctoring capabilities including facial recognition, behavioral monitoring, gaze tracking, and automated violation detection to ensure exam integrity and fairness. The system leverages modern technologies such as GoLang for high-performance backend services, React with TypeScript for responsive user interfaces, PostgreSQL for reliable data storage, and microservices architecture to support up to 10,000 concurrent users. By implementing features such as role-based access control, flexible assessment management, multiple question types, real-time analytics dashboards, and comprehensive reporting tools, this project aims to provide educational institutions with a scalable, secure, and user-friendly solution that reduces supervision costs, eliminates geographical barriers, maintains academic standards, and optimizes the entire examination process from creation to grading. The system not only serves the immediate needs of PTIT but also contributes to the broader educational technology ecosystem by offering a robust platform that can be adopted by other institutions facing similar challenges in the digital education era.

#

#

#

#

#

#

#

#

#

# **CHAPTER 1: INTRODUCTION TO THE SYSTEM AND TECHNOLOGIES USED** {#chapter-1:-introduction-to-the-system-and-technologies-used}

## **1.1. System introduction** {#1.1.-system-introduction}

### **1.1.1. Purposes and meanings of the project**

The objective of this project is to build an online examination system with integrated proctoring tools supporting core functions such as assessment management, question banks, exam taking, and real-time monitoring. The system aims to create a secure, transparent, and user-friendly platform for test-takers while helping educational institutions minimize supervision costs, ensure exam integrity, and optimize testing operations in the digital transformation environment.

The project not only builds an examination system but also applies advanced technologies such as artificial intelligence, facial recognition, behavioral monitoring, and microservices architecture, aiming to optimize testing processes, enhance user experience, and improve operational efficiency. The system also brings practical value to both test-takers and educators, such as saving time and resources, ensuring fairness through automated proctoring, personalizing assessment experiences, supporting scalability for up to 10,000 concurrent users, and enabling remote testing capabilities that eliminate geographical barriers while maintaining rigorous academic standards.

### **1.1.2. Project’s scope**

### **1.1.3. Core Problems to be solved**

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

## **1.2. Technology used** {#1.2.-technology-used}

### **1.2.1. Front-end**

The frontend application is built using modern web technologies optimized for performance, maintainability, and user experience. The following technologies form the foundation of the client-side implementation:

#### **Core Framework and Language**

**React 19** serves as the primary UI framework, providing a component-based architecture that enables efficient rendering through its virtual DOM implementation. React 19 introduces improved concurrent rendering capabilities and automatic batching of state updates, resulting in smoother user interactions during exam-taking sessions.

**TypeScript 5.9** extends JavaScript with static typing, enabling early detection of type-related errors during development. This strict typing ensures robust code quality across the codebase and improves developer productivity through enhanced IDE support and autocompletion.

**Vite (rolldown-vite)** is the build tool powering the development and production builds. Unlike traditional bundlers, Vite leverages native ES modules for instant development server startup and utilizes Rolldown (a Rust-based bundler) for optimized production builds with faster compilation times.

#### **UI Component Library and Styling**

**Ant Design 5.27** provides a comprehensive suite of enterprise-grade React components following design system principles. The library includes pre-built components for forms, tables, modals, and navigation, ensuring consistent UI/UX across the application.

A **custom theme system** is implemented through design tokens (tokens.ts), gradient definitions (gradients.ts), and a ThemeProvider component. This enables consistent branding and supports both light and dark mode themes.

**CSS Modules** are used for component-level styling, preventing style conflicts through automatic class name scoping and enabling maintainable, modular stylesheets.

#### **State Management and Data Fetching**

**TanStack React Query 5.90** handles server state management, providing automatic caching, background refetching, and optimistic updates. This eliminates the need for manual data fetching logic and ensures UI data remains synchronized with the server.

**React Context API** manages client-side global state for authentication, theme preferences, and notification settings, avoiding unnecessary complexity from external state management libraries.

**Axios 1.12** serves as the HTTP client for API communication, configured with interceptors for JWT token attachment, error handling, and request/response logging.

#### **Internationalization**

**i18next 25.7** with **react-i18next 16.3** provides comprehensive multi-language support. The system currently supports English (77KB translation file) and Vietnamese (89KB translation file). **i18next-browser-languagedetector** automatically detects the user's preferred language from browser settings.

#### **AI/ML Integration**

**MediaPipe Tasks Vision** (@mediapipe/tasks-vision) enables client-side face detection and facial landmark analysis for the proctoring system. Processing occurs entirely in the browser, ensuring student privacy by transmitting only violation metadata rather than video streams.

A **Web Worker** architecture offloads MediaPipe processing to a separate thread, preventing UI blocking during intensive ML computations. GPU acceleration via WebGL2 is used when available, with automatic fallback to CPU processing.

#### **Interactive Features**

**dnd-kit** (@dnd-kit/core, @dnd-kit/sortable) powers drag-and-drop functionality for ordering questions and matching question types during exam-taking.

**Recharts** provides interactive data visualization for analytics dashboards, displaying charts for exam statistics, violation trends, and performance metrics.

**PapaParse** handles CSV parsing for question import/export functionality, enabling teachers to bulk upload questions from spreadsheet files.

#### **Form Validation and Security**

**Zod 4.1** provides runtime schema validation for form inputs and API responses, ensuring data integrity throughout the application.

**Casdoor React SDK** integrates OAuth2 authentication, handling login flows, token management, and single sign-on (SSO) with external providers like Google.

#### **Development and Quality Tools**

**ESLint 9.39** with TypeScript plugins enforces code quality standards and catches potential issues during development.

**Prettier 3.7** ensures consistent code formatting across the codebase.

**Vitest** provides fast unit testing with React Testing Library for component testing, ensuring code reliability through automated tests.

### **1.2.2. Back-end**

### **1.2.3. Other ?**

## **1.3. Some specific solutions approach** {#1.3.-some-specific-solutions-approach}

#### **1.3.1. MediaPipe-Based Real-Time Proctoring System**

MediaPipe, developed by Google Research, is an open-source framework for building multimodal applied machine learning pipelines. In the context of our secure assessment platform, MediaPipe serves as the core technology for implementing real-time proctoring capabilities through computer vision and artificial intelligence.

##### **Technical Foundation and Architecture**

MediaPipe provides a comprehensive suite of pre-trained machine learning models optimized for real-time performance on various platforms. The framework utilizes a graph-based architecture where individual components (calculators) are connected to form processing pipelines. For our proctoring system, we leverage several key MediaPipe solutions:

- **Face Detection**: Employs the BlazeFace model, a lightweight convolutional neural network designed for mobile GPU inference, achieving sub-millisecond face detection on modern devices
- **Face Mesh**: Generates 468 3D facial landmarks in real-time, enabling precise facial geometry analysis and gaze direction estimation
- **Pose Detection**: Utilizes BlazePose for full-body pose estimation, providing additional context for student behavior analysis

##### **Integration with Assessment Platform**

The MediaPipe integration operates through a client-side processing approach, ensuring privacy compliance by processing video streams locally without transmitting raw video data to servers. The system architecture implements the following workflow:

- **Camera Stream Acquisition**: Utilizes MediaPipe's Camera Utils for optimized video capture and preprocessing
- **Real-Time Analysis**: Processes video frames through MediaPipe models to detect facial features, attention patterns, and behavioral anomalies
- **Event Generation**: Converts detection results into structured proctoring events (face not detected, multiple persons, attention deviation)
- **Violation Assessment**: Applies configurable thresholds to determine violation severity and trigger appropriate responses
- **Secure Transmission**: Sends only metadata and violation events to the backend system, maintaining student privacy

##### **Performance Optimization and Scalability**

The implementation incorporates several optimization strategies to ensure system performance under concurrent usage scenarios:

- **Model Quantization**: Utilizes TensorFlow Lite models for reduced computational overhead
- **Frame Rate Control**: Implements adaptive frame processing (10-15 FPS) to balance accuracy and resource consumption
- **Memory Management**: Employs efficient buffer management to prevent memory leaks during extended assessment sessions
- **Browser Compatibility**: Ensures cross-platform functionality across modern web browsers through WebAssembly and WebGL acceleration

##### **Privacy and Compliance Considerations**

The MediaPipe-based proctoring system adheres to strict privacy principles and regulatory compliance requirements:

- **Local Processing**: All video analysis occurs client-side, eliminating the need for video data transmission
- **Data Minimization**: Only essential violation metadata is collected and stored
- **Consent Management**: Implements explicit user consent mechanisms for camera access and monitoring
- **GDPR/FERPA Compliance**: Ensures compliance with international data protection regulations through privacy-by-design principles

This approach enables the platform to provide comprehensive exam integrity monitoring while maintaining student privacy and system performance at scale.

### **1.3.2. Real-time communication: Server-sent Events**

#### **Introduction**

Server-Sent Events (SSE) is a server push technology enabling a client to receive automatic updates from a server via an HTTP connection. It describes how servers can initiate data transmission towards clients once an initial client connection has been established. Unlike classic polling, where the client repeatedly asks for data, SSE establishes a persistent, long-lived connection, allowing the server to send data to the client whenever it becomes available.

#### **Technical Overview**

- Standard / API: SSE is a web standard defined in the HTML Living Standard (often casually referred to as “HTML5-era”) and uses the EventSource interface in the browser.
- Protocol: Operates over standard HTTP/HTTPS (typically a long-lived HTTP connection).
- Data Format: Messages are UTF-8 text using the MIME type text/event-stream, following the SSE field format (data:, id:, event:, etc.).
- Mechanism: The client opens a connection and the server keeps it open, streaming events to the client as they occur (server → client only).
- Built-in Features:
    - Automatic Reconnection: Browsers automatically attempt to reconnect if the connection is dropped.
    - Event IDs: Allows the server to send an ID with each event, so if a reconnection happens, the client can tell the server the last event it received (Last-Event-ID), preventing data loss.

##### **Comparison SSE to WebSocket**

| Feature         | Server-Sent Events (SSE)                                              | WebSockets                                                     |
| :-------------- | :-------------------------------------------------------------------- | :------------------------------------------------------------- |
| Directionality  | Unidirectional (Server to Client only).                               | Bidirectional (Full-duplex, Server \<-\> Client).              |
| Complexity      | Low. Simple HTTP implementation. No special protocol handling needed. | High. Requires a custom protocol handshake and frame handling. |
| Data Format     | Text only (UTF-8).                                                    | Binary and Text.                                               |
| Ideal Use Cases | News feeds, stock tickers, notifications, status updates.             | Chat apps, multiplayer games, collaborative editing.           |

##### **Why SSE for Notification Service?**

For a Notification Service, the primary requirement is to push information from the system to the user (e.g., "Assessment Graded", "New Assignment"). The user rarely needs to send high-frequency real-time data back on the same channel. Therefore, SSE is often the superior choice because:

- Simplicity: It leverages the existing HTTP infrastructure (Authentication, Load Balancing).
- Efficiency: It is lighter weight than maintaining full-duplex WebSocket connections for sporadic updates.
- Resilience: The built-in reconnection logic simplifies the client-side implementation significantly.

### **1.3.3. Infrastructure and DevOps**

#### **1.3.3.1. Database**

##### **1.3.3.1.1. Postgres:**

###### **_Introduction_**

PostgreSQL, often referred to as Postgres, is a powerful open-source object-relational database management system (ORDBMS) with over 35 years of active development. Originally developed at the University of California, Berkeley, in 1986 as a successor to the Ingres database, PostgreSQL has evolved into one of the most advanced and feature-rich database systems available today.

Known for its reliability, data integrity, and extensibility, PostgreSQL has become the database of choice for organizations ranging from startups to Fortune 500 companies. It supports both SQL for relational queries and JSON for non-relational workloads, making it a versatile solution for diverse application requirements.

###### **_Key Features_**

- ACID Compliance

PostgreSQL fully implements ACID properties, ensuring that database transactions are processed reliably. Atomicity guarantees that transactions are all-or-nothing operations. Consistency ensures that transactions bring the database from one valid state to another. Isolation prevents concurrent transactions from interfering with each other. Durability guarantees that committed transactions persist even in the event of system failures.

- Extensibility

One of PostgreSQL's most distinctive characteristics is its extensibility. Users can define custom data types, operators, functions, and index types. The extension system allows adding new functionality without modifying the core database code. Popular extensions include PostGIS for geospatial data, pg_trgm for fuzzy string matching, and pgcrypto for cryptographic functions.

- Advanced Data Types

PostgreSQL supports a rich set of data types beyond standard SQL types. These include arrays for storing multiple values in a single column, hstore for key-value pairs, JSON and JSONB for document storage with indexing capabilities, geometric types for points, lines, and polygons, network address types for IP addresses and MAC addresses, UUID for universally unique identifiers, and range types for representing value ranges.

- Concurrency Control

PostgreSQL implements Multi-Version Concurrency Control (MVCC), allowing multiple transactions to access the database simultaneously without locking. Readers never block writers, and writers never block readers, resulting in high performance for concurrent workloads. Each transaction sees a consistent snapshot of the database, regardless of concurrent modifications.

- Full-Text Search

Built-in full-text search capabilities enable sophisticated text searching without external tools. PostgreSQL provides text search configurations for multiple languages, ranking functions for relevance scoring, and various indexing strategies for optimal performance. This eliminates the need for separate search engines in many applications.

- Replication and High Availability

PostgreSQL offers multiple replication options for high availability and scalability. Streaming replication provides asynchronous or synchronous replication to standby servers. Logical replication enables selective replication of specific tables or data. Built-in failover mechanisms and tools like Patroni facilitate automatic failover in production environments.

###### **_Architecture_**

- Process Architecture

PostgreSQL uses a process-based architecture where each client connection spawns a dedicated backend process. The postmaster process serves as the main daemon, accepting connections and forking backend processes. Background processes handle tasks such as writing dirty buffers to disk, checkpointing, autovacuum operations, and WAL archiving.

- Memory Architecture

Shared memory buffers cache frequently accessed data pages, reducing disk I/O. The shared buffer pool is configurable and typically sized to 25% of available RAM for dedicated database servers. Each backend process also has private memory for query processing, sorting, and hash operations.

- Storage Architecture

PostgreSQL organizes data into tablespaces, databases, schemas, and tables. Each table is stored as a collection of 8KB pages on disk. Large objects and TOAST (The Oversized-Attribute Storage Technique) handle values exceeding page size by compressing and storing them separately.

- Write-Ahead Logging

The Write-Ahead Log (WAL) ensures durability and enables point-in-time recovery. Before modifying data files, PostgreSQL writes changes to the WAL. This sequential write pattern improves performance and provides a foundation for replication and backup strategies.

###### **_Indexing Strategies_**

- B-tree Indexes

B-tree is the default index type, suitable for equality and range queries on sortable data. B-tree indexes support all comparison operators and efficiently handle ORDER BY clauses. They are the most versatile and commonly used index type in PostgreSQL.

- Hash Indexes

Hash indexes provide fast equality lookups but do not support range queries. Since PostgreSQL 10, hash indexes are fully WAL-logged and crash-safe, making them viable for specific use cases where only equality comparisons are needed.

- GiST Indexes

Generalized Search Tree (GiST) indexes support complex data types and queries. They enable indexing of geometric data, full-text search, and range types. GiST provides a framework for implementing custom index strategies for specialized data types.

- GIN Indexes

Generalized Inverted Indexes (GIN) excel at indexing composite values where multiple keys map to the same row. Common use cases include full-text search, JSONB documents, and array columns. GIN indexes provide fast lookups at the cost of slower updates.

- BRIN Indexes

Block Range Indexes (BRIN) store summary information about ranges of physical table blocks. They are extremely compact and efficient for large tables where values correlate with physical storage order, such as timestamp columns in time-series data.

###### **_Query Processing_**

- Query Planning

The query planner analyzes SQL statements and generates execution plans. It considers available indexes, table statistics, and cost estimates to choose optimal strategies. The planner uses dynamic programming to evaluate join orders and access methods for complex queries.

- Parallel Query Execution

PostgreSQL supports parallel query execution for large sequential scans, hash joins, and aggregations. The planner automatically parallelizes queries when beneficial, distributing work across multiple CPU cores. Parallel queries significantly improve performance for analytical workloads on large datasets.

- Query Optimization Techniques

Common optimization techniques include using appropriate indexes for frequently queried columns, analyzing tables to update statistics for the query planner, using EXPLAIN ANALYZE to understand query execution, optimizing join orders and methods, and partitioning large tables for improved query performance and maintenance.

- Partitioning

PostgreSQL supports declarative partitioning for managing large tables by dividing them into smaller, more manageable pieces. Range partitioning divides data based on value ranges, commonly used for time-series data. List partitioning assigns rows to partitions based on discrete key values. Hash partitioning distributes rows evenly across partitions using a hash function.

Partitioning improves query performance by enabling partition pruning, simplifies data management through partition-level operations, and facilitates archiving historical data by detaching or dropping old partitions.

###### **_Comparison with Alternatives_**

- PostgreSQL vs. MySQL

PostgreSQL offers more advanced features including better JSON support, more sophisticated query planning, stronger ACID compliance, and richer data types. MySQL traditionally provides simpler administration and faster read performance for simple queries. PostgreSQL excels in complex analytical workloads and applications requiring advanced database features.

- PostgreSQL vs. Oracle

PostgreSQL provides comparable functionality to Oracle for most use cases at no licensing cost. Oracle offers certain enterprise features and commercial support that some organizations require. PostgreSQL's open-source nature and extensibility make it attractive for organizations seeking to reduce vendor lock-in.

- PostgreSQL vs. NoSQL Databases

PostgreSQL's JSONB support enables document storage patterns traditionally associated with MongoDB. While purpose-built NoSQL databases may offer better performance for specific use cases, PostgreSQL provides the flexibility to handle both relational and document workloads within a single system.

##### **1.3.3.1.2. Timescale-DB:**

###### **_Introduction_**

TimescaleDB is an open-source time-series database built as an extension on top of PostgreSQL. Developed by Timescale, Inc. and first released in 2017, TimescaleDB combines the reliability and ecosystem of PostgreSQL with specialized optimizations for time-series data. This unique approach enables developers to use familiar SQL while achieving the performance characteristics required for time-series workloads.

Unlike purpose-built time-series databases that require learning new query languages and paradigms, TimescaleDB looks and feels exactly like PostgreSQL. Applications can leverage existing PostgreSQL drivers, tools, and expertise while gaining automatic partitioning, time-series optimizations, and powerful analytical functions designed specifically for temporal data.

###### **_Understanding Time-Series Data_**

Time-series data consists of measurements or events tracked over time, characterized by a timestamp and one or more associated values. Common sources include IoT sensors generating metrics like temperature, pressure, and humidity at regular intervals, application monitoring systems collecting performance metrics and logs, financial systems tracking stock prices, transactions, and market data, infrastructure monitoring capturing CPU, memory, and network utilization, and user analytics recording events, sessions, and behavioral data.

Time-series workloads exhibit distinct patterns. Data arrives primarily through inserts with rare updates to historical records. Queries typically focus on recent data with time-based filtering. Aggregations across time intervals are common analytical operations. Data volume grows continuously, requiring efficient storage and lifecycle management.

###### **_Core Concepts_**

- Hypertable

The hypertable is TimescaleDB's primary abstraction for time-series data. A hypertable appears as a single table but is automatically partitioned into chunks based on time intervals. This transparent partitioning enables efficient data management while maintaining the familiar PostgreSQL table interface.

Creating a hypertable involves creating a standard PostgreSQL table and then converting it using the create_hypertable function. TimescaleDB handles all partitioning logic automatically, creating new chunks as data arrives and optimizing queries to access only relevant partitions.

- Chunks

Chunks are the physical partitions that compose a hypertable. Each chunk covers a specific time range and is stored as a separate PostgreSQL table. This chunking strategy provides several benefits including improved query performance through chunk exclusion, efficient data lifecycle management by dropping or compressing entire chunks, parallel query execution across multiple chunks, and optimized insert performance by writing to recent chunks.

The chunk time interval is configurable based on data characteristics and query patterns. Smaller chunks improve query performance for narrow time ranges but increase metadata overhead. Larger chunks reduce overhead but may include unnecessary data in query scans.

- Continuous Aggregates

Continuous aggregates automatically maintain materialized views that incrementally update as new data arrives. Unlike standard PostgreSQL materialized views that require full refresh, continuous aggregates efficiently process only new data, making them practical for large datasets.

Continuous aggregates are ideal for dashboards and reports requiring pre-computed metrics. Common use cases include hourly, daily, or monthly rollups of raw measurements, real-time aggregations for monitoring dashboards, and historical trend analysis without scanning raw data.

- Compression

TimescaleDB provides native compression that dramatically reduces storage requirements for time-series data. Compression operates at the chunk level, converting row-oriented storage to a columnar format optimized for time-series queries. Compression ratios of 90-95% are common for typical time-series workloads.

Compressed chunks remain queryable through standard SQL, with TimescaleDB transparently decompressing data as needed. Compression policies automate the process, compressing chunks older than a specified age without manual intervention.

- Data Retention Policies

Automated data retention policies manage the lifecycle of time-series data. Policies can drop old chunks after a specified retention period, automatically removing data beyond the defined window. This prevents unbounded data growth and simplifies compliance with data retention requirements.

Policies execute in the background through TimescaleDB's job scheduler, requiring no application changes or manual maintenance. Combining retention policies with compression and continuous aggregates enables efficient storage strategies where raw data is compressed after initial collection and eventually dropped while aggregated summaries are retained indefinitely.

###### **_Architecture_**

- Extension Architecture

TimescaleDB implements its functionality as a PostgreSQL extension rather than a fork. This approach ensures full compatibility with PostgreSQL features, extensions, and tools. Upgrades to PostgreSQL versions are straightforward, and the entire PostgreSQL ecosystem remains available.

The extension intercepts queries targeting hypertables and optimizes execution based on time-series characteristics. Query planning incorporates chunk exclusion, parallel execution, and specialized algorithms for time-series operations.

- Distributed Architecture

TimescaleDB supports distributed hypertables that span multiple database instances, enabling horizontal scalability for large-scale deployments. A distributed hypertable consists of an access node that receives queries and data nodes that store chunks.

Data distribution uses consistent hashing based on a partition key combined with time-based chunking. Queries are automatically distributed to relevant data nodes, with results aggregated at the access node. This architecture scales write throughput and storage capacity across a cluster.

- Multi-Node Deployment

Multi-node TimescaleDB deployments require careful planning for data distribution, query routing, and high availability. The access node coordinates distributed operations but represents a potential single point of failure. Data node replicas and automated failover mechanisms address availability requirements for production deployments.

###### **_Performance Optimizations_**

- Chunk Exclusion

TimescaleDB's query planner automatically excludes chunks that cannot contain relevant data based on query predicates. Queries with time range filters scan only chunks within the specified period, dramatically reducing I/O for queries on large datasets. This optimization is transparent and requires no query modifications.

- Parallel Query Execution

Queries across multiple chunks execute in parallel, leveraging multiple CPU cores for improved performance. TimescaleDB extends PostgreSQL's parallel query capabilities with awareness of chunk boundaries and time-series characteristics.

- Columnar Compression

Compressed chunks use columnar storage that provides excellent performance for analytical queries accessing specific columns. Compression algorithms exploit the temporal ordering and value patterns common in time-series data, achieving high compression ratios while maintaining query performance.

- Skip Scan

The skip scan optimization improves performance for queries with DISTINCT or GROUP BY on high-cardinality time-series data. Rather than scanning all rows, skip scan leverages index ordering to jump between distinct values, significantly reducing the rows examined.

- Merge Append Optimization

Queries requiring sorted results across multiple chunks benefit from merge append optimization. Rather than sorting the entire result set, TimescaleDB merges pre-sorted chunk results, reducing memory usage and improving performance for ORDER BY queries.

###### **_Analytical Functions_**

- Time Bucket Functions

The time_bucket function groups timestamps into fixed intervals for aggregation. This function is essential for time-series analysis, enabling queries like hourly averages, daily maximums, or weekly counts. Unlike PostgreSQL's date_trunc, time_bucket supports arbitrary interval sizes and handles edge cases common in time-series analysis.

- Gap Filling

Time-series data often contains gaps due to missing measurements or irregular collection intervals. The time_bucket_gapfill function generates rows for missing time intervals, enabling visualization and analysis that requires continuous time series. Interpolation functions like locf (last observation carried forward) and interpolate provide values for filled gaps.

- Statistical Aggregates

TimescaleDB includes specialized statistical functions for time-series analysis. Percentile approximations using t-digest or uddsketch algorithms provide memory-efficient percentile calculations. Two-step aggregation enables accurate distributed statistics across multiple nodes. Correlation and regression functions support trend analysis and anomaly detection.

- Hyperfunctions

Hyperfunctions are a collection of SQL functions designed for time-series analysis. They include functions for calculating deltas and rates of change, analyzing value distributions with percentile approximations, performing counter resets detection for monotonic counters, computing candlestick aggregations for financial data, and handling state transitions and duration calculations.

###### **_Data Management_**

- Automated Policies

TimescaleDB's job scheduler executes automated policies for data management. Compression policies convert old chunks to columnar format based on age thresholds. Retention policies drop chunks beyond the configured retention period. Continuous aggregate refresh policies keep materialized views current with new data. Reorder policies optimize chunk storage for query patterns.

- Data Tiering

TimescaleDB Cloud offers tiered storage that automatically moves older data to cost-effective object storage while maintaining query access. Hot data resides on fast local storage for low-latency queries. Warm and cold data moves to object storage tiers, reducing costs while remaining accessible through standard SQL queries.

- Backup and Recovery

Standard PostgreSQL backup tools work with TimescaleDB, including pg_dump for logical backups and pg_basebackup for physical backups. Point-in-time recovery using WAL archiving enables recovery to any moment within the retention period. For distributed deployments, coordinated backup procedures ensure consistency across nodes.

###### **_Integration Patterns_**

- Ingestion Pipelines

High-volume time-series ingestion requires careful consideration of throughput and latency requirements. Batch inserts using COPY or multi-row INSERT statements provide higher throughput than individual inserts. Client-side buffering and parallel writers maximize ingestion performance. For extreme volumes, message queues like Kafka decouple producers from database writers.

- Visualization and Dashboards

TimescaleDB integrates seamlessly with visualization tools that support PostgreSQL. Grafana provides native TimescaleDB support with specialized query builders for time-series visualization. Tableau, Power BI, and other business intelligence tools connect through standard PostgreSQL drivers. Continuous aggregates enable responsive dashboards on large datasets.

- Application Integration

Applications access TimescaleDB through any PostgreSQL client library. Connection poolers like PgBouncer manage connections for high-concurrency applications. ORMs and query builders that support PostgreSQL work without modification, though raw SQL often provides better performance for time-series queries.

###### **_Comparison with Alternatives_**

- TimescaleDB vs. InfluxDB

InfluxDB is a purpose-built time-series database with its own query language (Flux or InfluxQL). TimescaleDB offers full SQL compatibility and leverages the PostgreSQL ecosystem. InfluxDB may provide better write performance for simple use cases, while TimescaleDB excels in complex queries, joins with relational data, and scenarios requiring PostgreSQL features.

- TimescaleDB vs. Native PostgreSQL

PostgreSQL can handle time-series data using manual partitioning, but TimescaleDB significantly reduces operational complexity. Automatic chunking, compression, and continuous aggregates eliminate manual partition management. Time-series specific optimizations provide better query performance than manual implementations.

#### **1.3.3.2. Message Broker: Redis Stream**

##### **Introduction**

Redis Streams is a data structure introduced in Redis 5.0 that models a log-like append-only data structure. It combines the simplicity of Redis with powerful messaging capabilities, making it an excellent choice for building event-driven architectures, message queues, and real-time data processing pipelines.

Unlike traditional pub/sub systems, Redis Streams provides persistence, consumer groups, and message acknowledgment, addressing many limitations of simpler messaging patterns.

##### **Core Concepts**

###### **_Stream Entries_**

A stream is essentially an ordered collection of entries, where each entry consists of one or more field-value pairs. Every entry is assigned a unique identifier that reflects the time it was added to the stream.

###### **_Entry IDs_**

Each entry in a stream has a unique ID in the format `<millisecondsTime>-<sequenceNumber>`. For example, `1609459200000-0` represents the first entry added at that specific millisecond timestamp. Redis can auto-generate these IDs, or you can specify custom IDs as long as they maintain chronological order.

###### **_Consumer Groups_**

Consumer groups enable multiple consumers to cooperatively process messages from a stream. This mechanism provides load balancing across consumers, message acknowledgment tracking, and the ability to recover from failures without losing messages.

###### **_Key Features_**

Redis Streams offers several advantages that distinguish it from other messaging solutions:

**Persistence and Durability**: Unlike Redis Pub/Sub, messages in streams are persisted. Consumers can read historical data, and messages are not lost if no consumer is currently connected.

**Consumer Groups**: Multiple consumers can work together to process messages, with Redis tracking which messages have been delivered and acknowledged. This enables horizontal scaling of message processing.  
**Message Acknowledgment**: Consumers explicitly acknowledge processed messages. Unacknowledged messages can be claimed by other consumers after a timeout, ensuring no message is lost due to consumer failures.  
**Range Queries**: Streams support efficient range queries by ID or timestamp, allowing consumers to read specific portions of the stream history.  
**Blocking Reads**: Consumers can perform blocking reads to wait for new messages, reducing polling overhead and latency.  
**Capped Streams**: Streams can be configured with a maximum length, automatically removing older entries when the limit is reached.

###### **_Common Use Cases_**

**Event Sourcing**: Redis Streams naturally fits event sourcing patterns where all changes to application state are stored as a sequence of events. The append-only nature and efficient range queries make it ideal for this purpose.  
**Real-time Analytics**: Processing streams of events for real-time dashboards, metrics aggregation, and monitoring systems. The blocking read capability enables low-latency processing.  
**Message Queues**: Building reliable message queues with acknowledgment semantics and failure recovery. Consumer groups enable distributing work across multiple workers.  
**Activity Feeds**: Implementing social media feeds, notification systems, or audit logs where chronological ordering and historical access are important.  
**IoT Data Ingestion**: Collecting and processing high-volume sensor data where the append-only model and automatic ID generation simplify data management.

##### **Comparison with Alternatives**

###### **_Redis Streams vs. Redis Pub/Sub_**

Redis Pub/Sub is fire-and-forget: messages are lost if no subscriber is listening. Streams persist messages and support historical reads. Consumer groups in Streams provide acknowledgment and failure recovery, which Pub/Sub lacks entirely.

###### **_Redis Streams vs. Kafka_**

Apache Kafka offers stronger durability guarantees, higher throughput for very large-scale deployments, and a more mature ecosystem for stream processing. However, Redis Streams is simpler to operate, has lower latency for smaller-scale use cases, and integrates naturally if you already use Redis.

###### **_Redis Streams vs. RabbitMQ_**

RabbitMQ provides richer routing capabilities and messaging patterns. Redis Streams offers simpler operations, the convenience of using your existing Redis infrastructure, and efficient storage of time-series-like data.

### **1.3.3.3 Container Orchestration: Kubernetes**

##### **Introduction**

Kubernetes, often abbreviated as K8s, is an open-source container orchestration platform originally developed by Google and now maintained by the Cloud Native Computing Foundation (CNCF). Released in 2014, Kubernetes has become the de facto standard for deploying, scaling, and managing containerized applications in production environments.

The name Kubernetes originates from Greek, meaning "helmsman" or "pilot," reflecting its role in steering containerized workloads. The abbreviation K8s represents the eight letters between "K" and "s" in the full name. Kubernetes builds upon fifteen years of experience running production workloads at Google, combined with best practices and ideas from the open-source community.

###### **_Why Kubernetes?_**

Modern applications are increasingly built as collections of microservices packaged in containers. While containers provide consistency and portability, managing hundreds or thousands of containers across multiple servers presents significant operational challenges. Kubernetes addresses these challenges by providing automated deployment and rollback capabilities, service discovery and load balancing, self-healing mechanisms for failed containers, horizontal scaling based on demand, storage orchestration for stateful applications, and configuration and secret management.

Without an orchestration platform, teams would need to manually handle container placement, networking, scaling, and recovery from failures, which becomes impractical at scale.

###### **_Architecture Overview_**

Kubernetes follows a master-worker architecture, consisting of a control plane that manages the cluster and worker nodes that run application workloads.

###### **_Control Plane Components_**

The API Server serves as the central management entity and the front end for the Kubernetes control plane. All communication between components and external users passes through the API Server, which exposes the Kubernetes API and processes RESTful requests to modify cluster state.

etcd is a distributed, consistent key-value store that serves as Kubernetes' backing store for all cluster data. It maintains the configuration data and state of the cluster, ensuring consistency across all control plane components.

The Scheduler watches for newly created pods without assigned nodes and selects appropriate nodes for them to run on. Scheduling decisions consider factors such as resource requirements, hardware constraints, affinity specifications, and data locality.

The Controller Manager runs controller processes that regulate cluster state. Controllers include the Node Controller for monitoring node health, the Replication Controller for maintaining correct pod counts, the Endpoints Controller for populating endpoint objects, and the Service Account Controller for creating default accounts and tokens.

The Cloud Controller Manager integrates with underlying cloud provider APIs, enabling Kubernetes to interact with cloud-specific resources such as load balancers, storage volumes, and networking components.

###### **_Worker Node Components_**

The Kubelet is an agent that runs on each worker node, ensuring that containers are running in pods as expected. It communicates with the control plane, receives pod specifications, and manages container lifecycle on its node.

Kube-proxy maintains network rules on nodes, enabling network communication to pods from inside and outside the cluster. It implements the Kubernetes Service concept by managing iptables rules or IPVS configurations.

The Container Runtime is the software responsible for running containers. Kubernetes supports various container runtimes including containerd, CRI-O, and any implementation of the Kubernetes Container Runtime Interface (CRI).

##### **Core Concepts and Objects**

###### **_Pods_**

A Pod is the smallest deployable unit in Kubernetes, representing a single instance of a running process in the cluster. A pod encapsulates one or more containers that share storage, network, and a specification for how to run. Containers within a pod communicate via localhost and share the same IP address and port space.

While pods can contain multiple containers, the most common pattern is a single container per pod. Multi-container pods are used for tightly coupled processes that need to share resources, such as sidecar patterns for logging, proxying, or data synchronization.

###### **_Deployments_**

Deployments provide declarative updates for pods and ReplicaSets. You describe the desired state in a Deployment specification, and the Deployment Controller changes the actual state to match. Deployments manage rolling updates and rollbacks, ensuring zero-downtime deployments by gradually replacing old pods with new ones.

A typical Deployment specification defines the number of replicas, the container image to use, resource limits, and update strategy parameters such as maximum unavailable pods during updates.

###### **_Services_**

Services provide stable networking for pods, which have ephemeral IP addresses that change when pods are recreated. A Service defines a logical set of pods and a policy for accessing them, typically identified by a label selector.

Kubernetes supports several Service types. ClusterIP exposes the service on an internal IP within the cluster, making it reachable only from within. NodePort exposes the service on each node's IP at a static port, accessible from outside the cluster. LoadBalancer provisions an external load balancer in supported cloud environments. ExternalName maps the service to a DNS name, useful for accessing external services.

###### **_ConfigMaps and Secrets_**

ConfigMaps store non-confidential configuration data as key-value pairs, allowing you to decouple configuration from container images. Applications can consume ConfigMaps as environment variables, command-line arguments, or configuration files mounted in volumes.

Secrets function similarly to ConfigMaps but are intended for sensitive data such as passwords, tokens, and certificates. Kubernetes stores secrets encoded in base64 and provides mechanisms for encryption at rest. Pods reference secrets to access sensitive configuration without embedding credentials in application code.

###### **_Namespaces_**

Namespaces provide a mechanism for isolating groups of resources within a single cluster. They enable multiple teams or projects to share a cluster while maintaining logical separation. Resource quotas and access controls can be applied at the namespace level, making them useful for multi-tenant environments.

###### **_Persistent Volumes_**

Persistent Volumes (PV) and Persistent Volume Claims (PVC) provide an abstraction for storage in Kubernetes. A PV represents a piece of storage provisioned by an administrator or dynamically provisioned using Storage Classes. A PVC is a request for storage by a user, specifying size and access modes. Kubernetes binds PVCs to appropriate PVs, allowing pods to use persistent storage that survives pod restarts and rescheduling.

###### **_Ingress_**

Ingress manages external access to services within a cluster, typically HTTP and HTTPS traffic. An Ingress resource defines rules for routing external requests to internal services based on hostnames and paths. Ingress Controllers implement these rules, commonly using reverse proxies like NGINX, Traefik, or cloud provider load balancers.

###### **_Networking in Kubernetes_**

Kubernetes implements a flat network model where every pod receives its own IP address and can communicate with any other pod in the cluster without NAT. This simplifies application design by eliminating the need for port mapping and enabling containers to behave as if they were on the same network.

The Container Network Interface (CNI) specification defines how network plugins integrate with Kubernetes. Popular CNI plugins include Calico for network policy enforcement, Flannel for simple overlay networking, Cilium for eBPF-based networking with advanced security features, and Weave Net for encrypted mesh networking.

Network Policies define how pods communicate with each other and with external endpoints. By default, all pods can communicate freely, but Network Policies enable fine-grained control over ingress and egress traffic based on labels, namespaces, and IP blocks.

###### **_Scaling and Autoscaling_**

Kubernetes provides multiple mechanisms for scaling applications to meet demand.

Manual scaling involves adjusting the replica count in a Deployment or StatefulSet specification, either through kubectl commands or by modifying the manifest. Kubernetes then creates or terminates pods to match the desired count.

The Horizontal Pod Autoscaler (HPA) automatically scales the number of pod replicas based on observed metrics such as CPU utilization, memory usage, or custom application metrics. HPA continuously monitors metrics and adjusts replica counts within configured minimum and maximum bounds.

The Vertical Pod Autoscaler (VPA) automatically adjusts CPU and memory requests and limits for containers based on historical usage. Unlike HPA, which adds more pods, VPA right-sizes existing pods to optimize resource utilization.

The Cluster Autoscaler automatically adjusts the number of nodes in a cluster based on pending pods that cannot be scheduled due to insufficient resources. It integrates with cloud providers to provision and deprovision nodes dynamically.

###### **_Storage Management_**

Kubernetes provides a robust storage framework supporting various storage backends and use cases.

Storage Classes define different classes of storage with specific performance characteristics, provisioners, and parameters. Administrators create Storage Classes to offer storage tiers such as SSD-backed high-performance storage or cost-effective standard storage. When users create PVCs referencing a Storage Class, Kubernetes dynamically provisions the appropriate storage.

StatefulSets manage stateful applications requiring stable network identities and persistent storage. Unlike Deployments, StatefulSets maintain a sticky identity for each pod, ensuring that pods are created and deleted in a predictable order and that persistent volumes remain associated with specific pod instances.

###### **_Security Concepts_**

Role-Based Access Control (RBAC) regulates access to Kubernetes resources based on the roles of individual users or service accounts. Roles define permissions within a namespace, while ClusterRoles define cluster-wide permissions. RoleBindings and ClusterRoleBindings associate roles with subjects such as users, groups, or service accounts.

Pod Security Standards define security policies for pods, replacing the deprecated Pod Security Policies. These standards define three profiles: Privileged allows unrestricted access, Baseline prevents known privilege escalations, and Restricted enforces security best practices for sensitive workloads.

Service Accounts provide identities for processes running in pods. Applications use service accounts to authenticate with the Kubernetes API or external services. Each namespace has a default service account, and custom service accounts can be created with specific permissions.

###### **_Observability_**

Effective Kubernetes operations require comprehensive observability across logging, monitoring, and tracing.

For logging, Kubernetes captures standard output and error streams from containers. Aggregation solutions like the EFK stack comprising Elasticsearch, Fluentd, and Kibana or Loki with Grafana collect and visualize logs from across the cluster.

Monitoring typically involves Prometheus for metrics collection and alerting, often paired with Grafana for visualization. Kubernetes exposes metrics through the Metrics Server, and applications can expose custom metrics for consumption by monitoring systems and autoscalers.

Distributed tracing with tools like Jaeger or Zipkin helps track requests across microservices, identifying latency bottlenecks and understanding service dependencies.

###### **_Deployment Strategies_**

Kubernetes supports various deployment strategies for updating applications with minimal disruption.

Rolling Updates gradually replace old pods with new ones, ensuring that a minimum number of pods remain available throughout the process. This is the default strategy for Deployments and provides zero-downtime updates for most applications.

Blue-Green Deployments maintain two identical environments, with traffic switched between them during releases. This approach enables instant rollback by reverting traffic to the previous environment.

Canary Deployments gradually route a percentage of traffic to new versions, allowing validation before full rollout. Service meshes like Istio or Linkerd provide sophisticated traffic management for implementing canary releases.

###### **_Ecosystem and Tools_**

The Kubernetes ecosystem includes numerous tools that extend its capabilities.

Helm is the package manager for Kubernetes, providing templating and release management for complex applications. Helm charts package Kubernetes manifests with configurable values, simplifying deployment and upgrades.

kubectl is the command-line interface for interacting with Kubernetes clusters. It provides commands for deploying applications, inspecting resources, viewing logs, and executing commands in containers.

Kustomize enables customization of Kubernetes manifests without templates, using overlays and patches to modify base configurations for different environments.

Operators extend Kubernetes to manage complex stateful applications like databases and message queues. Operators encode operational knowledge into software, automating tasks that would otherwise require manual intervention.

### 1.3.3.4. CI/CD Pipeline: Github Action

##### **Introduction**

GitHub Actions is a powerful automation platform built directly into GitHub that enables developers to automate software workflows, including Continuous Integration and Continuous Deployment (CI/CD). Launched in 2019, it has rapidly become one of the most popular CI/CD solutions due to its seamless integration with GitHub repositories and its flexible, event-driven architecture.

By defining workflows as code within your repository, GitHub Actions allows teams to build, test, and deploy applications automatically whenever specific events occur, such as code pushes, pull requests, or scheduled triggers.

##### **Understanding CI/CD**

###### **_Continuous Integration (CI)_**

Continuous Integration is the practice of frequently merging code changes into a shared repository, where automated builds and tests verify each integration. This approach catches bugs early, reduces integration problems, and enables teams to develop software more rapidly with higher quality.

###### **_Continuous Deployment/Delivery (CD)_**

Continuous Delivery ensures that code is always in a deployable state by automating the release process up to the production environment. Continuous Deployment takes this further by automatically deploying every change that passes all tests to production without manual intervention.

##### **Core Concepts of GitHub Actions**

###### **_Workflows_**

A workflow is an automated process defined in a YAML file stored in the .github/workflows directory of your repository. Each workflow consists of one or more jobs and is triggered by specific events. You can have multiple workflows in a single repository, each serving different purposes such as testing, building, or deploying.

###### **_Events_**

Events are specific activities that trigger a workflow. Common events include pushing code to a branch, opening or merging a pull request, creating a release, or following a scheduled cron expression. GitHub supports a wide variety of events, allowing workflows to respond to virtually any activity in your repository.

###### **_Jobs_**

Jobs are sets of steps that execute on the same runner. By default, jobs in a workflow run in parallel, but you can configure dependencies between jobs to run them sequentially. Each job runs in a fresh virtual environment, ensuring isolation and reproducibility.

###### **_Steps_**

Steps are individual tasks within a job. A step can run commands directly using shell scripts or execute pre-built actions. Steps within a job execute sequentially and share the same filesystem, allowing them to pass data between each other.

###### **_Actions_**

Actions are reusable units of code that perform specific tasks. You can use actions created by GitHub, the community, or build your own custom actions. The GitHub Marketplace hosts thousands of actions for common tasks like checking out code, setting up programming languages, deploying to cloud providers, and sending notifications.

###### **_Runners_**

Runners are servers that execute your workflows. GitHub provides hosted runners with Linux, Windows, and macOS environments, pre-configured with common tools and languages. For specialized requirements or enhanced security, you can also configure self-hosted runners on your own infrastructure.

##### **Key Features**

###### **_Matrix Builds_**

Matrix builds allow you to run the same job across multiple configurations simultaneously. This is particularly useful for testing applications across different operating systems, language versions, or environment variables:

###### **_Secrets Management_**

GitHub Actions provides secure storage for sensitive information such as API keys, credentials, and tokens. Secrets are encrypted and only exposed to workflows at runtime. You can define secrets at the repository, environment, or organization level:

###### **_Environments and Deployment Protection_**

Environments allow you to configure deployment targets with specific protection rules. You can require manual approvals, restrict which branches can deploy, and define environment-specific secrets. This ensures proper governance over production deployments.

###### **_Caching and Artifacts_**

Caching dependencies between workflow runs significantly speeds up execution time. GitHub Actions supports caching for package managers like npm, pip, Maven, and Gradle. Artifacts allow you to persist data from workflow runs, such as build outputs, test results, or logs, for later retrieval or use in subsequent jobs.

###### **_Reusable Workflows_**

Reusable workflows enable you to define a workflow once and call it from other workflows. This promotes consistency across repositories and reduces duplication. Organizations can maintain centralized workflow templates that individual repositories reference.

###### **_Concurrency Control_**

Concurrency settings prevent multiple instances of the same workflow from running simultaneously. This is particularly important for deployment workflows where running concurrent deployments could cause conflicts or inconsistencies.

##### **Common Use Cases**

###### **_Automated Testing_**

Running unit tests, integration tests, and end-to-end tests automatically on every pull request ensures code quality and prevents regressions. Test results can be reported as checks on pull requests, providing immediate feedback to developers.

###### **_Code Quality and Security_**

Integrating linters, static analysis tools, and security scanners into your workflow catches potential issues before they reach production. Tools like ESLint, SonarQube, and Dependabot can be incorporated to maintain code standards and identify vulnerabilities.

###### **_Build and Package_**

Compiling applications, building Docker images, and creating release packages can be fully automated. Built artifacts can be published to package registries, container registries, or artifact storage for distribution.

###### **_Deployment Automation_**

Deploying applications to various platforms including cloud providers, Kubernetes clusters, serverless functions, and static site hosts. GitHub Actions integrates with AWS, Azure, Google Cloud, Vercel, Netlify, and many other platforms through official and community actions.

###### **_Scheduled Tasks_**

Running periodic jobs such as database backups, report generation, dependency updates, or cleanup tasks. Cron expressions define the schedule, and workflows execute automatically at the specified times.

##### **Comparison with Alternatives**

###### **_GitHub Actions vs. Jenkins_**

Jenkins offers greater flexibility and an extensive plugin ecosystem but requires self-hosting and maintenance. GitHub Actions provides a managed service with native GitHub integration, simpler configuration, and generous free tier for public repositories.

###### **_GitHub Actions vs. GitLab CI/CD_**

Both platforms offer similar capabilities with tight integration into their respective ecosystems. GitLab CI/CD is preferred when using GitLab for source control, while GitHub Actions is the natural choice for GitHub-hosted repositories.

###### **_GitHub Actions vs. CircleCI_**

CircleCI provides powerful caching, parallelism features, and a robust cloud infrastructure. GitHub Actions offers tighter GitHub integration and avoids the need for an additional external service in your development workflow.

## **1.4. Architectural Patterns** {#1.4.-architectural-patterns}

### **1.4.1. Some popular software architectures**

#### **a) Kiến trúc nguyên khối (Monolithic Architecture)** **Kiến trúc nguyên khối là mô hình phần mềm truyền thống, trong đó toàn bộ ứng dụng được xây dựng dưới dạng một khối duy nhất, chứa tất cả các thành phần và chức năng.**

- Đặc điểm:
    - Mọi thành phần (frontend, backend, database) đều được tích hợp chặt chẽ với nhau.
    - Việc triển khai (deployment) chỉ yêu cầu một bản build duy nhất.
    - Quản lý đơn giản, dễ phát triển ở giai đoạn ban đầu.
- Ưu điểm:
    - Dễ triển khai, dễ dàng trong việc kiểm tra và gỡ lỗi.
    - Hiệu suất cao do không có chi phí giao tiếp giữa các dịch vụ.
    - Tích hợp nhanh khi làm việc với các nhóm nhỏ.
- Nhược điểm:
    - Khó bảo trì và mở rộng khi ứng dụng lớn dần.
    - Nếu một phần của hệ thống bị lỗi, toàn bộ ứng dụng có thể ngừng hoạt động.
    - Khó áp dụng các công nghệ mới vào một phần nhỏ của hệ thống.

#### **b) Kiến trúc hướng dịch vụ (Service-Oriented Architecture \- SOA)**

- SOA (Service-Oriented Architecture) là **một phong cách kiến trúc phần mềm** trong đó các chức năng của hệ thống được **đóng gói thành các dịch vụ độc lập (independent services)**.

- Mỗi dịch vụ đảm nhiệm một nghiệp vụ cụ thể và có thể **giao tiếp, phối hợp với nhau thông qua các giao thức truyền thông chuẩn** (như HTTP, AMQP, SOAP hoặc REST), nhằm **xây dựng nên các ứng dụng phức tạp từ các thành phần tái sử dụng**.

* Đặc điểm:
    - **Tính độc lập (Loose Coupling):** Các dịch vụ được phát triển, triển khai và mở rộng một cách độc lập, không phụ thuộc trực tiếp vào nhau.
    - **Tính tái sử dụng (Reusability):** Một dịch vụ có thể được dùng lại trong nhiều ứng dụng hoặc quy trình nghiệp vụ khác nhau.
    - **Tính tương tác (Interoperability):** Các dịch vụ có thể giao tiếp dù được viết bằng ngôn ngữ hay chạy trên nền tảng khác nhau, thông qua chuẩn chung (SOAP/XML, REST/JSON, v.v.).
    - **Giao tiếp qua lớp trung gian:** Thông thường, việc trao đổi giữa các dịch vụ được quản lý bởi **Enterprise Service Bus (ESB)** hoặc **API Gateway** để đảm bảo định tuyến, bảo mật và giám sát.
* Ưu điểm:
    - Cho phép **tái sử dụng dịch vụ** trong nhiều hệ thống.
    - **Dễ bảo trì, mở rộng** và **tích hợp** với các hệ thống bên ngoài.
    - **Tăng tính linh hoạt** trong việc triển khai, thay đổi hoặc nâng cấp từng phần của hệ thống mà không ảnh hưởng đến toàn bộ ứng dụng.
    - **Phù hợp với các tổ chức lớn** cần tích hợp nhiều hệ thống nghiệp vụ khác nhau.
* Nhược điểm:
    - **Phức tạp trong triển khai** do cần lớp tích hợp (ESB/API Gateway) và cơ chế quản lý dịch vụ.
    - Có thể xuất hiện **điểm nghẽn (bottleneck)** tại ESB nếu thiết kế không tối ưu.
    - **Chi phí phát triển và bảo trì cao**, đòi hỏi hạ tầng đồng bộ.
    - **Hiệu suất thấp hơn** so với kiến trúc nguyên khối (monolithic) do chi phí truyền thông giữa các dịch vụ.

### **1.4.2. Overview of microservice architecture**

#### **a) Tổng quan**

· Microservices là một kiến trúc phần mềm trong đó ứng dụng được chia thành nhiều **dịch vụ nhỏ** (micro-service) hoạt động độc lập. Mỗi dịch vụ đảm nhận một chức năng cụ thể và được triển khai, vận hành độc lập.

· Kiến trúc microservices khá phổ biến hiện nay và được nhiều công ty lớn sử dụng như: Netflix, eBay, Amazon, Twitter, PayPal,...

· Mỗi service trong kiến trúc này là mỗi module độc lập giúp dễ dàng phát triển, kiểm thử, mở rộng và triển khai…

![][image2]

Hình 1\. 1\. Kiến trúc microservice

#### **b) Ưu điểm:**

- **Khả năng mở rộng:**

    Mỗi dịch vụ trong kiến trúc microservice được thiết kế độc lập, cho phép mở rộng một cách riêng biệt. Ví dụ: nếu một dịch vụ nhận được lưu lượng truy cập lớn (như dịch vụ xử lý thanh toán trong một ứng dụng thương mại điện tử), chỉ cần mở rộng dịch vụ này mà không cần tăng tài nguyên cho các dịch vụ khác.

    Lợi ích:
    - Tối ưu hóa tài nguyên hệ thống.
    - Tiết kiệm chi phí vận hành vì chỉ cần mở rộng những phần cần thiết.
    - Dễ dàng đáp ứng nhu cầu tăng trưởng theo thời gian.

- **Khả năng chịu lỗi:**

    Trong microservice, nếu một dịch vụ bị lỗi, các dịch vụ khác có thể tiếp tục hoạt động bình thường vì chúng hoạt động độc lập. Ví dụ, nếu dịch vụ gửi email bị lỗi, hệ thống vẫn có thể xử lý các đơn hàng mà không bị gián đoạn.

    Lợi ích:

    o Giảm thiểu rủi ro ngừng hoạt động toàn hệ thống.

    o Cải thiện trải nghiệm người dùng khi hệ thống vẫn duy trì dịch vụ chính.

- **Linh hoạt:**

    Các dịch vụ có thể được viết bằng các ngôn ngữ lập trình khác nhau và sử dụng các công nghệ khác nhau. Nếu cần nâng cấp hoặc áp dụng công nghệ mới, bạn chỉ cần thực hiện trên một dịch vụ cụ thể mà không ảnh hưởng đến toàn bộ hệ thống.

    Lợi ích:

    o Dễ dàng thử nghiệm và tích hợp công nghệ mới.

    o Giảm rủi ro khi triển khai các tính năng hoặc công nghệ mới.

- **Quản lý đội ngũ:**

    Với kiến trúc microservice, mỗi đội phát triển có thể chịu trách nhiệm cho một dịch vụ riêng biệt. Điều này giảm thiểu xung đột và sự phụ thuộc giữa các nhóm.

    Lợi ích:
    - Tăng năng suất làm việc của đội ngũ.
    - Đơn giản hóa việc quản lý dự án lớn.
    - Tạo điều kiện cho các nhóm nhỏ tập trung vào chuyên môn riêng.

#### **c) Nhược điểm:**

- **Phức tạp:** Việc chia nhỏ hệ thống thành nhiều dịch vụ dẫn đến sự phức tạp trong quản lý. Cần có các công cụ giám sát, logging và quản lý giao tiếp để đảm bảo các dịch vụ hoạt động đồng bộ.
- **Chi phí:** Việc vận hành nhiều dịch vụ riêng biệt đòi hỏi tài nguyên lớn hơn so với hệ thống nguyên khối. Cần đầu tư vào hạ tầng (máy chủ, công cụ giám sát) và nhân lực để duy trì.
- **Thách thức về giao tiếp:** Các dịch vụ phải giao tiếp với nhau thông qua giao thức API hoặc Message Queue. Điều này đòi hỏi sử dụng các công cụ và tiêu chuẩn giao tiếp hiệu quả.

#

# **CHAPTER 2: SYSTEM ANALYSIS AND DESIGN** {#chapter-2:-system-analysis-and-design}

## **2.1. Describe the actors, the terminology, and define the requirements** {#2.1.-describe-the-actors,-the-terminology,-and-define-the-requirements}

This section identifies the key stakeholders (actors) who interact with the Secure Assessment Platform (SAP), defines the terminology used throughout the system analysis, and consolidates functional/non-functional requirements derived from the platform goals and the requirements draft.

### **2.1.1. Identify and describe the actors**

_Table 2.1. Main actors of SAP_

| Num | Actors                | Description                                                                                                                                                                                                    | Interactions                     |
| --- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 1   | Administrator (Admin) | The user with the highest privileges. Responsible for system configuration, user management (RBAC), organization management, and viewing system-wide analytics.                                                | Web Application (Admin Portal)   |
| 2   | Teacher               | Users responsible for creating contents, tests and questions. They manage question banks, configure exam settings, monitor students via the proctoring dashboard in real-time, and grade subjective questions. | Web Application (Teacher Portal) |
| 3   | Student               | The primary end-user. They log in to take assessments, undergo AI-based verification and monitoring, and view their results and history.                                                                       | Web Application (Student Portal) |

In addition to the “human” actors above, the platform relies on technical actors/services that provide critical capabilities:

- Identity Provider (Casdoor): handles authentication/authorization flows such as OAuth2, SSO, MFA and RBAC.
- Client-side Proctoring Engine (MediaPipe): performs camera-based monitoring on the client, generates “proctoring events”, and sends only metadata/violation events to the backend.
- Auto-graded function: backend services which auto-grading multiple-choice questions.
- Notification delivery mechanisms (real-time \+ email): needed to push alerts and results to admins/teachers/students.

### **2.1.2. Building a glossary**

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

###

### **2.1.3. Identify requirements**

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
    - FR-50: Allow a Student to join/leave a Group via invite code/link or join-request workflow.
- Teachers:
    - FR-51: Allow Teacher/Admin to manage Group membership (approve/deny requests, remove members,bulk import/export roster).
    - FR-52: Allow Teacher to assign/publish an Assessment to one or more Groups, with optional availability window and attempt limits per group.
    - FR-55: Provide Teacher analytics at Group level (participants, completion rate, average/median, score)
- Assessment:
    - FR-53: When an Assessment is assigned to a Group, notify all Group members via configured channels (SSE/Email) and support reminder notifications before due time.
    - FR-54: Restrict assessment access so only students who are members of the target Group(s) can view/attempt the assigned Assessment.
    - FR-55: Provide Teacher analytics at Group level (participants, completion rate, average/median, score distribution) and per-student list; allow export (PDF/Excel).

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
    - **NFR-37**: Responsive design for mobile and desktop.
    - **NFR-38**: Accessibility compliance (WCAG 2.1 AA).
    - **NFR-39**: Internationalization support.
    - **NFR-40**: Intuitive navigation with fewer than 3 clicks.
- Browser Support:
    - **NFR-41**: Latest versions of Chrome/Edge/Safari/Firefox.
    - **NFR-42**: WebRTC support for camera/microphone.
    - **NFR-43**: WebGL support for MediaPipe.
    - **NFR-44**: Graceful degradation for older browsers.

**F. Operability**

- Monitoring & Logging:
    - **NFR-45**: Centralized logging with the ELK stack.
    - **NFR-46**: Metrics collection with Prometheus.
    - **NFR-47**: Distributed tracing with correlation IDs.
    - **NFR-48**: Custom metrics collection in Prometheus format.
- Deployment & DevOps:
    - **NFR-49**: GitOps deployment from GitHub with auto-deploy.
    - **NFR-50**: CI/CD pipeline with automated testing.
    - **NFR-51**: Environment parity (dev/staging/prod).
    - **NFR-52**: Automated testing in CI/CD pipeline (\>80% coverage).

**G. Compliance and Regulations**

- Educational Standards:
    - **NFR-53**: FERPA compliance for student records.
    - **NFR-54**: Academic integrity guidelines.0
    - **NFR-55**: Accessibility standards (Section 508).
    - **NFR-56**: Data retention policies.

- Technical Standards:
    - **NFR-57**: REST API design standards (OpenAPI 3.0).
    - **NFR-58**: Database normalization (minimum 2NF).
    - **NFR-59**: Code quality metrics (≥ 70% coverage).
    - **NFR-60**: Security vulnerability scanning.

**H. Event processing Requirements**

- Event Reliability:
    - **NFR-61**: Event delivery guarantee: at-least-once.
    - **NFR-62**: Event ordering per user session guaranteed.
    - **NFR-63**: Event deduplication using idempotency keys.
    - **NFR-64**: Event schema validation before processing.
- Event Performance:
    - **NFR-65**: Event publish latency \< 10ms (99th percentile).
    - **NFR-66**: Consumer processing latency \< 100ms average.
    - **NFR-67**: Event throughput scaling to 10K events/second.
    - **NFR-68**: Event storage efficiency with compression.

## **2.2. Use Case Identification and Description** {#2.2.-use-case-identification-and-description}

### **2.2.1. Overall use cases of the system**

![][image3]

### **2.2.2. Detailed use cases for students.**

- Use case take exam:

![][image4]

- Use case view result:

![][image5]

- Use case contest:  
  ![][image6]

### **2.2.3. Detailed use cases for teachers.**

- Use case manage assessment, question and question bank:  
  ![][image7]
- Use case manage contest:  
  ![][image8]
- Use case grade and evaluate:  
  ![][image9]
- Use case monitoring and analysis:

![][image10]

### **2.2.3. Detailed use cases for administrators.**

- Use case manage user and group:

![][image11]

- Use case notification management:  
  ![][image12]
- Use case system administration:  
  ![][image13]
- Use case monitoring and analytics system and proctoring:

![][image14]

### **2.2.4. Main scenarios for students.**

Table 2.1: Scenario of Authentication & Profile Management (as User)

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Student (inherits from User)                                                                                                                                                                                                                                                                                                                                                                                                |
| **Precondition**   | Student has registered account in the system via Casdoor identity provider                                                                                                                                                                                                                                                                                                                                                  |
| **Post-condition** | Student successfully logs into the system and can access student-specific features                                                                                                                                                                                                                                                                                                                                          |
| **Main Scenario**  | 1\. Student navigates to the login page. 2\. System displays login form with OAuth2 options via Casdoor. 3\. Student enters credentials (username/email and password) or selects OAuth provider. 4\. System validates credentials through Casdoor identity service. 5\. System issues JWT access token upon successful authentication. 6\. System redirects student to the student dashboard showing available assessments. |
| **Exception**      | 1.1 Invalid credentials: System displays error message and prompts student to re-enter credentials. 2.1 Account not found: System suggests registration or password recovery. 3.1 2FA required: System prompts for two-factor authentication code before granting access.                                                                                                                                                   |

Table 2.2: Scenario of Take exam

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Actor**          | Student                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Precondition**   | Student has successfully logged into the system. Assessment status is "Active" and not expired. Student has not exceeded maximum attempts allowed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Post-condition** | Student completes the exam attempt and answers are recorded in the system for grading                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Main Scenario**  | 1\. Student navigates to "My Assessments" page. 2\. System displays list of available assessments with status, due date, and remaining attempts. 3\. Student selects an assessment to take. 4\. System displays assessment details including duration, total questions, passing score, and proctoring requirements. 5\. Student clicks "Start Exam" button. 6\. System initializes AI Proctoring & Violation Detection (camera access, face verification). 7\. System creates new attempt record with status "in_progress" and starts timer. 8\. System displays questions (shuffled if configured) with navigation panel. 9\. Student answers questions and can navigate between questions. 10\. System auto-saves answers periodically. 11\. Student clicks "Submit Exam" when finished. 12\. System confirms submission, stops proctoring, and records completion time. 13\. System triggers Auto Grading for objective questions. 14\. System sends notification about exam completion. |
| **Exception**      | 1.1 No available assessments: System displays message "No assessments available at this time." 2.1 Maximum attempts reached: System disables "Start Exam" button and shows remaining attempts as 0\. 3.1 Assessment expired: System displays "This assessment has expired" message. 4.1 Camera access denied: System prompts student to enable camera for proctoring or blocks exam start. 5.1 Face verification failed: System warns student and may block exam continuation. 6.1 Violation detected (tab switching, multiple faces, etc.): System logs violation, sends warning, and may auto-submit if critical. 7.1 Time expires: System auto-submits all current answers and marks attempt as "timeout". 8.1 Connection lost: System preserves last saved state and allows resume within time limit.                                                                                                                                                                                   |

Table 2.3: Scenario of View results

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Student                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Precondition**   | Student has successfully logged into the system. Student has at least one completed attempt.                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Post-condition** | Student views exam results and performance analytics                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Main Scenario**  | 1\. Student navigates to "My Attempts" or "Results" page. 2\. System displays list of all attempts with filtering options (by assessment, status, date range). 3\. Student selects an attempt to view details. 4\. System displays attempt summary including: \- Total score and passing status \- Time taken vs time allowed \- Score breakdown by question type \- Violation summary (if any) 5\. Student can view individual question results. 6\. System shows correct answers and explanations. |
| **Exception**      | 1.1 No attempts found: System displays "You have not completed any assessments yet." 2.1 Results not yet available: System shows "Your results are being processed" for attempts pending manual grading. 3.1 Detailed results hidden: System displays only total score if teacher disabled detailed feedback.                                                                                                                                                                                        |

Table 2.4: Scenario of Participate in Contest:

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Student                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Precondition**   | Student has successfully logged into the system. Contest is published and within registration/participation period.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Post-condition** | Student successfully participates in contest and results are recorded for ranking                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Main Scenario**  | 1\. Student navigates to "Contests" page. 2\. System displays list of available contests with status (upcoming, ongoing, ended). 3\. Student selects a contest to view details. 4\. System displays contest information including: \- Contest name and description \- Start time and end time \- Number of participants \- Rules and scoring system 5\. Student clicks "Join Contest" or "Register" button. 6\. System confirms registration and adds student to the participant list. 7\. When contest starts, student clicks "Enter Contest". 8\. System follows Take Exam scenario with contest-specific rules. 9\. Upon completion, system calculates ranking based on score and time. 10\. System displays leaderboard with student's position. 11\. System sends notification about contest results. |
| **Exception**      | 1.1 Contest not found: System displays "Contest does not exist or has been removed." 2.1 Registration closed: System displays "Registration period has ended." 3.1 Contest not started: System shows countdown timer until contest begins. 4.1 Already registered: System shows "You are already registered for this contest." 5.1 Contest ended: System only allows viewing results and leaderboard.                                                                                                                                                                                                                                                                                                                                                                                                      |

Table 2.5: Scenario of Manage Notification Preferences (as User):

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Student (inherits from User)                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Precondition**   | Student has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Post-condition** | Student's notification preferences are updated in the system                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Main Scenario**  | 1\. Student navigates to "Settings" or "Preferences" page. 2\. System displays current notification preferences. 3\. Student configures notification channels (Email, SSE, Push, SMS). 4\. Student selects which events to receive notifications for: \- Exam reminders \- Results available \- Contest announcements \- Violation warnings 5\. Student saves preferences. 6\. System validates and stores preferences. 7\. System confirms update with success message. |

Table 2.6: Scenario of Join a Group (as Users):

##

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Student (inherits from User)                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Precondition**   | Student is logged in. Group exists and allows joining (open) or an invitation code/link is provided.                                                                                                                                                                                                                                                                                                                                                                              |
| **Post-condition** | Student becomes a member of the Group, or a join request is recorded as Pending.                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Main Scenario**  | 1\. Student navigates to "Groups" page. 2\. System displays available groups and/or a "Join via Code" field. 3\. Student enters group code (or selects a group) and clicks "Join" / "Request to Join". 4\. System validates group code and eligibility. 5\. If group is open: system adds student to group immediately. 6\. If approval is required: system stores request as Pending and notifies Teacher/Admin. 7\. System confirms the result (Joined/Pending) to the student. |
| **Exception**      | 1.1 Invalid/expired code: system shows an error. 2.1 Group closed: system blocks join and suggests invitation. 3.1 Already member: system displays "You are already in this group".                                                                                                                                                                                                                                                                                               |

### **2.2.5. Main scenarios for teachers.**

Table 3.1: Scenario of Authentication & Profile Management (as User)

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Actor**          | Teacher (inherits from User)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Precondition**   | Teacher has registered account in the system with Teacher role                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Post-condition** | Teacher successfully logs into the system and can access teacher-specific features                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Main Scenario**  | 1\. Teacher navigates to the login page. 2\. System displays login form with OAuth2 options via Casdoor. 3\. Teacher enters credentials (username/email and password) or selects OAuth provider. 4\. System validates credentials through Casdoor identity service. 5\. System verifies Teacher role and permissions. 6\. System issues JWT access token upon successful authentication. 7\. System redirects teacher to the Teacher Dashboard showing assessments overview, question banks, and recent activities. |
| **Exception**      | 1.1 Invalid credentials: System displays error message and prompts teacher to re-enter credentials. 2.1 Account not found: System suggests registration or password recovery. 3.1 Insufficient role: System displays "Access denied \- Teacher privileges required" if user doesn't have Teacher role. 4.1 2FA required: System prompts for two-factor authentication code before granting access.                                                                                                                  |

---

Table 3.2: Scenario of Manage Assessment, Bank & Questions \- Create Assessment

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Precondition**   | Teacher has successfully logged into the system with valid Teacher role                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Post-condition** | New assessment is created with "Draft" status and stored in database                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Main Scenario**  | 1\. Teacher navigates to "Assessments" page and clicks "Create Assessment". 2\. System displays assessment creation form. 3\. Teacher fills in assessment metadata: \- Title (required, max 200 characters) \- Description (max 1000 characters) \- Duration (5-180 minutes) \- Passing score (0-100) \- Max attempts (1-10) \- Due date (optional, must be future date) 4\. Teacher configures assessment settings: \- Randomize questions (on/off) \- Show results after submission (on/off) \- Enable proctoring (on/off) 5\. Teacher clicks "Save as Draft". 6\. System validates input data against business rules. 7\. System creates assessment with status "Draft". 8\. System logs creation in audit trail. 9\. System redirects to assessment detail page for adding questions. |
| **Exception**      | 1.1 Validation error: System displays specific error messages for invalid fields (empty title, duration out of range, invalid passing score). 2.1 Duplicate title: System displays "Assessment title already exists" if title is not unique for this teacher. 3.1 Database error: System displays error message and allows retry.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

---

Table 3.3: Scenario of Manage Assessment, Bank & Questions \- Add Questions to Assessment

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Precondition**   | Teacher has created an assessment in "Draft" status. Assessment has no student attempts yet.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Post-condition** | Questions are added to assessment with configured points and order                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Main Scenario**  | 1\. Teacher opens an existing assessment in edit mode. 2\. System displays assessment details with question management section. 3\. Teacher clicks "Add Questions". 4\. System displays question selection interface with options: \- Create new question \- Select from Question Bank \- Import from file 5\. Teacher selects questions to add. 6\. Teacher configures for each question: \- Points (1-100, or auto-assign) \- Order in assessment \- Time limit per question (optional) 7\. Teacher clicks "Add to Assessment". 8\. System validates total points don't exceed 100\. 9\. System rebalances points if auto-assign is enabled. 10\. System saves question-assessment associations. 11\. System displays updated assessment with question list. |
| **Exception**      | 1.1 Points exceed limit: System displays "Total points (X) would exceed maximum allowed (100)". 2.1 Duplicate question: System displays "Question already exists in this assessment". 3.1 Assessment locked: System displays "Cannot modify assessment \- students have already started attempts". 4.1 No access to question: System displays "Permission denied for question X".                                                                                                                                                                                                                                                                                                                                                                              |

---

Table 3.4: Scenario of Manage Assessment, Bank & Questions \- Create Question

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Precondition**   | Teacher has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Post-condition** | New question is created and stored in database                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Main Scenario**  | 1\. Teacher navigates to "Questions" or "Question Bank" page. 2\. Teacher clicks "Create Question". 3\. System displays question type selection (Multiple Choice, True/False, Essay, Fill-in-Blank, Matching, Ordering, Short Answer). 4\. Teacher selects question type. 5\. System displays appropriate form for selected type. 6\. Teacher fills in question details: \- Question text (required) \- Category (optional) \- Difficulty level (Easy/Medium/Hard) \- Points (default value) \- Answer options and correct answer(s) \- Explanation (optional) 7\. Teacher clicks "Save Question". 8\. System validates question structure and content. 9\. System creates question and associates with teacher. 10\. System displays success message with option to add to Question Bank or Assessment. |
| **Exception**      | 1.1 Invalid question format: System displays validation errors for missing required fields. 2.1 No correct answer: System displays "Please specify at least one correct answer". 3.1 Duplicate options: System displays "Answer options must be unique".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

---

Table 3.5: Scenario of Manage Assessment, Bank & Questions \- Manage Question Bank

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Precondition**   | Teacher has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Post-condition** | Question bank is created/updated with organized question collections                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Main Scenario**  | 1\. Teacher navigates to "Question Banks" page. 2\. System displays list of teacher's question banks and shared banks. 3\. Teacher clicks "Create Question Bank". 4\. System displays bank creation form. 5\. Teacher fills in: \- Bank name (required) \- Description \- Visibility (Private/Public/Shared) 6\. Teacher clicks "Create". 7\. System creates question bank. 8\. Teacher can add questions to bank by: \- Creating new questions \- Moving existing questions \- Importing from file 9\. Teacher can share bank with other teachers by specifying user IDs and permissions (read/write). 10\. System saves sharing configuration. |
| **Exception**      | 1.1 Duplicate name: System displays "Question bank name already exists". 2.1 Share failed: System displays error if target user not found. 3.1 Permission denied: System displays "Cannot modify shared bank \- read-only access".                                                                                                                                                                                                                                                                                                                                                                                                               |

---

Table 3.6: Scenario of Manage Assessment, Bank & Questions \- Publish Assessment

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Precondition**   | Assessment exists in "Draft" status with at least one question added                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Post-condition** | Assessment status changes to "Active" and becomes available to students                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Main Scenario**  | 1\. Teacher opens assessment in "Draft" status. 2\. Teacher reviews assessment details and questions. 3\. Teacher clicks "Publish Assessment". 4\. System validates assessment is ready for publishing: \- Has at least one question \- Total points equals 100 (or configured value) \- All required settings are configured 5\. System changes assessment status to "Active". 6\. System sends notifications to assigned students (if configured). 7\. System displays confirmation message. |
| **Exception**      | 1.1 No questions: System displays "Cannot publish \- assessment has no questions". 2.1 Invalid points: System displays "Total points must equal 100". 3.1 Past due date: System displays "Due date has already passed".                                                                                                                                                                                                                                                                        |

---

Table 3.7: Scenario of Manage Contest \- Create and Manage Contest

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Precondition**   | Teacher has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Post-condition** | Contest is created and configured for student participation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Main Scenario**  | 1\. Teacher navigates to "Contests" page. 2\. Teacher clicks "Create Contest". 3\. System displays contest creation form. 4\. Teacher fills in contest details: \- Contest name and description \- Start date/time and end date/time \- Registration period \- Scoring rules (time-based, accuracy-based, combined) \- Ranking criteria 5\. Teacher associates assessment(s) with contest. 6\. Teacher configures participation rules: \- Open registration or invite-only \- Maximum participants \- Eligibility criteria 7\. Teacher clicks "Create Contest". 8\. System validates contest configuration. 9\. System creates contest with "Scheduled" status. 10\. System displays contest management page. |
| **Exception**      | 1.1 Invalid time range: System displays "End time must be after start time". 2.1 No assessment: System displays "Please associate at least one assessment". 3.1 Conflict: System displays "Contest time conflicts with existing contest".                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

---

Table 3.8: Scenario of Grade & Evaluate \- Manual Grading

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Precondition**   | Students have completed attempts with essay or subjective questions requiring manual grading                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Post-condition** | Student answers are graded and scores are recorded                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Main Scenario**  | 1\. Teacher navigates to "Grading" or "Pending Reviews" page. 2\. System displays list of attempts pending manual grading. 3\. Teacher selects an attempt to grade. 4\. System displays attempt details with student answers. 5\. For each subjective question: \- System shows question, correct answer/rubric, and student's response \- Teacher assigns score (0 to max points) \- Teacher provides feedback (optional) 6\. Teacher clicks "Submit Grades". 7\. System validates scores are within range. 8\. System calculates final attempt score. 9\. System marks attempt as "Graded". 10\. System sends notification to student about results availability. |
| **Exception**      | 1.1 Invalid score: System displays "Score must be between 0 and X". 2.1 Already graded: System displays "This answer has already been graded". 3.1 Permission denied: System displays "You don't have permission to grade this assessment".                                                                                                                                                                                                                                                                                                                                                                                                                         |

---

Table 3.9: Scenario of Grade & Evaluate \- Review Violations

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Precondition**   | AI Proctoring has detected violations during student exam attempts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Post-condition** | Violations are reviewed and appropriate actions are taken                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Main Scenario**  | 1\. Teacher navigates to "Violation Review" or "Proctoring Reports" page. 2\. System displays list of attempts with violations, sorted by severity. 3\. Teacher selects an attempt to review. 4\. System displays violation details: \- Violation type (multiple faces, looking away, tab switching, etc.) \- Severity level (Low/Medium/High/Critical) \- Timestamp and duration \- Confidence score \- Snapshot/evidence (if available) 5\. Teacher reviews violation timeline and evidence. 6\. Teacher decides action: \- Dismiss (false positive) \- Warning (minor violation) \- Score penalty \- Invalidate attempt (severe violation) 7\. Teacher adds comments/justification. 8\. Teacher clicks "Submit Decision". 9\. System records decision and updates attempt status. 10\. System sends notification to student about violation review outcome. |
| **Exception**      | 1.1 No evidence: System displays "Snapshot unavailable for this violation". 2.1 Attempt already invalidated: System displays "This attempt has already been invalidated".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

---

Table 3.10: Scenario of Monitor & Analytics \- Real-time Dashboard

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Precondition**   | Teacher has active assessments with ongoing or completed attempts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Post-condition** | Teacher views real-time statistics and analytics for their assessments                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Main Scenario**  | 1\. Teacher navigates to "Dashboard" or "Analytics" page. 2\. System displays real-time dashboard with: \- Total assessments created \- Total questions in banks \- Active attempts in progress \- Completion rate \- Average scores 3\. Teacher can filter by: \- Date range (today, week, month, custom) \- Specific assessment \- Student group 4\. System displays charts and visualizations: \- Score distribution histogram \- Attempt timeline \- Question difficulty analysis \- Violation statistics 5\. Teacher can drill down into specific metrics. 6\. Teacher can export reports (PDF, Excel). |
| **Exception**      | 1.1 No data: System displays "No attempts found for selected filters". 2.1 Export failed: System displays error and allows retry.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

---

Table 3.11: Scenario of Monitor & Analytics \- Live Exam Monitoring

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Precondition**   | Assessment is active with students currently taking the exam                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Post-condition** | Teacher monitors exam progress in real-time                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Main Scenario**  | 1\. Teacher navigates to "Live Monitoring" for an active assessment. 2\. System displays real-time monitoring dashboard: \- Number of active participants \- Completion progress per student \- Real-time violation alerts \- Time remaining for each student 3\. System shows live feed of violations as they occur: \- Student name/ID \- Violation type and severity \- Timestamp 4\. Teacher can take immediate actions: \- Send warning message to student \- Extend time for specific student \- Force submit attempt 5\. System updates statistics in real-time (every 5 seconds). 6\. Teacher receives critical violation alerts via push notification. |
| **Exception**      | 1.1 No active attempts: System displays "No students are currently taking this assessment". 2.1 Connection lost: System displays "Real-time connection lost \- attempting to reconnect".                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

---

Table 3.12: Scenario of Manage Notification Preferences (as User)

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher (inherits from User)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Precondition**   | Teacher has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Post-condition** | Teacher's notification preferences are updated                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Main Scenario**  | 1\. Teacher navigates to "Settings" or "Preferences" page. 2\. System displays current notification preferences. 3\. Teacher configures notification channels (Email, SSE, Push, SMS). 4\. Teacher selects which events to receive notifications for: \- Student attempt completion \- Pending grading alerts \- Violation detection alerts \- Assessment deadline reminders \- System announcements 5\. Teacher saves preferences. 6\. System validates and stores preferences. 7\. System confirms update with success message. |
| **Exception**      | 1.1 Invalid configuration: System displays validation error for invalid settings. 2.1 Save failed: System displays error and prompts retry.                                                                                                                                                                                                                                                                                                                                                                                       |

Table 3.12: Scenario of Assign/Publish Assessment to Group (as Teacher)

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Precondition**   | Teacher is logged in. Assessment exists (Draft or Ready). Target Group(s) exist and teacher has permission to assign to them.                                                                                                                                                                                                                                                                                                                                                                                          |
| **Post-condition** | Assessment is assigned to selected Group(s). Notifications are sent to all Group members.                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Main Scenario**  | 1\. Teacher opens an Assessment. 2\. Teacher selects "Assign To" and chooses one or more Groups. 3\. Teacher configures availability window, due date, and attempts (optional). 4\. Teacher clicks "Publish" (or "Assign"). 5\. System validates configuration and activates/assigns the assessment. 6\. System resolves group roster and creates assignment records for each student. 7\. System sends notifications to all Group members (SSE/Email). 8\. System shows confirmation with count of notified students. |
| **Exception**      | 1.1 No permission for group: system blocks assignment. 2.1 Empty group: system warns "Group has no students". 3.1 Invalid schedule: system requires due date after start date.                                                                                                                                                                                                                                                                                                                                         |

Table 3.12: Scenario of View Group Results (as Teacher)

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Actor**          | Teacher                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Precondition**   | Teacher is logged in. Assessment is assigned to a Group and at least one attempt exists (or is in progress).                                                                                                                                                                                                                                                                                                                                                        |
| **Post-condition** | Teacher can review aggregated group performance and per-student scores.                                                                                                                                                                                                                                                                                                                                                                                             |
| **Main Scenario**  | 1\. Teacher navigates to "Reports" / "Analytics". 2\. Teacher selects an Assessment and filters by Group. 3\. System displays summary metrics: started, completed, average score, pass rate. 4\. System displays score distribution and violation summary (optional). 5\. System displays per-student list: score, status, time taken, violations. 6\. Teacher sorts/filters and opens any student attempt for details. 7\. Teacher exports the report (PDF/Excel). |
| **Exception**      | 1.1 No attempts yet: system shows roster with "Not started" statuses. 2.1 Access denied: system blocks results outside teacher’s assigned groups.                                                                                                                                                                                                                                                                                                                   |

### **2.2.6. Main scenarios for administrators.**

Table 4.1: Scenario of Authentication & Profile Management (as User)

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin (inherits from User)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Precondition**   | Admin has registered account in the system with Admin role                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Post-condition** | Admin successfully logs into the system and can access all administrative features                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Main Scenario**  | 1\. Admin navigates to the login page. 2\. System displays login form with OAuth2 options via Casdoor. 3\. Admin enters credentials (username/email and password) or selects OAuth provider. 4\. System validates credentials through Casdoor identity service. 5\. System verifies Admin role and full system permissions. 6\. System issues JWT access token with admin privileges. 7\. System redirects admin to the Admin Dashboard showing system overview, user statistics, and system health metrics. |
| **Exception**      | 1.1 Invalid credentials: System displays error message and prompts admin to re-enter credentials. 2.1 Account not found: System suggests contacting system administrator. 3.1 Insufficient role: System displays "Access denied \- Admin privileges required". 4.1 2FA required: System prompts for two-factor authentication code before granting access. 5.1 Account locked: System displays "Account has been locked due to security reasons".                                                            |

---

Table 4.2: Scenario of Manage Users & Groups \- View and Manage Users

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Precondition**   | Admin has successfully logged into the system with Admin role                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Post-condition** | User accounts are managed according to admin actions                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Main Scenario**  | 1\. Admin navigates to "User Management" page. 2\. System displays list of all users with pagination and filtering options. 3\. Admin can filter users by: \- Role (Student, Teacher, Admin) \- Status (Active, Inactive, Suspended) \- Registration date \- Last login date 4\. Admin selects a user to view details. 5\. System displays user profile including: \- Personal information \- Role and permissions \- Activity history \- Assessment statistics 6\. Admin can perform actions: \- Edit user information \- Change user role \- Activate/Deactivate account \- Reset password \- Delete user 7\. System sends notification to affected user (if configured). |
| **Exception**      | 1.1 Cannot delete self: System displays "Cannot delete your own account". 2.1 Cannot demote last admin: System displays "Cannot remove admin role \- at least one admin required". 3.1 User has active sessions: System prompts to force logout before deletion.                                                                                                                                                                                                                                                                                                                                                                                                            |

---

Table 4.3: Scenario of Manage Users & Groups \- Create User Groups

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Post-condition** | User groups are created and users are organized accordingly                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Main Scenario**  | 1\. Admin navigates to "Groups Management" page. 2\. Admin clicks "Create Group". 3\. System displays group creation form. 4\. Admin fills in group details: \- Group name (required) \- Description \- Group type (Class, Department, Custom) \- Parent group (for hierarchical structure) 5\. Admin adds members to group: \- Search and select users \- Bulk import from CSV \- Select from existing groups 6\. Admin assigns group permissions and access levels. 7\. Admin clicks "Create Group". 8\. System validates and creates group. 9\. System displays success message with group details. |
| **Exception**      | 1.1 Duplicate name: System displays "Group name already exists". 2.1 Invalid members: System displays "Some users could not be added" with details. 3.1 Circular hierarchy: System displays "Cannot create circular group hierarchy".                                                                                                                                                                                                                                                                                                                                                                  |

---

Table 4.4: Scenario of Manage Assessment, Bank & Questions (Admin Override)

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Post-condition** | Assessments are managed regardless of ownership                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Main Scenario**  | 1\. Admin navigates to "All Assessments" page. 2\. System displays list of ALL assessments in system (not limited to ownership). 3\. Admin can filter by: \- Creator (any teacher) \- Status (Draft, Active, Expired, Archived) \- Date range \- Category 4\. Admin selects any assessment to manage. 5\. System displays assessment with full edit capabilities. 6\. Admin can perform all operations: \- Edit assessment details \- Add/remove questions \- Change status \- Delete assessment (even with attempts \- with confirmation) \- Transfer ownership to another teacher 7\. System notifies original owner of changes (if configured). |
| **Exception**      | 1.1 Force delete with attempts: System requires additional confirmation "This will delete X student attempts. Type 'DELETE' to confirm". 2.1 Transfer to non-teacher: System displays "Can only transfer to users with Teacher role".                                                                                                                                                                                                                                                                                                                                                                                                              |

---

Table 4.5: Scenario of Manage Contest (Admin Override)

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Post-condition** | Contests are managed with full administrative privileges                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Main Scenario**  | 1\. Admin navigates to "All Contests" page. 2\. System displays list of all contests in system. 3\. Admin can manage any contest regardless of creator: \- Modify contest settings \- Extend or shorten time limits \- Add/remove participants \- Cancel ongoing contest \- Recalculate rankings 4\. Admin can perform emergency actions: \- Pause contest for all participants \- Resume paused contest \- Invalidate specific attempts \- Adjust scores manually 5\. System logs all admin actions with justification. 6\. System sends notifications to affected participants. |
| **Exception**      | 1.1 Cancel completed contest: System displays "Contest has already ended \- can only archive". 2.1 Recalculate with manual adjustments: System prompts to preserve or overwrite manual score changes.                                                                                                                                                                                                                                                                                                                                                                             |

---

Table 4.6: Scenario of Grade & Evaluate (Admin Override)

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Post-condition** | Grades are managed with full administrative privileges                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Main Scenario**  | 1\. Admin navigates to "Grading Management" page. 2\. System displays all pending and completed gradings system-wide. 3\. Admin can: \- Override teacher grades with justification \- Re-assign grading to different teacher \- Bulk grade adjustments (curve) \- Invalidate attempts due to integrity violations 4\. Admin reviews and overrides a grade: \- System shows original grade and teacher comments \- Admin enters new grade with mandatory justification \- System saves override with audit trail 5\. System notifies student and original grader of the override. 6\. System logs grade override in compliance records. |
| **Exception**      | 1.1 No justification provided: System requires "Justification is mandatory for grade override". 2.1 Grade outside valid range: System displays "Grade must be between 0 and maximum points".                                                                                                                                                                                                                                                                                                                                                                                                                                           |

---

Table 4.7: Scenario of Monitor & Analytics (System-wide)

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Post-condition** | Admin views comprehensive system analytics                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Main Scenario**  | 1\. Admin navigates to "System Analytics" dashboard. 2\. System displays comprehensive metrics: \- Total users by role \- Active users (daily/weekly/monthly) \- Total assessments and attempts \- System-wide completion rates \- Average scores across all assessments \- Violation statistics and trends 3\. Admin can view detailed breakdowns: \- Performance by teacher \- Performance by student group \- Assessment difficulty analysis \- Proctoring violation patterns 4\. Admin can generate reports: \- Custom date ranges \- Specific metrics selection \- Export to PDF/Excel 5\. System displays real-time statistics with auto-refresh. 6\. Admin can set up automated report scheduling. |
| **Exception**      | 1.1 Large data range: System displays "Processing large dataset \- report will be sent via email when ready". 2.1 Export failed: System displays error and allows retry.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

---

Table 4.8: Scenario of System Administration \- System Configuration

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Post-condition** | System configuration is updated                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Main Scenario**  | 1\. Admin navigates to "System Configuration" page. 2\. System displays configurable settings categories: \- General settings (site name, timezone, language) \- Assessment defaults (duration limits, attempt limits) \- Proctoring settings (violation thresholds, detection sensitivity) \- Security settings (session timeout, password policy) \- Integration settings (Kafka, Redis, external services) 3\. Admin modifies configuration values. 4\. System validates configuration changes. 5\. Admin clicks "Save Configuration". 6\. System applies changes (some may require restart). 7\. System logs configuration changes in audit trail. 8\. System displays success message with any required actions. |
| **Exception**      | 1.1 Invalid configuration: System displays validation errors for each invalid field. 2.1 Restart required: System prompts "This change requires system restart. Schedule restart?". 3.1 Conflicting settings: System displays "Configuration conflict detected" with resolution options.                                                                                                                                                                                                                                                                                                                                                                                                                              |

---

Table 4.9: Scenario of System Administration \- View Audit Logs

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Post-condition** | Admin views and analyzes system audit logs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Main Scenario**  | 1\. Admin navigates to "Audit Logs" page. 2\. System displays audit log entries with filtering options. 3\. Admin can filter logs by: \- Event type (assessment_created, user_login, grade_updated, etc.) \- User/Actor \- Target type (assessment, question, user, attempt) \- Date range \- Compliance level (low, medium, high, critical) 4\. System displays log details: \- Timestamp \- Actor (user who performed action) \- Event type and description \- Before/after values (for changes) \- IP address and user agent \- Request ID for tracing 5\. Admin can export logs for compliance reporting. 6\. Admin can set up alerts for specific event types. |
| **Exception**      | 1.1 Log retention exceeded: System displays "Logs older than X days have been archived". 2.1 Export too large: System queues export and sends via email.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

---

Table 4.10: Scenario of System Administration \- RBAC Management

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Post-condition** | Role-based access control is configured                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Main Scenario**  | 1\. Admin navigates to "Roles & Permissions" page. 2\. System displays existing roles (Student, Teacher, Admin) and custom roles. 3\. Admin can create custom role: \- Role name and description \- Base role (inherit from existing) \- Specific permissions selection 4\. Admin configures permissions for each role: \- Assessment management (create, read, update, delete) \- Question management \- User management \- System configuration \- Grading permissions \- Analytics access 5\. Admin assigns role to users. 6\. System validates permission consistency. 7\. System applies role changes immediately. 8\. System logs RBAC changes in audit trail. |
| **Exception**      | 1.1 Circular permission: System displays "Permission inheritance creates circular dependency". 2.1 Remove critical permission: System warns "Removing this permission may lock out users". 3.1 Delete role in use: System displays "Cannot delete role \- X users are assigned to this role".                                                                                                                                                                                                                                                                                                                                                                        |

---

Table 4.11: Scenario of Manage Notification Templates & Bulk Send \- Manage Templates

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Post-condition** | Notification templates are created/updated                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Main Scenario**  | 1\. Admin navigates to "Notification Templates" page. 2\. System displays list of existing templates. 3\. Admin clicks "Create Template". 4\. System displays template editor with: \- Template name (unique identifier) \- Template type (EMAIL, SSE, PUSH, SMS) \- Subject line (for email) \- Body content with placeholder syntax {{variableName}} \- Variable definitions 5\. Admin creates template using placeholders: \- {{firstName}}, {{lastName}} for user info \- {{assessmentName}}, {{dueDate}} for assessment info \- {{score}}, {{passingStatus}} for results 6\. Admin previews template with sample data. 7\. Admin saves template. 8\. System validates template syntax. 9\. System caches template for performance. |
| **Exception**      | 1.1 Invalid placeholder syntax: System displays "Invalid placeholder: {{invalid". 2.1 Duplicate template name: System displays "Template name already exists". 3.1 Missing required variables: System warns "Template uses undefined variables".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

---

Table 4.12: Scenario of Manage Notification Templates & Bulk Send \- Send Bulk Notifications

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Precondition**   | Admin has successfully logged into the system. Notification templates exist.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Post-condition** | Bulk notifications are sent to selected recipients                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Main Scenario**  | 1\. Admin navigates to "Bulk Notifications" page. 2\. Admin selects notification template to use. 3\. Admin selects recipients: \- Individual users \- User groups \- Role-based (all students, all teachers) \- Custom filter criteria 4\. Admin selects notification channels: \- Email \- SSE (real-time browser) \- Push notification \- SMS 5\. Admin provides common data for template variables. 6\. Admin can provide user-specific data overrides. 7\. Admin previews notification for sample recipients. 8\. Admin clicks "Send Bulk Notification". 9\. System processes notifications asynchronously. 10\. System displays progress and statistics: \- Total recipients \- Successfully sent \- Failed deliveries 11\. System publishes completion event to Redis. |
| **Exception**      | 1.1 No recipients selected: System displays "Please select at least one recipient". 2.1 Template not found: System displays "Selected template does not exist". 3.1 Partial failure: System displays "X notifications failed" with retry option. 4.1 Rate limit exceeded: System queues notifications and displays estimated delivery time.                                                                                                                                                                                                                                                                                                                                                                                                                                   |

---

Table 4.13: Scenario of Manage Notification Templates & Bulk Send \- Monitor Notification Delivery

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Post-condition** | Admin monitors and manages notification delivery status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Main Scenario**  | 1\. Admin navigates to "Notification Monitor" page. 2\. System displays notification delivery dashboard: \- Pending notifications queue \- Recent sent notifications \- Failed notifications \- Delivery statistics 3\. Admin can filter by: \- Status (Pending, Sent, Delivered, Failed) \- Channel (Email, SSE, Push) \- Date range \- Recipient 4\. Admin views individual notification details: \- Recipient information \- Template used \- Delivery attempts and timestamps \- Error messages (for failed) 5\. Admin can retry failed notifications. 6\. Admin can cancel pending notifications. 7\. System auto-retries failed notifications based on configuration. |
| **Exception**      | 1.1 Retry limit exceeded: System displays "Maximum retry attempts reached for this notification". 2.1 Recipient unsubscribed: System displays "Recipient has disabled this notification channel".                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

---

Table 4.14: Scenario of Manage Notification Preferences (as User)

| Field              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**          | Admin (inherits from User)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Precondition**   | Admin has successfully logged into the system                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Post-condition** | Admin's notification preferences are updated                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Main Scenario**  | 1\. Admin navigates to "Settings" or "Preferences" page. 2\. System displays current notification preferences. 3\. Admin configures notification channels (Email, SSE, Push, SMS). 4\. Admin selects which events to receive notifications for: \- System alerts and warnings \- User registration notifications \- Security events \- High-priority violation alerts \- Scheduled report delivery 5\. Admin saves preferences. 6\. System validates and stores preferences. 7\. System confirms update with success message. |
| **Exception**      | 1.1 Invalid configuration: System displays validation error for invalid settings. 2.1 Save failed: System displays error and prompts retry.                                                                                                                                                                                                                                                                                                                                                                                   |

### **2.2.7. UI flows and screen mapping**

## **2.3. System Analysis** {#2.3.-system-analysis}

### **2.3.1. Assessment Service**

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

---

### **2.3.2. Proctoring Service**

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

### **2.3.3. Identity Service (Casdoor)**

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

### **2.3.4. Identity Verification Service**

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

### **2.3.5. Notification Service**

#### **2.3.5.1. Extraction of System Entity Classes**

The Notification Service is designed to manage multi-channel notifications including email, SSE (Server-Sent Events), and push notifications. It supports templated messages with dynamic content and user preference management.  
Based on the database schema, the system entities are identified as follows:  
**Main Entities:**

- **NotificationTemplate**: Represents reusable notification templates with support for multiple channels (EMAIL, SSE, PUSH), subject lines, body content with placeholders, and variable definitions.
- **Notification**: Represents an individual notification instance with recipient information, content, delivery status, and retry tracking.
- **NotificationPreference**: Represents user-specific notification settings including channel enablement and email frequency preferences.

**Template Types (Enumeration):**

- EMAIL
- SSE
- PUSH
- SMS

**Notification Status (Enumeration):**

- PENDING
- SENT
- DELIVERED
- FAILED

**Email Frequency (Enumeration):**

- IMMEDIATE
- DAILY
- WEEKLY

#### **2.3.5.2. Identification of Relationships Between Classes**

- Each **Notification** can use one **NotificationTemplate** (optional via template_id), one NotificationTemplate can be used by multiple Notifications.
- Each **Notification** is sent to one recipient identified by recipient_id (reference to User in Identity Service).
- Each **NotificationPreference** belongs to exactly one **User** (via user_id, unique constraint), each User has at most one NotificationPreference.
- Each **NotificationTemplate** defines placeholders that are resolved using data provided when creating a **Notification**.

### **2.3.6. Group Service**

#### **2.3.6.1. Extraction of System Entity Classes**

**Purpose:** The Group Service manages teacher-created “classes/groups”, student membership, and the linkage between groups and assigned assessments. This service is designed as an isolated microservice with its own database, aligned with the system’s database-per-service architecture principles.

**Main Entities:**

- **ClassGroup**: Represents a teacher-owned class/group with metadata such as `name`, `description`, `owner_teacher_id`, `status`, and `join_policy`.
- **GroupMember**: Represents group membership records linking a `user_id` to a `group_id`, including role in group and membership status.
- **GroupInvitation**: Represents invite codes/links for joining a group (supports expiry and usage limits).
- **GroupJoinRequest**: Represents a student’s request to join a restricted group (approval flow).
- **GroupAssessmentAssignment**: Represents the association between a group and an assessment (by `assessment_id`), including publish/due rules per group.

**Enumerations (suggested):**

- **JoinPolicy**: `OPEN`, `INVITE_ONLY`, `APPROVAL_REQUIRED`
- **GroupStatus**: `ACTIVE`, `ARCHIVED`
- **MemberRole**: `STUDENT`, `TEACHER`, `TA`
- **MembershipStatus**: `PENDING`, `ACTIVE`, `REMOVED`, `BANNED`
- **JoinRequestStatus**: `PENDING`, `APPROVED`, `REJECTED`
- **AssignmentStatus**: `DRAFT`, `PUBLISHED`, `ARCHIVED`

---

#### **2.3.6.2. Identification of Relationships Between Classes**

- **Teacher Ownership**
    - Each **ClassGroup** is owned by exactly one teacher (`owner_teacher_id` references **User** in Identity Service).  
       SECURE ASSESSMENT PLATFORM (3)
- **Membership**
    - Each **ClassGroup** can contain multiple **GroupMembers**, each **GroupMember** belongs to exactly one **ClassGroup**.
    - Each **GroupMember** references exactly one **User** (`user_id` reference to Identity Service), and each **User** can belong to multiple **ClassGroups** (many-to-many via **GroupMember**).
    - Unique constraint recommended: `(group_id, user_id)` to prevent duplicate membership rows.
- **Invitations**
    - Each **ClassGroup** can have multiple **GroupInvitations**, each **GroupInvitation** belongs to exactly one **ClassGroup**.
    - Each **GroupInvitation** is created by one user (`created_by` reference to Identity Service).
- **Join Requests**
    - Each **ClassGroup** can have multiple **GroupJoinRequests**, each **GroupJoinRequest** belongs to exactly one **ClassGroup** and one **User**.
    - Each **GroupJoinRequest** may be processed by one teacher/admin user (`processed_by` reference to Identity Service).
- **Group ↔ Assessment Assignment**
    - Each **GroupAssessmentAssignment** associates exactly **one ClassGroup** and exactly **one Assessment** (`assessment_id` reference to Assessment Service).
    - One **ClassGroup** can be assigned multiple assessments; one **Assessment** can be assigned to multiple groups (many-to-many via **GroupAssessmentAssignment**).

- **Notification integration (event-driven)**
    - When a group assignment is published, the system should trigger notifications to all active group members. Your system already uses Redis Streams for event-driven notification workflows (e.g., assessment-related events consumed by Notification Service).  
       SECURE ASSESSMENT PLATFORM (3)
    - Suggested event types (examples): `group.member_added`, `group.member_removed`, `group.assessment_published` (consumed by Notification Service to notify students).

## **2.4. Building class diagrams at the design phase** {#2.4.-building-class-diagrams-at-the-design-phase}

### **2.4.1. Assessment Service**

![][image15]

### **2.4.2. Identity Verification Service**

![][image16]

### **2.4.3. Proctoring Service**

![][image17]

### **2.4.4. Casdoor Identity Service (minimalism version)**

![][image18]  
![][image19]

### **2.4.5. Notification Service**

![][image20]

### **2.4.6. Group Service**

![][image21]

## **2.5. System sequence diagrams** {#2.5.-system-sequence-diagrams}

### **2.5.1. Sequence diagrams for student functions**

The student module focuses on the exam-taking experience. The following diagrams illustrate the core flows for taking an assessment and viewing results.

#### **2.5.1.1. Take Assessment Sequence Diagram**

This process covers the flow from the moment a student starts an exam until they submit their answers. It involves fetching the exam content, verifying eligibility, and submitting responses.

\`\`\`mermaid  
sequenceDiagram  
 autonumber  
 actor Student  
 participant UI as TakeAssessment Page  
 participant Service as AssessmentService  
 participant API as Backend API  
 participant DB as Database

    Student-\>\>UI: Click "Start Exam"
    activate UI
    UI-\>\>Service: getAssessmentDetails(id)
    activate Service
    Service-\>\>API: GET /api/assessments/{id}
    activate API
    API-\>\>DB: Validate Time & Eligibility
    activate DB
    DB--\>\>API: Return Exam Content
    deactivate DB
    API--\>\>Service: Assessment Data
    deactivate API
    Service--\>\>UI: Render Exam Interface
    deactivate Service

    loop During Exam
        Student-\>\>UI: Select/Input Answer
        UI-\>\>Service: saveProgress(answer)
        Service--\>\>API: POST /api/submissions/progress
    end

    Student-\>\>UI: Click "Submit"
    UI-\>\>Service: submitAssessment(answers)
    activate Service
    Service-\>\>API: POST /api/submissions/submit
    activate API
    API-\>\>DB: Save Submission & Calculate Score (if auto-graded)
    activate DB
    DB--\>\>API: Submission Confirmation
    deactivate DB
    API--\>\>Service: Result/Confirmation
    deactivate API
    Service--\>\>UI: Show Completion Screen
    deactivate Service
    deactivate UI

\`\`\`  
![][image22]

#### **2.5.1.2. View Assessment Result Sequence Diagram**

After an exam is graded, students can view their detailed results, including scores and feedback.

\`\`\`mermaid  
sequenceDiagram  
 autonumber  
 actor Student  
 participant UI as AssessmentResults Page  
 participant Service as StudentService  
 participant API as Backend API  
 participant DB as Database

    Student-\>\>UI: Access Results Page
    activate UI
    UI-\>\>Service: getAssessmentResult(id)
    activate Service
    Service-\>\>API: GET /api/student/results/{id}
    activate API
    API-\>\>DB: Query Submission & Grades
    activate DB
    DB--\>\>API: Return Result Data
    deactivate DB
    API--\>\>Service: Result Data
    deactivate API
    Service--\>\>UI: Display Score & Feedback
    deactivate Service
    deactivate UI

\`\`\`  
![][image23]

#### **2.5.1.3. Face Registration Sequence Diagram**

Before taking exams, students must register their face data for the proctoring system. This process involves capturing a live image and sending it to the verification service.

\`\`\`mermaid  
sequenceDiagram  
 autonumber  
 actor Student  
 participant UI as Profile Page  
 participant Service as FaceVerificationService  
 participant API as Backend API  
 participant DB as Database

    Student-\>\>UI: Click "Register Face"
    activate UI
    UI-\>\>UI: Request Camera Access
    Student-\>\>UI: Allow Camera
    UI-\>\>UI: Capture Image Frame

    UI-\>\>Service: registerFace(imageBlob)
    activate Service
    Service-\>\>API: POST /api/face-verification/register
    activate API
    API-\>\>API: Process Image (Extract Embeddings)
    API-\>\>DB: Save Face Embeddings
    activate DB
    DB--\>\>API: Success
    deactivate DB
    API--\>\>Service: Registration Status
    deactivate API
    Service--\>\>UI: Show Success Message
    deactivate Service
    deactivate UI

\`\`\`  
![][image24]

#### **2.5.1.4. Student joins a Group (invite code, with optional approval)**

This sequence shows how a student joins a class/group from the UI. If the group requires approval, the system stores a pending request instead of activating membership immediately.

sequenceDiagram  
autonumber  
actor Student  
participant Page as GroupJoinPage  
participant Service as GroupService  
participant API as Backend API  
participant DB as Database

Student-\>\>Page: Enter group code \+ click "Join"  
Page-\>\>Service: joinGroup(code)  
Service-\>\>API: POST /api/groups/join {code}  
API-\>\>DB: Validate code \+ load group join policy

alt Approval required  
 DB--\>\>API: Group found (approvalRequired=true)  
 API-\>\>DB: Create membership status=PENDING  
 API--\>\>Service: JoinResult=PENDING  
 Service--\>\>Page: Show "Request sent"  
else Auto join  
 DB--\>\>API: Group found (approvalRequired=false)  
 API-\>\>DB: Create membership status=ACTIVE  
 API--\>\>Service: JoinResult=ACTIVE  
 Service--\>\>Page: Show "Joined successfully"  
end

![][image25]

### **2.5.2. Sequence diagrams for teacher functions**

Teachers are responsible for content creation and exam monitoring. These diagrams show the workflow for creating a new assessment and monitoring an ongoing exam session.

#### **2.5.2.1. Question Bank Management Sequence Diagram**

Teachers create and manage question banks to organize assessment content. This involves creating banks and adding questions to them.

\`\`\`mermaid  
sequenceDiagram  
 autonumber  
 actor Teacher  
 participant UI as QuestionBank Page  
 participant Service as QuestionBankService  
 participant API as Backend API  
 participant DB as Database

    Teacher-\>\>UI: Create New Bank
    activate UI
    UI-\>\>Service: createBank(name, description)
    activate Service
    Service-\>\>API: POST /api/question-banks
    activate API
    API-\>\>DB: Insert Bank Record
    activate DB
    DB--\>\>API: Bank ID
    deactivate DB
    API--\>\>Service: Bank Details
    deactivate API
    Service--\>\>UI: Show Bank Details
    deactivate Service

    Teacher-\>\>UI: Add Question to Bank
    UI-\>\>Service: addQuestion(bankId, questionData)
    activate Service
    Service-\>\>API: POST /api/question-banks/{id}/questions
    activate API
    API-\>\>DB: Insert Question
    activate DB
    DB--\>\>API: Success
    deactivate DB
    API--\>\>Service: Success
    deactivate API
    Service--\>\>UI: Update Question List
    deactivate Service
    deactivate UI

\`\`\`  
![][image26]

#### **2.5.2.2. Create Assessment Sequence Diagram**

This flow depicts a teacher configuring a new exam, including setting time limits, adding questions, and publishing it.

\`\`\`mermaid  
sequenceDiagram  
 autonumber  
 actor Teacher  
 participant UI as TeacherDashboard  
 participant Service as AssessmentService  
 participant API as Backend API  
 participant DB as Database

    Teacher-\>\>UI: Click "Create Assessment"
    activate UI
    UI-\>\>UI: Fill Exam Details (Title, Duration, Settings)
    Teacher-\>\>UI: Add Questions (from Bank or New)
    Teacher-\>\>UI: Click "Publish"

    UI-\>\>Service: createAssessment(data)
    activate Service
    Service-\>\>API: POST /api/assessments
    activate API
    API-\>\>DB: Insert Assessment & Questions
    activate DB
    DB--\>\>API: Success
    deactivate DB
    API--\>\>Service: Created Assessment ID
    deactivate API
    Service--\>\>UI: Show Success Message
    deactivate Service
    deactivate UI

\`\`\`  
![][image27]

#### **2.5.2.3. Monitor Exam (Proctoring) Sequence Diagram**

During an exam, teachers can monitor student status in real-time. This involves receiving updates about student connectivity and potential violations.

\`\`\`mermaid  
sequenceDiagram  
 autonumber  
 actor Teacher  
 participant UI as MonitoringDashboard  
 participant Service as ProctoringService  
 participant SSE as SSE Connection  
 participant API as Backend API

    Teacher-\>\>UI: Open Monitoring Dashboard
    activate UI
    UI-\>\>Service: connectToExamRoom(examId)
    activate Service
    Service-\>\>SSE: Establish SSE Connection
    activate SSE

    loop Real-time Updates
        API--\>\>SSE: Push Event (Student Joined)
        SSE--\>\>Service: Event Data
        Service--\>\>UI: Update Student List

        API--\>\>SSE: Push Event (Violation Detected)
        SSE--\>\>Service: Alert Data
        Service--\>\>UI: Show Violation Alert
    end

    deactivate SSE
    deactivate Service
    deactivate UI

\`\`\`  
![][image28]

#### **2.5.2.4. Teacher assigns/publishes a Test to a Group → all members get notified**

This sequence shows how a teacher publishes a test to a group. The database stores the “group-assessment assignment” so all group members can see it (and notifications can be handled elsewhere).

\---

config:

theme: default

\---

sequenceDiagram

autonumber

actor Teacher

participant Page as TeacherDashboard

participant Service as GroupService

participant API as Backend API

participant DB as Database

Teacher\-\>\>Page: Select group \+ click "Publish Test"

Page\-\>\>Service: publishTestToGroup(groupId, testId, settings)

Service\-\>\>API: POST /api/groups/{groupId}/assignments {testId, settings}

API\-\>\>DB: Insert GroupAssessmentAssignment (PUBLISHED)

API\-\>\>DB: Query active members for groupId (for targeting)

DB\--\>\>API: memberUserIds\[\]

API\--\>\>Service: PublishResult(success)

Service\--\>\>Page: Show success message

### **![][image29]**

#### **2.5.2.5. Teacher views Group scores (total \+ list)**

This sequence shows the teacher opening a scoreboard view: overall stats \+ per-student row list.

sequenceDiagram

autonumber

actor Teacher

participant Page as GroupScoreboardPage

participant Service as GroupService

participant API as Backend API

participant DB as Database

Teacher-\>\>Page: Open Group Scoreboard (groupId, testId)

Page-\>\>Service: getScoreboard(groupId, testId)

Service-\>\>API: GET /api/groups/{groupId}/tests/{testId}/scoreboard

API-\>\>DB: Load group members \+ their submissions/scores

DB--\>\>API: totalStats \+ scoreList

API--\>\>Service: totalStats \+ scoreList

Service--\>\>Page: Render totals \+ score table

###

### **![][image30]**

### **2.5.3. Sequence diagrams for administrator functions**

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

\`\`\`mermaid  
sequenceDiagram  
 autonumber  
 actor Admin as Administrator  
 participant UI as UserManagement Page  
 participant Service as UserService  
 participant API as Backend API  
 participant DB as Database

    Admin-\>\>UI: Access User Management Page
    activate UI
    UI-\>\>Service: getUsers(params)
    activate Service

    Note right of UI: params include page, size, filters

    Service-\>\>API: GET /api/users
    activate API

    API-\>\>DB: Query Users
    activate DB
    DB--\>\>API: Return User Data
    deactivate DB

    API--\>\>Service: UserListResponse (users, total)
    deactivate API

    Service--\>\>UI: User\[\]
    deactivate Service

    UI--\>\>Admin: Display User List
    deactivate UI

\`\`\`  
![][image31]  
**_Figure 2.X. Sequence diagram for View User List function_**

#### **2.5.3.2. Search Users Sequence Diagram**

To effectively manage a growing user base, administrators require the ability to search for specific individuals. The "Search Users" function allows for filtering based on criteria such as name or email address.

**Operational Flow**:

1. **Search Input**: The Administrator enters a search query (e.g., a name or email) into the search bar on the User Management Page.
2. **Service Request**: The UI triggers a \`searchUsers\` call to the \`UserService\` with the query string.
3. **API Request**: The \`UserService\` sends a request to the search endpoint (\`GET /api/users/search\`) with the query parameter.
4. **Filtered Query**: The Backend API constructs a database query using the search criteria (e.g., \`WHERE name LIKE %query%\`).
5. **Result Retrieval**: The Database returns the matching user records.
6. **UI Update**: The UI updates the user list to display only the records that match the search criteria.

\`\`\`mermaid  
sequenceDiagram  
 autonumber  
 actor Admin as Administrator  
 participant UI as UserManagement Page  
 participant Service as UserService  
 participant API as Backend API  
 participant DB as Database

    Admin-\>\>UI: Enter Search Query (e.g., "Nguyen")
    activate UI

    UI-\>\>Service: searchUsers(query)
    activate Service

    Service-\>\>API: GET /api/users/search?q=query
    activate API

    API-\>\>DB: Query Users (WHERE name LIKE %query%)
    activate DB
    DB--\>\>API: Return Matching Users
    deactivate DB

    API--\>\>Service: UserListResponse
    deactivate API

    Service--\>\>UI: Filtered User\[\]
    deactivate Service

    UI--\>\>Admin: Update User List Display
    deactivate UI

\`\`\`  
![][image32]  
**_Figure 2.Y. Sequence diagram for Search Users function_**

These sequence diagrams illustrate the separation of concerns within the system architecture, highlighting the interaction between the Presentation Layer (UI), Business Logic Layer (Service), and Data Access Layer (API/Database). This layered approach ensures maintainability and scalability of the administrator functions.

## **2.6. Database design** {#2.6.-database-design}

### **2.6.1. Information of tables in the database.**

### **2.6.2. Database schema of the system.**

## **2.7. Microservices architecture implementation** {#2.7.-microservices-architecture-implementation}

### **2.7.1. Overview**

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

### **2.7.2. System Components**

![][image33]

#### **Core Microservices**

**Assessment Service (GoLang)**

The Assessment Service serves as the central business logic hub for examination management. It handles complete lifecycle management of assessments, supports multiple question types (multiple choice, true/false, essay, fill-in-blank, matching, ordering), manages question banks with sharing capabilities, provides automated grading for objective questions, and tracks student attempts with time limits.

| Aspect     | Details                                                                                                                                                                                                                               |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Technology | GoLang 1.24+, Gin, GORM                                                                                                                                                                                                               |
| Database   | PostgreSQL                                                                                                                                                                                                                            |
| Tables     | users, assessments, assessment_settings, questions, question_categories, question_banks, question_bank_shares, question_bank_questions, assessment_questions, assessment_attempts, student_answers, question_attachments, import_jobs |

**Proctoring Service (GoLang)**

The Proctoring Service provides real-time examination monitoring using AI-powered detection via MediaPipe. It detects violations such as face not detected, multiple faces, looking away, mouth open, hand detected, tab switching, copy/paste, and fullscreen exit. Each violation is classified by severity (Low, Medium, High, Critical) with confidence scoring.

| Aspect     | Details                                                                                                           |
| :--------- | :---------------------------------------------------------------------------------------------------------------- |
| Technology | GoLang, Gin, sqlx, Uber-FX                                                                                        |
| Database   | TimescaleDB (PostgreSQL extension)                                                                                |
| Tables     | violation_logs (hypertable with 1-day chunks)                                                                     |
| Features   | Automatic compression after 7 days (90-95% savings), continuous aggregates for analytics, 90-day retention policy |

**Identity Verification Service (Python)**

The Identity Verification Service handles biometric authentication using face recognition technology. It provides face registration, 1:1 verification, 1:N identification, and liveness detection (passive and active challenges).

| Aspect      | Details                                                             |
| :---------- | :------------------------------------------------------------------ |
| Technology  | Python 3.10+, FastAPI, InspireFace                                  |
| Database    | PostgreSQL \+ Redis                                                 |
| Tables      | id_mapping (user_id to alloc_id mapping for InspireFace FeatureHub) |
| Performance | 99.5% accuracy, 150-250ms latency, 40-60 req/s                      |

**Notification Service (Java)**

The Notification Service manages all system communications through multiple delivery channels including email (SMTP) and real-time SSE (Server-Sent Events). It features a template engine with placeholder syntax, bulk notification processing, and user preference management.

| Aspect     | Details                                                         |
| :--------- | :-------------------------------------------------------------- |
| Technology | Java, Spring Boot 3.x, Spring Security OAuth2                   |
| Database   | PostgreSQL                                                      |
| Tables     | notification_templates, notifications, notification_preferences |
| Channels   | EMAIL, SSE (real-time browser notifications)                    |

**Identity Service (Casdoor \- External)**

The Identity Service utilizes Casdoor as an external OAuth2/OIDC provider for centralized authentication and authorization. It handles user registration, multi-factor authentication, role-based access control (Student, Teacher, Admin), JWT token issuance, and organizational hierarchy management.

| Aspect     | Details                                                                                            |
| :--------- | :------------------------------------------------------------------------------------------------- |
| Technology | Casdoor (External SaaS)                                                                            |
| Database   | PostgreSQL                                                                                         |
| Tables     | user, role, permission, organization, application, token, session, verification_record, and others |

#### **Database Architecture Summary**

| Service               | Database             | Key Tables                                                                   |
| :-------------------- | :------------------- | :--------------------------------------------------------------------------- |
| Assessment Service    | PostgreSQL           | assessments, questions, question_banks, assessment_attempts, student_answers |
| Proctoring Service    | TimescaleDB          | violation_logs (hypertable)                                                  |
| Identity Verification | PostgreSQL \+ Redis  | id_mapping, face embeddings (cached)                                         |
| Notification Service  | PostgreSQL           | notification_templates, notifications, notification_preferences              |
| Session Service       | PostgreSQL           | user_sessions, assessment_sessions, session_activities                       |
| Identity Service      | PostgreSQL (Casdoor) | user, role, permission, token, session                                       |

### **2.7.3. Applying Technologies to the System**

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

### **2.7.4. Selecting Appropriate Technologies**

#### **Technology Selection Matrix**

| Component            | Options Considered                | Selected         | Rationale                                                                              |
| :------------------- | :-------------------------------- | :--------------- | :------------------------------------------------------------------------------------- |
| Core Backend         | GoLang, Node.js, Java             | GoLang           | High performance, low memory footprint, excellent concurrency for real-time processing |
| Notification Backend | GoLang, Java Spring               | Java Spring Boot | Mature SSE support via WebFlux, rich ecosystem for email and templating                |
| Face Recognition     | OpenCV, Dlib, InspireFace         | InspireFace      | High accuracy (99.5%), CPU-optimized, production-ready FeatureHub                      |
| Time-Series Database | InfluxDB, TimescaleDB, PostgreSQL | TimescaleDB      | SQL compatibility, 90-95% compression, continuous aggregates, PostgreSQL ecosystem     |
| Event Streaming      | Kafka, RabbitMQ, Redis Streams    | Redis Streams    | Cost-effective (reuses existing Redis), simpler operations, sufficient throughput      |
| Authentication       | Custom JWT, Keycloak, Casdoor     | Casdoor          | Lightweight, easy integration, full OAuth2/OIDC support, reduces complexity            |

#### **Trade-offs Analysis**

| Decision                  | Advantages                                                                 | Disadvantages                                |
| :------------------------ | :------------------------------------------------------------------------- | :------------------------------------------- |
| GoLang for core services  | Fast compilation, low resource usage, strong typing, excellent concurrency | Smaller talent pool compared to Java/Node.js |
| TimescaleDB over InfluxDB | Standard SQL queries, PostgreSQL ecosystem, automatic compression          | Requires PostgreSQL knowledge                |
| Redis Streams over Kafka  | No extra infrastructure, significant cost savings, simpler operations      | Lower theoretical throughput ceiling         |
| InspireFace (CPU mode)    | No GPU infrastructure costs, sufficient accuracy for use case              | Slower inference compared to GPU             |
| Casdoor (External)        | Reduces authentication complexity, managed OAuth2/OIDC                     | External dependency, less customization      |

---

### **2.7.5. Choosing Communication Methods Between Microservices**

#### **Communication Patterns Overview**

The system employs three primary communication patterns based on specific use case requirements.

#### **![][image34]Pattern Selection Criteria**

| Pattern               | Technology      | When to Use                                                            | Examples                                               |
| :-------------------- | :-------------- | :--------------------------------------------------------------------- | :----------------------------------------------------- |
| Synchronous (REST)    | HTTP/HTTPS APIs | Immediate response required, CRUD operations, user-facing requests     | Login, create assessment, submit answer, fetch results |
| Asynchronous (Events) | Redis Streams   | Background processing, loose coupling, eventual consistency acceptable | Send notifications, log violations, update analytics   |
| Real-time Push        | SSE             | Server-initiated updates to browser, live monitoring                   | Proctoring alerts, instant notifications to teachers   |

#### **Redis Streams Architecture**

The system uses Redis Streams with consumer groups for reliable, scalable event processing.

#### **![][image35]Event Types and Routing**

| Event Type           | Source Service     | Target Service       | Communication | Purpose                  |
| :------------------- | :----------------- | :------------------- | :------------ | :----------------------- |
| user.registered      | Identity Service   | Notification Service | Redis Streams | Welcome email            |
| assessment.published | Assessment Service | Notification Service | Redis Streams | Notify enrolled students |
| assessment.expired   | Assessment Service | Notification Service | Redis Streams | Reminder notifications   |
| proctoring.violation | Proctoring Service | Notification Service | Redis Streams | Alert proctors           |
| session.completed    | Session Service    | Notification Service | Redis Streams | Send results             |

### **2.7.6. Designing a Hybrid Monolithic/Microservice System**

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

#### **Benefits of Hybrid Approach**

The hybrid architecture provides several advantages for the current stage of development. First, it offers reduced complexity by avoiding microservice overhead for components that do not require it. Second, it enables faster development since modules can share code, deployment pipelines, and infrastructure. Third, it is cost effective because fewer services means lower infrastructure and operational costs. Fourth, it maintains clear boundaries by deploying microservices where truly needed for scaling or technology diversity. Finally, the architecture is evolution ready, allowing modules to be extracted into microservices when growth demands it.

## **2.8. Frontend Architecture** {#2.8.-frontend-architecture}

The frontend application follows a modular, feature-based architecture that promotes separation of concerns, code reusability, and maintainability. The project structure organizes code by technical responsibility while grouping related functionality together.

### **2.8.1. Project Structure and Module Organization**

#### **Root Directory Structure**

The source code is organized under the `src/` directory with clear separation between different architectural layers:

```
src/
├── pages/           # Page-level components (route destinations)
├── components/      # Reusable UI components
├── services/        # API communication layer
├── hooks/           # Custom React hooks
├── contexts/        # React Context providers
├── providers/       # Application-wide providers
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── config/          # Application configuration
├── i18n/            # Internationalization resources
├── theme/           # Design tokens and theming
├── workers/         # Web Workers for background processing
├── styles/          # Global stylesheets
├── App.tsx          # Root component with routing
└── main.tsx         # Application entry point
```

#### **Pages Module**

The `pages/` directory contains 12 feature modules, each representing a distinct functional area of the application:

| Module        | Files | Purpose                                 |
| ------------- | ----- | --------------------------------------- |
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

Each page module follows a consistent internal structure. Complex modules like `Exam/` contain their own subdirectories for components, hooks, and utilities, creating self-contained feature units.

#### **Component Architecture**

The `components/` directory (31 items) contains shared, reusable UI components organized by functionality:

- **Layout Components**: `Layout/`, `AnimatedPage/` for page structure
- **Data Display**: `DataTable/`, `StatCard/`, `StatusBadge/`
- **Forms & Inputs**: `FormDrawer/`, `Questions/`
- **Navigation & Auth**: `ProtectedRoute/`, `RoleBasedRedirect/`
- **Feature Components**: `Proctoring/`, `NotificationDropdown/`, `SettingsModal/`

This separation ensures page components remain focused on business logic while delegating presentation to reusable building blocks.

#### **Type System**

TypeScript type definitions are centralized in the `types/` directory:

- **index.ts** (20KB): Core domain types including User, Assessment, Question, Attempt, Group, and API response types. Defines over 50 interfaces covering all data models.
- **proctoring.ts** (7KB): Specialized types for the proctoring system including violation events, detection states, and analytics data.

Strong typing throughout the application enables compile-time error detection, improves IDE support, and serves as living documentation for data structures.

#### **Module Dependencies**

The architecture enforces a unidirectional dependency flow to prevent circular imports and maintain clean boundaries:

```
pages → components → hooks → services → config
                ↓
         contexts/providers
                ↓
              types
```

This hierarchy ensures that lower-level modules (services, types) remain independent of higher-level concerns (pages, components), promoting testability and reusability across the application.

### **2.8.2. Component Design Pattern**

The frontend implements a layered component architecture that separates concerns between container components (smart) and presentational components (dumb), following React best practices.

#### **Page Components (Container Layer)**

Page components serve as the entry points for each route and are responsible for:

- **Data Fetching**: Using React Query hooks to fetch and cache server data
- **State Coordination**: Managing local UI state and coordinating between child components
- **Layout Composition**: Assembling the page structure from reusable components
- **Route Protection**: Implementing access control via `ProtectedRoute` wrapper

Example structure of a typical page component:

```
pages/Groups/
├── GroupList.tsx           # Main list view with filtering
├── GroupDetail.tsx         # Single group view with tabs
├── GroupAssessmentsTab.tsx # Tab component for assessments
├── GroupProctoringTab.tsx  # Tab component for proctoring
├── GroupGradingTab.tsx     # Tab component for grading
├── JoinGroupPage.tsx       # Student join flow
└── GenerateInviteLinkModal.tsx # Modal for invite generation
```

#### **Shared Components (Presentational Layer)**

Shared components in `components/` are designed to be:

- **Stateless**: Receive data via props, emit events via callbacks
- **Reusable**: Generic enough to be used across multiple pages
- **Styled**: Encapsulate their own CSS using CSS Modules
- **Accessible**: Follow WCAG guidelines with proper ARIA attributes

#### **Route Protection Pattern**

The application implements role-based access control through wrapper components:

- **ProtectedRoute**: Ensures user is authenticated, redirects to login if not
- **RoleBasedRedirect**: Redirects users to appropriate dashboard based on their role (Student → StudentDashboard, Teacher → TeacherDashboard)
- **Permission Checks**: Components conditionally render based on user permissions

#### **Routing Architecture**

The application uses `react-router-dom` with a nested route structure organized by user role:

| Route Group | Access                     | Example Routes                                  |
| ----------- | -------------------------- | ----------------------------------------------- |
| Public      | Anyone                     | `/login`, `/callback`                           |
| Admin       | Admin only                 | `/dashboard`, `/users`, `/groups`               |
| Teacher     | Admin, Teacher             | `/assessments`, `/questions`, `/question-banks` |
| Student     | All authenticated          | `/student/*`                                    |
| Exam        | Protected, separate layout | `/student/take/:attemptId`                      |

The routing implements two layout patterns:

- **MainLayout**: Standard navigation with sidebar for all management pages
- **ExamLayout**: Minimal distraction-free layout for exam-taking without navigation

#### **Error Boundary Pattern**

The `ErrorBoundary` component wraps the application to catch React errors gracefully, displaying a fallback UI instead of crashing the entire application. This ensures users see a helpful error message and can navigate away from broken states.

### **2.8.3. State Management Strategy**

The application employs a hybrid state management approach that distinguishes between server state and client state, using the most appropriate tool for each.

#### **Server State: React Query**

TanStack React Query manages all data fetched from the backend APIs. Key patterns include:

- **Query Keys**: Structured keys like `['groups', groupId, 'members']` enable precise cache invalidation
- **Stale-While-Revalidate**: Data is served from cache immediately while refreshing in the background
- **Optimistic Updates**: UI updates immediately on mutations, rolling back on failure
- **Automatic Refetching**: Data refreshes on window focus and network reconnection

Query configuration in `QueryProvider.tsx`:

```typescript
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			gcTime: 30 * 60 * 1000, // 30 minutes
			retry: 3,
			refetchOnWindowFocus: true,
		},
	},
});
```

#### **Client State: React Context**

React Context API manages global client-side state that doesn't come from the server:

- **AuthContext**: Current user, authentication status, login/logout functions
- **ThemeContext**: Light/dark mode preference, theme tokens
- **NotificationContext**: Toast notifications, unread count

Context providers are composed at the application root in `App.tsx` following a specific nesting order that ensures proper dependency resolution:

```
ErrorBoundary
  └── ThemeProvider          (theme state)
        └── AntdApp          (Ant Design context)
              └── NotificationProvider  (toast system)
                    └── QueryProvider   (React Query)
                          └── AuthProvider   (user state)
                                └── SettingsModalProvider
                                      └── BrowserRouter  (routing)
```

This hierarchy ensures that inner providers can access outer provider values. For example, `QueryProvider` can display error toasts via `NotificationProvider`, and `AuthProvider` can use React Query for user data fetching.

#### **Local Component State**

For UI-specific state that doesn't need to be shared (form inputs, modal visibility, loading states), components use `useState` and `useReducer` hooks directly. This keeps state close to where it's used and avoids unnecessary global state pollution.

#### **Why Not Redux?**

The decision to avoid Redux was intentional:

- React Query handles 90% of state management needs (server data)
- Context API is sufficient for the remaining global UI state
- Reduced bundle size and boilerplate code
- Simpler mental model for developers

### **2.8.4. API Layer Design (Services Pattern)**

The frontend implements a service layer pattern that abstracts all HTTP communication behind strongly-typed service modules.

#### **Service Structure**

Each domain area has a dedicated service file in `services/`:

| Service                         | Purpose                                  |
| ------------------------------- | ---------------------------------------- |
| `assessmentService.ts`          | Assessment CRUD, publishing, statistics  |
| `questionService.ts`            | Question management, filtering, import   |
| `questionBankService.ts`        | Question bank CRUD, sharing              |
| `groupService.ts`               | Group management, membership             |
| `inviteLinkService.ts`          | Invite code/link generation, validation  |
| `attemptService.ts`             | Exam attempts, answer submission         |
| `gradingService.ts`             | Manual grading, score updates            |
| `proctoringDashboardService.ts` | Real-time proctoring data, SSE streams   |
| `faceVerificationService.ts`    | Face registration and verification       |
| `violationService.ts`           | Violation reporting and retrieval        |
| `userService.ts`                | User search and management               |
| `notificationService.ts`        | Notification preferences, SSE connection |
| `importExportService.ts`        | CSV parsing for question import/export   |

#### **Centralized Configuration**

All API endpoints are defined in `config/api.ts`, providing:

- **Base URLs**: Configurable via environment variables for different environments
- **Endpoint Functions**: Type-safe functions that generate URLs with parameters
- **Timeout Configuration**: Default 30-second timeout for all requests

#### **Axios Instance**

A configured Axios instance provides:

- **JWT Token Injection**: Automatically attaches `Authorization` header
- **Error Handling**: Centralized error transformation via interceptors
- **Request/Response Logging**: Development-mode logging for debugging

#### **Error Handling Pattern**

The `utils/errorHandler.ts` module provides centralized error handling:

- Parses API error responses into user-friendly messages
- Handles network errors, timeouts, and authentication failures
- Triggers appropriate UI notifications via toast system

### **2.8.5. Custom Hooks Pattern**

Custom hooks encapsulate reusable logic, promoting code reuse and separation of concerns across the application.

#### **Hooks Directory Structure**

The `hooks/` directory contains 10 custom hooks:

| Hook                      | Purpose                                           |
| ------------------------- | ------------------------------------------------- |
| `useProctoring.ts`        | MediaPipe integration, violation detection, state |
| `useCamera.ts`            | Camera stream management, permissions             |
| `useAuth.ts`              | Authentication state, login/logout functions      |
| `useNotifications.ts`     | SSE connection, notification handling             |
| `useKeyboardShortcuts.ts` | Global keyboard shortcut registration             |
| `useFullscreen.ts`        | Fullscreen API wrapper for exam mode              |
| `useTimer.ts`             | Countdown timer for exam duration                 |
| `useDebounce.ts`          | Debounced value updates for search inputs         |
| `useLocalStorage.ts`      | Persistent local storage with React state sync    |
| `useMediaQuery.ts`        | Responsive breakpoint detection                   |

#### **Proctoring Hook Architecture**

The `useProctoring` hook is the most complex, managing the AI-powered monitoring system:

```typescript
const { isMonitoring, violations, faceDetected, attentionScore, startMonitoring, stopMonitoring } =
	useProctoring({
		attemptId,
		onViolation: handleViolation,
		config: proctoringConfig,
	});
```

Key responsibilities:

- Initializes Web Worker for MediaPipe processing
- Manages camera stream lifecycle
- Tracks violation events and severity
- Handles GPU/CPU fallback for face detection

#### **Module-Specific Hooks**

Complex page modules define their own hooks within their directory. For example, `pages/Exam/hooks/`:

- `useExam.ts`: Assessment loading, question navigation
- `useQuestion.ts`: Answer state, validation
- `useTimer.ts`: Exam-specific countdown with auto-submit

These module-specific hooks follow the same patterns but are scoped to their feature area, preventing the global hooks directory from becoming bloated.

## **2.9. System design** {#2.9.-system-design}

### **2.9.1. System design for 10,000 concurrent users and resource allocation**

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
    - You already include Datadog \+ K6 load testing in the stack; use K6 to validate the sizing assumptions and tune HPA thresholds.

### **2.9.2. System sizing**

### **2.9.3. Calculation of system operation costs**

## **2.10. Chapter 2 conclusion** {#2.10.-chapter-2-conclusion}

# **CHAPTER 3: APPLICATION DEPLOYMENT** {#chapter-3:-application-deployment}

## **3.1. Tools** {#3.1.-tools}

### **3.1.1. Tools used**

### **3.1.2. Supporting libraries**

## **3.2. Installation results** {#3.2.-installation-results}

### **3.2.1. System deployment and packaging into images (using Docker)**

### **3.2.2. Deploying the system on Kubernetes (K8s)**

### **3.2.3. Implementing the CI/CD pipeline**

### **3.2.4. Deploying tracing and monitoring tools**

### **3.2.5. Deploying the Mediapipe system on the client side**

## **3.3. Applying production standards to the product** {#3.3.-applying-production-standards-to-the-product}

## **3.4. Functional and non-functional testing (performance testing)** {#3.4.-functional-and-non-functional-testing-(performance-testing)}

## **3.5. Issues related to cheating/fraud & methods to disable monitoring** {#heading}

### **3.5.1. Disable copy/paste restrictions / tracking (Mediapipe-related)** {#heading}

### **3.5.2. Forge/proxy requests (manipulated results)** {#heading}

### **3.5.3. Multi-camera monitoring problem** {#heading}

### **3.5.4. Proposed solutions / mitigations**

## {#heading}

#

#

#

#

#

#

#

#

# **CONCLUSION** {#conclusion}

## **1\. Summary of the implemented content** {#1.-summary-of-the-implemented-content}

## **2\. Achievements and limitations of the system** {#2.-achievements-and-limitations-of-the-system}

## **3\. The direction of future development** {#3.-the-direction-of-future-development}

#

# **REFERENCES** {#references}

\[1\] W3schools: [https://www.w3schools.com/](https://www.w3schools.com/)  
\[2\] Momo developer: [https://developers.momo.vn/v3/vi/docs/payment/onboarding/test-instructions/](https://developers.momo.vn/v3/vi/docs/payment/onboarding/test-instructions/)  
\[3\] WikipediA\[Online\]: [https://en.wikipedia.org/wiki/Graph_neural_network](https://en.wikipedia.org/wiki/Graph_neural_network)
