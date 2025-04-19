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
    // this. = PropertiesService.getScriptProperties().getProperty('');
    // this. = PropertiesService.getScriptProperties().getProperty('');
  }
}