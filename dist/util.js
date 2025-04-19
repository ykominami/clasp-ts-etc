/**
 * @description 今日の日付と時刻を日本のロケールで取得し、コンソールに出力します。
 * @return {string} 今日の日付と時刻 (例: "2024/07/09 14:30:00")
 */
function getTodaysDateTimeJa() {
  const now = new Date();
  const formattedDateTime = now.toLocaleString("ja-JP"); // 日本のロケールを指定
  console.log(formattedDateTime); // 例: "2024/07/09 14:30:00"
  return formattedDateTime;
}

/**
 * @description 今日の日付と時刻をコンソールに表示します。
 */
function displayTodaysDate() {
  console.log(getTodaysDateTimeJa());
}

/**
 * @description 現在の日付と時刻を日本のロケールで取得します (24時間制)。
 * @return {string} 現在の日付と時刻 (例: "2024/07/09 14:30:00")
 */
function getCurrentDateTimeJa() {
  const now = new Date();
  const formattedDateTime = now.toLocaleString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false, // 24時間制
  });
  return formattedDateTime;
}
/**
 * @description 現在の日付と時刻をJSTで指定された形式で取得します。
 * @param {string} fmt 形式 ("filename"の場合は"yyyyMMdd-HHmmss"、それ以外は"yyyy/MM/dd HH:mm:ss")
 * @return {string} 現在の日付と時刻 (例: "2024/07/09 14:30:00" または "20240709-143000")
 */
function getCurrentDateTimeJST(fmt="") {
  const now = new Date();
  let formattedDateTime = null;
  if( fmt === "filename"){
    formattedDateTime = Utilities.formatDate(now, "Asia/Tokyo", "yyyyMMdd-HHmmss");
  }
  else{
    formattedDateTime = Utilities.formatDate(now, "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");
  }
  return formattedDateTime;
}
function getDateTimeJST(now, fmt=""){
  let formattedDateTime = null;
  switch(fmt){
    case "year":
      formattedDateTime = Utilities.formatDate(now, "Asia/Tokyo", "yyyy");
      break;
    case "year_month":
      formattedDateTime = Utilities.formatDate(now, "Asia/Tokyo", "yyyyMM");
      break;
    case "year_month_day":
      formattedDateTime = Utilities.formatDate(now, "Asia/Tokyo", "yyyyMMdd");
      break;
    default: 
      formattedDateTime = Utilities.formatDate(now, "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");
  }
  return formattedDateTime;
}
/**
 * @description 現在の日付と時刻をJSTでコンソールに表示します。
 */
function displayCurrentDateTimeJST() {
  console.log(getCurrentDateTimeJST());
}


/**
 * @description 現在の日付をJSTで指定された形式で取得します。
 * @param {string} fmt 形式 ("filename"の場合は"yyyy-MM-dd"、それ以外は"yyyy/MM/dd")
 * @return {string} 現在の日付 (例: "2024-07-09" または "20240709-143000")
 */
function getCurrentDateJST(fmt="") {
  const now = new Date();
  let formattedDateTime = null;
  if( fmt === "filename"){
    formattedDate = Utilities.formatDate(now, "Asia/Tokyo", "yyyy-MM-dd");
  }
  else{
    formattedDate = Utilities.formatDate(now, "Asia/Tokyo", "yyyy/MM/dd");
  }
  return formattedDate;
}

/**
 * @description 現在の日付をJSTでコンソールに表示します。
 */
function displayCurrentDate() {
  console.log(getCurrentDateJST());
  console.log(getCurrentDateJST("filename"));
}