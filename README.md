# ContentStack News Intelligence Backend


Backend service for the Techsurf 2025 Build & Pitch Challenge project.
This service ingests news articles from Contentstack webhooks, enriches them with vector embeddings, and exposes powerful search & suggestion APIs.
## Related Repositories

- [Frontend UI](https://github.com/AakashShah07/Content_stack_UI)
    :  React-based interface to browse, search, and visualize the news feed.

- [News Updater](https://github.com/AakashShah07/News-Updates) : Scheduled service that fetches & pushes topic/country news to the backend.

## Features
Features
* Real-time Contentstack Integration

* Webhook endpoint automatically stores or updates news entries in MongoDB.

* Vector-based Semantic Search

* Uses MongoDB Atlas Vector Search with sentence-transformer (all-MiniLM-L6-v2) for high-quality, semantic matching.

* Automated Topic & Country Feeds

* Periodic tasks fetch curated topic/country news every 30 minutes.

* RESTful API Endpoints

* Search, latest entries, advanced suggestions, and more.


## Tech StackTech Stack
* Runtime : Node.js + Express

* Database: MongoDB Atlas (Vector Search)

* MySQL - Relational database management system

* Content Platform: Contentstack (Webhooks + Delivery/Management APIs)

* AI/ML: @xenova/transformers (sentence embeddings)

* CORS - Cross-Origin Resource Sharing middleware


## SetUp Instructions

### Project Structure

```bash
contentStack_backend/
├── index.js                # Express server & scheduled tasks
├── routes/
│   ├── entriesRoute.js
│   ├── searchRoute.js
│   ├── webhookRoute.js     # Contentstack webhook handler
│   ├── autoSuggRoute.js
│   └── latestEntryRoute.js
├── api_endPoints/
│   ├── management/entries.js
│   └── search/methods.js   # MongoDB Vector Search logic
├── Memory_uploading.mjs/
│   ├── embednews.mjs
│   ├── memory.mjs
│   └── testSearch.mjs
└── Model/
    └── newsModel.js

```

### Environment Variables

```bash
CONTENTSTACK_API_KEY=your_api_key
CONTENTSTACK_ENVIRONMENT=test_env
DELIVERY_TOKEN=your_delivery_token
MANAGEMENT_TOKEN=your_management_token
MONGODB_URI=your_mongodb_uri
BASE_URL=eu-api.contentstack.com
OPEN_ROUTER_KEY=your_openrouter_key
NEWS_API_KEY=your_newsapi_key
PORT=3000

```

### Local Setup

```bash
# 1. Clone repository
git clone https://github.com/<your-username>/contentStack_backend.git
cd contentStack_backend

# 2. Install dependencies
npm install

# 3. Add environment variables
cp .env.example .env    # then edit with your values

# 4. Run development server
npm start
# Server runs on http://localhost:3000

```


## API Reference




| Method | Endpoint | Description |
| :----- | :------- | :---------- |
| `POST` | `/webhook` | Receives Contentstack webhook payload & stores vector embeddings |
| `GET`  | `/entries` | Fetch all entries (basic listing) |
| `GET`  | `/search?query=<text>` | Semantic search across news content |
| `GET`  | `/latest-entries` | Latest news entries |
| `GET`  | `/advanced-suggestions?query=<q>` | AI-powered auto suggestions |

#### Common Header

| Parameter  | Type     | Description                    |
| :--------- | :------- | :----------------------------- |
| `api_key`  | `string` | **Required**. Your API key sent as `Authorization: Bearer <api_key>` |

#### `/webhook` (POST)

| Parameter | Type   | Description |
| :-------- | :----- | :---------- |
| `payload` | `JSON` | **Required**. Raw Contentstack webhook payload |

#### `/entries` (GET)

_No query parameters required._  
Returns a list of all stored entries.

#### `/search` (GET)

| Parameter | Type     | Description                                  |
| :-------- | :------- | :------------------------------------------- |
| `query`   | `string` | **Required**. Text to run semantic search on. |

#### `/latest-entries` (GET)

_No parameters._  
Fetches the most recent entries.

#### `/advanced-suggestions` (GET)

| Parameter | Type     | Description                                  |
| :-------- | :------- | :------------------------------------------- |
| `query`   | `string` | **Required**. Text to generate AI suggestions |





## Scheduled Tasks

fetchTopicAndCountryNews runs every 30 minutes to keep the dataset fresh by calling:

 * https://news-updates-sooty.vercel.app/push-topic-news

*  https://news-updates-sooty.vercel.app/push-country-news


## Contribution Guidelines

* Fork the repo & create a feature branch: git checkout -b feature/your-feature

* Commit changes with descriptive messages.

* Open a pull request for review.
## Support

Made with ❤️ for Techsurf 2025 Hackathon

Developer: [Aakash Shah](https://github.com/AakashShah07)

