import { Component, OnInit } from "@angular/core";
import { AjaxService } from "src/providers/ajax.service";
import { CommonService, IsValidResponse, IsValidType } from "src/providers/common-service/common.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { WorkBook, read, utils, write, readFile } from "xlsx";
import { saveAs } from "file-saver";
import * as $ from "jquery";
import { Dictionary } from "src/providers/Generic/Code/Dictionary";
import { ZerothIndex } from 'src/providers/constants';
import { ExcelUploadModal, ROI, TargetModal, TraderSpendsModal } from "../promotionheader/promotionheader.component";

@Component({
  selector: 'app-traderspends',
  templateUrl: './traderspends.component.html',
  styleUrls: ['./traderspends.component.scss']
})
export class TraderspendsComponent  implements OnInit {
  wbout = [];
  table = [];
  entity: TraderSpendsModal;
  file: File;
  isUpdate: boolean = false;
  fileSize: string;
  fileName: string;
  isFileReady: boolean = false;
  noOfRecords: number;
  recordToUpload: any;
  ws: any;
  IsResultGenerated: boolean = false;
  ScriptFileName: string = "";
  DynamicTableResult: Array<any>;
  ExcelTableHeader: Array<any>;
  ExcelTableData: Array<any>;
  excelUploadModal: ExcelUploadModal;
  isActionEnalbed: boolean = false;
  enablePP: boolean = false;

  constructor(
    private http: AjaxService,
    private common: CommonService,
    private storage: ApplicationStorage
  ) {}

  s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }

  ngOnInit() {
    this.entity = new TraderSpendsModal();
    this.ExcelTableHeader = [];
    this.ExcelTableData = [];
    this.excelUploadModal = new ExcelUploadModal();
    this.loadData();
  }

  initHeader() {
    this.ExcelTableHeader = [
      { ColumnName: "Id" },
      { ColumnName: "TargetYear" },
      { ColumnName: "ChainCode" },
      { ColumnName: "ChainName" },
      { ColumnName: "DirectIn" },
      { ColumnName: "Promotions" },
      { ColumnName: "Visibility" },
      { ColumnName: "FixedVisibility" },
      { ColumnName: "RDSoffInvoiceMargin" },
      { ColumnName: "MTCustomeroffInvoiceMargin" },
      { ColumnName: "DE" },
    ];
  }

  fireBrowserFile() {
    $("#uploadexcel").click();
  }

  SaveToExcel(tableData, fileName: string = "QuestionSheet") {
    this.setTableData(tableData, fileName);
    saveAs(
      new Blob([this.s2ab(this.wbout)], { type: "application/octet-stream" }),
      fileName + ".xlsx"
    );
  }

  getTableData() {
    return this.table;
  }

  setTableData(tableData, fileName: string) {
    this.table = tableData;
    this.setExcelProperties(fileName);
  }

  setExcelProperties(fileName: string) {
    const ws_name = fileName.substr(0, 25); //'QuestionSheet'
    //  const ws_name = ''; // worksheet name cannot exceed 31 chracters length
    const wb: WorkBook = { SheetNames: [], Sheets: {} };
    this.ws = utils.json_to_sheet(this.getTableData());
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = this.ws;
    this.wbout = write(wb, { bookType: "xlsx", bookSST: true, type: "binary" });
  }

  readExcelData(e: any) {
    this.file = e.target.files[0];
    if (this.file !== undefined && this.file !== null) {
      this.convertToJson(false).then(data => {
        if (this.common.IsValid(data)) {
          this.recordToUpload = data;
          this.fileSize = (this.file.size / 1024).toFixed(2);
          this.fileName = this.file.name;
          this.noOfRecords = this.recordToUpload.length;
          this.isFileReady = true;
          let excelData = data.mapTable[ZerothIndex];
          if(IsValidType(excelData)) {
            this.ExcelTableHeader = excelData.value.Keys;
            this.ExcelTableData = excelData.value.Data;
          }
        } else {
          this.cleanFileHandler();
          this.common.ShowToast("Excel data is not valid.");
        }
      });
    }
  }

  cleanFileHandler() {
    $("#uploadexcel").val("");
    this.fileSize = "";
    this.fileName = "";
    this.isFileReady = false;
    this.noOfRecords = 0;
    event.stopPropagation();
    event.preventDefault();
  }

  convertToJson(onlyHeader: boolean = true): Promise<any> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      let workbookkk;
      let XL_row_object;
      let TempDictionary = new Dictionary<string, any>();
      reader.readAsBinaryString(this.file);
      reader.onload = function() {
        let data = reader.result;
        workbookkk = read(data, { type: "binary" });
        workbookkk.SheetNames.forEach(function(sheetName) {
          XL_row_object = utils.sheet_to_json(workbookkk.Sheets[sheetName]);
          let position = TempDictionary.hasKey(sheetName);
          if (
            position === -1 &&
            XL_row_object !== null &&
            XL_row_object.length > 0
          ) {
            let RowDetail = XL_row_object[0];
            let ColumnDetail = [];
            if (RowDetail !== null) {
              if (typeof RowDetail === "object") {
                let Keys = Object.keys(RowDetail);
                let index = 0;
                let Type = "";
                while (index < Keys.length) {
                  Type = typeof RowDetail[Keys[index]];
                  if (
                    Type === "undefined" ||
                    RowDetail[Keys[index]] === null ||
                    RowDetail[Keys[index]] == ""
                  ) {
                    Type = "string";
                  }
                  ColumnDetail.push({
                    ColumnName: Keys[index],
                    ColumnType: Type
                  });
                  index++;
                }
              }
            }
            let SheetData = {
              Keys: ColumnDetail,
              Data: onlyHeader ? null : XL_row_object
            };
            TempDictionary.insert(sheetName, SheetData);
          }
          resolve(TempDictionary);
        });
      };
    });
  }

  closePopup() {
    this.entity = new TraderSpendsModal();
    this.enablePP = false;
  }

  newEntry() {
    this.entity = new TraderSpendsModal();
    this.isUpdate = false;
    this.enablePP = true;
  }

  removeErrorField() {
    $(event.currentTarget).removeClass('error-field');
  }

  saveRecord() {
    if(this.entity !== null) {
      let error: Array<string> = [];
      if(!IsValidType(this.entity.TargetYear))
        error.push("TargetYear");
      
      if(!IsValidType(this.entity.ChainCode))
        error.push("ChainCode");
      
      if(!IsValidType(this.entity.ChainName))
        error.push("ChainName");
      
      if(!IsValidType(this.entity.DirectIn))
        error.push("DirectIn");
      
      if(!IsValidType(this.entity.Promotions))
        error.push("Promotions");
      
      if(!IsValidType(this.entity.Visibility))
        error.push("Visibility");

        if(!IsValidType(this.entity.FixedVisibility))
        error.push("FixedVisibility");

        if(!IsValidType(this.entity.RDSoffInvoiceMargin))
        error.push("RDSoffInvoiceMargin");
        if(!IsValidType(this.entity.MTCustomeroffInvoiceMargin))
        error.push("MTCustomeroffInvoiceMargin");
        if(!IsValidType(this.entity.DE))
        error.push("DE");

      if(error.length  === 0) {
        this.enablePP = false;
        let url = "Webportal/AddTraderSpends";
        if(this.isUpdate)
          url = "Webportal/UpdateTraderSpends";
        this.http.post(url, this.entity).then(response => {
          if(IsValidType(response)) {
            this.isFileReady = false;
            this.isActionEnalbed = true;
            this.initHeader();
            this.closePopup();
            this.ExcelTableData = response.content.data;
            this.common.ShowToast('Data uploaded successfully.');
          } else {
            this.common.ShowToast("Fail to insert record. Please contact to admin.");
          }
        })
      } else {
        let $elem = $('#roi-form');
        let index = 0;
        while(index < error.length) {
          $elem.find('input[name="' + error[index] + '"]').addClass('error-field');
          index++;
        }
      }
      
    } else {
      this.common.ShowToast("Invalid form. Please check all value correctly.");
    }
  }

  editCurrent(value: any) {
    if(value != null) {
      let filteredValue = this.ExcelTableData.filter(x=> x.Id === value);
      if(filteredValue.length > 0) {
        this.entity = filteredValue[ZerothIndex];
        this.isUpdate = true;
        this.enablePP = true;
      }
    }
  }

  uploadExcelSheet() {
    this.excelUploadModal.tradespends = this.ExcelTableData;
    this.excelUploadModal.Name = "tradespend";
    this.http.post('Webportal/ImportBulkData', this.excelUploadModal).then(response => {
      if(IsValidResponse(response)) {
        this.isFileReady = false;
        this.ExcelTableHeader = [];
        this.ExcelTableData = [];
        this.common.ShowToast('Data uploaded successfully.');
      } else {
        this.common.ShowToast('Fail to upload. Please contact admin.');
      }
    });
  }

  loadData() {
    this.http.get('Webportal/FetchTraderSpends?searchString=1=1').then(response => {
      if(IsValidResponse(response)) {
        this.isFileReady = false;
        this.isActionEnalbed = true;
        this.initHeader();
        this.ExcelTableData = response.content.data;
      } else {
        this.common.ShowToast('Fail to upload. Please contact admin.');
      }
    });
  }
}