//
function doGet(e){
  const webapi = new Webapi(ENV);
  webapi.doGet(e);
}

function doPost(e){
  const webapi = new Webapi(ENV);
  webapi.doPost(e);
}

/**
 * Webapi - Google Apps Script用のWeb APIクラス
 */
class Webapi {
  constructor(env){
    this.env = env;
    this.webapikey = new Webapikey(env);
	  // コマンドハンドラーの定義
	this.commandHandlers = {
	    'pc_config': (paramx, notUse) => { // 引数を追加
	      return this.pc_config(paramx, notUse);
	    },
	    'new_gss': (paramx, notUse) => {
	      try {
	        return this.new_gss(paramx, paramx.rettype);
	      } catch (error) {
	        const mes = [`fileName=${fileName}|`, error.message, error.name, ...error.stack].join("");
	        return HtmlService.createHtmlOutput("<b>1 エラー: " + mes + "</b>");
	      }
	    },
	    'new_docs': (paramx, notUse) => {
	      try {
	        return this.new_docs(paramx, paramx.rettype);
	      } catch (error) {
	        return HtmlService.createHtmlOutput("<b>2 エラー: " + error.toString() + "</b>" + JSON.stringify(error.stack) );
	      }
	    },
	    'new_docs_date': (paramx, notUse) => {
	      try {
	        return this.new_docs_date(paramx, paramx.rettype);
	      } catch (error) {
	        return HtmlService.createHtmlOutput("<b>エラー 3: " + error.toString() + "</b>");
	      }
	    },
	    'new_chomemo': (paramx, notUse) => {
	      try {
	        return this.new_chomeme(paramx, paramx.rettype);
	      } catch (error) {
	        Logger.log(`error 1 ${error.toString()}`);
	        Logger.log('エラー発生場所: ' + error.stack);
	        return HtmlService.createHtmlOutput("<b>エラー 4: " + error.toString() + "</b>");
	      }
	    },
	    'current_date': (paramx, notUse) => { // 引数を追加
	     return this.current_date(paramx, paramx.rettype);
	    },
	    'redirect': (paramx, notUse) => { // 引数を追加
	      return this.redirect(paramx, paramx.rettype);
	    },
	    'link': (paramx, notUse) => { // 引数を追加
	      return this.link(paramx, paramx.rettype);
	    },
	    'web_api': (paramx, sheetName) => {
	      return this.web_api(paramx, sheetName);
	    },
	    'web_api_2': (paramx, sheetName) => {
	      return this.web_api_2(paramx, sheetName);
	    },
	    'web_api_s': (paramx, sheetName) => {
	      return this.web_api_s(paramx, sheetName);
	    },
	    'web_api_list': (paramx, notUse) => {
	      return this.web_api_list(paramx, notUse);
	    },
	    'default': (error) => {
	      return HtmlService.createHtmlOutput("<b>Error: " + error.toString() + "</b>");
	    }
	  };

  }
  /**
   * doGet - GETリクエストを受け取り、スプレッドシートを作成してリダイレクト
   *
   * @param {Object} e リクエストイベントオブジェクト
   * @return {HtmlOutput} 新しく作成されたスプレッドシートへのリダイレクト
   */
  doGet(e) {
    // return pc_config(e.parameter, rettye);
    return this.execCmd(e.parameter);
  }

  /**
   * doPost - POSTリクエストを受け取り、スプレッドシートを作成してリダイレクト
   *
   * @param {Object} e リクエストイベントオブジェクト
   * @return {HtmlOutput} 新しく作成されたスプレッドシートへのリダイレクト
   */
  doPost(e) {
    // POSTデータからフォルダIDとファイル名を取得 (JSON形式を想定)
    // const postData = JSON.parse(e.postData.contents);
    const postData = e.parameter;
    return this.execCmd(postData);
  }

  /**
   * execCmd - 引数に含まれるcmdに対応した処理をする('new_gss': POSTリクエストを受け取り、スプレッドシートを作成してリダイレクト
   *
   * @param {Object} paramx GETメソッドまたはPOSTメソッドのパラメータオブジェクト
   * @return {HtmlOutput} cmdが"new_gss"の場合:新しく作成されたスプレッドシートへのリダイレクト
   */
  execCmd(paramx){
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
      case "web_api_2":{
        secondArg = paramx.name;
      }
      case "web_api_s":{
        secondArg = paramx.name;
      }
      case "web_api_list":{
        secondArg = "";
      }
      default: {
        secondArg = paramx.rettype;
      }
    }
    const handler = this.commandHandlers[cmd] || this.commandHandlers['default'];
    return handler(paramx, secondArg);
  }

  getOrCreateGoogleAppsFileUnderFolderAndRetX(kind, rettype, folderId, fileName){
    if( !folderId ){
      folderId = this.env.oneDaysFolderId
    }
    if( !fileName ){
      fileName = this.env.defaultFileName
    }
    return YKLibb.Gapps.getOrCreateGoogleAppsFileUnderFolderAndRet(kind, rettype, folderId, fileName);
  }

  new_gss(paramx, rettype){
    const folderId = paramx.folderId;
    let fileName = paramx.fileName;
    const kind = "gss";
    if (!fileName) {
      fileName = Util.getCurrentDateTimeJST("filename");
    }
    return this.getOrCreateGoogleAppsFileUnderFolderAndRetX(kind, rettype, folderId, fileName);
  }

  new_docs(paramx, rettype){
    let folderId = paramx.folderId;
    let fileName = paramx.fileName;
    if (!folderId) {
      const pathArray = this.getPathArrayUnder1DAYFolderWithToday();
      folderId = YKLibb.Gapps.getFolderByPath(pathArray).getId();
    }
    if (!fileName) {
      fileName = Util.getCurrentDateTimeJST("filename");
    }
    const kind = "docs";
    return this.getOrCreateGoogleAppsFileUnderFolderAndRetX(kind, rettype, folderId, fileName);
  }

  new_docs_date(paramx, rettype){
    let folderId = paramx.folderId;
    if (!folderId) {
      folderId = this.env.dailyLogFolderId;
    }
    let fileName = paramx.fileName;
    if (!fileName) {
      fileName = Util.getCurrentDateJST("filename");
    }
    const kind = "docs";
    return this.getOrCreateGoogleAppsFileUnderFolderAndRetX(kind, rettype, folderId, fileName);
  }

  new_chomeme(paramx, rettype){
    const folderId = ENV.chomemoFolderId;
    Logger.log(`folderId=${folderId}`);
    const fileName = paramx.fileName;
    const kind = "docs";
    if (!fileName) {
      return YKLibb.Gapps.getOrCreateGoogleAppsFileUnderFolderAndRet(kind, rettype, folderId);
    } else {
      return YKLibb.Gapps.getOrCreateGoogleAppsFileUnderFolderAndRet(kind, rettype, folderId, fileName);
    }
  }

  link(paramx, rettype){
    const url = ENV.outerHostUrl;
    return HtmlService.createHtmlOutput(
      `<html><head><base target="_top" /></head><body><a href="${url}">Click here to visit the site</a></body></html>`
    );
  }

  current_date(paramx, rettype){
    const now = new Date();
    const response = {
      "datetime": now.toISOString()
    };
    return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
  }

  redirect(paramx, rettype){
    const url = ENV.outerHostUrl;
    return HtmlService.createHtmlOutput(
        '<html><head><meta http-equiv="refresh" content="0; url=' + url + '"></head><body></body></html>');
  }

  web_api_sub(paramx, rettype){
    const allApiSpreadsheetId = ENV.allApiSpreadsheetId;
    const sheetName = paramx.name;
    // const [header, totalValues, totalRange]
    const [header, dataValues, totalRange] = YKLibb.Gssx.setupSpreadsheet(allApiSpreadsheetId, sheetName);
    return [header, dataValues, totalRange, sheetName]
  }

  web_api(paramx, rettype, additional = ""){
    const [header, dataValues, totalRange, sheetName] =  this.web_api_sub(paramx, rettype)

    const keyAssocArray = this.webapikey.getAPIKey(header, dataValues, sheetName);
    const str = JSON.stringify({ "additional": additional, "api-key": keyAssocArray })
    return ContentService.createTextOutput(str).setMimeType(ContentService.MimeType.JSON);
  }

  web_api_2(paramx, rettype, additional = ""){
    const [header, dataValues, totalRange, sheetName] =  this.web_api_sub(paramx, rettype)
    const keyAssocArray = this.webapikey.getAPIKey(header, dataValues, sheetName);
    const str = JSON.stringify({ "weg_api_s":"web_api_2", "api-key": keyAssocArray })
    return ContentService.createTextOutput( str ).setMimeType(ContentService.MimeType.JSON);
  }

  web_api_s(paramx, rettype){
    const [header, dataValues, totalRange, sheetName] = this.web_api_sub(paramx, rettype)
    const keyAssocArray = this.webapikey.getAPIKey(header, dataValues, sheetName);
    const str = JSON.stringify({ "weg_api_s":"web_api_s", "api-key": keyAssocArray })
    return ContentService.createTextOutput( str ).setMimeType(ContentService.MimeType.JSON);
  }

  web_api_list(paramx, rettype){
    const allApiSpreadsheetId = ENV.allApiSpreadsheetId;
    const sheetNameList = YKLibb.Gssx.getAllWorksheetNames(allApiSpreadsheetId);
    return ContentService.createTextOutput(JSON.stringify( sheetNameList, null, 2 )).setMimeType(ContentService.MimeType.JSON);
  }

  pc_config(paramx, rettype){
    const pcConfigSpreadsheetId = ENV.pcConfigSpreadsheetId;
    const sheetNameList = YKLibb.Gssx.getAllWorksheetNames(pcConfigSpreadsheetId);
    return ContentService.createTextOutput(JSON.stringify( sheetNameList, null, 2 )).setMimeType(ContentService.MimeType.JSON);
  }

  planning(){
    const planningSpreadsheetId = ENV.planningSpreadsheetId;
    const sheetName = "Sheet1"
    const  [spreadsheet, worksheet] = YKLibb.Gssx.setupForSpreadsheet(planningSpreadsheetId, sheetName)
    const range = YKLibb.Gssx.getMinimalContentRange(worksheet)
    const values = range.getValues();
    const objects = Util.createArrayOfObjects(values);

     Logger.log(`0 values=${JSON.stringify(values)}`)
     Logger.log(`====`)
     Logger.log(`1 objects=${JSON.stringify(objects)}`)
  }

  /**
   * Google ドライブのルートフォルダ直下にあるフォルダとファイルの一覧を取得し、ログに出力します。
   */
  listFilesInRootFolder() {
    // ルートフォルダを取得
    const rootFolder = DriveApp.getRootFolder();

    // ルートフォルダ直下のファイルとフォルダの一覧を取得
    const filesAndFolders = this.getFilesAndFoldersInFolder(rootFolder);

    // Markdown 形式でログに出力
    Logger.log(filesAndFolders);
  }

  /**
   * 指定されたフォルダ直下にあるファイルとフォルダの一覧を取得する。
   *
   * @param {Folder} folder - 検索対象のフォルダ
   * @returns {string} ファイルとフォルダの情報を含む Markdown 形式の文字列
   */
  getFilesAndFoldersInFolder(folder) {
    let markdownOutput = "# " + folder.getName() + " の中身\n\n"; // ルートフォルダ名を `#` に変更

    // フォルダを取得
    const folders = this.getFoldersInFolder(folder);
    folders.forEach(folder => {
      markdownOutput += `## ${folder.name}\n`; // 名前を `##` に変更
      markdownOutput += `### Type: Folder\n`; // その他の項目を `###` に変更
      markdownOutput += `### ID: ${folder.id}\n`;
      markdownOutput += `### URL: ${folder.url}\n\n`;
    });

    // ファイルを取得
    const files = this.getFilesInFolder(folder);
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
  getFoldersInFolder(folder) {
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
  getFilesInFolder(folder) {
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

  getPathArrayUnder1DAYFolderWithToday(){
    const today = new Date()
    return [ENV.oneDaysFolderName,
      Util.getDateTimeJST(today, "year"),
      Util.getDateTimeJST(today, "year_month"),
      Util.getDateTimeJST(today, "year_month_day")]
  }

}
