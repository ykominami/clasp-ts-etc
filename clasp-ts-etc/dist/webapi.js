function getData(){
  const array = []
  return array
}

//
function doGet(e){
  const webapi = new Webapi(ENV);
  return webapi.doGet(e);
}

function doPost(e){
  const webapi = new Webapi(ENV);
  return webapi.doPost(e);
}

/**
 * Webapi - Google Apps Script用のWeb APIクラス
 */
class Webapi {
  constructor(env){
    this.env = env;
    this.webapikey = new Webapikey();
	  // コマンドハンドラーの定義
	  this.commandHandlers = {
      'task': (_paramx, _notUse) => {
	      try {
  	      return this.taskAndContentService();
	      } catch (error) {
	        const mes = [ error.message, error.name, ...error.stack].join("");
	        return HtmlService.createHtmlOutput("<b>-2 エラー: " + mes + "</b>");
	      }
      },
      'planning': (_paramx, _notUse) => {
	      try {
  	        return this.planningAndContentService();
	      } catch (error) {
	        const mes = [ error.message, error.name, ...error.stack].join("");
	        return HtmlService.createHtmlOutput("<b>-1 エラー: " + mes + "</b>");
	      }
      },
	    'pc_config': (_paramx, _notUse) => { // 引数を追加
	      try {
            return this.pcConfigAndContentService();
	      } catch (error) {
	        const mes = [ error.message, error.name, ...error.stack].join("");
	        return HtmlService.createHtmlOutput("<b>0 エラー: " + mes + "</b>");
	      }
	    },
	    'new_gss': (paramx, _notUse) => {
	      try {
	        return this.new_gss(paramx, paramx.rettype);
	      } catch (error) {
	        const mes = [`paramx.name=${paramx.name}|`, error.message, error.name, ...error.stack].join("");
	        return HtmlService.createHtmlOutput("<b>1 エラー: " + mes + "</b>");
	      }
	    },
	    'new_docs': (paramx, _notUse) => {
	      try {
	        return this.new_docs(paramx, paramx.rettype);
	      } catch (error) {
	        return HtmlService.createHtmlOutput("<b>2 エラー: " + error.toString() + "</b>" + JSON.stringify(error.stack) );
	      }
	    },
	    'new_docs_date': (paramx, _notUse) => {
	      try {
	        return this.new_docs_date(paramx, paramx.rettype);
	      } catch (error) {
	        return HtmlService.createHtmlOutput("<b>3 エラー: " + error.toString() + "</b>");
	      }
	    },
	    'new_chomemo': (paramx, _notUse) => {
	      try {
	        return this.new_chomemo(paramx, paramx.rettype);
	      } catch (error) {
	        Logger.log(`error 1 ${error.toString()}`);
	        Logger.log('エラー発生場所: ' + error.stack);
	        return HtmlService.createHtmlOutput("<b>4 エラー: " + error.toString() + "</b>");
	      }
	    },
	    'current_date': (_paramx, _notUse) => { // 引数を追加
	     return this.currentDateAndContentServices();
	    },
	    'redirect': (_paramx, _notUse) => { // 引数を追加
	      return this.redirectAndHtmlService();
	    },
	    'link': (_paramx, _notUse) => { // 引数を追加
	      return this.linkAndHtmlService();
	    },
	    'web_api': (paramx, _sheetName) => {
	      return this.webApiAndContentService(paramx);
	    },
	    'web_api_2': (paramx, _sheetName) => {
	      return this.webApi2AndContentService(paramx);
	    },
	    'web_api_s': (paramx, _sheetName) => {
	      return this.webApiSAndContentService(paramx);
	    },
	    'web_api_list': (_paramx, _notUse) => {
	      return this.webApiListAndContentService();
	    },
	    'default': (error) => {
	      return HtmlService.createHtmlOutput("<b>default Error: " + error.toString() + "</b>");
	    },
	    '_error': (error) => {
	      return HtmlService.createHtmlOutput("error Error: " + error.toString() + "</b>");
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
    return this.execCmd(e.parameter);
  }

  /**
   * doPost - POSTリクエストを受け取り、スプレッドシートを作成してリダイレクト
   *
   * @param {Object} e リクエストイベントオブジェクト
   * @return {HtmlOutput} 新しく作成されたスプレッドシートへのリダイレクト
   */
  doPost(e) {
    let postData
    if( Object.keys(e.parameter).length > 0 ){
      postData = e.parameter
    }
    else{
      const jsonString = e.postData.contents;
      postData = JSON.parse(jsonString);
    }

    // --- ⑧ レスポンスの返却 ---
    // ContentServiceを使ってJSON形式のレスポンスを返します。
    // const keys = Object.keys(postData)
    // const data = postData
    // const data = keys
    // return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);

    // POSTデータからフォルダIDとファイル名を取得 (JSON形式を想定)
    // const postData = JSON.parse(e.postData.contents);
    // const postData = e.parameter;
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
    let handler = this.commandHandlers[cmd]
    if( !handler ){
      handler = this.commandHandlers['_error']
    }
    // const handler =  || this.commandHandlers['_error'];
    return handler(paramx, secondArg);
  }

  getOrCreateGoogleAppsFileUnderFolderAndRetX(kind, rettype, folderId, fileName){
    if( !folderId ){
      folderId = this.env.oneDaysFolderId
    }
    if( !fileName ){
      fileName = this.env.defaultFileName
    }
    return YKLibb.Gapps.getOrCreateGoogleAppsFileUnderFolderAndHtmlService(kind, rettype, folderId, fileName);
  }

  new_gss(paramx, rettype){
    const folderId = paramx.folderId;
    let fileName = paramx.fileName;
    const kind = "gss";
    if (!fileName) {
      fileName = YKLibb.Util.getCurrentDateTimeJST("filename");
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
      fileName = YKLibb.Util.getCurrentDateTimeJST("filename");
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
      fileName = YKLibb.Util.getCurrentDateJST("filename");
    }
    const kind = "docs";
    return this.getOrCreateGoogleAppsFileUnderFolderAndRetX(kind, rettype, folderId, fileName);
  }

  new_chomemo(paramx, rettype){
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
  
  linkAndHtmlService(){
    const url = this.link()
    return HtmlService.createHtmlOutput(
      `<html><head><base target="_top" /></head><body><a href="${url}">Click here to visit the site</a></body></html>`
    );
  }

  link(){
    const url = ENV.outerHostUrl;
    return url
  }

  currentDateAndContentServices(){
    const response = this.currentDate()
    return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
  }

  currentDate(){
    const now = new Date();
    const response = {
      "datetime": now.toISOString()
    };
    return response;
  }

  redirectAndHtmlService(){
    const url = this.redirect()
    return HtmlService.createHtmlOutput(
        '<html><head><meta http-equiv="refresh" content="0; url=' + url + '"></head><body></body></html>');
  }

  redirect(){
    const url = ENV.outerHostUrl;
    return url;
  }

  webApiSub(paramx){
    const allApiSpreadsheetId = ENV.allApiSpreadsheetId;
    const sheetName = paramx.name;
    const table = YKLibb.SimpleTable.createById(allApiSpreadsheetId, sheetName);
    const [worksheet, totalRange, headerRange, dataRowsRange, nextDataRowsRange, header, totalValues, status] = table.getRangesAndHeaderAndTotalValues()

    let dataRowsValues = [[]]
    if( dataRowsRange !== null ){
      dataRowsValues = dataRowsRange.getValues()
    }
    return [header, dataRowsValues, totalRange, sheetName, allApiSpreadsheetId, status]
  }

  webApiAndContentService(paramx, additional = ""){
    const str = this.webApi(paramx, additional)
    return ContentService.createTextOutput(str).setMimeType(ContentService.MimeType.JSON);
  }

  webApi(paramx, additional = ""){
    const [header, dataValues, totalRange, sheetName] =  this.webApiSub(paramx)
    const keyAssocArray = this.webapikey.getAPIKey(header, dataValues, sheetName);
    const str = JSON.stringify({ "additional": additional, "api-key": keyAssocArray })
    return str;
  }

  webApiX(paramx, additional = ""){
    const [header, dataValues, totalRange, sheetName, allApiSpreadsheetId, status] =  this.webApiSub(paramx)
    const str = JSON.stringify( { header: header, dataValues: dataValues , sheetName: sheetName, allApiSpreadsheetId: allApiSpreadsheetId, status: status } )
    return str;
  }

  webApi2AndContentService(paramx){
    const str = this.webApi2(paramx)
    return ContentService.createTextOutput( str ).setMimeType(ContentService.MimeType.JSON);
  }

  webApi2(paramx){
    const [header, dataValues, totalRange, sheetName] =  this.webApiSub(paramx)
    const keyAssocArray = this.webapikey.getAPIKey(header, dataValues, sheetName);
    const str = JSON.stringify({ "weg_api_2":"web_api_2", "api-key": keyAssocArray })
    return str
  }

  webApiSAndContentService(paramx){
    const str = this.webApiS(paramx)
    return ContentService.createTextOutput( str ).setMimeType(ContentService.MimeType.JSON);    
  }
  webApiS(paramx){
    const [header, dataValues, totalRange, sheetName] = this.webApiSub(paramx)
    const keyAssocArray = this.webapikey.getAPIKey(header, dataValues, sheetName);
    const str = JSON.stringify({ "weg_api_s":"web_api_s", "api-key": keyAssocArray })
    return str
  }

  webApiListAndContentService(){
    const sheetNameList = this.webApiList()
    return ContentService.createTextOutput(JSON.stringify( sheetNameList, null, 2 )).setMimeType(ContentService.MimeType.JSON);
  }

  webApiList(){
    const allApiSpreadsheetId = ENV.allApiSpreadsheetId;
    const sheetNameList = YKLibb.Gssx.getAllWorksheetNames(allApiSpreadsheetId);
    return sheetNameList
  }

  pcConfigAndContentService(){
    const array = this.pcConfig()
    return ContentService.createTextOutput(JSON.stringify( array, null, 2 )).setMimeType(ContentService.MimeType.JSON);
  }

  pcConfig(){
    const way = YKLibb.Config.NONE()
    const sourceHeader = [""]
    const yklibbConfig = new YKLibb.Config(sourceHeader.length, sourceHeader, way)

    const pcConfigSpreadsheetId = ENV.pcConfigSpreadsheetId;
    const sheetNameList = YKLibb.Gssx.getAllWorksheetNames(pcConfigSpreadsheetId);
    Logger.log(`1 sheetNameList=${JSON.stringify(sheetNameList)}`)
    let array = []
    sheetNameList.map( sheetName => {
        const table = YKLibb.SimpleTable.createById(pcConfigSpreadsheetId, sheetName)
        array = [...array, table.getDataRowsValues()]
    })
    return array
  }
  planningAndContentService(){
    const objects = this.planning()
    return ContentService.createTextOutput(JSON.stringify( objects, null, 2 )).setMimeType(ContentService.MimeType.JSON);
  }
  planning(){
    const planningSpreadsheetId = ENV.planningSpreadsheetId;
    const sheetName = ENV.sheet1Name
    const spreadsheet = SpreadsheetApp.openById(planningSpreadsheetId);
    const sourceHeader = ENV.planningFields
    // const way = YKLibb.Config.NONE()
    const way = YKLibb.Config.COMPLETE()
    const yklibbConfig = new YKLibb.Config(sourceHeader.length, sourceHeader, way)

    const table = new YKLibb.SimpleTable(spreadsheet, sheetName, yklibbConfig)

    const objects = table.arrayOfObjects;

    // Logger.log(`0 values=${JSON.stringify(dataValues)}`)
    // Logger.log(`====`)
    // Logger.log(`1 objects=${JSON.stringify(objects)}`)
    return objects
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
      YKLibb.Util.getDateTimeJST(today, "year"),
      YKLibb.Util.getDateTimeJST(today, "year_month"),
      YKLibb.Util.getDateTimeJST(today, "year_month_day")]
  }
  taskAndContentService(){
    const objects = this.task()
    return ContentService.createTextOutput(JSON.stringify( objects, null, 2 )).setMimeType(ContentService.MimeType.JSON);
  }
  task(){
    const array = []
    return array
  }
}
