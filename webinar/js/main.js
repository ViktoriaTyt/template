document.querySelector('.header h1').style.marginLeft = '0';
document.querySelector('.header-descr').style.marginLeft = '0';
 document.querySelector('.header-text').style.marginLeft = '0';
document.querySelector('.header-btn a').style.marginLeft = '0';
 document.querySelector('.header-start').style.marginLeft = '0';



let webinarTable = document.querySelector('.webinar__table');
let formData = new FormData();
formData.append('action', 'getEvents');
fetch(App.url, {
    method: 'POST',
    body: formData,
}) .then(resp => resp.json())
    .then(function(data) {
        data.sort(function(a, b){
            let dateA=new Date(a.START_AT), dateB=new Date(b.START_AT);
            return dateB-dateA;
        });
        for( const property in data){
            if (!data.hasOwnProperty(property)) continue;
            let webinarTableItem = document.createElement("div");
            webinarTableItem.className = "webinar__table-item";
            webinarTable.insertAdjacentElement('afterbegin',webinarTableItem);

            let webinarContainer = document.createElement("div");
            webinarContainer.className = "container";
            webinarTableItem.appendChild(webinarContainer);

           let webinarTableAccordion = document.createElement("div");
            webinarTableAccordion.className = "webinar__table-wrapper";
            webinarContainer.appendChild(webinarTableAccordion);

            let accordionTitle = document.createElement("div");
           accordionTitle.className = "webinar-title";
            webinarTableAccordion.appendChild(accordionTitle);

            let time = document.createElement("span");
            time.className = "time";
            accordionTitle.appendChild(time);

            let accordionDescription = document.createElement("div");
            accordionDescription.className = "webinar-description";
            webinarTableAccordion.appendChild(accordionDescription);

            let accordionDescriptionContainer = document.createElement("div");
            accordionDescriptionContainer.className = "webinar-description__container";
            accordionDescription.appendChild(accordionDescriptionContainer);

            let theme = document.createElement("div");
            theme.className = "theme";
            accordionDescriptionContainer.appendChild(theme);

            let accordionDescr = document.createElement("div");
            accordionDescr.className = "webinar-descr";
            accordionDescriptionContainer.appendChild(accordionDescr);

            let wrapper = document.createElement("div");
            wrapper.className = "wrapper";
            accordionDescription.appendChild(wrapper);

            let btn = document.createElement("a");
                btn.className = "btn popupTrigger";
            wrapper.appendChild(btn);

            let webinarTableHeader = document.createElement("div");
            webinarTableHeader.className = "webinar__table-header";
            webinarContainer.insertAdjacentElement('afterbegin',webinarTableHeader);

            let webinarDate = document.createElement("span");
            webinarDate.className = "date";
            webinarTableHeader.insertAdjacentElement('afterbegin',webinarDate);

            let webinarWeek = document.createElement("span");
            webinarWeek.className = "day";
            webinarTableHeader.insertAdjacentElement('afterbegin',webinarWeek);

            const obj = data[property];
            for (const prop in obj) {
                let timeTable = obj.START_AT;
                time.setAttribute("data-start",timeTable);
                let newTime = timeTable.slice(11, 16);
                time.innerHTML = newTime;

                let timeMonth = new Date(timeTable);
                const options = { weekday: 'long'};
                const dayWeek = timeMonth.toLocaleDateString('ru-RU', options);
                webinarWeek.innerHTML = dayWeek + ', ';

                let dayTable = timeMonth.getDate();
                let dayMonth = timeMonth.getMonth() + 1;
                if (dayMonth < 10){
                    dayMonth = '0' + (dayMonth);
                }

                let dataForArr = timeTable.slice(0, 10);
                webinarTableHeader.setAttribute("data-time",dataForArr);

                webinarDate.innerHTML = dayTable + '.' +  dayMonth;
                theme.innerHTML = obj.NAME;
                accordionDescr.innerHTML = obj.DESCRIPTION;
                btn.innerHTML = 'Участвовать';
                let roomUrl = obj.ROOM_URL;
                let rooMId = obj.ID;
                btn.setAttribute('data-url', roomUrl);
                btn.setAttribute('data-room', rooMId);

                let elem = document.querySelectorAll('[data-time]');
                let arrDate = [];
                for (let i = 1; i < elem.length; i++) {
                    let a = elem[i];
                    let b = elem[(i - 1)];
                    let aDataset = a.dataset.time;
                    let bDataset = b.dataset.time;

                    if ((aDataset == bDataset)){
                        arrDate.push(elem[i]);
                    }
                }
                for (let k = 0; k < arrDate.length; k++) {
                    arrDate[k].style.display = 'none';
                }
            }

        }
        /* timer*/
        const timerCount = confTime => {
            const setCounter = setInterval(function() {
                // const daysBlock = document.querySelector('.timer__days');
                const hoursBlock = document.querySelector('.start-hours');
                const minutesBlock = document.querySelector('.start-minutes');
                //const secondsBlock = document.querySelector('.start-seconds');
                const countDownDate = confTime;
                const now = new Date().getTime();
                const distance = countDownDate - now;
                const days = Math.floor(distance / (1000 * 60 * 60 * 24))* 24;
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + days;
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                //const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // daysBlock.textContent = days >= 10 ? days : '0' + days;
                hoursBlock.textContent = hours >= 10 ? hours : '0' + hours;
                minutesBlock.textContent = minutes >= 10 ? minutes : '0' + minutes;
               // secondsBlock.textContent = seconds >= 10 ? seconds : '0' + seconds;

                if (distance < 0) {
                    clearInterval(setCounter);
                    // daysBlock.textContent = '00';
                    hoursBlock.textContent = '00';
                    minutesBlock.textContent = '00';
                   // secondsBlock.textContent = '00';
                }
            }, 1000);
        };
        const arrayContent = Object.entries(data);
        for (let i = 0; i < arrayContent.length; i++) {
            let confTime = new Date(arrayContent[i][1].START_AT).getTime();
            let now = new Date().getTime();
            if (confTime > now) {
                timerCount(confTime);
                continue;
            }
        }
        document.addEventListener("click", function (e) {
            if(e.target.classList.contains('btn')){
                let event = e.target;
                let roomIdContinue= event.getAttribute('data-room');
                sessionStorage.setItem('roomId', roomIdContinue);
            }
        });
    })
    .catch(function(error) {
        console.log(error);
    });
App.action = async function(email, callback) {
    const formDataLogin = new FormData();
    formDataLogin.append('action', 'sendEmail');
    formDataLogin.append('email', email);
    formDataLogin.append('roomId', sessionStorage.getItem('roomId'));
    formDataLogin.append('nickname', $('input[name="fullname"]').val());

    const rawResponse = await fetch(this.url, {
        method: 'POST',
        body: formDataLogin
    });

    const content = await rawResponse.text();
    callback(content);
    return;
};
const modalTriggers = document.querySelectorAll('.popupTrigger');
const modalCloseTrigger = document.querySelector('.popupModalClose');
const bodyBlackout = document.querySelector('.bodyBlackout');
const popupModal = document.querySelector(`.popupModal`);

if(document.querySelector('.webinar')) {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('popupTrigger')){
            popupModal.classList.add('is--visible');
            bodyBlackout.classList.add('is-blacked-out');
        }
    });
    modalCloseTrigger.addEventListener('click', () => {
        popupModal.classList.remove('is--visible');
        bodyBlackout.classList.remove('is-blacked-out');
    });
    bodyBlackout.addEventListener('click', () => {
        popupModal.classList.remove('is--visible');
        bodyBlackout.classList.remove('is-blacked-out');
    });
}


