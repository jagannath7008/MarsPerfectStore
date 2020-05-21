import { Component, OnInit } from "@angular/core";
import { PromotionModal } from "../promotiondetail/promotiondetail.component";
import {
  IsValidType,
  CommonService,
} from "src/providers/common-service/common.service";
import { SearchModal } from "src/providers/constants";
import { AjaxService } from "src/providers/ajax.service";
import { iNavigation } from "src/providers/iNavigation";

@Component({
  selector: "app-specialvisibilitydetail",
  templateUrl: "./specialvisibilitydetail.component.html",
  styleUrls: ["./specialvisibilitydetail.component.sass"],
})
export class SpecialvisibilitydetailComponent implements OnInit {
  EnableFilter: boolean;
  AdvanceSearch: any;
  IsReportPresent: boolean;
  Promotion: Array<PromotionModal>;
  pageIndex: number;
  TotalPageCount: number;
  SearchData: SearchModal;
  SpecialVisibilityDetailData: Array<SpecialVisibilityDetailModal>;
  HeaderName: string = "Specialvisibility detail";
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
      this.SearchData.SearchString = `1=1 And SpecialvisibilityGid='${Data.Gid}'`;
      this.LoadData();
    }
  }

  LoadData() {
    this.http
      .post("Webportal/SpecialVisibilityDetailReport", this.SearchData)
      .then((response) => {
        if (this.commonService.IsValidResponse(response)) {
          let Data = response.content.data;
          if (Data !== null && Data !== "" && Data !== "{}") {
            this.IsReportPresent = true;
            this.SpecialVisibilityDetailData = JSON.parse(Data).Table;
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

class SpecialVisibilityDetailModal {
  Id: string = null;
  SpecialvisibilityGid: string = null;
  Chain: string = null;
  StoreCode: string = null;
  AssetName: string = null;
  Product: string = null;
  ValidFrom: string = null;
  ValidTill: string = null;
  KAM: string = null;
  Gid: string = null;
}
