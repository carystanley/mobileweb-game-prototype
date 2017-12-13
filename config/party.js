/* global window */
/* eslint quotes: "off" */

window.PARTY = {
    party: ['hero'],
    members: {
        hero: {
            sprite: 0,
            dead_sprite: 4,
            hp: 10,
            maxhp: 10,
            offense: 2,
            defense: 3,
            guts: 1,
            luck: 1,
            speed: 4,
            xp: 0
        },
        girl: {
            sprite: 1,
            dead_sprite: 5,
            hp: 6,
            maxhp: 6,
            offense: 1,
            defense: 2,
            guts: 1,
            luck: 3,
            speed: 5,
            xp: 0
        },
        bully: {
            sprite: 2,
            dead_sprite: 6,
            hp: 65,
            maxhp: 65,
            offense: 42,
            defense: 23,
            guts: 10,
            luck: 14,
            speed: 25,
            xp: 0
        },
        principal: {
            sprite: 3,
            dead_sprite: 3,
            hp: 100,
            maxhp: 100,
            offense: 1,
            defense: 1,
            guts: 1,
            luck: 1,
            speed: 1,
            xp: 0
        }
    },
    inventory: ['sneaker', 'pocky'],
    vars: {
        chapter: 0,
        cash: 100,
        reserve: 0
    },
    flags: {}
}
