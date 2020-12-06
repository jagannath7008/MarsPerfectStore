import { Component, OnInit } from "@angular/core";
import { PromotionModal } from "../promotiondetail/promotiondetail.component";
import { iNavigation } from "src/providers/iNavigation";
import {
  CommonService,
  IsValidResponse,
  IsValidType,
} from "src/providers/common-service/common.service";
import { AjaxService } from "src/providers/ajax.service";
import { SearchModal, SpecialVisibilityDetail } from "src/providers/constants";
import { ExcelUploadModal } from "../promotionheader/promotionheader.component";
import * as $ from 'jquery';
import { ExcelReader } from 'src/providers/excelReader';

@Component({
  selector: "app-specialvisibilityheader",
  templateUrl: "./specialvisibilityheader.component.html",
  styleUrls: ["./specialvisibilityheader.component.sass"],
})
export class SpecialvisibilityheaderComponent implements OnInit {
  EnableFilter: boolean;
  AdvanceSearch: any;
  IsReportPresent: boolean;
  SpecialVisibilityHeaders: Array<PromotionModal>;
  pageIndex: number;
  TotalPageCount: number;
  SearchData: SearchModal;
  HeaderName: string = "Specialvisibility header";
  EnableUploadPopup: boolean = false;
  excelUploadModal: ExcelUploadModal;

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
    this.SpecialVisibilityHeaders = [];
    this.AdvanceSearch = {};
    this.pageIndex = 0;
    this.TotalPageCount = 0;
  }

  LoadData() {
    this.http
      .post("Webportal/SpecialVisibilityReport", this.SearchData)
      .then((response) => {
        if (this.commonService.IsValidResponse(response)) {
          let Data = response.content.data;
          if (Data !== null && Data !== "" && Data !== "{}") {
            this.IsReportPresent = true;
            this.SpecialVisibilityHeaders = JSON.parse(Data).Table;
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
        if(this.excelUploadModal.Code.trim() === '') {
          this.commonService.ShowToast('Code is mandatory.');
          return null;
        }

        if(this.excelUploadModal.Name.trim() === '') {
          this.commonService.ShowToast('Name is mandatory.');
          return null;
        }

        if(!this.excelUploadModal.IsPublished) {
          this.commonService.ShowToast('Please select IsPublished checkbox.');
          return null;
        }

        this.excelUploadModal.specialVisibilityDetail = data;
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
      this.nav.navigate(SpecialVisibilityDetail, data);
    }
  }
}
