import { Injectable } from "@angular/core";
import { CommonService, IsValidType } from "./common-service/common.service";

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

  public GetMasterDataValues(
    TableName: string = "",
    Gid: string = ""
  ): Array<any> {
    let ResponseData = new Array<any>();
    if (TableName !== "") {
      let MasterData = this.getMaster();
      if (IsValidType(TableName)) {
        if (IsValidType(Gid)) {
          ResponseData = MasterData[TableName].filter(
            (x) => x.ParentGid == Gid
          );
        } else {
          ResponseData = MasterData[TableName];
        }
      }
    }
    return ResponseData;
  }
}
