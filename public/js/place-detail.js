function formatToday(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
}

function formatDate(input) {
    const dArr = input.split("-");
    return dArr[2] + "-" + dArr[1] + "-" + dArr[0];
}

function compareDate() {
    //Get Unformatted Date
    const unformatdate = document.getElementById('update').innerHTML;
    const unformatToday = formatToday(new Date());
    //Format date to YYYY-MM-DD
    const formattedDate = formatDate(unformatdate.substring(0, 10));
    const formattedToday = unformatToday.substring(0, 10);
    const hour = unformatdate.substring(11, 16);
    const formatdate1 = formattedDate.split("-");
    const formatdate2 = formattedToday.split("-");
    //Compare Days Between Date
    const one_day = 1000 * 60 * 60 * 24;
    const date1 = new Date(formatdate1[0], (formatdate1[1] - 1), formatdate1[2]);
    const date2 = new Date(formatdate2[0], (formatdate2[1] - 1), formatdate2[2]);
    const diff = Math.ceil((date2.getTime() - date1.getTime()) / (one_day));
    //If Condition
    if (diff === 0)
        document.getElementById('lastupdate').innerHTML = 'Hari ini,  '+hour+' WIB'
    else if (diff === 1)
        document.getElementById('lastupdate').innerHTML = 'Kemarin, ' + hour+' WIB'
    else if (diff === 2)
        document.getElementById('lastupdate').innerHTML = diff+' hari yang lalu, '+hour+' WIB'
    else
        document.getElementById('lastupdate').innerHTML = unformatdate + " WIB"
}

$(document).ready(function () {
    compareDate();
})
