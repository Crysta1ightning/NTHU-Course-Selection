let selected_d = "none", selected_t = "none";
let courses = [
['11010CS 135600', '計算機程式設計二', 'TaTbTc', '陳煥宗', 0, 0],
['11010GEC 111502', '統計思維與分析', 'F2F3F4', '張延彰', 0, 1],
['11010LST 350302', '法學緒論', 'M7M8M9', '林昀嫺', 0, 2],
['11010PE 205009', '跆拳道', 'M5M6', '戴偉國', 0, 3],
['11010QF 214401', '統計學一', 'M3M4W2', '余士迪', 0, 4],
['11010QF 214800', '線性代數', 'T5T6R5', '韓傳祥', 0, 5],
['11010QF 322100', '不動產財務管理', 'R6R7', '林哲群', 0, 6],
['11010FL 102802', '進階英文：閱讀與討論', 'M1M2', '呂文仁', 0, 7],
['11010ECON 206102', '個體經濟學一', 'W8W9Wa', '黃賀寶', 0, 8],
['11010ECON 206101', '個體經濟學一', 'W3W4F3F4', '周瑞賢', 0, 9],
['11010ECON 206103', '個體經濟學一', 'T3T4R3R4', '吳世英', 0, 10],
['11010ECON 206104',  '個體經濟學一', 'W3W4F3F4', '蔡璧涵', 0, 11],
['11010GEC 110200', '批判思考', 'T3T4Tn', '趙之振', 0, 12],
['11010GEC 111400', '思想經典：《韓非子》選讀', 'W3W4', '洪巳軒', 0, 13],
['11010GEC 120100', '當代生命科學', 'T5T6', '周秀專', 0, 14],
['11010CS 135800', 'Python語言程式入門', 'M2W3W4', '周百祥', 0,15],
['11010CS 342301', '作業系統', 'M3M4W2', '周志遠', 0, 16],
['11010CS 460200', '機器學習概論', 'T3T4R3', '郭柏志', 0, 17],
]
let final_schedule = [
['', '', '', '', ''], // 1
['', '', '', '', ''], // 2
['', '', '', '', ''], // 3
['', '', '', '', ''], // 4
['', '', '', '', ''], // n
['', '', '', '', ''], // 5
['', '', '', '', ''], // 6
['', '', '', '', ''], // 7
['', '', '', '', ''], // 8
['', '', '', '', ''], // 9
['', '', '', '', ''], // A
['', '', '', '', ''], // B
['', '', '', '', ''], // C
]
let final_score = 0;
let day_trans = {'M': 0, 'T': 1, 'W': 2, 'R': 3, 'F': 4};
let time_trans = {'1': 0, '2': 1, '3': 2, '4': 3, 'n': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'a': 10, 'b':11, 'c':12};

/* scoring */
function outputTable()
{
  var table = document.getElementById("courses");
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
  for (var i = 17; i >= 0; i--) {
    // check for department and for time
    if((courses[i][0].includes(selected_d) && courses[i][2].includes(selected_t)) ||
      (selected_d == "none" && courses[i][2].includes(selected_t)) ||
      (selected_t == "none" && courses[i][0].includes(selected_d)) ||
      (selected_d == "none" && selected_t == "none")) {
      var row = table.insertRow(1);
      for (var j = 0; j < 4; j++) {
        var cell = row.insertCell(j);
        cell.innerHTML = courses[i][j];
      }
      var cell = row.insertCell(4);
      var line1 = '<td><INPUT TYPE="NUM" NAME="SCORE" id='+courses[i][5].toString()+' value='+courses[i][4].toString()+
      ' onchange="scored('+ courses[i][5]+')"></td>';
      cell.innerHTML = line1;    
    }
  }
}

function getSelectedValue()
{
  selected_d = document.getElementById("department").value;
  selected_t = document.getElementById("time").value;
  outputTable();
}

function scored(id)
{
  var given_score = document.getElementById(id).value;
  if(!isNaN(given_score) && !isNaN(parseInt(given_score)) && parseInt(given_score) >= 0) courses[id][4] = parseInt(given_score);
  else{
    alert("再亂打羊羊會去揍你喔🐑");
    courses[id][4] = 0;
    placer = document.getElementById(id)
    placer.value = 0;
  }
} 



/* ranking */

function check(schedule, temp_courses, target_name, target_time){
  // check for time
  for (var i = 0; i < target_time.length; i += 2) {
    var current_day = day_trans[target_time[i]];
    var current_time = time_trans[target_time[i+1]];
    if(schedule[current_time][current_day] != '') {
      return false;
    }
  }
  // check for class name
  if(temp_courses.includes(target_name)){
    return false;
  }
  return true;
}

function update(schedule, name, time, teacher) {
  for (var i = 0; i < time.length; i += 2) {
    var current_day = day_trans[time[i]];
    var current_time = time_trans[time[i+1]];
    schedule[current_time][current_day] = name + "<br>" + teacher;
  }
  return schedule;
}

function rec_gen(schedule, temp_courses, id, score) 
{
  if(id == 18) {
    if(score > final_score){
      final_score = score;
      final_schedule = JSON.parse(JSON.stringify(schedule));
    }
  }
  else if(courses[id][4] > 0) { // if it is scored
    // 1. check to see if it is valid
    var valid = check(schedule, temp_courses, courses[id][1], courses[id][2]);
    // 2. don't put in schedule
    schedule_2 = JSON.parse(JSON.stringify(schedule)); // here we made another schedule for recursion need
    temp_courses2 = JSON.parse(JSON.stringify(temp_courses))
    rec_gen(schedule_2, temp_courses2, id+1, score);
    // 3. put in schedule (only if it is valid), plus total_score
    if(valid){
      temp_courses.push(courses[id][1]);
      schedule = update(schedule, courses[id][1], courses[id][2], courses[id][3]);
      rec_gen(schedule, temp_courses, id+1, score+courses[id][4]);
    }
  }
  else {
    rec_gen(schedule, temp_courses, id+1, score);
  }
}

function generate_schedule()
{
  var table = document.getElementById("schedule");
  var temp_schedule = [
  ['', '', '', '', ''], // 1
  ['', '', '', '', ''], // 2
  ['', '', '', '', ''], // 3
  ['', '', '', '', ''], // 4
  ['', '', '', '', ''], // n
  ['', '', '', '', ''], // 5
  ['', '', '', '', ''], // 6
  ['', '', '', '', ''], // 7
  ['', '', '', '', ''], // 8
  ['', '', '', '', ''], // 9
  ['', '', '', '', ''], // A
  ['', '', '', '', ''], // B
  ['', '', '', '', ''], // C
  ]
  var temp_courses = []
  rec_gen(temp_schedule, temp_courses, 0, 0);
  alert("Generating the schedule... This might take a while");
  for (var i = 0; i <= 12; i++) { // 1~4 n 5~9 a~c
    for (var j = 0; j <= 4; j++) { // M ~ F 
      table.rows[i+1].cells[j+1].innerHTML = final_schedule[i][j];
    }
  }
  alert("Finished, the total score: " + final_score.toString());
  final_score = 0;
}

