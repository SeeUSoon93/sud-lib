export const locale_en = {
  weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  yearFormat: (dayjsObj) => `${dayjsObj.year()}`,
  monthFormat: (dayjsObj) => `${dayjsObj.month() + 1}`,
  today: "Today"
};

export const locale_ko = {
  weekdays: ["일", "월", "화", "수", "목", "금", "토"],
  months: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월"
  ],
  yearFormat: (dayjsObj) => `${dayjsObj.year()}년`,
  monthFormat: (dayjsObj) => `${dayjsObj.month() + 1}월`,
  today: "오늘"
};
