//Global variables
const beginSpringA = {
  月: "20210412",
  火: "20210413",
  水: "20210414",
  木: "20210408",
  金: "20210409",
  土: "20210410",
};
const beginSpringB = {
  月: "20210524",
  火: "20210525",
  水: "20210526",
  木: "20210520",
  金: "20210521",
  土: "20210522",
};
const beginSpringC = {
  月: "20210705",
  火: "20210706",
  水: "20210707",
  木: "20210701",
  金: "20210702",
  土: "20210703",
};
const beginFallA = {
  月: "20211004",
  火: "20211005",
  水: "20211006",
  木: "20211007",
  金: "20211001",
  土: "20211002",
};
const beginFallB = {
  月: "20211115",
  火: "20211116",
  水: "20211117",
  木: "20211111",
  金: "20211112",
  土: "20211113",
};
const beginFallC = {
  月: "20220124",
  火: "20220111",
  水: "20220112",
  木: "20220106",
  金: "20220107",
  土: "20220108",
};
const springEndDate = {
  A: "20210518T130000Z;",
  B: "20210623T130000Z;",
  C: "20210805T130000Z;",
};
const fallEndDate = {
  A: "20211109T130000Z;",
  B: "20211221T130000Z;",
  C: "20220215T130000Z;",
};
const engWeekday = {
  月: "MO",
  火: "TU",
  水: "WE",
  木: "TH",
  金: "FR",
  土: "SA",
};
const weekdayList = ["月", "火", "水", "木", "金", "土"];
//the head element(0) is a dummy
const classBeginPeriod = [
  "0",
  "084000",
  "101000",
  "121500",
  "134500",
  "151500",
  "164500",
  "182000",
  "194500",
];
const classEndPeriod = [
  "0",
  "095500",
  "112500",
  "133000",
  "150000",
  "163000",
  "180000",
  "193500",
  "210000",
];
const springAHolidays = [
  "20210429",
  "20210503",
  "20210504",
  "20210505",
  "20210507",
];
const springBHolidays = [];
const springCHolidays = ["20210722", "20210723"];
const fallAHolidays = ["20211103", "20211105", "20211108", "20211109"];
const fallBHolidays = [
  "20211123",
  "20211125",
  "20211126",
  "20211129",
  "20211130",
];
const fallCHolidays = [
  "20220110",
  "20220113",
  "20220114",
  "20220117",
  "20220118",
  "20220211",
];
const springABCHolidays = [
  "20210429",
  "20210503",
  "20210504",
  "20210505",
  "20210507",
  "20210519",
  "20210722",
  "20210723",
];
const fallABCHolidays = [
  "20211103",
  "20211105",
  "20211108",
  "20211109",
  "20211123",
  "20211125",
  "20211129",
  "20211130",
  "20211229",
  "20211230",
  "20211231",
  "20220101",
  "20220102",
  "20220103",
  "20220104",
  "20220105",
  "20220110",
  "20220113",
  "20220114",
  "20220117",
  "20220118",
  "20220204",
];
//Date:Module:Class schedule of the day
const rescheduledDateList = [
  "20210507",
  "20210722",
  "20211109",
  "20211125",
  "20220113",
  "20220118",
];
const rescheduledClassList = [
  "春A:水",
  "春C:金",
  "秋B:水",
  "秋B:火",
  "秋C:金",
  "秋C:月",
];

function getJSON(filename) {
  return new Promise(function (r) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL(filename), true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        r(xhr.responseText);
      }
    };
    xhr.send();
  });
}
const addZero = (str) => {
  return str.length === 1 && str !== "T" ? "0" + str : str;
};
const isAvailableModule = (module) => {
  return !(module.indexOf("春") === -1 && module.indexOf("秋") === -1);
};
const isAvaibaleDay = (period) => {
  //There's no Sunday class in the year
  return weekdayList.includes(period.slice(0, 1));
};
const getModulePeriodList = (moduleList, periodList) => {
  let modulePeriodList = [];
  let tmpList = [];
  if (moduleList.length === 1 && periodList.length > 1) {
    for (let i = 0; i < periodList.length; i++) {
      tmpList = tmpList.concat(periodList[i]);
    }
    periodList = [tmpList];
  }
  for (let i = 0; i < moduleList.length; i++) {
    for (let j = 0; j < moduleList[i].length; j++) {
      for (let k = 0; k < periodList[i].length; k++) {
        modulePeriodList.push([moduleList[i][j], periodList[i][k]]);
      }
    }
  }
  return modulePeriodList;
};
const getSpan = (module, period) => {
  let beginDate = "";
  const DTSTART = "DTSTART;TZID=Asia/Tokyo:";
  const DTEND = "DTEND;TZID=Asia/Tokyo:";
  //Get the start and end date of the module
  if (module[0] == "春") {
    switch (module[1]) {
      case "A":
        beginDate = beginSpringA[period[0]];
        break;
      case "B":
        beginDate = beginSpringB[period[0]];
        break;
      case "C":
        beginDate = beginSpringC[period[0]];
        break;
    }
  } else {
    switch (module[1]) {
      case "A":
        beginDate = beginFallA[period[0]];
        break;
      case "B":
        beginDate = beginFallB[period[0]];
        break;
      case "C":
        beginDate = beginFallC[period[0]];
        break;
    }
  }
  //Get the start and end time of the course
  let beginPeriod = classBeginPeriod[parseInt(period.slice(1, 2))];
  let endPeriod = classEndPeriod[parseInt(period.slice(-1))];
  return (
    DTSTART +
    beginDate +
    "T" +
    beginPeriod +
    "\n" +
    DTEND +
    beginDate +
    "T" +
    endPeriod +
    "\n"
  );
};
const addReschedule = (index, period) => {
  let beginDate = rescheduledDateList[index];
  const DTSTART = "DTSTART;TZID=Asia/Tokyo:";
  const DTEND = "DTEND;TZID=Asia/Tokyo:";
  //Get the start and end time of the course
  let beginPeriod = classBeginPeriod[parseInt(period.slice(1, 2))];
  let endPeriod = classEndPeriod[parseInt(period.slice(-1))];
  return (
    DTSTART +
    beginDate +
    "T" +
    beginPeriod +
    "\n" +
    DTEND +
    beginDate +
    "T" +
    endPeriod +
    "\n"
  );
};
const getRepeat = (module, period) => {
  let rrule = "RRULE:FREQ=WEEKLY;UNTIL=";
  let exdate;
  rrule +=
    module[0] == "春"
      ? springEndDate[module.slice(-1)]
      : fallEndDate[module.slice(-1)];
  rrule += "BYDAY=" + engWeekday[period[0]] + "\n";
  exdate = removeHolidays(module, period);
  return rrule + exdate;
};
//For ABC module class
const getABCRepeat = (module, period) => {
  let rrule = "RRULE:FREQ=WEEKLY;UNTIL=";
  let exdate;
  rrule += module[0] == "春" ? "20210729T130000Z;" : "20220208T130000Z;";
  rrule += "BYDAY=" + engWeekday[period[0]] + "\n";
  exdate = removeABCHolidays(module, period);
  return rrule + exdate;
};
const getMisc = (name, classroom, desc) => {
  //Create a timestamp for this year
  const year = "2021";
  const month = "4";
  const date = "8";
  const hour = "0";
  const minute = "0";
  const timeStampList = [year, month, date, "T", hour, minute, "00"];
  const timeStamp = timeStampList.map((x) => addZero(x)).join("");
  const dtstamp = "DTSTAMP:" + timeStamp;
  const created = "CREATED:" + timeStamp;
  const description = "DESCRIPTION:" + desc;
  const lastModified = "LAST-MODIFIED:" + timeStamp;
  const classroomLocation = "LOCATION:" + classroom;
  const sequence = "SEQUENCE:0";
  const confirmed = "STATUS:CONFIRMED";
  const summary = "SUMMARY:" + name;
  const transp = "TRANSP:OPAQUE";
  return [
    dtstamp,
    created,
    description,
    lastModified,
    classroomLocation,
    sequence,
    confirmed,
    summary,
    transp,
  ].join("\n");
};
const removeHolidays = (module, period) => {
  let beginPeriod = classBeginPeriod[parseInt(period.slice(1, 2))];
  let holidaysList = [];
  let exdate = "EXDATE:";
  if (module[0] === "春") {
    for (let i = 1; i < module.length; i++) {
      if (module[i] === "A")
        holidaysList = holidaysList.concat(springAHolidays);
      else if (module[i] === "B")
        holidaysList = holidaysList.concat(springBHolidays);
      else if (module[i] === "C")
        holidaysList = holidaysList.concat(springCHolidays);
    }
  }
  if (module[0] === "秋") {
    for (let i = 1; i < module.length; i++) {
      if (module[i] === "A") holidaysList = holidaysList.concat(fallAHolidays);
      else if (module[i] === "B")
        holidaysList = holidaysList.concat(fallBHolidays);
      else if (module[i] === "C")
        holidaysList = holidaysList.concat(fallCHolidays);
    }
  }
  //Check if the list is blank
  if (!holidaysList.length) {
    return "";
  }
  for (let i = 0; i < holidaysList.length; i++) {
    exdate += holidaysList[i] + "T" + beginPeriod + ",";
  }
  return exdate + "\n";
};
//For ABC classes
const removeABCHolidays = (module, period) => {
  let beginPeriod = classBeginPeriod[parseInt(period.slice(1, 2))];
  let holidaysList;
  let exdate = "EXDATE:";
  holidaysList = module[0] == "春" ? springABCHolidays : fallABCHolidays;
  for (let i = 0; i < holidaysList.length; i++) {
    exdate += holidaysList[i] + "T" + beginPeriod + ",";
  }
  return exdate + "\n";
};
const addDeadlines = () => {
  let deadlinesList = [];
  let misc =
    "DTSTAMP:20210408T000000\nCREATED:20210408T000000\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\n";
  let dtstart;
  let dtend;
  let nextDate;
  let summary;
  let icsEvent;
  for (let i = 0; i < deadlinesDate.length; i++) {
    dtstart = "DTSTART;VALUE=DATE:" + deadlinesDate[i] + "\n";
    nextDate = String(Number(deadlinesDate[i]) + 1);
    dtend = "DTEND;VALUE=DATE:" + nextDate + "\n";
    summary = "SUMMARY:" + deadlinesDetail[i] + "\n";
    icsEvent =
      "BEGIN:VEVENT" + dtstart + dtend + misc + summary + "END:VEVENT\n";
    deadlinesList.push(icsEvent);
  }
  return deadlinesList.join("");
};
const createICS = (idList, kdb) => {
  let output =
    "BEGIN:VCALENDAR\nPRODID:-//gam0022//TwinC 1.0//EN\nVERSION:2.0\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nX-WR-CALNAME:授業時間割\nX-WR-TIMEZONE:Asia/Tokyo\nX-WR-CALDESC:授業時間割\nBEGIN:VTIMEZONE\nTZID:Asia/Tokyo\nX-LIC-LOCATION:Asia/Tokyo\nBEGIN:STANDARD\nTZOFFSETFROM:+0900\nTZOFFSETTO:+0900\nTZNAME:JST\nDTSTART:19700102T000000\nEND:STANDARD\nEND:VTIMEZONE\n";
  //idList = idList.map(x => x.replace(/[\"]/g, ""));
  //idList = idList.map(x => x.replace(/\r/g, ""));
  const eventBegin = "BEGIN:VEVENT\n";
  const eventEnd = "\nEND:VEVENT\n";
  let courseList = [];
  let isValid = false;
  let isABC;
  //Search courses
  for (let i = 0; i < idList.length - 1; i++) {
    try {
      courseList.push(kdb[idList[i]]);
    } catch (error) {
      //Do nothing
    }
  }
  for (let i = 0; i < courseList.length; i++) {
    const name = courseList[i].name;
    const moduleList = courseList[i].module;
    const periodList = courseList[i].period;
    const classroom = courseList[i].room;
    const description = courseList[i].description;
    const modulePeriodList = getModulePeriodList(moduleList, periodList);
    let module;
    let period;
    let devidedModule;
    let devidedPeriod;
    let rescheduleIndex;
    for (let j = 0; j < modulePeriodList.length; j++) {
      module = modulePeriodList[j][0];
      period = modulePeriodList[j][1];
      let icsEvent = "";
      if (!isAvailableModule(module) || !isAvaibaleDay(period)) continue;
      if (module.slice(1) === "ABC") {
        isABC = true;
        icsEvent =
          getSpan(module, period) +
          getABCRepeat(module, period) +
          getMisc(name, classroom, description);
        output += eventBegin + icsEvent + eventEnd;
      } else {
        icsEvent =
          getSpan(module, period) +
          getRepeat(module, period) +
          getMisc(name, classroom, description);
        output += eventBegin + icsEvent + eventEnd;
        isABC = false;
      }
      for (let k = 1; k < module.length; k++) {
        devidedModule = module[0] + module[k];
        devidedPeriod = period[0];
        rescheduleIndex = rescheduledClassList.indexOf(
          devidedModule + ":" + devidedPeriod
        );
        if (rescheduleIndex !== -1) {
          icsEvent =
            addReschedule(rescheduleIndex, period) +
            getMisc(name, classroom, description);
          output += eventBegin + icsEvent + eventEnd; 
        }
      }
    }
  }

  //determine the file name from time
  output += "END:VCALENDAR\n";
  const date = new Date();
  let month = date.getMonth() + 1;
  const day = date.getDate();
  const name = "twinc-" + month + "-" + day + ".ics";

  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(
      new Blob([output], { type: "text/plain" }),
      name
    );
  } else {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([output], { type: "text/plain" }));
    //a.target   = '_blank';
    a.download = name;
    document.body.appendChild(a); //  FireFox specification
    a.click();
    document.body.removeChild(a); //  FireFox specification
  }
  location.reload();
};

function main() {
  const coursecodeHTMLList = document.getElementsByClassName("coursecode");
  let coursecodeList = [];
  let kdb = "";

  //Check if the home format is thumbnail
  if (coursecodeHTMLList.length !== 0) {
    for (let i = 0; i < coursecodeHTMLList.length; i++) {
      coursecodeList.push(coursecodeHTMLList[i].innerHTML);
    }
    //Remove the special courses (e.g. INFOSS)
    coursecodeList = coursecodeList.filter(
      (course) => course === course.toUpperCase()
    );

    //Import KdB data
    const url = chrome.runtime.getURL("kdb_twinc.json");

    fetch(url)
      .then((response) => response.json()) //assuming file contains json
      .then((json) => createICS(coursecodeList, json));
  }
}


let button = document.createElement("button");
button.innerText = "Import TwinC";
button.onclick = function () {
  main();
};

if (document.getElementsByClassName("coursecode").length !== 0) {
  let coursememo = document.getElementById("coursememo");
  coursememo.appendChild(button);
}
