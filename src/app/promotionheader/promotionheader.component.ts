import { Component, OnInit } from "@angular/core";
import { PromotionModal } from "../promotiondetail/promotiondetail.component";
import { SearchModal, PromotionDetail } from "src/providers/constants";
import { AjaxService } from "./../../providers/ajax.service";
import {
  CommonService,
  IsValidResponse,
  IsValidType,
} from "./../../providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";

@Component({
  selector: "app-promotionheader",
  templateUrl: "./promotionheader.component.html",
  styleUrls: ["./promotionheader.component.sass"],
})
export class PromotionheaderComponent implements OnInit {
  EnablePopup: boolean;
  AdvanceSearch: any;
  IsReportPresent: boolean;
  Promotion: Array<PromotionModal>;
  pageIndex: number;
  TotalPageCount: number;
  PromotionHeader: PromotionHeaderModal;
  SearchData: SearchModal;
  HeaderName: string = "Promotion header";
  constructor(
    private http: AjaxService,
    private commonService: CommonService,
    private nav: iNavigation
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

  ClosePopup() {
    this.EnablePopup = false;
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
}

class PromotionHeaderModal {
  Id: number = null;
  Gid: string = null;
  Code: string = null;
  Name: string = null;
  IsPublished: number = 0;
}
