import { Component, OnInit } from "@angular/core";
import{IGrid} from "src/providers/Generic/Interface/IGrid";
import{CommonService} from "src/providers/common-service/common.service";
import{JourneyPlan, Employee} from "src/providers/constants";
import {iNavigation} from "src/providers/iNavigation";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormControl } from "@angular/forms";
import * as $ from "jquery";

import { AjaxService } from "src/providers/ajax.service";


@Component({
  selector: 'app-planogram-detail-report',
  templateUrl: './planogram-detail-report.component.html',
  styleUrls: ['./planogram-detail-report.component.scss']
})
export class PlanogramDetailReportComponent implements OnInit {

  BindingHeader: Array<IGrid>;
  IsEmptyRow: boolean = true;
  searchQuery: string = "";
  HeaderName: string = "Page Name";
  TableResultSet: any[];
  BindSuggestedImages:Array<PlanogramSuggestedImages>;
  BindTypeImages:Array<PlanogramTypeImages>;
  EnableFilter: boolean = false;
 
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private nav: iNavigation,
    private http: AjaxService
  ) {

    let PageName = this.commonService.GetCurrentPageName();
      this.HeaderName = "Planogram Detail";
  }

 

  ngOnInit() {
    this.BindingHeader = [
      { column: "storeName", displayheader: "Store Name", width: 10 },
      { column: "MainAisleSuggested", displayheader: "MA Suggested"},
      { column: "MainAisleExecuted", displayheader: "MA Executed"},
      { column: "SecondaryVisibilitySuggested", displayheader: "SV Suggested" },
      { column: "SecondaryVisibilityExecuted", displayheader: "SV Executed" },
      { column: "TransactionZoneSuggested", displayheader: "TZ Suggested" },
      { column: "TransactionZoneExecuted", displayheader: "TZ Executed" },
      { column: "Gid", type: "hidden" }
    ];
    
    this.LoadData();
    this.LoadTableData();
  }

  FilterLocaldata() {
    console.log(this.searchQuery);
    this.LoadData();
  }

  LoadTableData() {
    this.IsEmptyRow = false;
  }
  Open(Gid:string,Type:string)
  {
    this.BindTypeImages=[];
    for(var i=0;i<this.BindSuggestedImages.length;i++)
    {
           if(this.BindSuggestedImages[i].Gid==Gid && this.BindSuggestedImages[i].Type==Type)
           {
              this.BindTypeImages.push({Type:this.BindSuggestedImages[i].Type,ImageTypes:this.BindSuggestedImages[i].ImageTypes,
              SuggestedImages:this.BindSuggestedImages[i].SuggestedImages,SubType:this.BindSuggestedImages[i].SubType})

           }

    }


  //   for (var i=0;i<this.TableResultSet.length;i++)
  //   {
  //      let Imagelist:any[];
  //      Imagelist=this.TableResultSet[i].lstPlanogramSuggestedImages;
    
  //   for(var j=0;j<Imagelist.length;i++)
  //   {
  //          if(Imagelist[i].Gid==Gid && Imagelist[i].Type==Type)
  //          {
  //             this.BindTypeImages.push({Type:Imagelist[i].Type,ImageTypes:Imagelist[i].ImageTypes,
  //             SuggestedImages:Imagelist[i].SuggestedImages,SubType:Imagelist[i].SubType})

  //          }

  //   }
  // }

    this.EnableFilter = true;
  }
  Close() {
    this.EnableFilter = false;
  }
  ResetFilter() {
    this.searchQuery = "";
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
//     this.http.post("Webportal/FetchPlanogramDetailReport", input).then(response => {
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

this.BindSuggestedImages=[
{Gid:"1234",Type:"MainAisle",SubType:"Suggested",ImageTypes:"MainAisleSuggested",SuggestedImages:"assets/images/Image5.jpg"},
{Gid:"1234",Type:"MainAisle",SubType:"Suggested",ImageTypes:"MainAisleSuggested",SuggestedImages:"assets/images/Image6.jpg"},
{Gid:"1234",Type:"MainAisle",SubType:"Suggested",ImageTypes:"MainAisleSuggested",SuggestedImages:"assets/images/Image6.jpg"},
{Gid:"1234",Type:"MainAisle",SubType:"Suggested",ImageTypes:"MainAisleSuggested",SuggestedImages:"assets/images/Image6.jpg"},
{Gid:"1234",Type:"MainAisle",SubType:"Suggested",ImageTypes:"MainAisleSuggested",SuggestedImages:"assets/images/Image6.jpg"},
{Gid:"1234",Type:"MainAisle",SubType:"Suggested",ImageTypes:"MainAisleSuggested",SuggestedImages:"assets/images/Image6.jpg"},
{Gid:"1234",Type:"MainAisle",SubType:"Suggested",ImageTypes:"MainAisleSuggested",SuggestedImages:"assets/images/Image6.jpg"},


{Gid:"2345",Type:"MainAisle",SubType:"Suggested",ImageTypes:"MainAisleSuggested",SuggestedImages:"assets/images/Image7.jpg"},
{Gid:"2345",Type:"MainAisle",SubType:"Suggested",ImageTypes:"MainAisleSuggested",SuggestedImages:"assets/images/Image8.jpg"},
{Gid:"1234",Type:"MainAisle",SubType:"Executed",ImageTypes:"MainAisleExecuted",SuggestedImages:"assets/images/Image1.jpg"},
{Gid:"1234",Type:"MainAisle",SubType:"Executed",ImageTypes:"MainAisleExecuted",SuggestedImages:"assets/images/Image2.jpg"},
{Gid:"2345",Type:"MainAisle",SubType:"Executed",ImageTypes:"MainAisleExecuted",SuggestedImages:"assets/images/Image3.jpg"},
{Gid:"2345",Type:"MainAisle",SubType:"Executed",ImageTypes:"MainAisleExecuted",SuggestedImages:"assets/images/Image4.jpg"}
];

  this.TableResultSet=[
    {Gid:"1234",storeName:"Pankaj",StoreCode:"0001",BusinessUnitCode:"Mars",UserCode:"U1",UserName:"User1"
    ,BusinessUnitName:"MarsDetail",DateExecuted:"2020-02-09"
    ,SuggestedImagesList:this.BindSuggestedImages},
    
    {Gid:"2345",storeName:"Rahul",StoreCode:"0002",BusinessUnitCode:"Mars",UserCode:"U2",UserName:"User2"
    ,BusinessUnitName:"MarsDetail"
    ,DateExecuted:"2020-02-09",SuggestedImagesList:this.BindSuggestedImages}
      ];
    



  }

  

}



export class PlannogramDetailModel {

  Gid:string;
  storeName:string;
  StoreCode:string;  
  BusinessUnitCode:string;
  UserCode:string;
  UserName:string;
  BusinessUnitName:string;
  DateExecuted:string;
  //Region,State,City,BeatCode,BeatName,ChainName,Subchannel
  SuggestedImagesList: Array<PlanogramSuggestedImages>;
  // ExecutedImagesList: Array<PlanogramExecutedImages>;

  
}

export class PlanogramSuggestedImages{
Gid:string;
Type:string;
ImageTypes:string;
SuggestedImages:string;
SubType:string;

}

export class PlanogramTypeImages
{
  Type:string;
  ImageTypes:string;
  SuggestedImages:string;
  SubType:string;
}


  