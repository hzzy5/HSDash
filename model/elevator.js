const OFFSET_TOP = 20; 
const OFFSET_BOTTOM = 1;
const OFFSET_WIDTH = 3;

export class Elevator {
    constructor(x, floor) {
        this.top = {x: x + OFFSET_WIDTH, y: 212}; //3552, y: 192+20
        this.bottom = {x: x + OFFSET_WIDTH, y: 480}; //3555, y: 479+1
        
        this.width = 100; //schmaler machen!
        this.height = 202;
        this.sprite = null;       // wird später vom Renderer gesetzt
        this.target = null;

        this.state = "idle"; // idle | open | moving | closed
        this.playerInside = false;
        
        this.currentFloor = floor; // top | bottom
        this.startFloor = floor;
    }

    //Methode, um die x-Position des Fahrstuhls herausfinden
    getPositionX() {
        const pos = this.currentFloor === "top" 
        ? this.top
        : this.bottom;
        
        return pos.x;
    }

    //Methode, um die y-Position des Fahrstuhls herausfinden
    getPositionY() {
        const pos = this.currentFloor === "top" 
        ? this.top
        : this.bottom;
        
        return pos.y;
    }

    //Methode, um den Fahrstuhl zu reseten
    resetElevator() {
        this.currentFloor = this.startFloor;

        if (this.currentFloor === "top") {
            this.sprite.x = this.top.x;
            this.sprite.y = this.top.y;
        } else {
            this.sprite.x = this.bottom.x;
            this.sprite.y = this.bottom.y;
        }


    }

    //Methode, um mit dem Fahrstuhl nach unten bzw oben zu fahren.
    takeTheElevator() {
    if (!this.sprite) return;
    if (this.state !== "ready") return;

    this.state = "moving";

    if (this.currentFloor === "top") {
        this.sprite.x = this.bottom.x;
        this.sprite.y = this.bottom.y;
        this.currentFloor = "bottom";
    } else {
        this.sprite.x = this.top.x;
        this.sprite.y = this.top.y;
        this.currentFloor = "top";
    }

    //Fahrt beendet
    this.state = "idle";
    this.playerInside = true; //wird im Controller erst auf false gesetzt, wenn es keine Kollision meh gibt
}


    //Methode, um ein Zustand zu setzen
    setState(state) {
        this.state = state;
    }


} //end class elevator