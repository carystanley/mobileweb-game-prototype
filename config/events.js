/* global window */

window.EVENTS = {
    1: [{
        commands: [
            {cmd: 'dialog', text: 'Ouch!!'},
            {cmd: 'dialog', text: 'Watch it!!'},
            {cmd: 'fadeOut', ticks: 60},
            {cmd: 'dialog', text: 'SMASH!!'},
            {cmd: 'fadeIn', ticks: 60}
        ]
    }],
    2: [{
        commands: [
            {cmd: 'dialog', text: 'To Understand the Banana, You Must Become the Banana'}
        ]
    }],
    3: [{
        commands: [
            {cmd: 'if', cond: 'hasItem', id: 'sock'},
                {cmd: 'dialog', text: 'You took my Socks!'},
            {cmd: 'else'},
                {cmd: 'dialog', text: 'When you can snatch the pebble from my hand, it will be time for you to leave.'},
                {cmd: 'addItemToInventory', id: 'sock'},
            {cmd: 'endif'}
        ]
    }]
}
