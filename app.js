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

const eventTitle = document.querySelector('#event-title');
const eventDate = document.querySelector('#event-date');
const eventPlace = document.querySelector('#event-place');
const eventDescription = document.querySelector('#event-description');

const showProgramButton = document.querySelector('#show-program');
const program = document.querySelector('#program');

const serviceForm = document.querySelector('#service-form');

const guideCheckbox = document.querySelector('#guide');
const audioCheckbox = document.querySelector('#audio');
const catalogCheckbox = document.querySelector('#catalog');

const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');

const result = document.querySelector('#result');
const reportJson = document.querySelector('#report-json');

function buildReport(services, guideChecked, audioChecked, catalogChecked) {

    const selectedServices = services.filter(service => {
        return (
            (service.id === 'guide' && guideChecked) ||
            (service.id === 'audio' && audioChecked) ||
            (service.id === 'catalog' && catalogChecked)
        );
    });

    const items = selectedServices.map(({ title, price }) => {
        return {
            title: title.trim(),
            price: price
        };
    });

    const total = items.reduce((sum, item) => {
        return sum + item.price;
    }, 0);

    return {
        count: items.length,
        total: total,
        items: items
    };
}

let data;

try {
    data = JSON.parse(sourceJson);

    if (eventTitle) eventTitle.textContent = data.event.title;
    if (eventDate) eventDate.textContent = data.event.date;
    if (eventPlace) eventPlace.textContent = data.event.place;
    if (eventDescription) eventDescription.textContent = data.event.description;

    if (serviceForm) serviceForm.hidden = false;

    function showProgram() {
        if (program) {
            program.innerHTML = data.event.meeting;
            program.hidden = false;
        }
    }

    if (showProgramButton) {
        showProgramButton.addEventListener('click', showProgram);
    }

    function calculateServices(event) {
        event.preventDefault();

        if (choiceError) choiceError.hidden = true;
        if (result) result.hidden = true;
        if (reportJson) reportJson.hidden = true;

        const guideChecked = guideCheckbox ? guideCheckbox.checked : false;
        const audioChecked = audioCheckbox ? audioCheckbox.checked : false;
        const catalogChecked = catalogCheckbox ? catalogCheckbox.checked : false;

        const report = buildReport(
            data.services,
            guideChecked,
            audioChecked,
            catalogChecked
        );

        if (report.count === 0) {
            if (choiceError) {
                choiceError.textContent = 'Выберите хотя бы одну услугу.';
                choiceError.hidden = false;
            }
            return;
        }

        const serviceNames = report.items.map(item => item.title);
       
        const namesHtml = serviceNames.join('<br>') + '.';

        if (result) {
            result.innerHTML =
                `Выбрано услуг: ${report.count}<br>` +
                `Итого: ${report.total} руб.<br>` +
                namesHtml;
            result.hidden = false;
        }

        const jsonString = JSON.stringify(report);

        JSON.parse(jsonString);

        if (reportJson) {
            reportJson.textContent = jsonString;
            reportJson.hidden = false;
        }
    }

    if (serviceForm) {
        serviceForm.addEventListener('submit', calculateServices);
    }

} catch (error) {
    if (dataError) {
        dataError.textContent = 'Ошибка данных.';
        dataError.hidden = false;
    }
    if (serviceForm) {
        serviceForm.hidden = true;
    }
}
