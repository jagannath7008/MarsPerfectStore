import { Component, OnInit } from "@angular/core";
import { iNavigation } from "src/providers/iNavigation";
import { CommonService } from "src/providers/common-service/common.service";
import { ApplicationStorage } from 'src/providers/ApplicationStorage';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  constructor(private nav: iNavigation, private common: CommonService, 
    private local: ApplicationStorage) {}

  ngOnInit() {}

  doLogout() {
    this.local.clear();
    this.common.ShowToast("Logout successfully.");
    this.nav.navigate("/", null);
  }
}
