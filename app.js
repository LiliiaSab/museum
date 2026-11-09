const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selected = { guide: guideChecked, audio: audioChecked, catalog: catalogChecked };
  
  const items = services
    .filter((service) => selected[service.id])
    .map(({ title, price }) => ({ title: title.trim(), price }));
    
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  return { count: items.length, total: total, items: items };
}

const programButton = document.querySelector('#show-program');
const programBlock = document.querySelector('#program');
const form = document.querySelector('#service-form');
const guideCheckbox = document.querySelector('#guide');
const audioCheckbox = document.querySelector('#audio');
const catalogCheckbox = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const resultBlock = document.querySelector('#result');
const reportJsonBlock = document.querySelector('#report-json');

let data;

try {
  data = JSON.parse(sourceJson);
} catch (error) {
  dataError.hidden = false;
  form.hidden = true;
}

programButton.addEventListener('click', () => {
  programBlock.innerHTML = data.event.meeting;
  programBlock.hidden = false;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const report = buildReport(
    data.services,
    guideCheckbox.checked,
    audioCheckbox.checked,
    catalogCheckbox.checked
  );

  if (report.count === 0) {
    choiceError.hidden = false;
    resultBlock.hidden = true;
    reportJsonBlock.hidden = true;
    return;
  }

  choiceError.hidden = true;

  let html = 'Выбрано услуг: ' + report.count + '<br>Итого: ' + report.total + ' руб.';
  report.items.forEach((item) => {
    html += '<br>' + item.title;
  });
  resultBlock.innerHTML = html;

  const jsonString = JSON.stringify(report);
  JSON.parse(jsonString);
  reportJsonBlock.textContent = jsonString;

  resultBlock.hidden = false;
  reportJsonBlock.hidden = false;
});