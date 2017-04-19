function World() {
    this.player = new BouncySquare(this);
    this.events = [
        {x: 150, y: 205, z: 0, width: 16, height: 8,
            text: 'Ouch!!'},
        {x: 355, y: 220, z: 0, width: 16, height: 8,
            text: 'To Understand the Banana, You Must Become the Banana'},
        {x: 175, y: 235, z: 0, width: 16, height: 8,
            text: 'When you can snatch the pebble from my hand, it will be time for you to leave.'}
    ];
    this.entities = this.events.slice(0);
    this.entities.push(this.player);

    this.walls = [
        {x: 0, y: 0, width: 440, height: 100, color: 'rgba(80, 80, 80, 0.5)'},
        {x: 0, y: 0, width: 75, height: 372, color: 'rgba(80, 80, 80, 0.5)'},
        {x: 0, y: 280, width: 300, height: 150, color: 'rgba(80, 80, 80, 0.5)'},
        {x: 300, y: 340, width: 140, height: 60, color: 'rgba(80, 80, 80, 0.5)'},
        {x: 390, y: 0, width: 200, height: 290, color: 'rgba(80, 80, 80, 0.5)'},
        {x: 100, y: 100, width: 150, height: 65, color: 'rgba(80, 80, 80, 0.5)'},
        {x: 60, y: 230, width: 40, height: 100, color: 'rgba(80, 80, 80, 0.5)'},
        {x: 190, y: 240, width: 110, height: 40, color: 'rgba(80, 80, 80, 0.5)'},
        {x: 240, y: 210, width: 70, height: 30, color: 'rgba(80, 80, 80, 0.5)'}
    ];

    this.width = 440;
    this.height = 372;
}
