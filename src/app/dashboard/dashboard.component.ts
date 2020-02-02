import { Component, OnInit } from "@angular/core";
import { PageName, RouteDescription } from "src/providers/constants";
import { iNavigation } from "src/providers/iNavigation";
import { CommonService } from "src/providers/common-service/common.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.sass"]
})
export class DashboardComponent implements OnInit {
  Pages: Array<RouteDescription> = [];
  constructor(
    private nav: iNavigation,
    private commonService: CommonService,
    private storage: ApplicationStorage
  ) {}

  ngOnInit() {
    this.Pages = PageName;
  }

  SignOut() {
    this.storage.clear();
    this.nav.navigate("/", null);
  }
}
