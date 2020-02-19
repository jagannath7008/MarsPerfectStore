import { Component, OnInit } from "@angular/core";
import { iNavigation } from "src/providers/iNavigation";
import { CommonService } from "src/providers/common-service/common.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  constructor(private nav: iNavigation, private common: CommonService) {}

  ngOnInit() {}

  doLogout() {
    this.nav.navigate("/", null);
    this.common.ShowToast("Logout successfully.");
  }
}
