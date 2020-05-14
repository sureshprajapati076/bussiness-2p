var total;
function response(res) {
    // returns an array of the values from the dice
    total = res[0] + res[1];

}
function rollDiceWithoutValues() {
    const element = document.getElementById('dice-box1');
    const numberOfDice = 2;
    const options = {
        element, // element to display the animated dice in.
        numberOfDice, // number of dice to use 
        callback: response
    }
    rollADie(options);
    return total;
}