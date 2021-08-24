const moment = require("moment")

const dayInId = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const formats = {
    date: 'YYYY-MM-DD',
    dateTime: "YYYY-MM-DD HH:mm:ss",
    lastUpdate: "DD-MM-YYYY HH:mm"
}

const getDayId = (dateString) => {
    const dayIdx = moment(dateString).format("e");
    return dayInId[dayIdx];
}

const getTodayId = () => {
    const today = moment().format(formats.date);
    return getDayId(today);
}

const isPlaceOpen = (opTime) => {
    if (!opTime.is_open) return false;
    if(opTime.is_24Hours) return true;
    const today = moment().format(formats.date);
    const open = moment(`${today} ${opTime.openTime}`).format(formats.dateTime);
    const now = moment().format(formats.dateTime);
    var close = moment(`${today} ${opTime.closeTime}`).format(formats.dateTime);
    if (open > close) {
        if (now >= close && now <= open)
            return false
        else return true
    } else
        return moment(now).isBetween(open, close);
}


module.exports = {
    getDayId,
    getTodayId,
    isPlaceOpen,
    formats
}
