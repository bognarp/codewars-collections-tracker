import collectionObj from './collection-urls.json' assert { type: 'json' };
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'fs';

const getCollectionTitle = (url) => {
  const urlArray = url.split('/');
  return urlArray[urlArray.length - 1];
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const fetchData = async (url) => {
  return fetch(url)
    .then((response) => response.text())
    .then((data) => {
      return data;
    });
};

function objectsEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

const scrapeCollectionsKataIds = () => {
  console.log('...Reading URLs from ./collection-url.json...');

  fs.readFile(
    './js/scraper/collection-katas.json',
    'utf8',
    async (err, data) => {
      if (err) {
        console.log(`Error reading file from disk: ${err}`);
      } else {
        const katasJSON = JSON.parse(data);
        console.log('...Scraping kata ids from collection URLs...');
        await asyncForEach(collectionObj, async (obj) => {
          const collectionsRawData = await fetchData(obj.url);

          let collection = {
            section: obj.section,
            title: getCollectionTitle(obj.url),
            katas: [],
          };

          const parsedCollection = cheerio.load(collectionsRawData);
          const collectionKatas = parsedCollection('.list-item-kata');

          Array.from(collectionKatas).forEach((kata) =>
            collection.katas.push({
              id: kata.attribs.id,
              title: kata.attribs['data-title'],
            })
          );

          if (
            !katasJSON.some((existingCollection) =>
              objectsEqual(existingCollection, collection)
            )
          ) {
            katasJSON.push(collection);
          }
        });

        console.log('...Writing Data to ./collection-katas.json...');
        fs.writeFile(
          './js/scraper/collection-katas.json',
          JSON.stringify(katasJSON, null, 2),
          (err) => {
            if (err) {
              console.log(`Error writing file: ${err}`);
            }
          }
        );
      }
    }
  );
};

scrapeCollectionsKataIds();
