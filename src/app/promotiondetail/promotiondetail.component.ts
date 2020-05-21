import { Component, OnInit } from "@angular/core";
import { AjaxService } from "src/providers/ajax.service";
import {
  CommonService,
  IsValidType,
} from "src/providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";
import { SearchModal } from "src/providers/constants";

@Component({
  selector: "app-promotiondetail",
  templateUrl: "./promotiondetail.component.html",
  styleUrls: ["./promotiondetail.component.sass"],
})
export class PromotiondetailComponent implements OnInit {
  EnableFilter: boolean;
  AdvanceSearch: any;
  IsReportPresent: boolean;
  Promotion: Array<PromotionModal>;
  pageIndex: number;
  TotalPageCount: number;
  SearchData: SearchModal;
  PromotionDetailData: Array<PromotionDetailModal>;
  HeaderName: string = "Promotion detail";
  constructor(
    private http: AjaxService,
    private commonService: CommonService,
    private nav: iNavigation
  ) {}

  ngOnInit() {
    this.InitPage();
    let Data = this.nav.getValue();
    if (IsValidType(Data)) {
      this.SearchData = new SearchModal();
      this.SearchData.SearchString = `1=1 And PromotionGid='${Data.Gid}'`;
      this.LoadData();
    }
  }

  LoadData() {
    this.http
      .post("Webportal/PromotionDetailReport", this.SearchData)
      .then((response) => {
        if (this.commonService.IsValidResponse(response)) {
          let Data = response.content.data;
          if (Data !== null && Data !== "" && Data !== "{}") {
            this.IsReportPresent = true;
            this.PromotionDetailData = JSON.parse(Data).Table;
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
    this.PromotionDetailData = [];
    this.EnableFilter = false;
    this.IsReportPresent = false;
    this.Promotion = [];
    this.AdvanceSearch = {};
    this.pageIndex = 0;
    this.TotalPageCount = 0;
  }

  SubmitSearchCriateria() {}

  GetAdvanceFilter() {}

  ResetFilter() {}

  FilterLocaldata() {}
  ExportMe() {}

  PreviousPage() {}
  NextPage() {}
}

export class PromotionModal {
  Id: string = null;
  Gid: string = null;
  Code: string = null;
  Name: string = null;
  IsPublished: boolean = false;
  IncentiveMonth: number = null;
}

class PromotionDetailModal {
  Id: string = null;
  PromotionGid: string = null;
  Chain: string = null;
  SKUCode: string = null;
  SKUName: string = null;
  MRP: number = null;
  Promotion: string = null;
  ValidFrom: string = null;
  ValidTill: string = null;
  Gid: string = null;
}
