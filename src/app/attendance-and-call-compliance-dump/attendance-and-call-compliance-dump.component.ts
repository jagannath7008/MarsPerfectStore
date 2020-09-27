import { Component, OnInit } from "@angular/core";
import {
  CommonService,
  IsValidType,
} from "src/providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";
import { AjaxService } from "src/providers/ajax.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import {
  MasterDataModal,
  AdvanceFilterModal,
} from "../availabilityreport/availabilityreport.component";
import { PostParam } from "src/providers/constants";
import { StateModel } from "../state/state.component";
import { IGrid } from "src/providers/Generic/Interface/IGrid";

@Component({
  selector: "app-attendance-and-call-compliance-dump",
  templateUrl: "./attendance-and-call-compliance-dump.component.html",
  styleUrls: ["./attendance-and-call-compliance-dump.component.sass"],
})
export class AttendanceAndCallComplianceDumpComponent implements OnInit {
  entity: any = new StateModel();
  AdvanceSearch: AdvanceFilterModal;
  TableResultSet: Array<StateModel>;
  BindingHeader: Array<IGrid>;
  TotalHeaders: number = 5;
  EnableFilter: boolean = false;
  MasterData: MasterDataModal;
  searchQuery: string = " 1=1 ";
  sortBy: string = "";
  pageIndex: number = 1;
  pageSize: number = 15;
  TotalCount: number = 0;
  TotalPageCount: number = 0;

  HeaderName: string = "";
  IsEmptyRow: boolean = false;

  constructor(
    private commonService: CommonService,
    private nav: iNavigation,
    private http: AjaxService,
    private local: ApplicationStorage
  ) {}

  ngOnInit() {
    let LocalMasterData = this.local.getMaster();
    if (IsValidType(LocalMasterData)) {
      this.MasterData = LocalMasterData;
    }
  }

  ResetAdvanceFilter() {
    this.AdvanceSearch = new AdvanceFilterModal();
  }

  GetAdvanceFilter() {
    this.EnableFilter = !this.EnableFilter;
  }

  FilterLocaldata() {}

  ResetFilter() {}

  ExportMe() {}

  PreviousPage() {}

  NextPage() {}

  SubmitSearchCriateria() {
    let searchQuery = "1=1 ";
    this.local.GetAdvanceFilterValue(this.AdvanceSearch);

    if (IsValidType(this.AdvanceSearch.Marchandisor)) {
      searchQuery +=
        " And Marchandisor = '" + this.AdvanceSearch.Marchandisor + "'";
    }

    if (IsValidType(this.AdvanceSearch.Supervisor)) {
      searchQuery +=
        " And Supervisor = '" + this.AdvanceSearch.Supervisor + "'";
    }

    if (IsValidType(this.AdvanceSearch.Region)) {
      searchQuery += " And Region = '" + this.AdvanceSearch.Region + "'";
    }

    if (this.AdvanceSearch.CustomerName) {
      searchQuery +=
        " And CustomerName = '" + this.AdvanceSearch.CustomerName + "'";
    }

    if (this.AdvanceSearch.CustomerCode) {
      searchQuery +=
        " And CustomerCode = '" + this.AdvanceSearch.CustomerCode + "'";
    }

    if (this.AdvanceSearch.State) {
      searchQuery += " And State = '" + this.AdvanceSearch.State + "'";
    }

    if (this.AdvanceSearch.City) {
      searchQuery += " And City = '" + this.AdvanceSearch.City + "'";
    }

    if (this.AdvanceSearch.ChainName) {
      searchQuery += " And ChainName = '" + this.AdvanceSearch.ChainName + "'";
    }

    this.LoadData();
  }

  LoadData() {
    let MSData = JSON.parse(PostParam);
    this.EnableFilter = false;
    this.http
      .post(
        "Webportal/FetchAvailabilityReport",
        JSON.stringify(this.AdvanceSearch)
      )
      .then((response) => {
        if (this.commonService.IsValidResponse(response)) {
          let Data = response.content.data;
          this.TableResultSet = [];
        }
      });
  }

  Edit(editEntity: any) {
    this.Open();
    this.entity = editEntity;
  }

  OpenFilter() {
    this.EnableFilter = true;
  }

  Open() {
    this.entity = new StateModel();
    this.entity.ParentGid = "";
  }
}
