/* global window */
/* eslint quotes: "off" */

window.PARTY = {
    mapId: 'debug',
    locationId: 'start',
    party: ['hero'],
    members: {
        hero: {
            sprite: 0,
            dead_sprite: 4,
            level: 1,
            hp: 5,
            maxhp: 5,
            offense: 2,
            defense: 3,
            guts: 1,
            luck: 1,
            speed: 4,
            xp: 0,
            levelXp: 0,
            growth: {
                maxhp: 20,
                offense: 18,
                defense: 5,
                guts: 7,
                luck: 6,
                speed: 4
            }
        },
        girl: {
            sprite: 1,
            dead_sprite: 5,
            level: 1,
            hp: 4,
            maxhp: 4,
            offense: 1,
            defense: 2,
            guts: 1,
            luck: 3,
            speed: 5,
            xp: 0,
            levelXp: 0,
            growth: {
                maxhp: 10,
                offense: 12,
                defense: 3,
                guts: 5,
                luck: 5,
                speed: 8
            }
        },
        bully: {
            sprite: 2,
            dead_sprite: 6,
            level: 1,
            hp: 65,
            maxhp: 65,
            offense: 42,
            defense: 23,
            guts: 10,
            luck: 14,
            speed: 25,
            xp: 0,
            levelXp: 0,
            growth: {
                maxhp: 16,
                offense: 21,
                defense: 18,
                guts: 3,
                luck: 3,
                speed: 7
            }
        },
        principal: {
            sprite: 3,
            dead_sprite: 3,
            level: 1,
            hp: 100,
            maxhp: 100,
            offense: 1,
            defense: 1,
            guts: 1,
            luck: 1,
            speed: 1,
            xp: 0,
            levelXp: 0,
            growth: {
                maxhp: 0,
                offense: 0,
                defense: 0,
                guts: 0,
                luck: 0,
                speed: 0
            }
        }
    },
    inventory: ['sneaker', 'pocky'],
    vars: {
        chapter: 0,
        cash: 1000,
        reserve: 0
    },
    flags: {}
}
