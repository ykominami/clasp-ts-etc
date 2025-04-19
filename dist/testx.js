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