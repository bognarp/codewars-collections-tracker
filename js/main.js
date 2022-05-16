function fetchCodewars(username) {
  return fetch(
    `https://www.codewars.com/api/v1/users/${username}/code-challenges/completed?`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

function fetchCollectionKatas(jsonUrl) {
  return fetch(jsonUrl)
    .then((response) => response.json())
    .then((json) => json);
}

async function generateCollections() {
  const ul = document.createElement('ul');
  ul.className = 'results';

  const collectionKatas = await fetchCollectionKatas(
    './js/scraper/collection-katas.json'
  );

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  const thSection = document.createElement('th');
  thSection.textContent = `Section`;
  tr.appendChild(thSection);

  const thSlug = document.createElement('th');
  thSlug.textContent = `Collection`;
  tr.appendChild(thSlug);

  const thKatas = document.createElement('th');
  thKatas.textContent = `Katas`;
  tr.appendChild(thKatas);

  const thDone = document.createElement('th');
  thDone.textContent = `Done`;
  tr.appendChild(thDone);

  const thTodo = document.createElement('th');
  thTodo.textContent = `Todo`;
  tr.appendChild(thTodo);

  thead.appendChild(tr);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  collectionKatas.forEach((kata) => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', kata.title);

    const tdSection = document.createElement('td');
    tdSection.textContent = kata.section;
    tr.appendChild(tdSection);

    const tdSlug = document.createElement('td');
    tdSlug.textContent = kata.title;
    tr.appendChild(tdSlug);

    const tdKatas = document.createElement('td');
    tdKatas.textContent = `${kata.katas.length}`;
    tr.appendChild(tdKatas);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  return table;
}

async function calculateProgress(completedKatas) {
  const collectionKatas = await fetchCollectionKatas(
    './js/scraper/collection-katas.json'
  );

  const collectionProgress = [];

  collectionKatas.forEach((collection) => {
    let progress = {
      title: collection.title,
      done: [],
      todo: [],
    };

    collection.katas.forEach((kata) => {
      const foundKata = completedKatas.find((completed) => {
        return kata.id === completed.id;
      });
      if (foundKata) {
        progress.done.push(foundKata);
      } else {
        progress.todo.push(kata);
      }
    });

    collectionProgress.push(progress);
  });

  return collectionProgress;
}

function renderResults(resultData) {
  resultData.forEach((dataObj) => {
    const tr = document.querySelector(`tr[data-id=${dataObj.title}]`);

    const allKatas = Number(tr.lastChild.textContent);
    const donePercent = ((dataObj.done.length / allKatas) * 100).toFixed(0);

    const tdDone = document.createElement('td');
    tdDone.textContent = `${donePercent}%`;
    tdDone.setAttribute('data-id', 'calculated');
    tr.appendChild(tdDone);

    if (dataObj.todo.length > 0) {
      const tdTodo = document.createElement('td');
      tdTodo.setAttribute('data-id', 'calculated');
      const ul = document.createElement('ul');

      dataObj.todo.forEach((todo) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('href', `https://www.codewars.com/kata/${todo.id}`);
        a.setAttribute('target', '_blank');
        a.textContent = todo.title;
        li.appendChild(a);
        ul.appendChild(li);
      });

      tdTodo.appendChild(ul);
      tr.appendChild(tdTodo);
    }
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded and parsed');

  const collections = await generateCollections();
  const body = document.querySelector('body');
  body.appendChild(collections);

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const username = formData.get('username');

    fetchCodewars(username)
      .then((res) => {
        return calculateProgress(res.data);
      })
      .then((results) => {
        const calulatedTd = Array.from(
          document.querySelectorAll('td[data-id=calculated]')
        );
        calulatedTd.forEach((td) => {
          td.parentNode.removeChild(td);
        });
        renderResults(results);
      });
  });
});
