import { Component, OnInit } from "@angular/core";
import { PromotionModal } from "../promotiondetail/promotiondetail.component";
import { AjaxService } from "src/providers/ajax.service";
import {
  CommonService,
  IsValidResponse,
  IsValidType,
} from "src/providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";
import { SearchModal, IncentiveTargetDetail } from "src/providers/constants";
import * as $ from 'jquery';
import { ExcelReader } from 'src/providers/excelReader';
import { ExcelUploadModal, IntcentiveTargetDetailModal } from "../promotionheader/promotionheader.component";

@Component({
  selector: "app-incentivetargetheader",
  templateUrl: "./incentivetargetheader.component.html",
  styleUrls: ["./incentivetargetheader.component.sass"],
})
export class IncentivetargetheaderComponent implements OnInit {
  EnableFilter: boolean;
  AdvanceSearch: any;
  IsReportPresent: boolean;
  IncentiveTarget: Array<PromotionModal>;
  pageIndex: number;
  TotalPageCount: number;
  SearchData: SearchModal;
  EnableUploadPopup: boolean = false;
  excelUploadModal: ExcelUploadModal;

  HeaderName: string = "IncentiveTarget header";
  constructor(
    private http: AjaxService,
    private commonService: CommonService,
    private nav: iNavigation,
    private excel: ExcelReader
  ) {}

  ngOnInit() {
    this.InitPage();
    this.SearchData = new SearchModal();
    this.LoadData();
  }

  InitPage() {
    this.EnableFilter = false;
    this.IsReportPresent = false;
    this.IncentiveTarget = [];
    this.AdvanceSearch = {};
    this.pageIndex = 0;
    this.TotalPageCount = 0;
  }

  LoadData() {
    this.http
      .post("Webportal/IncentiveTargetReport", this.SearchData)
      .then((response) => {
        if (this.commonService.IsValidResponse(response)) {
          let Data = response.content.data;
          if (Data !== null && Data !== "" && Data !== "{}") {
            this.IsReportPresent = true;
            this.IncentiveTarget = JSON.parse(Data).Table;
          } else {
            this.commonService.ShowToast("Returned empty result.");
          }
        } else {
          this.commonService.ShowToast(
            "Server error. Please contact to admin."
          );
        }
      });
  }

  GetUploadPopup(){
    this.excelUploadModal = new ExcelUploadModal();
    this.EnableUploadPopup = !this.EnableUploadPopup;
  }

  CloseUploadPopup() {
    this.EnableUploadPopup = false;
  }

  fireBrowserFile() {
    $("#uploadexcel").click();
  }

  SubmitUploadData() {
    this.EnableUploadPopup = false;
    this.http.post('Webportal/ImportBulkData', this.excelUploadModal).then(response => {
      if(IsValidResponse(response)) {
        this.SearchData.PageIndex = 1;
        this.SearchData.SearchString = "1=1";
        this.LoadData();
        this.commonService.ShowToast('Data uploaded successfully.');
      }
    });
  }

  readExcelData(e: any) {
    let Data = this.excel.readExcelData(e).then(data => {
      if(IsValidType(data)) {
        if(this.excelUploadModal.Name.trim() === '') {
          this.commonService.ShowToast('Name is mandatory.');
          return null;
        }

        if(this.excelUploadModal.IncentiveMonth !== '' && this.excelUploadModal.IncentiveMonth !== null &&
        isNaN(Number(this.excelUploadModal.IncentiveMonth))) {
          this.commonService.ShowToast('Incentive monthe is mandatory.');
          return null;
        }

        if(!this.excelUploadModal.IsPublished) {
          this.commonService.ShowToast('Please select IsPublished checkbox.');
          return null;
        }

        let incentiveModal: IntcentiveTargetDetailModal = null;

        let index = 0;
        while(index < data.length) {
          incentiveModal = new IntcentiveTargetDetailModal();

          incentiveModal.Parameter1 = data[index]["Parameter1"];
          incentiveModal.Parameter2 = data[index]["Parameter2"];
          incentiveModal.Parameter3 = data[index]["Parameter3"];
          incentiveModal.Parameter4 = data[index]["Parameter4"];
          incentiveModal.Target1 = data[index]["Target1"].toString();
          incentiveModal.Target2 = data[index]["Target2"].toString();
          incentiveModal.Target3 = data[index]["Target3"].toString();
          incentiveModal.Target4 = data[index]["Target4"].toString();

          this.excelUploadModal.incentiveTargetDetail.push(incentiveModal);
          index++;
        }

        this.commonService.ShowToast("Excel file selected successfully");
      } else {
        this.commonService.ShowToast('Unable to upload or fetch data.');
      }
    });
  }

  SubmitSearchCriateria() {}

  GetAdvanceFilter() {}

  ResetFilter() {}

  FilterLocaldata() {}
  ExportMe() {}

  PreviousPage() {}
  NextPage() {}

  GetDetail(data: PromotionModal) {
    if (IsValidType(data)) {
      this.nav.navigate(IncentiveTargetDetail, data);
    }
  }
}
