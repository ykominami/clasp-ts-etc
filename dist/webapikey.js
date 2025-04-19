function z(){
  spreadsheetId = PropertiesService.getScriptProperties().getProperty("ALL_API_SPREADSHEET_ID");
  let array = getAllSheetNames(spreadsheetId);
  console.log(array);
}
function getLevel1(values){
  return values[0][0];
}
function getLevel2(values){
  return values[0][1];
}
function getLevel3(values){
  return values[0][2];
}
function getLevel1and2(values){
  return [ values[0][0], values[0][1] ];
}
function getLevel1and2and3(values){
  return [ values[0][0], values[0][1], values[0][2] ];
}

function getAPIKey(header, values, name) {
  let key = null;
  let consumer = null;
  let secret = null;
  let user_id;
  let developer_access_token;
  let AppName;
  let Description;
  let APIkey;
  let url;
  let name2;
  let project;
  let platform;
  switch(name){
    case "OpenAI":
      key = getLevel2(values);
      break;
    case 'VeyraX':
      key = getLevel1(values);
      break;
    case 'Gemini':
      [project, name2, APIkey] = getLevel1and2and3(values);
      key = APIkey;
      break;
    case 'amazon':
      key = "";
      break;
    case 'Azure':
      key = "";
      break;
    case 'github':
      key = "";
      break;
    case 'bitbucket':
      [consumer, secret] = getLevel1and2(values);
      key = secret;
      break;
    case 'chocolaty':
      key = getLevel1(values);
      break;
    case 'etc':
      key = "";
      break;
    case 'evernote':
      key = getLevel3(values);
      break;
    case 'Google':
      key = "";
      break;
    case 'slack':
      key = "";
      break;
    case 'paypal-classic':
      key = "";
      break;
    case 'twitter':
      key = "";
      break;
    case 'Facebook':
      key = "";
      break;
    case 'bitly-generic':
      key = getLevel1(values);
      break;
    case 'evernote-developer':
      key = "";
      break;
    case 'feedly':
      [user_id, developer_access_token] =  getLevel1and2(values);
      key = developer_access_token;
      break;
    case 'diigo':
      [AppName, Description, APIkey] = getLevel1and2and3(values);
      key = APIkey;
      break;
    case 'hatena-id':
      [user_id, APIkey, url] = getLevel1and2and3(values);
      key = APIkey;
      break;
    case 'hatena':
      key = "";
      break;
    case 'pocket':
      [name2, platform, cosumer]= getLevel1and2and3(values);
      key = cosumer;
      break;
    case 'rakuten':
      key = "";
      break;
    case 'akismet':
      key = "";
      break;
    case 'yahoo-ykominamijp':
      key = "";
      break;
    case 'LINE':
      key = "";
      break;
    case 'DeepL':
      key = "";
      break;
    case 'Sert':
      key = "";
      break;
    case 'gitlab':
      key = "";
      break;
    // case '':
    //  key = "";
    //  break;
      
    default:
      ;
  }
  return key;

}
/**
 * スプレッドシートIDを指定して、そのスプレッドシートに含まれるすべてのシートの名前を取得します。
 *
 * @param {string} spreadsheetId - 対象のスプレッドシートのID
 * @returns {string[]} スプレッドシートに含まれるすべてのシートの名前の配列
 * @throws {Error} スプレッドシートが見つからない場合、またはIDが不正な場合にエラーをスローします。
 */
function getAllSheetNames(spreadsheetId) {
  try {
    // スプレッドシートを開く
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);

    // スプレッドシート内のすべてのシートを取得
    const sheets = spreadsheet.getSheets();

    // 各シートの名前を抽出して配列に格納
    const sheetNames = sheets.map(sheet => sheet.getName());

    return sheetNames;
  } catch (error) {
    // エラーが発生した場合、エラーメッセージをログに出力し、エラーをスロー
    console.error(`Error: ${error.message}`);
    throw new Error(`Failed to get sheet names. Check spreadsheet ID: ${spreadsheetId}`);
  }
}
