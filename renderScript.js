function createEmptyScheduleGrid(element, index) {
    const scheduleContainer = document.getElementById(element);
    const timeSlot = document.createElement('div');
    timeSlot.classList.add('time-slot');
    timeSlot.textContent = `${Math.floor(index / 4)}:${index % 4 ? index % 4 * 15 : '00'}`;
    scheduleContainer.appendChild(timeSlot);
}

function fillEmptyScheduleGrid(element, repeat) {
    const scheduleContainer = document.getElementById(element);
    const timeSlot1 = document.createElement('div');
    timeSlot1.classList.add('schedule-tmp-item');
    timeSlot1.style.gridRow = `span 15 / span 15`;
    timeSlot1.style.gridColumn = `2`;
    if (repeat >= 1) {
        timeSlot1.style.gridColumn = `2`;
        scheduleContainer.appendChild(timeSlot1);
    }

    const timeSlot2 = document.createElement('div');
    timeSlot2.classList.add('schedule-tmp-item');
    timeSlot2.style.gridRow = `span 15 / span 15`;
    timeSlot2.style.gridColumn = `3`;
    if (repeat >= 2) scheduleContainer.appendChild(timeSlot2);

    const timeSlot3 = document.createElement('div');
    timeSlot3.classList.add('schedule-tmp-item');
    timeSlot3.style.gridRow = `span 15 / span 15`;
    timeSlot3.style.gridColumn = `4`;
    if (repeat === 3) scheduleContainer.appendChild(timeSlot3);
}

// Функция заполнения ячеек расписания с учетом списка приемов
function calculateIndexSlotAtDate(startTime, slotTime) {
    const timeDiffInMinutes = Math.abs(slotTime.getTime() - startTime.getTime()) / 1000 / 60; // Разница в минутах
    const hoursDiff = Math.floor(timeDiffInMinutes / 60); // Часы
    const minutesDiff = Math.floor(timeDiffInMinutes % 60); // Минуты
    // const indexSlotAtDate = hoursDiff * 4 + Math.floor(minutesDiff / 15); // Индекс слота
    return hoursDiff * 60 + Math.floor(minutesDiff) + 1;
}

function isIntersect(slotTime, slotDuration, appTime, appDuration) {
    const appStart = Math.floor(appTime.getTime() / 60000);
    const appEnd = Math.floor((appTime.getTime() + appDuration * 60000) / 60000);
    const slotStart = Math.floor(slotTime.getTime() / 60000);
    const slotEnd = Math.floor((slotTime.getTime() + slotDuration * 60000) / 60000);

    return (slotStart < appEnd && slotEnd > appStart);
}

function calcIntersect(slotTime, slotDuration, receptions) {
    return receptions.filter(reception => {
        return isIntersect(slotTime, slotDuration, reception.reception_dt, reception.duration);
    }).length;
}

function nok(count) {
    if(count === 1)
        return 1;
    else if(count === 2)
        return 2;
    else if(count === 3)
        return 6;
    else if(count === 4)
        return 12;
    else if(count === 5)
        return 60;
    else
        throw EncodingError('на найден');
}

function changeColCount(element, rooms) {
    const scheduleContainer = document.getElementById(element);
    const count = rooms.length;
    scheduleContainer.style.gridTemplateColumns = `[time] 60px repeat(${nok(count)}, 1fr)`;
    const headerContainer = document.getElementById("rooms-header-container");
    scheduleContainer.style.gridTemplateColumns = `repeat(1, 1fr)`;
    const roomHeader = document.getElementById("room-header");
    scheduleContainer.style.gridTemplateColumns = `60px minmax(100px, ${rooms.length}fr)`;

}

function createRoomColumn(room_id, count, room_index, index) {
    //const scheduleContainer = document.getElementById(element);
    const roomItem = document.createElement('div');
    roomItem.id = `room_${index}_${room_id}`;
    roomItem.classList.add('room-item');
    roomItem.style.gridTemplateColumns = `repeat(${nok(count)}, 1fr)`;
    return roomItem;
}


function createRoomColumns(element, room_id, count, room_index, index) {
    const scheduleContainer = document.getElementById(element);
    const roomContainer = document.createElement('div');
    const roomItem = createRoomColumn(room_id, count, room_index+1, index);
    //roomItem.tagName = room_id;
    roomContainer.classList.add("room-container");
    roomContainer.style.gridColumn = room_index+1;
    roomContainer.style.gridRowStart = 1;
    roomContainer.style.gridRowEnd = 240;
    roomContainer.appendChild(roomItem);
    scheduleContainer.appendChild(roomContainer);
}

let nextIndex = 1

function createEmptyReceptionSlot(element, column_index, startTime, slotTime, slotDuration, slotColor, slotCardNo, slotPersonName, slotReceptionName, slotComment, arrivalStatus, paymentStatus, visitConfirmation, tags, receptions) {
    const scheduleContainer = document.getElementById(element);

    const scheduleItem = document.createElement('div');
    scheduleItem.classList.add('reception-item');




    if (nextIndex !== 0) {
        nextIndex -= 1;
    } else {
        nextIndex = calcIntersect(slotTime, slotDuration, receptions);
    }
    if (calcIntersect(slotTime, slotDuration, receptions) !== 0)
        scheduleItem.style.gridColumn = `${nextIndex + (column_index * 2)}`;
    else
        scheduleItem.style.gridColumn = `${column_index * 2} / ${2 + (column_index * 2)}`;
    scheduleItem.style.backgroundColor = slotColor;
    const index = calculateIndexSlotAtDate(startTime, slotTime) + 1;
    const slotsNeeded = Math.floor(slotDuration / 60 * 60);
    if (Math.floor(startTime.getTime() / 60000) === Math.floor(slotTime.getTime() / 60000)) {
        scheduleItem.style.gridRowStart = `${index - 1}`;
    } else {
        scheduleItem.style.gridRowStart = `${index - 1}`;
    }
    scheduleItem.style.gridRowEnd = `${index + slotsNeeded - 1}`;
    scheduleContainer.appendChild(scheduleItem.cloneNode(true))
}

const allContainerEl = document.querySelectorAll('.room-container');
allContainerEl.forEach(el => {
        const numberEl = el.children.length;
        console.log(el.children.length)
        if (numberEl > 2) {
            let roomContainer = document.querySelectorAll('.room-container');
            let receptionItem = document.querySelectorAll('.reception-item');
            roomContainer.forEach(elRoomCont => {
                console.log(elRoomCont.classList);
                elRoomCont.classList.add('active-room-container');
            })
            receptionItem.forEach(elRecItem => {
                elRecItem.classList.add('active-reception-item');
            })
        } else {
            let roomContainer = document.querySelectorAll('.room-container');
            let receptionItem = document.querySelectorAll('.reception-item');
            roomContainer.forEach(elRoomCont => {
                console.log(elRoomCont.classList);
                elRoomCont.classList.remove('active-room-container');
            })
            receptionItem.forEach(elRecItem => {
                elRecItem.classList.remove('active-reception-item');
            })
        }
    })





function createReceptionSlot(element, column_index, startTime, slotTime, slotDuration, slotColor, slotCardNo, slotPersonName, slotReceptionName, slotComment, arrivalStatus, paymentStatus, visitConfirmation, tags, receptions) {


    const scheduleContainer = document.getElementById(element);

    const scheduleItem = document.createElement('div');
    scheduleItem.classList.add('reception-item');

    if (nextIndex !== 0) {
        nextIndex -= 1;
    } else {
        nextIndex = calcIntersect(slotTime, slotDuration, receptions);
    }

    if (calcIntersect(slotTime, slotDuration, receptions) !== 0)
        scheduleItem.style.gridColumn = `${nextIndex + (column_index * 2)}`;
    else
        scheduleItem.style.gridColumn = `${column_index * 2} / ${2 + (column_index * 2)}`;
    scheduleItem.style.backgroundColor = slotColor;

    if (tags.includes('RiskGroupMedium')) {
        scheduleItem.style.borderWidth = '1px';
        scheduleItem.style.borderColor = 'yellow';
    }
    if (tags.includes('RiskGroupHigh')) {
        scheduleItem.style.borderWidth = '1px';
        scheduleItem.style.borderColor = 'red';
    }

    // scheduleItem.textContent = slotCardNo + slotReceptionName + `${calcIntersect(slotTime, slotDuration, receptions)} ${slotDuration}`;

    const personNameElem = document.createElement('div');
    personNameElem.textContent = slotPersonName;
    personNameElem.classList.add('person-name');

    if (tags.includes('Vip')) personNameElem.classList.add('vip-item');
    if (tags.includes('PositiveHhs')) personNameElem.classList.add('positive-hhs-item');
    if (tags.includes('TroubleMaker')) personNameElem.classList.add('trouble-maker-item');

    const receptionNameElem = document.createElement('div');
    receptionNameElem.textContent = slotReceptionName;

    const visitConfirmationElem = document.createElement('div');
    if (visitConfirmation !== null) visitConfirmationElem.textContent = visitConfirmation;

    const commentElem = document.createElement('div');
    if(slotComment !== null) commentElem.textContent = slotComment;

    const tableInfoElem = document.createElement('div');
    tableInfoElem.classList.add('reception-item-tags');

    const surrogateMotherTagElem = document.createElement('div');
    surrogateMotherTagElem.classList.add('reception-item-tags-item');
    if (tags.includes('SurrogateMother')) surrogateMotherTagElem.textContent = 'СМ';

    const anonymousODTagElem = document.createElement('div');
    anonymousODTagElem.classList.add('reception-item-tags-item');
    if (tags.includes('AnonymousOvumDonor')) anonymousODTagElem.textContent = 'ДЯ';

    const commentTagElem = document.createElement('div');
    commentTagElem.classList.add('reception-item-tags-item');
    if (slotComment == null) {
        commentTagElem.style.backgroundColor = '#ffff00';
        commentTagElem.textContent = 'К';
    }
    const arrivalStatusTagElem = document.createElement('div');
    arrivalStatusTagElem.classList.add('reception-item-tags-item');
    arrivalStatusTagElem.appendChild(createArrivalStatusTag(arrivalStatus, tags.includes('Commercial')));

    const topElem = document.createElement('div');
    topElem.classList.add('elem-info');
    const cardNoElem = document.createElement('div');
    cardNoElem.classList.add('elem-info-left');
    cardNoElem.textContent = slotCardNo;

    tableInfoElem.appendChild(surrogateMotherTagElem);
    tableInfoElem.appendChild(anonymousODTagElem);
    tableInfoElem.appendChild(commentTagElem);
    tableInfoElem.appendChild(arrivalStatusTagElem);
    topElem.appendChild(cardNoElem);
    topElem.appendChild(tableInfoElem);

    const index = calculateIndexSlotAtDate(startTime, slotTime) + 1;
    const slotsNeeded = Math.floor(slotDuration / 60 * 60);
    if (Math.floor(startTime.getTime() / 60000) === Math.floor(slotTime.getTime() / 60000)) {
        scheduleItem.style.gridRowStart = `${index - 1}`;
    } else {
        scheduleItem.style.gridRowStart = `${index - 1}`;
    }
    scheduleItem.style.gridRowEnd = `${index + slotsNeeded - 1}`;
    // 13 / 5;

    scheduleItem.appendChild(topElem);
    // scheduleItem.appendChild(cardNoElem)
    scheduleItem.appendChild(personNameElem);
    scheduleItem.appendChild(receptionNameElem);
    if (visitConfirmation !== null) scheduleItem.appendChild(visitConfirmationElem);
    if (slotComment !== null) scheduleItem.appendChild(commentElem);
    scheduleContainer.appendChild(scheduleItem.cloneNode(true));
}

function createArrivalStatusTag(arrivalStatus, commercialTag) {
    if (commercialTag) {
        const svgElem = document.createElement('svg');
        const polygonElem = document.createElement('polygon');
        svgElem.classList.add('triangle');
        svgElem.classList.add('triangle-' + arrivalStatus);
        polygonElem.setAttribute('points', '1,11 6,1 11,11');
        svgElem.appendChild(polygonElem)
        return svgElem;
        // trangle
    } else {
        const circleElem = document.createElement('div');
        circleElem.classList.add('circle');
        circleElem.classList.add('circle-' + arrivalStatus);
        return circleElem;
        // circle
    }
    //
    // <div style="display: flex; margin-bottom: 5px">
    //     <div style="display: inline-flex; margin-right: 20px">
    //         <div className="circle" style="background-color: transparent; margin-right: 5px"></div>
    //         <svg className="triangle" style="fill: transparent">
    //             <polygon points="1,11 6,1 11,11"/>
    //         </svg>
    //     </div>
    //     <div className="description">Ожидается прием</div>
    // </div>
    // <div style="display: flex; margin-bottom: 5px">
    //     <div style="display: inline-flex; margin-right: 20px">
    //         <div className="circle" style="background-color: red; margin-right: 5px"></div>
    //         <svg className="triangle" style="fill: red">
    //             <polygon points="1,11 6,1 11,11"/>
    //         </svg>
    //     </div>
    //     <div className="description">Пациент прибыл на прием</div>
    // </div>
    // <div style="display: flex; margin-bottom: 5px">
    //     <div style="display: inline-flex; margin-right: 20px">
    //         <div className="circle" style="background-color: #00ff00; margin-right: 5px"></div>
    //         <svg className="triangle" style="fill: #00ff00">
    //             <polygon points="1,11 6,1 11,11"/>
    //         </svg>
    //     </div>
    //     <div className="description">Прием состоялся</div>
    // </div>
    // <div style="display: flex; margin-bottom: 5px">
    //     <div style="display: inline-flex; margin-right: 20px">
    //         <div className="circle" style="background-color: #ff8800; margin-right: 5px"></div>
    //         <svg className="triangle" style="fill: #ff8800">
    //             <polygon points="1,11 6,1 11,11"/>
    //         </svg>
    //     </div>
    //     <div className="description">Прием отменен</div>
    // </div>
}

function split_receptions_at(date1, date2, receptions) {
    return split_at(date2, split_at(date1, receptions));
}

function split_at(date, receptions) {
    const result = [];
    const currentTimestamp = date.getTime() / 60000;

    receptions.forEach(reception => {
        const beginDt = (reception.reception_dt.getTime())/60000;
        const endDt = (reception.reception_dt.getTime() + (reception.duration * 60000))/60000;

        const lastDuration = Math.floor((date.getTime() - reception.reception_dt.getTime()) / 60000);

        if (beginDt < currentTimestamp && endDt > currentTimestamp) {
            if (lastDuration !== 0) {
                result.push({
                    reception_dt: reception.reception_dt,
                    duration: lastDuration,
                    visible: lastDuration >= reception.duration - lastDuration,
                    color: reception.color,
                    card_no: reception.card_no,
                    person_name: reception.person_name,
                    room_for_table: reception.room_for_table,
                    reception_name: reception.reception_name,
                    comment: reception.comment,
                    arrival_status: reception.arrival_status,
                    payment_status: reception.payment_status,
                    visit_confirmation: reception.visit_confirmation,
                    tags: reception.tags,
                });
                result.push({
                    reception_dt: date,
                    duration: reception.duration - lastDuration,
                    visible: lastDuration < reception.duration - lastDuration,
                    color: reception.color,
                    card_no: reception.card_no,
                    person_name: reception.person_name,
                    room_for_table: reception.room_for_table,
                    reception_name: reception.reception_name,
                    comment: reception.comment,
                    arrival_status: reception.arrival_status,
                    payment_status: reception.payment_status,
                    visit_confirmation: reception.visit_confirmation,
                    tags: reception.tags,
                });
            } else {
                result.push(reception/*{
                    reception_dt: reception.reception_dt,
                    duration: reception.duration,
                    visible: reception.visible,
                    color: reception.color,
                    card_no: reception.card_no,
                    reception_name: reception.reception_name,
                    person_name: reception.person_name,
                    comment: reception.comment,
                    arrival_status: reception.arrival_status,
                    payment_status: reception.payment_status,
                    visit_confirmation: reception.visit_confirmation,
                    tags: reception.tags,
                }*/);
            }
        } else {
            result.push(reception/*{
                    reception_dt: reception.reception_dt,
                    duration: reception.duration,
                    visible: reception.visible,
                    color: reception.color,
                    card_no: reception.card_no,
                    reception_name: reception.reception_name,
                    person_name: reception.person_name,
                    comment: reception.comment,
                    arrival_status: reception.arrival_status,
                    payment_status: reception.payment_status,
                    visit_confirmation: reception.visit_confirmation,
                    tags: reception.tags,
                }*/);
        }
    });

    return result;
}

function findDurationIndex(appTime, appDuration, durations) {
    return durations.findIndex(d => {
            return Math.floor(d.startTime.getTime() / 60000) <= Math.floor((appTime.getTime()) / 60000) && Math.floor((appTime.getTime() + appDuration * 60000) / 60000 <= Math.floor(d.endTime.getTime() / 60000));
        }
    );
}

function createOvumPickupsInfo(ovumPickupsForMonth, ovumPickupsForYear, chiOvumPickupCountForMonth, chiOvumPickupCountForYear, cancelledOvumPickupsForMonth, cancelledOvumPickupsForYear) {
    const scheduleContainer = document.getElementById('table__title');
    const timeSlot = document.createElement('div');
    const monthNames = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
        "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
    ];
    // timeSlot1.classList.add('table__title');
    timeSlot.textContent = `${new Date(Date.now()).getUTCDate()} ${monthNames[new Date(Date.now()).getMonth()]} ${new Date(Date.now()).getUTCFullYear()}. Пункций проведено (за месяц / год): ${ovumPickupsForMonth}/${ovumPickupsForYear}. В том числе по ОМС: ${chiOvumPickupCountForMonth}/${chiOvumPickupCountForYear}.  Пункций отменено (за месяц / год): ${cancelledOvumPickupsForMonth} / ${cancelledOvumPickupsForYear}`;
    // timeSlot1.style.
    scheduleContainer.appendChild(timeSlot);
}

function fill(index_column, visible, reception_dt, duration, color, card_no, person_name, reception_name, comment, arrival_status, payment_status, visit_confirmation, tags, receptions, durations) {
    const filtred_receptions = receptions.filter(reception => {
        return (reception_dt !== reception.reception_dt || duration !== reception.duration || card_no !== reception.card_no || reception_name !== reception.reception_name || person_name !== reception.person_name || comment !== reception.comment);
    });
    const foundedDurationIndex = findDurationIndex(reception_dt, duration, durations);
    if(visible===false) {
        const container = document.getElementById(`room_${foundedDurationIndex + 1}_${index_column}`);
        const roomContainer = container.children.namedItem("room-container");
        createEmptyReceptionSlot(container, index_column, durations[foundedDurationIndex].startTime, reception_dt, duration, color, card_no, person_name, reception_name, comment, arrival_status, payment_status, visit_confirmation, tags, filtred_receptions);
    }
    else {
        const container = document.getElementById(`room_${foundedDurationIndex + 1}_${index_column}`);
        const roomContainer = container.children.namedItem("room-container");
        createReceptionSlot(`room_${foundedDurationIndex + 1}_${index_column}`, index_column, durations[foundedDurationIndex].startTime, reception_dt, duration, color, card_no, person_name, reception_name, comment, arrival_status, payment_status, visit_confirmation, tags, filtred_receptions);
    }
}

function getDurations() {
    // const date =
    const startTime1 = new Date()
    const firstTime = new Date()
    const secondTime = new Date()
    const endTimes = new Date()
    startTime1.setHours(8, 0, 0, 0)
    firstTime.setHours(12, 0, 0, 0)
    secondTime.setHours(16, 0, 0, 0)
    endTimes.setHours(20, 0, 0, 0)

    return [
        {startTime: startTime1, endTime: firstTime},
        {startTime: firstTime, endTime: secondTime},
        {startTime: secondTime, endTime: endTimes},
    ];
}