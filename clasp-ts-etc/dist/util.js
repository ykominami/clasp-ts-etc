/**
 * @description ユーティリティクラス
 */
class Util {
  /**
   * @description 今日の日付と時刻を日本のロケールで取得し、コンソールに出力します。
   * @return {string} 今日の日付と時刻 (例: "2024/07/09 14:30:00")
   */
  static getTodaysDateTimeJa() {
    const now = new Date();
    const formattedDateTime = now.toLocaleString("ja-JP"); // 日本のロケールを指定
    console.log(formattedDateTime); // 例: "2024/07/09 14:30:00"
    return formattedDateTime;
  }

  /**
   * @description 今日の日付と時刻をコンソールに表示します。
   */
  static displayTodaysDate() {
    console.log(Util.getTodaysDateTimeJa());
  }

  /**
   * @description 現在の日付と時刻を日本のロケールで取得します (24時間制)。
   * @return {string} 現在の日付と時刻 (例: "2024/07/09 14:30:00")
   */
  static getCurrentDateTimeJa() {
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
  static getCurrentDateTimeJST(fmt="") {
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

  static getDateTimeJST(now, fmt=""){
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
  static displayCurrentDateTimeJST() {
    console.log(Util.getCurrentDateTimeJST());
  }

  /**
   * @description 現在の日付をJSTで指定された形式で取得します。
   * @param {string} fmt 形式 ("filename"の場合は"yyyy-MM-dd"、それ以外は"yyyy/MM/dd")
   * @return {string} 現在の日付 (例: "2024-07-09" または "20240709-143000")
   */
  static getCurrentDateJST(fmt="") {
    const now = new Date();
    let formattedDate = null;
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
  static displayCurrentDate() {
    console.log(Util.getCurrentDateJST());
    console.log(Util.getCurrentDateJST("filename"));
  }

  static showExceptionInfo(e){
    // Logger.log("エラーが発生しました:");
    Logger.log("  メッセージ:", e.message);
    Logger.log("  名前:", e.name);
    Logger.log("  スタックトレース:", e.stack);
  }

  static createArrayOfObjects(twoDimArray) {
    // 配列が空か、ヘッダー行がない場合はエラーを返すか、空の配列を返します。
    if (!twoDimArray || twoDimArray.length === 0) {
      console.error("入力配列が空か無効です。");
      return [];
    }
  
    // 最初の行をヘッダーとして取得します。
    const headers = twoDimArray[0];
  
    // 結果となる連想配列の配列を格納する変数です。
    const result = [];
  
    // 2行目からデータの処理を開始します。
    // 各データ行をループ処理します。
    for (let i = 1; i < twoDimArray.length; i++) {
      const row = twoDimArray[i]; // 現在のデータ行
      const obj = {}; // 現在の行に対応する新しいオブジェクト
  
      // ヘッダーとデータ行の各要素をペアにしてオブジェクトに格納します。
      for (let j = 0; j < headers.length; j++) {
        // ヘッダーのキーと対応するデータ行の値をペアにします。
        // データ行の要素がヘッダーの数より少ない場合でもエラーにならないようにします。
        obj[headers[j]] = row[j] !== undefined ? row[j] : null;
      }
      result.push(obj); // 作成したオブジェクトを結果配列に追加します。
    }
  
    return result; // 連想配列の配列を返します。
  }
}