import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService, IsValidType } from "./common-service/common.service";

export const NAVPARAMNAME = "navigation_parameter";

@Injectable()
export class iNavigation {
  constructor(private route: Router, private common: CommonService) {}

  public navigate(Path: string, Parameter: any) {
    let PageParamter: any = "";
    if (Path !== null && Path !== "") {
      if (Parameter !== null && Parameter !== "") {
        PageParamter = JSON.stringify({ page: Path, data: Parameter });
      }
      localStorage.setItem(NAVPARAMNAME, PageParamter);
      this.common.HighlightNavMenu(Path);
      this.route.navigate([Path]);
    } else {
      this.common.ShowToast("Invalid component path passed.");
    }
  }

  public getValue(): any {
    let PageObject = localStorage.getItem(NAVPARAMNAME);
    if (!IsValidType(PageObject)) {
      PageObject = null;
    } else {
      let Data = JSON.parse(PageObject);
      if (Data !== "") {
        if (Data.page !== this.common.GetCurrentPageName()) {
          try {
            localStorage.removeItem(NAVPARAMNAME);
            Data = null;
            PageObject = null;
          } catch (e) {
            console.log("Localstorage value not exists.");
          }
        } else {
          PageObject = Data.data;
        }
      }
    }
    return PageObject;
  }

  public resetValue() {
    localStorage.removeItem(NAVPARAMNAME);
  }
}
