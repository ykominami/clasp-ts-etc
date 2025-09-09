class Env {
  constructor(){
    this.oneDaysFolderId = PropertiesService.getScriptProperties().getProperty('1-DAYS_FOLDER_ID');
    this.oneDaysFolderName = PropertiesService.getScriptProperties().getProperty('1-DAYS_FOLDER_NAME');
    this.allApiSpreadsheetId = PropertiesService.getScriptProperties().getProperty('ALL_API_SPREADSHEET_ID');
    this.chomemoFolderId = PropertiesService.getScriptProperties().getProperty('CHOMEMO_FOLDER_ID');
    this.chomemoFolderName = PropertiesService.getScriptProperties().getProperty('CHOMEMO_FOLDER_NAME');
    this.dailyLogFolderId = PropertiesService.getScriptProperties().getProperty('DAILY-LOG_FOLDER_ID');
    this.dailyLogFolderName = PropertiesService.getScriptProperties().getProperty('DAILY-LOG_FOLDER_NAME');
    this.daysFolderId = PropertiesService.getScriptProperties().getProperty('DAYS_FOLDER_ID');
    this.daysFolderName = PropertiesService.getScriptProperties().getProperty('DAYS_FOLDER_NAME');
    this.defaultDocsFolderId = PropertiesService.getScriptProperties().getProperty('DEFAULT_DOCS_FOLDER_ID');
    this.defaultDocsFolderName = PropertiesService.getScriptProperties().getProperty('DEFAULT_DOCS_FOLDER_NAME');
    this.defaultFolderId = PropertiesService.getScriptProperties().getProperty('DEFAULT_FOLDER_ID');
    this.outerHostUrl = PropertiesService.getScriptProperties().getProperty('OUTER_HOST_URL');
    this.readingListId = PropertiesService.getScriptProperties().getProperty('READING_LIST_ID');
    this.defaultFileName = PropertiesService.getScriptProperties().getProperty('DEFAULT_FILENAME');
    // https://drive.google.com/drive/folders/1F3I0a8fxzE-h-QogpNVJPYxzFhLqt0EQ
    this.youtubeScribeFolderId = PropertiesService.getScriptProperties().getProperty('YOUTUBE_SCRIBE_FOLDER_ID');
    //
    this.pcConfigSpreadsheetId = PropertiesService.getScriptProperties().getProperty('PC_CONFIG_SPREADSHEET_ID');
    this.planningSpreadsheetId = PropertiesService.getScriptProperties().getProperty('PLANNING_SPREADSHEET_ID');
    //
    this.dailyLog0SpreadsheetId = PropertiesService.getScriptProperties().getProperty('DAILY_LOG0_SPREADSHEET_ID');
    this.dailyLog0SheetName = PropertiesService.getScriptProperties().getProperty('DAILY_LOG0_SHEET_NAME');
    // this. = PropertiesService.getScriptProperties().getProperty('');
    // this. = PropertiesService.getScriptProperties().getProperty('');
    // https://docs.google.com/spreadsheets/d/1iHMgQZedJ_bQ_sa54g6uPEHzVeaLn3KseDAttT0iHHk/edit?gid=0#gid=0
    this.sheets1SheetName = "SHEETS1"
    this.sheetsSheetName = "SHEETS"
    this.sheetFields = ["recordId","category","fileType","title","url"]
    this.sheet1Name = "sheet1"
    this.planningFields = ["大分類","小分類","項目","name","idx","url","url-script","url-sheet","url-script-2","url-sheet-2",
    "github_url_ssh","github_url_https","A","B","C","D","YKLiba.Log"]

    this.fileTypeGSpreadSheets = "Google-Spreadsheet"
    this.fileTypeGAppsScript = "Google-Apps-Script"
    this.fileTypeGDocs = "Google-Docs"
    this.fileTypeGForms = "Google-Forms"

  }
}
const ENV = new Env()