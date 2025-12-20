# Project_Red_Queen
An AI Agent that uses RAG principles to educate users of Resident Evil Lore.

--

12/20/25 Entry

To build a high-quality RAG (Retrieval-Augmented Generation) system for Resident Evil, you need to solve two problems: getting the massive amount of "legacy" lore and capturing the rapid updates for upcoming titles like **Resident Evil 9: Requiem** (expected early 2026).

The most effective method is a **Hybrid Ingestion Pipeline** combining a Wiki-scraper with a News-monitor.

---

### 1. The "Lore Core": Scraping the Wiki

The **Resident Evil Fandom Wiki** is the gold standard. It contains over 30,000 pages of data. Don't scrape it manually; use a specialized tool that converts HTML to **Markdown**, which is the preferred format for LLMs because it preserves headers and tables.

* **Best Tool:** [Firecrawl](https://www.firecrawl.dev/) or [Jina Reader](https://jina.ai/reader/). These tools crawl the wiki and output clean Markdown.
* **The Strategy:** Focus on the "Canon" category. Use **LlamaIndex** with a `ScrapflyReader` to automate the crawling of the [Resident Evil Timeline](https://residentevil.fandom.com/wiki/Timeline) page and all its sub-links.
* **Cleaning:** Wikis often have "Trivia" or "Non-Canon" sections. In your Python processing script, use a simple regex to strip out sections labeled "Gallery," "Trivia," or "Merchandise" to keep your RAG's context window focused on actual lore.

---

### 2. The "Update Layer": News & Trailers

Because the series is currently in a "hype cycle" for **Resident Evil 9: Requiem**, standard wiki data will be months behind.

* **Source:** [Resident Evil Official X (Twitter)](https://x.com/RE_Games) and [Capcom’s Press Site](https://www.google.com/search?q=https://press.capcom.com/).
* **Method:** Use a **YouTube Transcript Scraper** for the latest "Resident Evil Showcase" or "Game Awards 2025" trailers. This captures info on new characters like **Grace Ashcroft** and the return of **Leon S. Kennedy**.
* **Specific 2025 Context:** Ensure your RAG knows that *Requiem* takes place 30 years after the Raccoon City incident and features a "dual gameplay" style (Grace for horror, Leon for action).

---

### 3. Implementation in Python (Django-Friendly)

To integrate this into your Django app, use **ChromaDB** (local) or **Pinecone** (cloud) to store the vectors.

```python
import ollama
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

# 1. Load your scraped Markdown files
documents = SimpleDirectoryReader("./resident_evil_data/").load_data()

# 2. Create the index (using Gemma or Llama 3)
index = VectorStoreIndex.from_documents(documents)

# 3. Query with a specific 'Resident Evil' persona
query_engine = index.as_query_engine()
response = query_engine.query("Who is Victor Gideon in Resident Evil Requiem?")
print(response)

```

### 4. Critical Optimization: The "Villain/Virus" Problem

Resident Evil lore is full of exact names (T-Virus, G-Virus, T-Phobos). Standard "semantic search" often gets these mixed up.

* **The Fix:** Use **Hybrid Search**. Combine **Vector Search** (for general lore) with **BM25 Keyword Search** (for specific virus and character names). This ensures that when a user asks about "RE9," the system doesn't accidentally pull data from "RE2."

**Would you like a sample Python script that specifically scrapes a Fandom Wiki page and prepares it for your Django database?**
