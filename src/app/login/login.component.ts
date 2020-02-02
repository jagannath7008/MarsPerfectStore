import { Component, Output, EventEmitter } from "@angular/core";
import { AjaxService } from "../../providers/ajax.service";
import { PageCache } from "./../../providers/PageCache";
import { ApplicationStorage } from "../../providers/ApplicationStorage";
import * as $ from "jquery";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { CommonService } from "./../../providers/common-service/common.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  title = "Business manager";
  initialUrl: string = "";
  catagory: any = {};
  @Output() AuthenticateUser = new EventEmitter();
  UserData: FormGroup;
  constructor(
    private http: AjaxService,
    private cache: PageCache,
    private local: ApplicationStorage,
    private commonService: CommonService,
    private fb: FormBuilder
  ) {
    this.UserData = this.fb.group({
      Username: new FormControl(""),
      Password: new FormControl("")
    });
  }

  MobileNumber(e: any) {
    if (
      !this.commonService.MobileNumberFormat(
        e.which,
        $(event.currentTarget).val().length
      )
    ) {
      event.preventDefault();
    }
  }

  VerifiyUser() {
    if (this.UserData.valid) {
      if (
        this.UserData.get("Username").value !== "" &&
        this.UserData.get("Password").value !== ""
      ) {
        this.AuthenticateUser.emit(this.UserData.value);
      } else {
        this.commonService.ShowToast("Invalid username or password.");
      }
    }
  }
}
