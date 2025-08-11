function xtesta3(){
  // YKLiblog.Log.initLogDebug()
  YKLiblog.Log.initLogWarn()

  const fields = ['BraveSearch', 'OpenAI', 'Gemini', 'Anthropic', 'cohere', 'github', 'chocolaty', 'diigo']
  fields.forEach( field => xtesta31(field) )
}

function xtesta31(field){
  YKLiblog.Log.debug(`field=${ JSON.stringify(field)}`)
  let array = null

  const paramx = {name: field}
  const allApiSpreadsheetId = ENV.allApiSpreadsheetId;
  const sheetName = paramx.name;
  const [header, totalValues, totalRange] = YKLibb.Gssx.setupSpreadsheet(allApiSpreadsheetId, sheetName);
  const webapikey = new Webapikey(ENV);
  const keyAssocArray = webapikey.getAPIKey(header, totalValues, sheetName);
  // const filteredkeyAssocArray = keyAssocArray.filter( assoc => assoc["kind"] === kind)
  // const keys = filteredkeyAssocArray.map( item => item['_api_key'] )
  YKLiblog.Log.warn(`keyAssocArray.length=${ keyAssocArray.length }`)
  array = keyAssocArray.map( item => item['_api_key'])
  YKLiblog.Log.warn(`keyAssocArray=${ JSON.stringify(array)}`)
}

function xtesta2(){
  // YKLiblog.Log.initLogWarn()
  YKLiblog.Log.initLogDebug()
  const paramx = {name: "OpenAI"}
  const kind = "CursorCursor"
  const allApiSpreadsheetId = ENV.allApiSpreadsheetId;
  const sheetName = paramx.name;
  // const [header, totalValues, totalRange]
  const [header, totalValues, totalRange] = YKLibb.Gssx.setupSpreadsheet(allApiSpreadsheetId, sheetName);
  const webapikey = new Webapikey(ENV);
  const keyAssocArray = webapikey.getAPIKey(header, totalValues, sheetName);
  const filteredkeyAssocArray = keyAssocArray.filter( assoc => assoc["kind"] === kind)
  // const keys = keyAssocArray.map( item => item['_api_key'] )
  const keys = filteredkeyAssocArray.map( item => item['_api_key'] )
  // return ContentService.createTextOutput(JSON.stringify({ "api-key": key })).setMimeType(ContentService.MimeType.JSON);
  YKLiblog.Log.debug(`keys=${ JSON.stringify(keys)}`)
}

function xtesta(){
  // YKLiblog.Log.initLogWarn()
  YKLiblog.Log.initLogDebug()
  const kind = "CursorCursor"
  let cursorCursor = null
  const paramx = { name: "OpenAI"}
  const rettype = null
  // web_api(paramx, rettype)

  const ret = YKLibb.Ga.disp()
  const allApiSpreadsheetId = ENV.allApiSpreadsheetId;
  const sheetName = paramx.name;

  const [header, dataValues, totalRange] = YKLibb.Gssx.setupSpreadsheet(allApiSpreadsheetId, sheetName);
  const webapikey = new Webapikey(ENV);
  const keyAssocArray = webapikey.getAPIKey(header, dataValues, sheetName);
  const filteredkeyAssocArray = keyAssocArray.filter( assoc => assoc["kind"] === kind)
  if( filteredkeyAssocArray.length > 0 ){
    cursorCursor = filteredkeyAssocArray[0]
  }

  YKLiblog.Log.debug(`ret=${ret}`)
  YKLiblog.Log.debug(`cursorCursor=${ JSON.stringify(cursorCursor['API_KEY'])}`)
}

function moveYouTubeSpreadsheetsEndYoutube(){
  YKLiblog.Log.initLogDebug()
  YKLiblog.Log.debug(`ENV=${ENV.constructor}`)
  Util.moveYouTubeSpreadsheetsEndYoutube()
}

function testa(){
  const kind = "docs"
  const rettype = "showUrl"
  // const folderId = ENV.oneDaysFolderId
  // const fileName = null
  const webapi = new Webapi(ENV)
  const pathArray = webapi.getPathArrayUnder1DAYFolderWithToday()
  folderId = YKLibb.getFolderByPath(pathArray).getId()

  const fileName = Util.getCurrentDateTimeJST("filename")
  webapi.getOrCreateGoogleAppsFileUnderFolderAndRetX(kind, rettype, folderId, fileName)
}

// 使用例
function displayAllEmptyFiles() {
  var emptyFileIds = YKLibb.Gapps.getEmptyDocsFileIds();
  Logger.log(emptyFileIds);
}

// 実行例：ログにフォルダIDを表示
function testGetFolderIds() {
  var ids = YKLibb.Gapps.getFolderIdsUnderComputers()

  Logger.log(ids);
}
// 実行例：ログにフォルダIDを表示
function testGetFolderIdsx() {
  const ids = YKLibb.Gapps.getFolderIdsUnderComputersx()
  Logger.log(ids);
  const folderNames = ids.map( idArray => {
    Logger.log(idArray[0])
    Logger.log(idArray[1])
    return [idArray[0], idArray[1].map( id => DriveApp.getFolderById(id).getName() )]
  } )
  Logger.log(folderNames)
}

