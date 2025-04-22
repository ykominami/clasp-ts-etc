function testx(){
  const paramx = {
    "cmd": "new_chomemo",
    "fileName": null
  }
  execCmd(paramx); 
}

function testx2(){
  const paramx = {
    "cmd": "new_chomemo",
    "fileName": ""
  }
  execCmd(paramx); 
}

function t(){
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty("ALL_API_SPREADSHEET_ID");
  // const sheetName = aramx.name;
  const sheetName = "OpenAI";
  const [header, values, dataRange] = YKLibb.setupSpreadsheet(spreadsheetId, sheetName);

  console.log(`header=${header}`);
  console.log(`values=${values}`);
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

// 使用例
function displayAllEmptyFiles() {
  var emptyFileIds = YKLibb.getEmptyDocsFileIds();
  Logger.log(emptyFileIds);
}

// 使用例
function displayAllEmptyFileUnderComputers() {
  var computersFolderFileIds = getComputersFolderFileIds();
  Logger.log(computersFolderFileIds);
}

function displayFolderUnderComputersFolder(){
  folderIds　= YKLibb.getComputersFolderIds()
  Logger.log(`folderIds=${folderIds}`)
}
// 実行例：ログにフォルダIDを表示
function testGetFolderIds() {
  var ids = YKLibb.getFolderIdsUnderComputers()

  Logger.log(ids);
}
// 実行例：ログにフォルダIDを表示
function testGetFolderIdsx() {
  const ids = YKLibb.getFolderIdsUnderComputersx()
  Logger.log(ids);
  const folderNames = ids.map( idArray => {
    Logger.log(idArray[0])
    Logger.log(idArray[1])
    return [idArray[0], idArray[1].map( id => DriveApp.getFolderById(id).getName() )]
  } )
  Logger.log(folderNames)
}

