import { Injectable } from "@angular/core";
import { Dictionary } from './Generic/Code/Dictionary';
import { read, utils } from "xlsx";
import * as $ from 'jquery';
import { IsValidType } from './common-service/common.service';
import { ZerothIndex } from './constants';
import { promise } from 'protractor';

@Injectable()
export class ExcelReader {
    file: File;
    fileSize: string;
    fileName: string;
    recordToUpload: any;
    noOfRecords: number;
    isFileReady: boolean;
    
    cleanFileHandler() {
    $("#uploadexcel").val("");
    this.fileSize = "";
    this.fileName = "";
    this.isFileReady = false;
    this.noOfRecords = 0;
    event.stopPropagation();
    event.preventDefault();
    }

    async readExcelData(e: any): Promise<any> {
        let result = null;
        this.file = e.target.files[0];
        if (this.file !== undefined && this.file !== null) {
            await this.convertToJson(false).then(data => {
                if (IsValidType(data)) {
                    this.recordToUpload = data;
                    this.fileSize = (this.file.size / 1024).toFixed(2);
                    this.fileName = this.file.name;
                    this.noOfRecords = this.recordToUpload.length;
                    this.isFileReady = true;
                    let excelData = data.mapTable[ZerothIndex];
                    if(IsValidType(excelData)) {
                        result = excelData.value.Data;
                    }
                } else {
                    this.cleanFileHandler();
                }
            });
        }
        return result;
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
}