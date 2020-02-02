import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/providers/common-service/common.service";

@Component({
  selector: "app-pagebreadcrumb",
  templateUrl: "./pagebreadcrumb.component.html",
  styleUrls: ["./pagebreadcrumb.component.scss"]
})
export class PagebreadcrumbComponent implements OnInit {
  BreadCrumbData: Array<string> = [];
  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.BreadCrumbData = this.commonService.GetBreadCrumbRoute();
  }
}
