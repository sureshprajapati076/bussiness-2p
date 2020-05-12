import { Component, OnInit } from '@angular/core';

declare const rollDiceWithoutValues: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'customjs';
  result: any
  ngOnInit() {


  }
  roll() {
    this.result = rollDiceWithoutValues();

  }
}
