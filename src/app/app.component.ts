import { Component, OnInit } from '@angular/core';
import { GameInitialData } from './data';

declare const rollDiceWithoutValues: any;

export class Player {
  pos: number;
  completeOneCircle: boolean
  ownedLand: Array<Land>;
  amount: number;
  constructor() {
    this.pos = 0;
    this.ownedLand = [];
    this.amount = 12000;
    this.completeOneCircle = false;
  }

}
export class Land {
  name: String;
  price: number;
  ownedBy: any;
  house: String;

}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'customjs';
  result: number
  colorGreen: String

  Px: Player;
  Py: Player;


  P2: boolean
  P1: boolean

  data: Array<Land>
  showHomeOption: boolean
  showPayRent: boolean

  hideBoth: boolean
  turn: boolean;

  ngOnInit() {
    this.hideBoth = false;

    this.turn = true;
    this.Px = new Player();
    this.Py = new Player();

    this.P1 = false;
    this.P2 = true;
    this.showHomeOption = false;
    this.showPayRent = false;
    this.data = GameInitialData.data;



  }
  buyX() {
    let land = this.data[this.Px.pos]
    land.ownedBy = 'red';

    if (this.Px.ownedLand.indexOf(land) == -1) {

      this.Px.ownedLand.push(land)
      this.Px.amount -= land.price;
    }
    this.finish();

  }

  buyY() {
    let land = this.data[this.Py.pos]
    land.ownedBy = 'blue';
    if (this.Py.ownedLand.indexOf(land) == -1) {
      this.Py.ownedLand.push(land)
      this.Py.amount -= land.price;
    }
    this.finish();


  }
  buildHouseX() {
    let land = this.data[this.Px.pos]
    if (this.Px.ownedLand.indexOf(land) >= 0) {
      land.house = 'H';
      this.Px.amount -= land.price * 2;
      this.finish();
    }


  }
  buildHouseY() {
    let land = this.data[this.Py.pos]
    if (this.Py.ownedLand.indexOf(land) >= 0) {
      land.house = 'H';
      this.Py.amount -= land.price * 2;
      this.finish();
    }

  }
  checkIfOwnedByX() {
    let land = this.data[this.Px.pos]
    if (this.Px.ownedLand.indexOf(land) >= 0)
      return true;
    else
      return false;

  }
  checkIfOwnedByY() {
    let land = this.data[this.Py.pos]
    if (this.Py.ownedLand.indexOf(land) >= 0)
      return true;
    else
      return false;

  }
  checkIfHouseOfX() {
    let land = this.data[this.Px.pos]
    if (this.Px.ownedLand.indexOf(land) >= 0 && land.house == 'H')
      return true;
    else
      return false;

  }
  checkIfHouseOfY() {
    let land = this.data[this.Py.pos]
    if (this.Py.ownedLand.indexOf(land) >= 0 && land.house == 'H')
      return true;
    else
      return false;

  }
  payRentToY() {
    let land = this.data[this.Px.pos]
    let payAmount = land.price;
    if (land.house == 'H') {
      payAmount *= 2;
    }
    this.Py.amount += payAmount;
    this.Px.amount -= payAmount;
    this.finish();
  }
  payRentToX() {
    let land = this.data[this.Py.pos]
    let payAmount = land.price;
    if (land.house == 'H') {
      payAmount *= 2;
    }
    this.Px.amount += payAmount;
    this.Py.amount -= payAmount;
    this.finish();
  }

  finish() {

    if (this.turn == true) {
      this.P2 = true;
      this.P1 = false;
    } else {
      this.P2 = false;
      this.P1 = true;
    }
    this.hideBoth = false;

  }


  roll1() {

    this.result = rollDiceWithoutValues();
    this.P1 = true;
    this.P2 = true;
    setTimeout(() => { this.animate1() }, 1000)
    this.turn = false;



  }
  roll2() {
    this.P1 = true;
    this.P2 = true

    this.result = rollDiceWithoutValues();

    setTimeout(() => { this.animate2() }, 1000)

    this.turn = true;



  }
  animate1() {

    if (this.Px.pos + this.result >= 36) {
      this.Px.completeOneCircle = true;
    }
    if (this.Px.completeOneCircle == false) {
      this.finish();
    }

    for (let i = 1; i <= this.result; i++) {
      setTimeout(() => {

        this.Px.pos = (this.Px.pos + 1) % 36;
      }, 200 * i);
    }
    setTimeout(() => {
      let land = this.data[this.Px.pos];
      this.hideBoth = true;
      if (this.Px.ownedLand.indexOf(land) >= 0) {
        this.showHomeOption = true;
      } else {
        this.showHomeOption = false;
      }
      if (this.Py.ownedLand.indexOf(land) >= 0) {
        this.showPayRent = true;
      } else {
        this.showPayRent = false;
      }

    }, 200 * this.result)

  }


  animate2() {

    if (this.Py.pos + this.result >= 36) {
      this.Py.completeOneCircle = true;
    }
    if (this.Py.completeOneCircle == false) {
      this.finish();
    }
    for (let i = 1; i <= this.result; i++) {
      setTimeout(() => {

        this.Py.pos = (this.Py.pos + 1) % 36;
      }, 200 * i);
    }
    setTimeout(() => {
      let land = this.data[this.Py.pos];
      this.hideBoth = true;
      if (this.Py.ownedLand.indexOf(land) >= 0) {
        this.showHomeOption = true;
      } else {
        this.showHomeOption = false;
      }
      if (this.Px.ownedLand.indexOf(land) >= 0) {
        this.showPayRent = true;
      } else {
        this.showPayRent = false;
      }

    }, 200 * this.result)

  }

}
