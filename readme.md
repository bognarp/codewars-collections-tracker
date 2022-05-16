### Adding your own collections

If you'd like to use your custom CodeWars collection list, you need to clone the repo and have Node already installed.

1. Add CodeWars collection urls directly to [`collection-urls.json`](js%5Cscraper%5Ccollection-urls.json) (`section` attribute is optional).

2. Run `npm run scrape` to scrape the kata ids from the collection urls.

3. Launch a local http(s) server like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
