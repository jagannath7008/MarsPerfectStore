import { Component, OnInit } from "@angular/core";
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { AjaxService } from "src/providers/ajax.service";
import { CommonService } from "src/providers/common-service/common.service";

@Component({
  selector: "app-rowdata",
  templateUrl: "./rowdata.component.html",
  styleUrls: ["./rowdata.component.scss"],
})
export class RowdataComponent implements OnInit {
  fromModel: NgbDateStruct;
  toModel: NgbDateStruct;
  modalDate: string = "";
  selectedDate: any;
  datePickerConfig: any = {};
  rawType: string = "";
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  progresstext: boolean;

  constructor(
    private commonService: CommonService,
    private http: AjaxService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    this.fromDate = null; //calendar.getToday();
    this.toDate = null; // calendar.getNext(calendar.getToday(), "d", 10);
    this.progresstext = false;
  }

  ngOnInit() {
    this.fromModel = this.calendar.getToday();
    this.toModel = this.calendar.getToday();
    this.modalDate = `${this.fromModel.day}/${this.fromModel.month}/${this.fromModel.year}`;
  }

  FetchData() {
    if (this.rawType !== "" && this.fromDate !== null && this.toDate !== null) {
      let requestObject = {
        StartDate: this.GetFormatterDate(this.fromDate),
        EndDate: this.GetFormatterDate(this.toDate),
        ProcedureType: this.rawType,
      };

      this.progresstext = true;
      setTimeout(() => {
        this.progresstext = false;
      }, 1000 * 10);
      this.http.getExcel(
        `Webportal/RawDataExcel?StartTime=${requestObject.StartDate}&EndTime=${requestObject.EndDate}&DumpType=${requestObject.ProcedureType}`
      );
    } else {
      this.commonService.ShowToast(
        "Please select RawType, Start and End date properlly."
      );
    }
  }

  GetFormatterDate(dateValue: NgbDate) {
    let formattedDate = null;
    if (dateValue !== null) {
      formattedDate = dateValue.year.toString();
      if (dateValue.month < 10)
        formattedDate += "0" + dateValue.month.toString();
      else formattedDate += dateValue.month.toString();

      if (dateValue.day < 10) formattedDate += "0" + dateValue.day.toString();
      else formattedDate += dateValue.day.toString();
    }
    return formattedDate;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }
}
