/* global window */
/* eslint quotes: "off" */

window.EVENTS = {
    'transport': [{
        sprite: -1,
        trigger: 'contact',
        commands: [
            {cmd: 'fadeOut', ticks: 60},
            {cmd: 'transport', map: '$$params.map', location: '$$params.location'},
            {cmd: 'fadeIn', ticks: 60}
        ]
    }],
    'enemy': [{
        sprite: -1,
        trigger: 'load',
        commands: [
            {
                cmd: 'enemy',
                type: '$$params.type',
                x: '$$params.x', y: '$$params.y',
                probability: '$$params.probability'
            }
        ]
    }],
    'ramenguy': [{
        sprite: 13,
        commands: [
            {cmd: 'dialog', text: "Want some delicious ramen?"},
            {cmd: 'shop', id: 'ramenguy1'}
        ]
    }],
    'npc1': [{
        sprite: 10,
        commands: [
            {cmd: 'dialog', text: "Don't talk to me Nerd"}
        ]
    }],
    'npc2': [{
        sprite: 11,
        commands: [
            {cmd: 'dialog', text: "GIRL is upstairs"}
        ]
    }],
    'npc3': [{
        sprite: 18,
        commands: [
            {cmd: 'dialog', text: "BULLY is looking for you, you better run"}
        ]
    }],
    'npc4': [{
        sprite: 19,
        commands: [
            {cmd: 'dialog', text: "I hear rumors that BULLY through someone off the roof at his last school"}
        ]
    }],
    'npc5': [{
        sprite: 20,
        commands: [
            {cmd: 'dialog', text: "Take a hike Nerd!"}
        ]
    }],
    'npc6': [{
        sprite: 12,
        commands: [
            {cmd: 'dialog', text: "My mom made me stinky tofu for lunch"},
            {cmd: 'dialog', text: "I hate stinky tofu"}
        ]
    }],
    'alert': [{
        sprite: -1,
        trigger: 'contact',
        cond: "!flag('gave_alert')",
        commands: [
            {cmd: 'dialog', text: "ALERT all students we are being attacked by Mushrooms"},
            {cmd: 'setFlag', id: 'gave_alert', value: true}
        ]
    }],
    'robot': [{
        sprite: 7,
        cond: "!flag('robot_explode')",
        commands: [
            {cmd: 'dialog', text: "I'm a Robot"},
            {cmd: 'dialog', text: 'Initiate Self Destruct'},
            {cmd: 'dialog', text: 'one two three'},
            {cmd: 'fadeOut', ticks: 30},
            {cmd: 'setFlag', id: 'robot_explode', value: true},
            {cmd: 'fadeIn', ticks: 60}
        ]
    }],

    'ouch': [{
        sprite: 1,
        commands: [
            {cmd: 'dialog', text: 'Ouch!!'},
            {cmd: 'dialog', text: 'Watch it!!'},
            {cmd: 'fadeOut', ticks: 60},
            {cmd: 'dialog', text: 'SMASH!!'},
            {cmd: 'fadeIn', ticks: 60}
        ]
    }],
    'banana_guru': [{
        sprite: 2,
        commands: [
            {cmd: 'if', cond: "flag('banana_joke')"},
                {cmd: 'dialog', text: 'But to Become the Banana might get sticky...'},
                {cmd: 'setFlag', id: 'banana_joke', value: false},
            {cmd: 'else'},
                {cmd: 'dialog', text: 'To Understand the Banana, You Must Become the Banana'},
                {cmd: 'setFlag', id: 'banana_joke', value: true},
            {cmd: 'endif'}
        ]
    }],
    'snatch': [{
        sprite: 3,
        commands: [
            {cmd: 'if', cond: "hasInventoryItem('sock')"},
                {cmd: 'dialog', text: 'You took my Socks!'},
            {cmd: 'else'},
                {cmd: 'dialog', text: 'When you can snatch the pebble from my hand, it will be time for you to leave.'},
                {cmd: 'addItemToInventory', id: 'sock'},
            {cmd: 'endif'}
        ]
    }],
    'bully_join': [{
        sprite: 2,
        commands: [
            {cmd: 'dialog', text: 'Lets kick Mushroom Butt!!!.'},
            {cmd: 'joinParty', id: 'bully'}
        ]
    }],
    'principal': [{
        sprite: -1,
        commands: []
    }, {
        sprite: 3,
        cond: "!flag('principal_join')",
        commands: [
            {cmd: 'dialog', text: 'Help me boy, I should have to deal with this!!!.'},
            {cmd: 'joinParty', id: 'principal'},
            {cmd: 'setFlag', id: 'principal_join', value: true}
        ]
    }]
}
