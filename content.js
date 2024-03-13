
//Поиск голых меток на странице
//console.log("NakedLabelFinder is starting to work");
var perm = 'perm:YWxla3NlaS5rYXJzYWtvdg==.NjQtMjkz.Xj9j0grYiJ8kbgPTGisXHMk3LTgEeX';
var all = document.getElementsByTagName('*'); //Находим абсолютно все элементы
//Сравниваем имя элементов с nakedLabel
var labels = [];

delay(0)
    .then(() => {
        for (var i = 0; i < all.length; i++) {
            let povtor = 0;
            const reg = /^!sorryTextNotLoaded_(?<nakedLabel>[\w.]+)/;//здесь регулярное выражение для поиска голой метки
            var text = all[i].innerText;
            if (text && reg.test(text)) {
                //Голую метку нашли, надо что-то с ней сделать
                let label = reg.exec(text);
                //Проверяем, что элемента с такой меткой еще нет
                for (var j = 0; j < labels.length; j++) {
                    if (label.groups.nakedLabel == labels[j]) povtor++;
                }
                if (povtor == 0) {
                    //console.log(label.groups.nakedLabel);
                    labels.push(label.groups.nakedLabel);
                }
            };
        };
        //console.log(labels);

        //Обрабатываем полученные голые метки(если они есть)
        if (labels.length > 0 && labels.length < 10) {
            for (let i = 0; i < labels.length; i++) {
                delay(0)
                    .then(() => alreadyCreated(labels[i]));
            }
        }
        else if (labels.length != 0) {
            console.log('[NakedLabelFinder]:Отправил сообщение в Slack, слишком много меток');
            sendSlackMessage();
        };
    });

//Функция задержки
function delay(time) {
    return new Promise((resolve, reject) => { setTimeout(resolve, time); });
}

//Функция для создания YT тикета 
function createIssue(nakedLabel) {
    chrome.storage.session.get(['tabUrl'], ({ tabUrl }) => {
        let newIssue = {
            project: { "id": "60-7" },
            summary: "Not translate: " + nakedLabel,
            description: "Not translated label is find on the page: " + tabUrl,
        };
        fetch('https://track.ecwid.com/youtrack/api/issues',
            {
                method: 'POST',
                body: JSON.stringify(newIssue),
                headers: {
                    "Accept": 'application/json',
                    "Authorization": "Bearer " + perm,
                    "Content-Type": 'application/json'
                }
            }
        );
    });
    sessionStorage.setItem(nakedLabel, nakedLabel);
}


//Проверка, есть ли уже такой тикет
function alreadyCreated(nakedLabel) {
    let url = 'https://track.ecwid.com/youtrack/api/issues?query=%27Not%20translate:%20' + nakedLabel + '%27';
    fetch(url,
        {
            method: 'GET',
            headers: {
                "Accept": 'application/json',
                "Authorization": "Bearer " + perm,
                "Content-Type": 'application/json'
            }
        }
    ).then(
        resp => resp.json() // обрабатываем ответ
    ).then(
        response => {
            if (response.length == 0) {
                if (!sessionStorage.getItem(nakedLabel)) {
                    console.log('[NakedLabelFinder]: Создаю тикет для метки без перевода ' + nakedLabel);
                    createIssue(nakedLabel);
                }
            }
            else console.log('[NakedLabelFinder]: Тикет с меткой без перевода ' + nakedLabel + ' уже есть.');
        }
    );
}

//Отправка сообщения в Slack
function sendSlackMessage() {

}