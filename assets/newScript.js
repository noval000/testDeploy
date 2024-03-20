// на 138 строчку докинуть в renderScript


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