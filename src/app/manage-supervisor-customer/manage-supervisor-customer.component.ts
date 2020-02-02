import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/providers/common-service/common.service";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { AjaxService } from "./../../providers/ajax.service";
import { PostParam } from "src/providers/constants";
import { IGrid } from "src/providers/Generic/Interface/IGrid";
import { iNavigation } from "src/providers/iNavigation";

@Component({
  selector: "app-manage-supervisor-customer",
  templateUrl: "./manage-supervisor-customer.component.html",
  styleUrls: ["./manage-supervisor-customer.component.scss"]
})
export class ManageSupervisorCustomerComponent implements OnInit {
  CurrentSupervisorData: any;
  SupervisorName: string = "";
  dropdownList = [];
  selectedItems = [];
  IsCtxAvailable: boolean = false;
  dropdownSettings: IDropdownSettings = {};
  IsEmptyRow = false;
  CustomerList: any;
  Name: string = "";
  AddedCustomers: Array<Customer> = [];
  CustomersUidSelected: Array<string> = [];
  BindingHeader: Array<IGrid> = [];
  constructor(
    private commonService: CommonService,
    private http: AjaxService,
    private nav: iNavigation
  ) {}

  ngOnInit() {
    this.BindingHeader = [
      { column: "Customer", displayheader: "Customer", width: 10 },
      { column: "CustomerGid", type: "hidden" },
      { column: "RowGid", type: "hidden" },
      { column: "JobGid", type: "hidden" },
      { column: "Channel", displayheader: "Channel" },
      { column: "SubChannel", displayheader: "SubChannel" },
      { column: "ChainName", displayheader: "ChainName" },
      { column: "Type", displayheader: "Type" },
      { column: "City", displayheader: "City" },
      { column: "State", displayheader: "State" },
      { column: "Region", displayheader: "Region" },
      { column: "Country", displayheader: "Country" }
    ];

    let EditManageData = this.nav.getValue();
    if (this.commonService.IsValid(EditManageData)) {
      this.CurrentSupervisorData = this.nav.getValue();
      if (this.commonService.IsValid(this.CurrentSupervisorData)) {
        this.Name = this.CurrentSupervisorData.Name;
        this.commonService.ShowToast("User bind successfully.");
      } else {
        this.commonService.ShowToast("Invalid edit value.");
      }
      this.LoadData();
    } else {
      this.commonService.ShowToast("Edit data not found.");
    }
  }

  LoadData() {
    let Param = JSON.parse(PostParam);
    Param.content.searchString = "";
    Param.content.locType = "";
    this.http
      .post("Webportal/FetchRetailers", Param)
      .then(response => {
        if (
          this.commonService.IsValidResponse(response) &&
          response.status.code === "SUCCESS"
        ) {
          let Data = response.content.data;
          if (this.commonService.IsValid(Data)) {
            this.IsEmptyRow = false;
            this.BindPageData(Data);
            this.commonService.ShowToast("Data retrieve successfully.");
          } else {
            this.IsEmptyRow = true;
            this.commonService.ShowToast("Got empty dataset.");
          }
        } else {
          this.commonService.ShowToast("Unable to get data.");
        }
      })
      .catch(e => {
        this.commonService.ShowToast("Getting server error.");
      });

    let MSData = JSON.parse(PostParam);
    MSData.content.jobGid = this.CurrentSupervisorData.Gid;

    this.http
      .post("Beat/FetchMSCustomers", MSData)
      .then(result => {
        if (this.commonService.IsValid(result)) {
          this.commonService.ShowToast("Customer added successfully.");
          this.CheckAndBindData(result);
        } else {
          this.commonService.ShowToast(
            "Unable to add customer. Please contact to admin."
          );
        }
      })
      .catch(e => {
        this.commonService.ShowToast("Getting server error.");
      });
  }

  BindPageData(CtxData: any) {
    if (this.commonService.IsValid(CtxData)) {
      this.CustomerList = [];
      let index = 0;
      this.dropdownList = [];
      while (index < CtxData.length) {
        this.dropdownList.push({
          item_id: CtxData[index].Gid,
          item_text: CtxData[index].Name
        });
        index++;
      }

      // this.selectedItems = [
      //   { item_id: 3, item_text: "Pune" },
      //   { item_id: 4, item_text: "Navsari" }
      // ];
      this.dropdownSettings = {
        singleSelection: false,
        idField: "item_id",
        textField: "item_text",
        selectAllText: "Select All",
        unSelectAllText: "UnSelect All",
        itemsShowLimit: 3,
        allowSearchFilter: true
      };
    }
  }

  onSelectAll($data: any) {
    console.log($data);
  }

  onItemSelect($e: any) {
    if (this.commonService.IsValid($e)) {
      if (this.CustomersUidSelected.indexOf($e.item_id) === -1) {
        this.CustomersUidSelected.push($e.item_id);
      }
    }
  }

  RemoveCustomer($item: any) {
    let DeleteData = JSON.parse(PostParam);
    DeleteData.content.rowGid = $item.RowGid;

    this.http
      .post("Beat/RemoveMSCustomer", DeleteData)
      .then(result => {
        if (this.commonService.IsValid(result)) {
          if (result.status.code === "SUCCESS") {
            let NewItems: Array<Customer> = [];
            let index = 0;
            while (index < this.AddedCustomers.length) {
              if (this.AddedCustomers[index].RowGid !== $item.RowGid) {
                NewItems.push(this.AddedCustomers[index]);
              }
              index++;
            }

            this.AddedCustomers = NewItems;
            this.commonService.ShowToast("Customer deleted successfully.");
          }
        } else {
          this.commonService.ShowToast(
            "Unable to add customer. Please contact to admin."
          );
        }
      })
      .catch(e => {
        this.commonService.ShowToast("Getting server error.");
      });
  }

  AddCustomer() {
    if (this.CustomersUidSelected.length > 0) {
      let Data = this.CustomersUidSelected.join(",");
      let DefaultServerData = JSON.parse(PostParam);
      DefaultServerData.content.jobGid = this.CurrentSupervisorData.Gid;
      DefaultServerData.content.customerGid = Data;

      this.http
        .post("Beat/AddMSCustomer", DefaultServerData)
        .then(result => {
          if (this.commonService.IsValid(result)) {
            this.CheckAndBindData(result);
          }
        })
        .catch(e => {
          this.commonService.ShowToast(
            "Getting server error. Unable to add customer."
          );
        });
    }
  }

  CheckAndBindData(result: any) {
    if (
      this.commonService.IsValid(result) &&
      result.status.code === "SUCCESS"
    ) {
      let index = 0;
      let Data = result.content.data;
      while (index < Data.length) {
        if (
          this.AddedCustomers.filter(
            x => x.CustomerGid === Data[index].CustomerGid
          ).length === 0
        ) {
          this.AddedCustomers.push({
            Customer: Data[index].Customer,
            CustomerGid: Data[index].CustomerGid,
            RowGid: Data[index].RowGid,
            JobGid: Data[index].JobGid,
            Channel: Data[index].Channel,
            SubChannel: Data[index].SubChannel,
            ChainName: Data[index].ChainName,
            Type: Data[index].Type,
            City: Data[index].City,
            State: Data[index].State,
            Region: Data[index].Region,
            Country: Data[index].Country
          });
        }
        index++;
      }
      this.commonService.ShowToast("Customer added successfully.");
    } else {
      this.commonService.ShowToast(
        "Unable to add customer. Please contact to admin."
      );
    }
  }
}

interface Customer {
  Customer: string;
  CustomerGid: string;
  RowGid: string;
  JobGid: string;
  Channel: string;
  SubChannel: string;
  ChainName: string;
  Type: string;
  City: string;
  State: string;
  Region: string;
  Country: string;
}
