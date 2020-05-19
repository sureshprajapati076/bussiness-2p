import { Component, OnInit } from '@angular/core';
import { GameInitialData } from './data';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';

declare const rollDiceWithoutValues: any;

export class Player {
  pos: number;
  completeOneCircle: boolean
  ownedLand: Array<Land>;
  amount: number;
  secretKey: string;
  constructor() {
    this.pos = 0;
    this.ownedLand = [];
    this.amount = 40000;
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

  appTitle = 'Business-2 Player';
  result: number

  hideVideo: boolean;

  Px: Player;
  Py: Player;

  noActionNeeded = []
  rewardOrTaxes = []
  P2: boolean
  P1: boolean
  noLand = []
  noHouse = []
  hover = []
  data: Array<Land>
  showHomeOption: boolean
  showPayRent: boolean

  hideBoth: boolean
  turn: boolean;
  sellStatus: boolean


  showMessage(message) {

    this.toastr.warning('<span>' + message + '</span>', "", { enableHtml: true, timeOut: 2000, closeButton: true, positionClass: "toast-top-right" });


  }
  constructor(private toastr: ToastrService) {

  }


  ngOnInit() {
    this.sellStatus = false;

    this.hideVideo = false;

    this.noLand = [0, 1, 5, 7, 9, 18, 20, 27, 28, 32];
    this.noHouse = [0, 1, 5, 7, 9, 18, 20, 27, 28, 32, 12, 13, 14, 23, 24, 31, 33];
    this.noActionNeeded = [1, 7, 18, 20, 27, 28];
    this.rewardOrTaxes = [0, 5, 9, 32]


    if (sessionStorage.getItem('gameData')) {


      let gameInitialState = JSON.parse(sessionStorage.getItem('gameData'))

      this.hideBoth = gameInitialState.hideBoth;

      this.turn = gameInitialState.turn;
      this.Px = gameInitialState.Px;
      this.Py = gameInitialState.Py;

      this.P1 = gameInitialState.P1;
      this.P2 = gameInitialState.P2;
      this.showHomeOption = gameInitialState.showHomeOption;
      this.showPayRent = gameInitialState.showPayRent;
      this.data = gameInitialState.data;
      if (this.Px.completeOneCircle == false || this.Py.completeOneCircle == false) {
        this.reset();
      }

    } else {
      this.reset();
    }


  }
  reset() {





    this.hideBoth = true;

    this.turn = true;
    this.Px = new Player();
    this.Py = new Player();

    this.P1 = false;
    this.P2 = true;
    this.showHomeOption = false;
    this.showPayRent = false;
    this.data = GameInitialData.data;
    //this.Px.secretKey = prompt('Enter secret key for Green', 'green');  uncomment prompt if you want to create secret key for transaction among players
    // this.Py.secretKey = prompt('Enter secret key for Green', 'blue');
    this.toastr.success('Game Loaded... Good Luck for Game!!!', '');


  }
  buyX() {

    let land = this.data[this.Px.pos]

    if (this.Px.amount < land.price) {
      this.showMessage('Insufficient Fund!');

      return;
    }



    if (land.ownedBy == 'blue' || this.Px.completeOneCircle == false) {
      return;
    }

    land.ownedBy = 'green';


    if (this.Px.ownedLand.indexOf(land) == -1) {

      this.Px.ownedLand.push(land)
      this.animateNumber('Px', 'sub', land.price);
    }
    this.finish();

  }
  animateNumber(player, method, amount) {

    for (let i = 1; i <= amount; i++) {
      setTimeout(() => {
        if (player == 'Px' && method == 'add') {
          this.Px.amount += 1;
        } else if (player == 'Px' && method == 'sub') {
          this.Px.amount -= 1;
        } else if (player == 'Py' && method == 'add') {
          this.Py.amount += 1;
        } else {
          this.Py.amount -= 1;
        }

      }, 200);
    }
  }


  buyY() {
    let land = this.data[this.Py.pos]
    if (this.Py.amount < land.price) {
      this.showMessage('Insufficient Fund!')
      return;
    }

    if (land.ownedBy == 'green' || this.Py.completeOneCircle == false) {
      return;
    }
    land.ownedBy = 'blue';

    if (this.Py.ownedLand.indexOf(land) == -1) {
      this.Py.ownedLand.push(land)
      this.animateNumber('Py', 'sub', land.price);
    }
    this.finish();


  }





  sellPropertyConfirm(option, land: Land) {

    let index;

    switch (option) {
      case 'RMV_HOUSE_G':
        index = this.Px.ownedLand.indexOf(land);
        if (index > -1) {
          land.house = '';
          this.animateNumber('Px', 'add', land.price * 1.8);


        }
        break;
      case 'SELL_BANK_G':
        index = this.Px.ownedLand.indexOf(land);
        if (index > -1) {
          if (land.house == 'H') {
            this.animateNumber('Px', 'add', land.price * 2.7);
          } else {
            this.animateNumber('Px', 'add', land.price * 0.9);
          }
          land.ownedBy = 'bank'


          this.Px.ownedLand.splice(index, 1);
        }
        break;
      case 'SELL_B':
        // let secret: string = prompt('Enter Blue Player Secret to confirm');
        // if (this.Py.secretKey === secret) {
        index = this.Px.ownedLand.indexOf(land);
        if (index > -1) {
          if (land.house == 'H') {
            if (this.Py.amount < land.price * 3) { this.showMessage('Blue CAN NOT AFFORD! / Transaction Failed'); return; }
            this.animateNumber('Px', 'add', land.price * 3);
            this.animateNumber('Py', 'sub', land.price * 3);
          } else {
            if (this.Py.amount < land.price) { this.showMessage('Blue CAN NOT AFFORD! / Transaction Failed'); return; }
            this.animateNumber('Px', 'add', land.price);
            this.animateNumber('Py', 'sub', land.price);
          }

          land.ownedBy = 'blue'


          this.Px.ownedLand.splice(index, 1);
          this.Py.ownedLand.push(land);
        }
        // }
        //  else {
        //   this.showMessage('Invalid code / Transaction Failed')
        // }
        break;
      case 'RMV_HOUSE_B':
        index = this.Py.ownedLand.indexOf(land);
        if (index > -1) {
          land.house = '';
          this.animateNumber('Py', 'add', land.price * 1.8);


        }
        break;
      case 'SELL_BANK_B':
        index = this.Py.ownedLand.indexOf(land);
        if (index > -1) {
          if (land.house == 'H') {
            this.animateNumber('Py', 'add', land.price * 2.7);

          } else {
            this.animateNumber('Py', 'add', land.price * 0.9);

          }
          land.ownedBy = 'bank'

          this.Py.ownedLand.splice(index, 1);
        }
        break;
      case 'SELL_G':
        // let secretG: string = prompt('Enter Green Player Secret to confirm');
        // if (this.Px.secretKey === secretG) {
        index = this.Py.ownedLand.indexOf(land);
        if (index > -1) {
          if (land.house == 'H') {
            if (this.Px.amount < land.price * 3) { this.showMessage('Green CAN NOT AFFORD! / Transaction Failed'); return; }
            this.animateNumber('Py', 'add', land.price * 3);

            this.animateNumber('Px', 'sub', land.price * 3);

          } else {
            if (this.Px.amount < land.price) { this.showMessage('Green CAN NOT AFFORD! / Transaction Failed'); return; }
            this.animateNumber('Py', 'add', land.price);

            this.animateNumber('Px', 'sub', land.price);

          }

          land.ownedBy = 'green'


          this.Py.ownedLand.splice(index, 1);
          this.Px.ownedLand.push(land);
        }
        // } else {
        //   this.showMessage('Invalid code / Transaction Failed')
        // }
        break;
      default:
    }

  }
  buildHouseX() {
    let land = this.data[this.Px.pos]
    if (this.noHouse.indexOf(this.Px.pos) >= 0) return;
    if (this.Px.ownedLand.indexOf(land) >= 0 && land.house != 'H') {
      if (this.Px.amount < 2 * land.price) {
        this.showMessage('Insufficient Fund!')
        return;
      }
      land.house = 'H';
      this.animateNumber('Px', 'sub', land.price * 2);

      this.finish();
    }


  }
  buildHouseY() {
    let land = this.data[this.Py.pos]
    if (this.noHouse.indexOf(this.Py.pos) >= 0) return;
    if (this.Py.ownedLand.indexOf(land) >= 0 && land.house != 'H') {
      if (this.Py.amount < 2 * land.price) {
        this.showMessage('Insufficient Fund!')
        return;
      }
      land.house = 'H';
      this.animateNumber('Py', 'sub', land.price * 2);

      this.finish();
    }

  }
  checkIfOwnedByX(pos) {
    let land = this.data[pos]
    if (this.Px.ownedLand.indexOf(land) >= 0)
      return true;
    else
      return false;

  }
  checkIfOwnedByY(pos) {
    let land = this.data[pos]
    if (this.Py.ownedLand.indexOf(land) >= 0)
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

    if (this.Px.amount < payAmount) {
      this.showMessage('Insufficient Fund!')
      return;
    }

    this.animateNumber('Py', 'add', payAmount);

    this.animateNumber('Px', 'sub', payAmount);

    this.showPayRent = false;
    this.finish();
  }
  payRentToX() {
    let land = this.data[this.Py.pos]
    let payAmount = land.price;
    if (land.house == 'H') {
      payAmount *= 2;
    }
    if (this.Py.amount < payAmount) {
      this.showMessage('Insufficient Fund!')
      return;
    }
    this.animateNumber('Px', 'add', payAmount);

    this.animateNumber('Py', 'sub', payAmount);

    this.showPayRent = false;
    this.finish();
  }

  finish() {
    for (let i = 0; i < 40; i++) {
      this.hover[i] = false;
    }
    if (this.showPayRent == true) {
      return;
    }
    if (this.Px.amount < 0 || this.Py.amount < 0) {
      this.showMessage('You Are Out Of Money');
      return;
    }
    if (this.result == 2 || this.result == 12) {
      this.turn = !this.turn;
    }
    if (this.turn == true) {
      this.P2 = true;
      this.P1 = false;
    } else {
      this.P2 = false;
      this.P1 = true;
    }

    this.hideBoth = true;

    /*
 this.hideBoth = true;
    this.noLand = [0, 1, 5, 7, 9, 18, 20, 27, 28, 32];
    this.noHouse = [0, 1, 5, 7, 9, 18, 20, 27, 28, 32, 12, 13, 14, 23, 24, 31, 33];
    this.noActionNeeded = [1, 7, 18, 20, 27, 28];
    this.rewardOrTaxes = [0, 5, 9, 32]
    this.turn = true;
    this.Px = new Player();
    this.Py = new Player();

    this.P1 = false;
    this.P2 = true;
    this.showHomeOption = false;
    this.showPayRent = false;

    */

    sessionStorage.setItem('gameData', JSON.stringify({
      'hideBoth': this.hideBoth,
      'turn': this.turn,
      'Px': this.Px,
      'Py': this.Py,
      'P1': this.P1,
      'P2': this.P2,
      'showHomeOption': this.showHomeOption,
      'showPayRent': this.showPayRent,
      'data': this.data



    }));




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
    let pos = (this.Px.pos + this.result) % 36;

    if (this.Px.pos + this.result >= 36) {
      this.Px.completeOneCircle = true;
    }



    for (let i = 1; i <= this.result; i++) {
      setTimeout(() => {

        this.Px.pos = (this.Px.pos + 1) % 36;
      }, 200 * i);
    }
    if (this.Px.completeOneCircle == false || this.noActionNeeded.indexOf(pos) >= 0) {
      this.finish();


    } else if (this.rewardOrTaxes.indexOf(pos) >= 0) {
      this.Px.amount += this.data[pos].price;
      if (this.Px.amount < 0) this.Px.amount = 0;
      this.finish();


    }
    else {

      setTimeout(() => {
        let land = this.data[this.Px.pos];
        this.hideBoth = false;
        this.showHomeOption = false;
        if (this.Px.ownedLand.indexOf(land) >= 0) {
          this.showHomeOption = true;
        }
        if (this.showHomeOption == true && this.noHouse.indexOf(this.Px.pos) >= 0) {
          this.showHomeOption = false;
          this.finish();
        }
        if (land.house == 'H') {
          this.showHomeOption = false;
        }






        if (this.Py.ownedLand.indexOf(land) >= 0) {
          this.showPayRent = true;
        } else {
          this.showPayRent = false;
        }

      }, 200 * this.result)
    }

  }
  animate2() {
    let pos = (this.Py.pos + this.result) % 36;

    if (this.Py.pos + this.result >= 36) {
      this.Py.completeOneCircle = true;
    }



    for (let i = 1; i <= this.result; i++) {
      setTimeout(() => {

        this.Py.pos = (this.Py.pos + 1) % 36;
      }, 200 * i);
    }
    if (this.Py.completeOneCircle == false || this.noActionNeeded.indexOf(pos) >= 0) {
      this.finish();


    } else if (this.rewardOrTaxes.indexOf(pos) >= 0) {
      this.Py.amount += this.data[pos].price;
      if (this.Py.amount < 0) this.Py.amount = 0;
      this.finish();


    }
    else {

      setTimeout(() => {
        let land = this.data[this.Py.pos];
        this.hideBoth = false;
        this.showHomeOption = false;
        if (this.Py.ownedLand.indexOf(land) >= 0) {
          this.showHomeOption = true;
        }
        if (this.showHomeOption == true && this.noHouse.indexOf(this.Py.pos) >= 0) {
          this.showHomeOption = false;
          this.finish();
        }
        if (land.house == 'H') {
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

  animateBorder(land: Land) {


    let index = this.data.findIndex(x => x.name == land.name);




    this.hover[index] = true;



  }

  removeAnimateBorder(land: Land) {
    let index = this.data.findIndex(x => x.name == land.name);

    this.hover[index] = false;

  }

  sellProperty(option, land: Land) {
    let sellTo = 'Bank'
    if (option == 'SELL_G') {
      sellTo = "Green Player"
    } else if (option == 'SELL_B') {
      sellTo = 'Blue Player'
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to sell Property on ' + land.name + ' to ' + sellTo + ' !!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sell',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {


        this.sellPropertyConfirm(option, land);



      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',

        )
      }
    })
  }




}
