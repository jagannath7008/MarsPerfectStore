import { Component, OnInit, Input, ViewChild  } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { IGrid } from "src/providers/Generic/Interface/IGrid";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { CommonService } from "src/providers/common-service/common.service";
import * as $ from "jquery";
import { JourneyPlan, Employee } from "src/providers/constants";
import { iNavigation } from "src/providers/iNavigation";
import { AjaxService } from "src/providers/ajax.service";
import { BusinessunitModel } from 'src/app/businessunit/businessunit.component';

@Component({
  selector: 'app-availabilityreport',
  templateUrl: './availabilityreport.component.html',
  styleUrls: ['./availabilityreport.component.sass']
})
export class AvailabilityreportComponent implements OnInit {
  selectedClass: string = 'Assigned';
  public TodayJourneyPlanViewModel:Array<AvailabilityReportCategoryViewModel>;
  public ChildModel:Array<AvailabilityReportBrandViewModel>;
  public GCModel:Array<AvailabilityReportSKUViewModel>;

  TableResultSet:any[];
  IsEmptyRow: boolean = true;
  HeaderName: string = "Page Name";
  EnableFilter: boolean = false;
  TotalHeaders: number = 5;
  searchQuery: string = "";
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private nav: iNavigation,
    private http: AjaxService
  ) {
    let PageName = this.commonService.GetCurrentPageName();
      this.HeaderName = "Availability Report";
  }
  ActiveRow:boolean[]=[];
  ActiveRowGC:boolean[]=[];
  icon:string="assets/images/view.png";

  

  
  ngOnInit() {
    this.LoadData();
  }
  LoadData() {
//     let input : any = {
//       "meta" : {
//                 "app" : "MerchandiserApp",
//                 "action" : "WebLogin",
//                 "requestId" : "0",
//                 "deviceId" : "web"
//       },
//       "content" : {
//                   "deviceId" : "web",
//                   "deviceType" : "web",
//                   "deviceOS":"Windows",
//                   "deviceVersion" : "web",
//                   "deviceInfo" : "web"
//       }
//     };
// input.content.searchString = this.searchQuery;
//     this.http.post("Webportal/FetchAvailabilityReport", input).then(response => {
//       this.TableResultSet = [];
//       if (this.commonService.IsValidResponse(response)) {
//         let Data = response.content.data;
//         if (Data != null && Data != "") {
//           this.IsEmptyRow = false;
//           this.TableResultSet = Data;
//           this.commonService.ShowToast("Data retrieve successfully.");
//         } else {
//           this.IsEmptyRow = true;
//           this.commonService.ShowToast("Got empty dataset.");
//         }
//       } else {
//         this.commonService.ShowToast("Unable to get data.");
//       }
//     });

    this.TodayJourneyPlanViewModel=[
      {CategoryCode:"CA1", TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50",
      lstAvailabilityReportBrandViewModel:[
        {CategoryCode:"CA1", BrandCode:"BA1",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"
        ,lstAvailabilityReportSKUViewModel:[
          {CategoryCode:"CA1", BrandCode:"BA1",ItemCode:"I1",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
          {CategoryCode:"CA1", BrandCode:"BA1",ItemCode:"I2",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"}
        ]
      },
        {CategoryCode:"CA1", BrandCode:"BA2",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"
        ,lstAvailabilityReportSKUViewModel:[
          {CategoryCode:"CA1", BrandCode:"BA2",ItemCode:"I3",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
      {CategoryCode:"CA1", BrandCode:"BA2",ItemCode:"I4",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"}
        ]
      }
      ]
    },


      {CategoryCode:"CA2", TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50",
      lstAvailabilityReportBrandViewModel:[
        {CategoryCode:"CA2", BrandCode:"BA3",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"
      ,lstAvailabilityReportSKUViewModel:[
        {CategoryCode:"CA2", BrandCode:"BA3",ItemCode:"I5",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
        {CategoryCode:"CA2", BrandCode:"BA3",ItemCode:"I6",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"}
      ]
      },
        {CategoryCode:"CA2", BrandCode:"BA4",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"
        ,lstAvailabilityReportSKUViewModel:[
          {CategoryCode:"CA2", BrandCode:"BA4",ItemCode:"I7",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
          {CategoryCode:"CA2", BrandCode:"BA4",ItemCode:"I8",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"}
        ]
      }
      ]
    },
    ];

    // this.ChildModel=[
    //   {CategoryCode:"CA1", BrandCode:"BA1",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
    //   {CategoryCode:"CA1", BrandCode:"BA2",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
    //   {CategoryCode:"CA2", BrandCode:"BA3",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
    //   {CategoryCode:"CA2", BrandCode:"BA4",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
    // ];
    // this.GCModel=[
    //   {CategoryCode:"CA1", BrandCode:"BA1",ItemCode:"I1",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
    //   {CategoryCode:"CA1", BrandCode:"BA1",ItemCode:"I2",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
    //   {CategoryCode:"CA1", BrandCode:"BA2",ItemCode:"I3",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
    //   {CategoryCode:"CA1", BrandCode:"BA2",ItemCode:"I4",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
    //   {CategoryCode:"CA2", BrandCode:"BA3",ItemCode:"I5",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
    //   {CategoryCode:"CA2", BrandCode:"BA3",ItemCode:"I6",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
    //   {CategoryCode:"CA2", BrandCode:"BA4",ItemCode:"I7",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
    //   {CategoryCode:"CA2", BrandCode:"BA4",ItemCode:"I8",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},

    // ];

  }

  ResetFilter() {
    this.searchQuery = "";
    this.LoadData();
  }
  toggleIcon(event:Event)
  {
     var imagevalue=(event.target as Element).getAttribute("src");    
     if( imagevalue=="assets/images/view.png")      {
          (event.target as Element).setAttribute("src","assets/images/view1.png")       
       }
          else if(imagevalue=="assets/images/view1.png")
          {
            (event.target as Element).setAttribute("src","assets/images/view.png")
          }
       
     }
    

  


  FilterLocaldata() {
    console.log(this.searchQuery);
    this.LoadData();
  }
}

export class AvailabilityReportCategoryViewModel {
  CategoryCode:string;
  TotalNoOfStores:string;
  AvailabileIn:string;
  AvailabilityPercentage:string;
  lstAvailabilityReportBrandViewModel :Array<AvailabilityReportBrandViewModel> ;
 
 
 }
 
 export class AvailabilityReportBrandViewModel{
 CategoryCode:string;
 BrandCode:string;
 TotalNoOfStores:string;
 AvailabileIn:string;
 AvailabilityPercentage:string;
 lstAvailabilityReportSKUViewModel:Array<AvailabilityReportSKUViewModel> ;
 
 }
 
 export class AvailabilityReportSKUViewModel
 {
    CategoryCode:string;
     BrandCode:string;
     ItemCode:string;
     TotalNoOfStores:string;
     AvailabileIn:string;
     AvailabilityPercentage:string;
 
 
 }
