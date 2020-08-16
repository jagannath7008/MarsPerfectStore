import { Injectable } from "@angular/core";
import { CommonService, IsValidType } from "./common-service/common.service";
import {
  ZerothIndex,
  M_Merchandiser,
  M_Supervisor,
  M_Region,
  M_State,
  M_City,
} from "./constants";
import { AdvanceFilterModal } from "src/app/availabilityreport/availabilityreport.component";

@Injectable()
export class ApplicationStorage {
  $master: any = {};
  MasterCacheName = "master";
  constructor(private commonService: CommonService) {}

  reinitMaster() {
    let flag = false;
    let LocalData = localStorage.getItem("master");
    if (LocalData != null && LocalData != "" && LocalData != "{}") {
      this.$master = JSON.parse(LocalData);
      flag = true;
    }
    return flag;
  }

  set(Data: any, IsReplaceAll: boolean = false) {
    if (this.commonService.IsValid(Data)) {
      if (IsReplaceAll) {
        this.$master = null;
        this.$master = Data;
      } else {
        let LocalData = localStorage.getItem("master");
        if (LocalData != "" && LocalData !== null) {
          this.$master = JSON.parse(LocalData);
          let Fields = Object.keys(Data);
          let index = 0;
          while (index < Fields.length) {
            this.$master[Fields[index]] = Data[Fields[index]];
            index++;
          }
        } else {
          this.$master = null;
          this.$master = Data;
        }
      }

      localStorage.removeItem(this.MasterCacheName);
      if (
        typeof localStorage.removeItem("master") === "undefined" ||
        localStorage.getItem("master") === null
      ) {
        localStorage.setItem(
          this.MasterCacheName,
          JSON.stringify(this.$master)
        );
        this.commonService.ShowToast("Data initialized.");
      } else {
        this.commonService.ShowToast("Not able to re-load master data.");
      }
    }
  }

  clear() {
    localStorage.clear();
  }

  get(storageName: string = this.MasterCacheName, key: string) {
    let ResultingData = null;
    if (
      storageName === undefined ||
      storageName === null ||
      storageName === ""
    ) {
      storageName = this.MasterCacheName;
    }
    storageName = storageName.toLocaleLowerCase();
    let Data = localStorage.getItem(storageName);
    if (this.commonService.IsValid(Data)) {
      Data = JSON.parse(Data);
      let DataKeys = Object.keys(Data);
      if (DataKeys.length > 0) {
        let index = 0;
        while (index < DataKeys.length) {
          if (DataKeys[index].toLocaleLowerCase() === key.toLocaleLowerCase()) {
            ResultingData = Data[DataKeys[index]];
            break;
          }
          index++;
        }
      }
    }
    return ResultingData;
  }

  getMaster() {
    let ResultingData = null;
    let Data = localStorage.getItem(this.MasterCacheName);
    if (this.commonService.IsValid(Data)) {
      try {
        ResultingData = JSON.parse(Data);
      } catch (e) {
        ResultingData = Data;
      }
    }
    return ResultingData;
  }

  setByKey(Key: string, ModifiedData: any): boolean {
    let flag = false;
    let ResultingData = null;
    if (this.MasterCacheName != "" && Key != "") {
      this.MasterCacheName = this.MasterCacheName.toLocaleLowerCase();
      let Data = localStorage.getItem(this.MasterCacheName);
      if (this.commonService.IsValid(Data)) {
        Data = JSON.parse(Data);
        let DataKeys = Object.keys(Data);
        if (DataKeys.length > 0) {
          let index = 0;
          while (index < DataKeys.length) {
            if (
              DataKeys[index].toLocaleLowerCase() === Key.toLocaleLowerCase()
            ) {
              Data[DataKeys[index]] = ModifiedData;
              localStorage.setItem(this.MasterCacheName, JSON.stringify(Data));
              flag = true;
              break;
            }
            index++;
          }
        }
      }
    }
    return flag;
  }

  public GetAdvanceFilterValue(AdvanceSearch: AdvanceFilterModal) {
    if (IsValidType(AdvanceSearch)) {
      let MasterData = this.getMaster();
      if (IsValidType(AdvanceSearch.Marchandisor)) {
        let Data = MasterData[M_Merchandiser].filter(
          (x) => x.Gid === AdvanceSearch.Marchandisor
        );
        if (Data.length > 0) {
          AdvanceSearch.Marchandisor = Data[ZerothIndex].Name;
        }
      }

      if (IsValidType(AdvanceSearch.Supervisor)) {
        let Data = MasterData[M_Supervisor].filter(
          (x) => x.Gid === AdvanceSearch.Supervisor
        );
        if (Data.length > 0) {
          AdvanceSearch.Supervisor = Data[ZerothIndex].Name;
        }
      }

      if (IsValidType(AdvanceSearch.Region)) {
        let Data = MasterData[M_Region].filter(
          (x) => x.Gid === AdvanceSearch.Region
        );
        if (Data.length > 0) {
          AdvanceSearch.Region = Data[ZerothIndex].Name;
        }
      }

      if (IsValidType(AdvanceSearch.State)) {
        let Data = MasterData[M_State].filter(
          (x) => x.Gid === AdvanceSearch.State
        );
        if (Data.length > 0) {
          AdvanceSearch.State = Data[ZerothIndex].Name;
        }
      }

      if (IsValidType(AdvanceSearch.City)) {
        let Data = MasterData[M_City].filter(
          (x) => x.Gid === AdvanceSearch.City
        );
        if (Data.length > 0) {
          AdvanceSearch.City = Data[ZerothIndex].Name;
        }
      }

      if (IsValidType(AdvanceSearch.ChainName)) {
        let Data = MasterData["ChainName"].filter(
          (x) => x.Gid === AdvanceSearch.ChainName
        );
        if (Data.length > 0) {
          AdvanceSearch.ChainName = Data[ZerothIndex].Name;
        }
      }
    }
  }

  public GetMasterDataValues(
    TableName: string = "",
    Gid: string = "",
    Name: string = ""
  ): Array<any> {
    let ResponseData = new Array<any>();
    if (TableName !== "") {
      let MasterData = this.getMaster();
      if (IsValidType(TableName)) {
        if (TableName === "Merchandiser") {
          let CurrentSupervisor = this.GetUniqueItems(
            MasterData.Supervisor.filter((x) => x.Gid == Gid)
          );
          if (CurrentSupervisor.length > 0) {
            ResponseData = this.GetUniqueItems(
              MasterData.Merchandiser.filter(
                (x) => x.Code == CurrentSupervisor[ZerothIndex]["Code"]
              )
            );
          }
        } else {
          if (Name !== null && Name !== "") {
            ResponseData = this.GetUniqueItems(
              MasterData[TableName].filter((x) => x.Name == Name)
            );
          } else if (IsValidType(Gid)) {
            ResponseData = this.GetUniqueItems(
              MasterData[TableName].filter((x) => x.ParentGid == Gid)
            );
          } else {
            ResponseData = MasterData[TableName];
          }
        }
      }
    }
    return ResponseData;
  }

  private GetUniqueItems(Data: Array<any>): Array<any> {
    let FilteredData = [];
    if (IsValidType(Data)) {
      let index = 0;
      while (index < Data.length) {
        if (
          FilteredData.filter((x) => x.Gid === Data[index].Gid).length === 0
        ) {
          FilteredData.push(Data[index]);
        }
        index++;
      }
    }
    return FilteredData;
  }

  public GetChainOrCustomer(
    IsChain: boolean,
    CityGid: string = "",
    ChainName: string = ""
  ) {
    let ChainNameData = [];
    if (IsValidType(CityGid)) {
      let MasterData = this.getMaster();
      let FilteredData = MasterData.City.filter((x) => x.Gid === CityGid);
      if (FilteredData.length > 0) {
        if (IsChain) {
          ChainNameData = MasterData.ChainName.filter(
            (x) => x.City === FilteredData[ZerothIndex].Name
          );
        } else {
          ChainNameData = MasterData.CustomerName.filter(
            (x) => x.City === FilteredData[ZerothIndex].Name
          );
        }
      }
    }
    if (ChainName !== "") {
      let MasterData = this.getMaster();
      ChainNameData = MasterData.CustomerName.filter(
        (x) => x.ChainName === ChainName
      );
    } else {
      let MasterData = this.getMaster();
      if (IsChain) {
        ChainNameData = MasterData.ChainName;
      } else {
        ChainNameData = MasterData.CustomerName;
      }
    }
    return ChainNameData;
  }

  public GetObjectByGid(TableName: string, Gid: string) {
    let CurrentObject = null;
    if (TableName !== null && TableName !== "" && Gid !== null && Gid !== "") {
      let MasterData = this.getMaster();
      if (IsValidType(MasterData)) {
        CurrentObject = MasterData[TableName].filter((x) => x.Gid === Gid);
        if (CurrentObject.length > 0) CurrentObject = CurrentObject[0];
        else CurrentObject = null;
      }
    }
    return CurrentObject;
  }
}
