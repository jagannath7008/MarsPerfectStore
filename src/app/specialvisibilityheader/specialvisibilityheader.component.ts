import { Component, OnInit } from "@angular/core";
import { PromotionModal } from "../promotiondetail/promotiondetail.component";
import { iNavigation } from "src/providers/iNavigation";
import {
  CommonService,
  IsValidType,
} from "src/providers/common-service/common.service";
import { AjaxService } from "src/providers/ajax.service";
import { SearchModal, SpecialVisibilityDetail } from "src/providers/constants";

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
