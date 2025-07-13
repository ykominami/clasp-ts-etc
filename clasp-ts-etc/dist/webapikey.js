function z(){
  spreadsheetId = PropertiesService.getScriptProperties().getProperty("ALL_API_SPREADSHEET_ID");
  let array = getAllSheetNames(spreadsheetId);
  console.log(array);
}

/**
 * ヘッダーとデータ配列、およびフィールド名の配列を受け取り、
 * 指定されたすべてのフィールドに値を持つ行のデータを抽出してオブジェクトの配列を返します。
 *
 * @param {string[]} headers ヘッダー行の配列。
 * @param {any[][]} data データ行の2次元配列 (ヘッダーを含まない)。
 * @param {string[]} fields 抽出対象のフィールド名（ヘッダー名）の配列。
 * @return {Object[]} 指定されたフィールドをキー、対応する値を値とするオブジェクトの配列。
 * @throws {Error} 指定されたフィールドのいずれかがヘッダーに見つからない場合。
 */
function processDataWithFields(headers, data, fields) {
  if (!headers || !Array.isArray(headers)) {
    throw new Error('headers パラメータが有効な配列ではありません。');
  }
  if (!data || !Array.isArray(data)) {
    throw new Error('data パラメータが有効な配列ではありません。');
  }
  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    throw new Error('fields パラメータは空でないフィールド名の配列である必要があります。');
  }

  // 各フィールドの列インデックスを検索
  const fieldCols = {};
  const notFoundFields = [];
  for (const field of fields) {
    const colIndex = headers.indexOf(field);
    if (colIndex < 0) {
      notFoundFields.push(field);
    }
    fieldCols[field] = colIndex;
  }

  // 見つからないフィールドがあればエラーをスロー
  if (notFoundFields.length > 0) {
    throw new Error(`ヘッダーに次のフィールドが見つかりません: ${notFoundFields.join(', ')}`);
  }

  const result = [];
  Logger.log(`処理対象データ行数: ${data.length}`);

  // データ行をループ
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const obj = {};
    let allFieldsHaveValue = true;
    const logValues = [];

    // 指定されたフィールドの値をチェックし、オブジェクトを構築
    for (const field of fields) {
      const colIndex = fieldCols[field];
      // 配列外アクセスを防ぐチェック
      if (colIndex >= row.length) {
         Logger.log(`警告: 行 ${i+1} の列インデックス ${colIndex} (${field}) が範囲外です。行の長さ: ${row.length}`);
         allFieldsHaveValue = false; // 値が存在しないとみなす
         break; // この行の処理を中断
      }

      const value = row[colIndex];

      // 値が空('')またはnull/undefinedでないかチェック
      if (value === '' || value == null) { // == null は undefined もチェックします
        allFieldsHaveValue = false;
        logValues.push(`${field}=<空>`);
        break; // いずれかのフィールドが空なら、この行は対象外
      }
      obj[field] = value.toString(); // 値を文字列に変換して格納
      logValues.push(`${field}=${value}`);
    }

    Logger.log(`行 ${i+1}: ${logValues.join(' ')}`);

    // すべてのフィールドに値があれば結果に追加
    if (allFieldsHaveValue) {
      result.push(obj);
      Logger.log(`行 ${i+1}: 条件を満たすため結果に追加しました。`);
    } else {
      Logger.log(`行 ${i+1}: 条件を満たさないためスキップしました。`);
    }
  }

  Logger.log(`抽出結果件数: ${result.length}`);
  return result;
}

function getAPIKey(header, values, name) {
  let key = null;
  let developer_access_token;
  let AppName;
  let Description;
  let APIkey;
  let url;
  let name2;
  let project;
  let platform;
  switch(name){
    case "BraveSearch":
      key = processDataWithFields(header, values, ['plan', 'name', 'API_KEY'])
      break;
    case "OpenAI":
      key = processDataWithFields(header, values, ['name', 'API_KEY'])
      break;
    case 'Gemini':
      key = processDataWithFields(header, values, ['PROJECT','NAME','API-KEY'])
      break;
    case 'Anthropic':
      key = processDataWithFields(header, values, ['NAME', 'API-KEY'])
      // key = getApiKeyWithFields(header, values, 'NAME', 'API-KEY')
      break;
    case 'cohere':
      key = processDataWithFields(header, values, ['API-KEY'])
      break;
    case 'amazon':
      key = processDataWithFields(header, values, ['ouser',	'Consumerkey',	'Consumersecret'])
      break;
    case 'github':
      key = processDataWithFields(header, values, ['label','api-key','date'])
      break;
    case 'slack':
      key = processDataWithFields(header, values, ['kind','name','url'])
      // key = getApiKeyWithFields(header, values, 'kind','name','url');
      break;
    case 'slack-webhook':
      key = processDataWithFields(header, values, ['slack-webhook', 'dynalist'])
      // key = getApiKeyWithFields(header, values, 'slack-webhook', 'dynalist');
      break;
    case 'bitbucket':
      key = processDataWithFields(header, values, ['cosumer',	'secret'])
     //  key = getApiKeyWithFields(header, values, 'cosumer',	'secret');
      break;
    case 'chocolaty':
      key = processDataWithFields(header, values, ['api-key'])
      // key = getApiKeyWithFields(header, values, 'api-key');
      break;
    case 'evernote':
      key = processDataWithFields(header, values, ['provider','activate','service','name','Consumerkey','Consumersecret'])
      break;
    case 'evernote-developer':
      key = processDataWithFields(header, values, ['valid','name','developer-token','url','End-datetime'])
      break;
    case 'twitter':
      key = processDataWithFields(header, values, ['service','name','description','Consumerkey','Consumersecret','oauth_token','oauth_token_secret','scope','Request-token-URL','Authorize-URL','Access-token-URL','Callback-URL','website'])
      break;
    case 'Facebook':
      key = processDataWithFields(header, values, ['name','description','App-ID','API-Version','App-Token','User-Token','Consumerkey','	App-Secret','website'])
      break;
    case 'bitly-generic':
      key = processDataWithFields(header, values, ['Generic-Access-Token'])
      break;
    case 'feedly':
      key = processDataWithFields(header, values, ['user-id','developer-access-token'])
      break;
    case 'diigo':
      key = processDataWithFields(header, values, ['AppName', 'Description', 'APIkey'])
      break;
    case 'hatena-id':
      key = processDataWithFields(header, values, ['Hatena-ID','API-Key','url'])
      break;
    case 'hatena':
      key = processDataWithFields(header, values, ['provider','name','Consumerkey','Consumersecret','RequestTokenURL','Authorize-URL','Access-token-URL'])
      break;
    case 'pocket':
      key = processDataWithFields(header, values, ['NAME','PLATFORM','CONSUMER KEY'])
      break;
    case 'rakuten':
      key = processDataWithFields(header, values, ['applicationId','developerId','application_secret','affiliateId'])
      break;
    case 'akismet':
      key = processDataWithFields(header, values, ['service','APIkey'])
      break;
    case 'yahoo-ykominamijp':
      key = processDataWithFields(header, values, ['service','user','name','APIkey'])
      break;
    case 'LINE':
      key = processDataWithFields(header, values, ['name','url','チャンネル','URL','チャンネルID','チャンネルid','チャンネル説明','メールアドレス','プライバシーポリシーURL','サービス利用規約URL','アプリタイプ','権限','チャンネルシークレット','アサーション署名キー','あなたのユーザID'])
      break;
    case 'DeepL':
      key = processDataWithFields(header, values, ['お客様の登録番号','サポート','登録取り消し','認証キー','API-DOMAIN','URL'])
      break;
    case 'VeyraX':
      key = processDataWithFields(header, values, ['API_KEY'])
      break;
    case 'Sert':
      key = processDataWithFields(header, values, ['PRIVATE_API_KEY'])
      break;
    case 'gitlab':
      key = processDataWithFields(header, values, ['name','pat','expire'])
      break;
    case 'paypal-classic':
      key = processDataWithFields(header, values, ['user','password','signature','APIkey','Consumerkey','Consumersecret','oauth_token','oauth_token_secret','scope','ClientID','Clientsecret','Request-token-URL','Authorize-URL','Access_token_URL','Callback_URL','web_site','api-url','public_key_fingerprints'])
      break;
			

    case 'Azure':
      key = "";
      break;
    case 'Google':
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
