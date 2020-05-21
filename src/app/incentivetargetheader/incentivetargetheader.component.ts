import { Component, OnInit } from "@angular/core";
import { PromotionModal } from "../promotiondetail/promotiondetail.component";
import { AjaxService } from "src/providers/ajax.service";
import {
  CommonService,
  IsValidType,
} from "src/providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";
import { SearchModal, IncentiveTargetDetail } from "src/providers/constants";

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
  HeaderName: string = "IncentiveTarget header";
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
