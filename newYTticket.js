
let labels = ["PayPal.UpgradeBanner"];
const auth = 'perm:YWxla3NlaS5rYXJzYWtvdg==.NjQtMjkz.Xj9j0grYiJ8kbgPTGisXHMk3LTgEeX';
for (let i = 0; i < labels.length; i++) {
    delay(30000)
        .then(() => alreadyCreated(labels[i]));
}
//Функция задержки
function delay(time) {
    return new Promise((resolve, reject) => { setTimeout(resolve, time); });
}

//Функция для создания YT тикета 
function createIssue(nakedLabel) {
    let newIssue = {
        project: { "id": "60-7" },
        summary: "Not translate: " + nakedLabel,
        description: "Not translated label is find!",
    };
    fetch('https://track.ecwid.com/youtrack/api/issues',
        {
            method: 'POST',
            body: JSON.stringify(newIssue),
            headers: {
                "Accept": 'application/json',
                "Authorization": "Bearer " + auth,
                "Content-Type": 'application/json'
            }
        }
    ).then(
        response => response.json() // if the response is a JSON object
    ).then(
        data => console.log(data) // Handle the success response object
    );
}

//Проверка, есть ли уже такой тикет
function alreadyCreated(nakedLabel) {
    let url = 'https://track.ecwid.com/youtrack/api/issues?query=%27Not%20translate:%20' + nakedLabel + '%27';
    console.log(url);
    fetch(url,
        {
            method: 'GET',
            headers: {
                "Accept": 'application/json',
                "Authorization": "Bearer " + auth,
                "Content-Type": 'application/json'
            }
        }
    ).then(
        resp => resp.json() // if the response is a JSON object
    ).then(
        response => {
            console.log(response);
            console.log(response.length);
            if (response.length == 0) {
                createIssue(nakedLabel);
                console.log('Создан тикет для метки без перевода ' + nakedLabel);
            }
            else console.log('Тикет с меткой без перевода ' + nakedLabel + ' уже есть.');
        } // Handle the success response object
    );
}



