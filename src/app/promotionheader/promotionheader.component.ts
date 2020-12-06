import { Component, OnInit } from "@angular/core";
import { PromotionModal } from "../promotiondetail/promotiondetail.component";
import { SearchModal, PromotionDetail, ZerothIndex } from "src/providers/constants";
import { AjaxService } from "./../../providers/ajax.service";
import {
  CommonService,
  IsValidResponse,
  IsValidType,
} from "./../../providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";
import * as $ from 'jquery';
import { ExcelReader } from 'src/providers/excelReader';

@Component({
  selector: "app-promotionheader",
  templateUrl: "./promotionheader.component.html",
  styleUrls: ["./promotionheader.component.scss"],
})
export class PromotionheaderComponent implements OnInit {
  EnablePopup: boolean;
  AdvanceSearch: any;
  IsReportPresent: boolean;
  Promotion: Array<PromotionModal>;
  pageIndex: number;
  TotalPageCount: number;
  PromotionHeader: PromotionHeaderModal;
  excelUploadModal: ExcelUploadModal;
  SearchData: SearchModal;
  HeaderName: string = "Promotion header";
  EnableUploadPopup: boolean;

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

  LoadData() {
    this.http
      .post("Webportal/PromotionReport", this.SearchData)
      .then((response) => {
        if (this.commonService.IsValidResponse(response)) {
          let Data = response.content.data;
          if (Data !== null && Data !== "" && Data !== "{}") {
            this.IsReportPresent = true;
            this.Promotion = JSON.parse(Data).Table;
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

  InitPage() {
    this.EnablePopup = false;
    this.EnableUploadPopup = false;
    this.IsReportPresent = false;
    this.Promotion = [];
    this.AdvanceSearch = {};
    this.pageIndex = 0;
    this.TotalPageCount = 0;
  }

  SubmitSearchCriateria() {}

  GetPopup() {
    this.PromotionHeader = new PromotionHeaderModal();
    this.EnablePopup = !this.EnablePopup;
  }

  GetUploadPopup(){
    this.excelUploadModal = new ExcelUploadModal();
    this.EnableUploadPopup = !this.EnableUploadPopup;
  }

  ClosePopup() {
    this.EnablePopup = false;
  }

  CloseUploadPopup() {
    this.EnableUploadPopup = false;
  }

  AddNewPrmotionHeader() {
    if (!IsValidType(this.PromotionHeader.Code)) {
      this.commonService.ShowToast("Promotion code is required.");
      return;
    }

    if (!IsValidType(this.PromotionHeader.Name)) {
      this.commonService.ShowToast("Promotion Name is required.");
      return;
    }

    this.ClosePopup();
    this.http
      .post("Webportal/InsertUpdatePromotion", this.PromotionHeader)
      .then((response) => {
        if (this.commonService.IsValidResponse(response)) {
          this.Promotion = [];
          let Data = response.content.data;
          if (Data !== null && Data !== "" && Data !== "{}") {
            this.IsReportPresent = true;
            this.Promotion = JSON.parse(Data).Table;
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

  ResetFilter() {}

  FilterLocaldata() {}
  ExportMe() {}

  PreviousPage() {}
  NextPage() {}

  GetDetail(data: PromotionModal) {
    if (IsValidType(data)) {
      this.nav.navigate(PromotionDetail, data);
    }
  }

  fireBrowserFile() {
    $("#uploadexcel").click();
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

        this.excelUploadModal.promotionDetail = data;
      } else {
        this.commonService.ShowToast('Unable to upload or fetch data.');
      }
    });
  }
}

class PromotionHeaderModal {
  Id: number = null;
  Gid: string = '';
  Code: string = '';
  Name: string = '';
  IsPublished: number = 0;
}

class PromotionDetailModal {
  Chain: string = '';
  SKUCode: string = '';
  SKUName: string = '';
  MRP: string = '';
  Promotion: string = '';
  ValidFrom: string = '';
  ValidTill: string = '';
  Location: string = '';
}

class SpecialVisibilityDetailModal {
  Chain: string = "";
  StoreCode: string = "";
  AssetName: string = "";
  NoofAsset: string = "";
  Product: string = "";
  ValidFrom: string = "";
  ValidTill: string = "";
  KAM: string = "";
}

export class IntcentiveTargetDetailModal {
  Id: number = 0;
  IncentivetargetGid: string = "";
  SS: number = 0;
  CT: number = 0;
  MT: number = 0;
  SCT: number = 0;
  SMT: number = 0;
  ContactGid: string = "";
  Parameter1: string = "";
  Target1: string = "";
  Achievement1: string = "";
  Parameter2: string = "";
  Target2: string = "";
  Achievement2: string = "";
  Parameter3: string = "";
  Target3: string = "";
  Achievement3: string = "";
  Parameter4: string = "";
  Target4: string = "";
  Achievement4: string = "";
  TotalEarningPotential: string = "";
  TotalEarning: string = "";
  Value: string = "";
}

export class ExcelUploadModal {
  Code: string = '';
  Name: string = '';
  IncentiveMonth = null;
  IsPublished: boolean = false;
  promotionDetail: Array<PromotionDetailModal> = [];
  specialVisibilityDetail: Array<SpecialVisibilityDetailModal> = [];
  incentiveTargetDetail: Array<IntcentiveTargetDetailModal> = [];
}