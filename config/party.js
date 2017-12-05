/* global window */
/* eslint quotes: "off" */

window.PARTY = {
    party: ['hero', 'girl'],
    members: {
        hero: {
            sprite: 0,
            name: 'Izumi',
            hp: 10,
            maxhp: 10,
            offense: 2,
            defense: 3,
            guts: 1,
            luck: 1,
            speed: 4
        },
        girl: {
            sprite: 1,
            name: 'Asami',
            hp: 6,
            maxhp: 6,
            offense: 1,
            defense: 2,
            guts: 1,
            luck: 3,
            speed: 5
        },
        bully: {
            sprite: 2,
            name: 'Ryoko',
            hp: 65,
            maxhp: 65,
            offense: 42,
            defense: 23,
            guts: 10,
            luck: 14,
            speed: 25
        },
        principal: {
            sprite: 3,
            name: 'Principal',
            hp: 100,
            maxhp: 100,
            offense: 1,
            defense: 1,
            guts: 1,
            luck: 1,
            speed: 1
        }
    },
    inventory: ['sneaker', 'rice'],
    vars: {
        chapter: 0,
        cash: 1000,
        reserve: 0
    },
    flags: {}
}
