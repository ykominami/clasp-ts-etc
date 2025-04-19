//
const ENV = new Env();

/**
 * doGet - GETリクエストを受け取り、スプレッドシートを作成してリダイレクト
 *
 * @param {Object} e リクエストイベントオブジェクト
 * @return {HtmlOutput} 新しく作成されたスプレッドシートへのリダイレクト
 */
function doGet(e) {
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
function testa(){
  const kind = "docs"
  const rettype = "showUrl"
  // const folderId = ENV.oneDaysFolderId
  // const fileName = null
  const pathArray = getPathArrayUnder1DAYFolderWithToday()
  folderId = YKLibb.getFolderByPath(pathArray).getId()

  const fileName = getCurrentDateTimeJST("filename")
  getOrCreateGoogleAppsFileUnderFolderAndRetX(kind, rettype, folderId, fileName)
}
function getOrCreateGoogleAppsFileUnderFolderAndRetX(kind, rettype, folderId, fileName){
  if( !folderId ){
    folderId = ENV.oneDaysFolderId
  }
  if( !fileName ){
    fileName = ENV.defaultFileName
  }
  return YKLibb.getOrCreateGoogleAppsFileUnderFolderAndRet(kind, rettype, folderId, fileName);
}
/**
 * execCmd - 引数に含まれるcmdに対応した処理をする('new_gss': POSTリクエストを受け取り、スプレッドシートを作成してリダイレクト
 *
 * @param {Object} paramx GETメソッドまたはPOSTメソッドのパラメータオブジェクト
 * @return {HtmlOutput} cmdが"new_gss"の場合:新しく作成されたスプレッドシートへのリダイレクト
 */
function execCmd(paramx){
  let cmd;
  let folderId;
  let fileName;
  let kind;
  let url;
  let spreadsheetId;
  let sheetName;
  // if (Object.keys(paramx).includes("cmd") ){
  if ("cmd" in paramx ){
    cmd = paramx.cmd;
  }
  else{
    cmd = "new_gss";
  }
  const rettype = paramx.rettype;
  switch(cmd){
    case 'new_gss':
      try {
        folderId = paramx.folderId;
        fileName = paramx.fileName;
        // スプレッドシートを作成してリダイレクト(パラメータがない場合はデフォルト値が使用される)
        kind = "gss";
        return getOrCreateGoogleAppsFileUnderFolderAndRetX(kind, rettype, folderId, fileName);
      } catch (error) {
        // エラーメッセージを表示
        return HtmlService.createHtmlOutput("<b>エラー: " + error.toString() + "</b>");
      }
      break;
    case 'new_docs':
      try {
        folderId = paramx.folderId;
        fileName = paramx.fileName;
        if( !folderId ){
          const pathArray = getPathArrayUnder1DAYFolderWithToday()
          folderId = YKLibb.getFolderByPath(pathArray).getId()
        }
        if( !fileName ){
          ENV.oneDaysFolderName
          fileName = getCurrentDateTimeJST("filename");
        }
        kind = "docs";
        return getOrCreateGoogleAppsFileUnderFolderAndRetX(kind, rettype, folderId, fileName);
      } catch (error) {
        // エラーメッセージを表示
        return HtmlService.createHtmlOutput("<b>エラー: " + error.toString() + "</b>");
      }
      break;
    case 'new_docs_date':
      try {
        folderId = paramx.folderId;
        if( !folderId ){
          folderId = ENV.dailyLogFolderId;
        }
        fileName = paramx.fileName;
        if( !fileName ){
          fileName = getCurrentDateJST("filename");
        }
        kind = "docs";
        return YKLibb.getOrCreateGoogleAppsFileUnderFolderAndRet(kind, rettype, folderId, fileName);
      } catch (error) {
        // エラーメッセージを表示
        return HtmlService.createHtmlOutput("<b>エラー: " + error.toString() + "</b>");
      }
      break;
    case 'new_chomemo':
      try {
        // folderId = PropertiesService.getScriptProperties().getProperty('CHOMEMO_FOLDER_ID');
        folderId = ENV.chomemoFolderId;
        // chomemoFolderName = PropertiesService.getScriptProperties().getProperty('CHOMEMO_FOLDER_NAME');
        Logger.log(`folderId=${folderId}`);

        // folderId = "12wN06ImleS9bc43aygwllQe5mVQaW_Xt"; // 0-inbox>0-0>chomemo
        fileName = paramx.fileName;
        kind = "docs";
        if( !fileName ){
          return YKLibb.getOrCreateGoogleAppsFileUnderFolderAndRet(kind, rettype, folderId);
        }
        else{
          return YKLibb.getOrCreateGoogleAppsFileUnderFolderAndRet(kind, rettype, folderId, fileName);
        }
      } catch (error) {
        Logger.log(`error 1 ${error.toString()}`);
        Logger.log('エラー発生場所: ' + error.stack);
        // エラーメッセージを表示
        return HtmlService.createHtmlOutput("<b>エラー: " + error.toString() + "</b>");
      }
      break;
    case 'current_date':
      // 現在の日時を取得
      var now = new Date();

      // JSON 形式でレスポンスを作成
      var response = {
        "datetime": now.toISOString() // ISO 8601 形式で日時を返す
      };

      // レスポンスを返す
      return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);

    case 'redirect':
      // url = PropertiesService.getScriptProperties().getProperty('OUTER_HOST_URL');
      url = ENV.outerHostUrl;
      return HtmlService.createHtmlOutput(
    '<html><head><meta http-equiv="refresh" content="0; url=' + url + '"></head><body></body></html>');

    case 'link':
      // url = PropertiesService.getScriptProperties().getProperty('OUTER_HOST_URL');
      url = ENV.outerHostUrl;
      // リンクを含むHTMLレスポンスを返す
      return HtmlService.createHtmlOutput(
        `<html><head><base target="_top" /></head><body><a href="${url}">Click here to visit the site</a></body></html>`
      );
    case 'web_api':
      allApiSpreadsheetId = ENV.allApiSpreadsheetId;
      const [header, values, dataRange] = YKLibb.setupSpreadsheet(spreadsheetId, sheetName);
      const key = getAPIKey(header, values, sheetName);
      return ContentService.createTextOutput(JSON.stringify({"api-key": key})).setMimeType(ContentService.MimeType.JSON);
    default:
      return HtmlService.createHtmlOutput("<b>エラー: " + error.toString() + "</b>");
  }
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
    getDateTimeJST(today, "year"),
    getDateTimeJST(today, "year_month"),
    getDateTimeJST(today, "year_month_day")]
}
