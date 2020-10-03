import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-monthpromoandcomm',
  templateUrl: './monthpromoandcomm.component.html',
  styleUrls: ['./monthpromoandcomm.component.sass']
})
export class MonthpromoandcommComponent implements OnInit {
  isDataAvailable: boolean = true;
  constructor() { }

  ngOnInit() {
  }

  allowEnter (event) {
    if (event.which == 13) {
      event.preventDefault();
        var s = $(this).val();
        $(this).val(s+"\n");
    }
  }
}
