/* global window */

window.ITEMS = {
    sneaker: {label: 'Old Sneaker'},
    stungun: {label: 'Stun Gun'},
    sock: {label: 'Sock'},

    smokebomb: {
        label: 'Smoke Bomb',
        cost: 30
    },
    cherrybomb: {
        label: 'Cherry Bomb',
        cost: 50
    },
    bomb: {
        label: 'Bomb',
        cost: 150
    },

    // Heal
    pocky: {
        label: 'Pocky',
        battleAction: 'heal:10',
        action: 'heal:10',
        cost: 15
    },
    onigiri: {
        label: 'Onigiri',
        battleAction: 'heal:20',
        action: 'heal:20',
        cost: 50
    },
    ramen: {
        label: 'Ramen',
        battleAction: 'heal:150',
        action: 'heal:150',
        cost: 200
    }
};
