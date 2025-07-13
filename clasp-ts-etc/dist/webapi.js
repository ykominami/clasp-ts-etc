//
const ENV = new Env();

/**
 * doGet - GETリクエストを受け取り、スプレッドシートを作成してリダイレクト
 *
 * @param {Object} e リクエストイベントオブジェクト
 * @return {HtmlOutput} 新しく作成されたスプレッドシートへのリダイレクト
 */
function doGet(e) {
  // return pc_config(e.parameter, rettye);
  return execCmd(e.parameter);
}

/**
 * doPost - POSTリクエストを受け取り、スプレッドシートを作成してリダイレクト
 *
 * @param {Object} e リクエストイベントオブジェクト
 * @return {HtmlOutput} 新しく作成されたスプレッドシートへのリダイレクト
 */
function doPost(e) {
  // POSTデータからフォルダIDとファイル名を取得 (JSON形式を想定)
  // const postData = JSON.parse(e.postData.contents);
  const postData = e.parameter;
  return execCmd(postData);
}

function getOrCreateGoogleAppsFileUnderFolderAndRetX(kind, rettype, folderId, fileName){
  if( !folderId ){
    folderId = ENV.oneDaysFolderId
  }
  if( !fileName ){
    fileName = ENV.defaultFileName
  }
  return YKLibb.Googleapi.getOrCreateGoogleAppsFileUnderFolderAndRet(kind, rettype, folderId, fileName);
}
function new_gss(paramx, rettype){
  const folderId = paramx.folderId;
  let fileName = paramx.fileName;
  const kind = "gss";
  if (!fileName) {
    fileName = Util.getCurrentDateTimeJST("filename");
  }
  return getOrCreateGoogleAppsFileUnderFolderAndRetX(kind, rettype, folderId, fileName);
}
function new_docs(paramx, rettype){
  let folderId = paramx.folderId;
  let fileName = paramx.fileName;
  if (!folderId) {
    const pathArray = getPathArrayUnder1DAYFolderWithToday();
    folderId = YKLibb.Googleapi.getFolderByPath(pathArray).getId();
  }
  if (!fileName) {
    fileName = Util.getCurrentDateTimeJST("filename");
  }
  const kind = "docs";
  return getOrCreateGoogleAppsFileUnderFolderAndRetX(kind, rettype, folderId, fileName);
}
function new_docs_date(paramx, rettype){
  let folderId = paramx.folderId;
  if (!folderId) {
    folderId = ENV.dailyLogFolderId;
  }
  let fileName = paramx.fileName;
  if (!fileName) {
    fileName = Util.getCurrentDateJST("filename");
  }
  const kind = "docs";
  return getOrCreateGoogleAppsFileUnderFolderAndRetX(kind, rettype, folderId, fileName);
}
function new_chomeme(paramx, rettype){
  const folderId = ENV.chomemoFolderId;
  Logger.log(`folderId=${folderId}`);
  const fileName = paramx.fileName;
  const kind = "docs";
  if (!fileName) {
    return YKLibb.Googleapi.getOrCreateGoogleAppsFileUnderFolderAndRet(kind, rettype, folderId);
  } else {
    return YKLibb.Googleapi.getOrCreateGoogleAppsFileUnderFolderAndRet(kind, rettype, folderId, fileName);
  }
}
function link(paramx, rettype){
  const url = ENV.outerHostUrl;
  return HtmlService.createHtmlOutput(
    `<html><head><base target="_top" /></head><body><a href="${url}">Click here to visit the site</a></body></html>`
  );
}
function current_date(paramx, rettype){
  const now = new Date();
  const response = {
    "datetime": now.toISOString()
  };
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}
function redirect(paramx, rettype){
  const url = ENV.outerHostUrl;
  return HtmlService.createHtmlOutput(
      '<html><head><meta http-equiv="refresh" content="0; url=' + url + '"></head><body></body></html>');
}
function web_api(paramx, rettype){
  const allApiSpreadsheetId = ENV.allApiSpreadsheetId;
  const sheetName = paramx.name;
  const [header, values, dataRange] = YKLibb.Gssx.setupSpreadsheet(allApiSpreadsheetId, sheetName);
  const key = getAPIKey(header, values, sheetName);
  return ContentService.createTextOutput(JSON.stringify({ "api-key": key })).setMimeType(ContentService.MimeType.JSON);
}
function web_api_s(paramx, rettype){
  const allApiSpreadsheetId = ENV.allApiSpreadsheetId;
  const sheetName = paramx.name;
  Logger.log(`sheetName=${sheetName}`)
  const [header, values, dataRange] = YKLibb.Gssx.setupSpreadsheet(allApiSpreadsheetId, sheetName);
  const key = getAPIKey(header, values, sheetName);
  return JSON.stringify({ "api-key": key });
}
function web_api_list(paramx, rettype){
  const allApiSpreadsheetId = ENV.allApiSpreadsheetId;
  const sheetNameList = YKLibb.Gssx.getAllWorksheetNames(allApiSpreadsheetId);
  return ContentService.createTextOutput(JSON.stringify( sheetNameList, null, 2 )).setMimeType(ContentService.MimeType.JSON);
}
function pc_config(paramx, rettype){
  const pcConfigSpreadsheetId = ENV.pcConfigSpreadsheetId;
  const sheetNameList = YKLibb.Gssx.getAllWorksheetNames(pcConfigSpreadsheetId);
  return ContentService.createTextOutput(JSON.stringify( sheetNameList, null, 2 )).setMimeType(ContentService.MimeType.JSON);
  // return ContentService.createTextOutput(JSON.stringify( pcConfigSpreadsheetId, null, 2 )).setMimeType(ContentService.MimeType.JSON);
}
function planning(){
  const planningSpreadsheetId = ENV.planningSpreadsheetId;
  const sheetName = "Sheet1"
  const  [spreadsheet, worksheet] = YKLibb.Gssx.setupForSpreadsheet(planningSpreadsheetId, sheetName)
  //  const [values0, dataRange] = YKLibb.Gssx.getValuesFromSheet(worksheet)
  const range = YKLibb.Gssx.getMinimalContentRange(worksheet)
  // const range = YKLibb.Gssx.adjustDataRangeHeight(worksheet)
  const values = range.getValues();
  const objects = Util.createArrayOfObjects(values);

   Logger.log(`0 values=${JSON.stringify(values)}`)
   Logger.log(`====`)
   Logger.log(`1 objects=${JSON.stringify(objects)}`)
  // return ContentService.createTextOutput(JSON.stringify( sheetNameList, null, 2 )).setMimeType(ContentService.MimeType.JSON);
}

const commandHandlers = {
  'pc_config': (paramx, notUse) => { // 引数を追加
    return pc_config(paramx, notUse);
  },
  'new_gss': (paramx, notUse) => {
    try {
      return new_gss(paramx, paramx.rettype);
    } catch (error) {
      const mes = [`fileName=${fileName}|`, error.message, error.name, ...error.stack].join("");
      return HtmlService.createHtmlOutput("<b>1 エラー: " + mes + "</b>");
    }
  },
  'new_docs': (paramx, notUse) => {
    try {
      return new_docs(paramx, paramx.rettype);
    } catch (error) {
      return HtmlService.createHtmlOutput("<b>2 エラー: " + error.toString() + "</b>" + JSON.stringify(error.stack) );
    }
  },
  'new_docs_date': (paramx, notUse) => {
    try {
      return new_docs_date(paramx, paramx.rettype);
    } catch (error) {
      return HtmlService.createHtmlOutput("<b>エラー 3: " + error.toString() + "</b>");
    }
  },
  'new_chomemo': (paramx, notUse) => {
    try {
      return new_chomemo(paramx, paramx.rettype);
    } catch (error) {
      Logger.log(`error 1 ${error.toString()}`);
      Logger.log('エラー発生場所: ' + error.stack);
      return HtmlService.createHtmlOutput("<b>エラー 4: " + error.toString() + "</b>");
    }
  },
  'current_date': (paramx, notUse) => { // 引数を追加
   return current_date(paramx, paramx.rettye);
  },
  'redirect': (paramx, notUse) => { // 引数を追加
    return redirect(paramx, paramx.rettype);
  },
  'link': (paramx, notUse) => { // 引数を追加
    return link(paramx, paramx.rettype);
  },
  'web_api': (paramx, sheetName) => {
    return web_api(paramx, sheetName);
  },
  'web_api_s': (paramx, sheetName) => {
    return web_api_s(paramx, sheetName);
  },
  'web_api_list': (paramx, notUse) => {
    return web_api_list(paramx, notUse);
  },
  'pc_conifg': (notUsea, notUseb) => {
    return pc_config(notUsea, notUseb);
  },
  'default': (error) => {
    return HtmlService.createHtmlOutput("<b>エラー: " + error.toString() + "</b>");
  }
};


/**
 * execCmd - 引数に含まれるcmdに対応した処理をする('new_gss': POSTリクエストを受け取り、スプレッドシートを作成してリダイレクト
 *
 * @param {Object} paramx GETメソッドまたはPOSTメソッドのパラメータオブジェクト
 * @return {HtmlOutput} cmdが"new_gss"の場合:新しく作成されたスプレッドシートへのリダイレクト
 */
function execCmd(paramx){
  let cmd;
  let secondArg;
  // if (Object.keys(paramx).includes("cmd") ){
  if ("cmd" in paramx ){
    cmd = paramx.cmd;
  }
  else{
    // cmd = "new_gss";
    cmd = "";
  }
  switch(cmd){
    case "web_api":{
      secondArg = paramx.name;
    }
    case "web_api_list":{
      secondArg = "";
    }
    default: {
      secondArg = paramx.rettype;
    }
  }
  const handler = commandHandlers[cmd] || commandHandlers['default'];
  return handler(paramx, secondArg);
}

/**
 * Google ドライブのルートフォルダ直下にあるフォルダとファイルの一覧を取得し、ログに出力します。
 */
function listFilesInRootFolder() {
  // ルートフォルダを取得
  const rootFolder = DriveApp.getRootFolder();

  // ルートフォルダ直下のファイルとフォルダの一覧を取得
  const filesAndFolders = getFilesAndFoldersInFolder(rootFolder);

  // Markdown 形式でログに出力
  Logger.log(filesAndFolders);
}

/**
 * Google ドライブのルートフォルダ直下にあるフォルダとファイルの一覧を取得し、ログに出力します。
 */
function listFilesInRootFolder() {
  // ルートフォルダを取得
  const rootFolder = DriveApp.getRootFolder();

  // ルートフォルダ直下のファイルとフォルダの一覧を取得
  const filesAndFolders = getFilesAndFoldersInFolder(rootFolder);

  // Markdown 形式でログに出力
  Logger.log(filesAndFolders);
}

/**
 * 指定されたフォルダ直下にあるファイルとフォルダの一覧を取得する。
 *
 * @param {Folder} folder - 検索対象のフォルダ
 * @returns {string} ファイルとフォルダの情報を含む Markdown 形式の文字列
 */
function getFilesAndFoldersInFolder(folder) {
  let markdownOutput = "# " + folder.getName() + " の中身\n\n"; // ルートフォルダ名を `#` に変更

  // フォルダを取得
  const folders = getFoldersInFolder(folder);
  folders.forEach(folder => {
    markdownOutput += `## ${folder.name}\n`; // 名前を `##` に変更
    markdownOutput += `### Type: Folder\n`; // その他の項目を `###` に変更
    markdownOutput += `### ID: ${folder.id}\n`;
    markdownOutput += `### URL: ${folder.url}\n\n`;
  });

  // ファイルを取得
  const files = getFilesInFolder(folder);
  files.forEach(file => {
    markdownOutput += `## ${file.name}\n`; // 名前を `##` に変更
    markdownOutput += `### Type: File\n`; // その他の項目を `###` に変更
    markdownOutput += `### ID: ${file.id}\n`;
    markdownOutput += `### URL: ${file.url}\n\n`;
  });

  return markdownOutput;
}

/**
 * 指定されたフォルダ直下にあるフォルダの一覧を取得する。
 *
 * @param {Folder} folder - 検索対象のフォルダ
 * @returns {Array<{type: string, name: string, id: string, url: string}>} フォルダの情報を含むオブジェクトの配列
 */
function getFoldersInFolder(folder) {
  const folders = [];
  const folderIterator = folder.getFolders();
  while (folderIterator.hasNext()) {
    const subFolder = folderIterator.next();
    folders.push({
      type: "Folder",
      name: subFolder.getName(),
      id: subFolder.getId(),
      url: subFolder.getUrl()
    });
  }
  return folders;
}

/**
 * 指定されたフォルダ直下にあるファイルの一覧を取得する。
 *
 * @param {Folder} folder - 検索対象のフォルダ
 * @returns {Array<{type: string, name: string, id: string, url: string}>} ファイルの情報を含むオブジェクトの配列
 */
function getFilesInFolder(folder) {
  const files = [];
  const fileIterator = folder.getFiles();
  while (fileIterator.hasNext()) {
    const file = fileIterator.next();
    files.push({
      type: "File",
      name: file.getName(),
      id: file.getId(),
      url: file.getUrl()

    });
  }
  return files;
}


function getPathArrayUnder1DAYFolderWithToday(){
  const today = new Date()
  return [ENV.oneDaysFolderName,
    Util.getDateTimeJST(today, "year"),
    Util.getDateTimeJST(today, "year_month"),
    Util.getDateTimeJST(today, "year_month_day")]
}
