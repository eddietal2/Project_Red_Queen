# The 3-Step Strategy

## Method 1: The "Raw Text" Hack (?action=raw)

By appending ?action=raw to any Fandom/MediaWiki URL, you bypass the entire "frontend." This means no ads, no Javascript pop-ups, and no heavy HTML tags.

## Discovery

Use the MediaWiki API to get a list of every page title on the site.

## Extraction 

Loop through those titles and download the content using ?action=raw.

## Ingestion (ChromaDB) 

Take those .txt files, break them into small chunks, and save them in your Vector Database.