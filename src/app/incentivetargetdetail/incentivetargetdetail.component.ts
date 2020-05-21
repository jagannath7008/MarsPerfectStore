import { Component, OnInit } from "@angular/core";
import { PromotionModal } from "../promotiondetail/promotiondetail.component";
import { SearchModal } from "src/providers/constants";
import { AjaxService } from "src/providers/ajax.service";
import {
  CommonService,
  IsValidType,
} from "src/providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";

@Component({
  selector: "app-incentivetargetdetail",
  templateUrl: "./incentivetargetdetail.component.html",
  styleUrls: ["./incentivetargetdetail.component.sass"],
})
export class IncentivetargetdetailComponent implements OnInit {
  EnableFilter: boolean;
  AdvanceSearch: any;
  IsReportPresent: boolean;
  Promotion: Array<PromotionModal>;
  pageIndex: number;
  TotalPageCount: number;
  SearchData: SearchModal;
  IncentiveTargetDetailData: Array<IncentiveTargetDetailModal>;
  HeaderName: string = "IncentiveTarget detail";
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
      this.SearchData.SearchString = `1=1 And IncentiveTargetGid='${Data.Gid}'`;
      this.LoadData();
    }
  }

  LoadData() {
    this.http
      .post("Webportal/IncentiveTargetDetailReport", this.SearchData)
      .then((response) => {
        if (this.commonService.IsValidResponse(response)) {
          let Data = response.content.data;
          if (Data !== null && Data !== "" && Data !== "{}") {
            this.IsReportPresent = true;
            this.IncentiveTargetDetailData = JSON.parse(Data).Table;
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

class IncentiveTargetDetailModal {
  Id: number = null;
  IncentiveTargetGid: string = null;
  ContactGid: string = null;
  Parameter1: string = null;
  Target1: string = null;
  Achievement1: string = null;
  Parameter2: string = null;
  Target2: string = null;
  Achievement2: string = null;
  Parameter3: string = null;
  Target3: string = null;
  Achievement3: string = null;
  Parameter4: string = null;
  Target4: string = null;
  Achievement4: string = null;
  TotalEarningPotential: string = null;
  TotalEarning: string = null;
  Value: string = null;
}
