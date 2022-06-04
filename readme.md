## Codewars Collections Progress Tracker

Made for tracking progress over Codewars collections. Unfortunately the Codewars API doesn't have a specific endpoint for collections, so you have to scrape the challenges from the collections page. The challenge data is fetched from a pre scraped [`json file`](js/scraper/collection-katas.json).

### How to scrape & add your own Codewars collections

If you'd like to track your own custom Codewars collection list, you need to clone the repo and have Node already installed.

1. Add your Codewars collection urls directly to [`collection-urls.json`](js/scraper/collection-urls.json) the `section` attribute is optional it's just for convenience.

2. Run `npm run scrape` to scrape the kata ids from your collection urls.

3. Serve the files on a local http(s) server like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

4. Profit?
