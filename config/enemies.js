/* global window */
/* eslint quotes: "off" */

window.ENEMIES = {
    'perlatum': {
        name: 'Perlatum',
        sprite: 22,
        battlesprite: 0,
        cash: 2,
        xp: 10,
        hp: 5,
        offense: 1,
        defense: 1,
        missRate: 1/16,
        strategy: 'random',
        actions: ['bash', 'heal:5', 'other', 'other']
    },
    'shiitake': {
        name: 'Shiitake',
        sprite: 24,
        battlesprite: 1,
        cash: 2,
        xp: 10,
        hp: 5,
        offense: 1,
        defense: 1,
        missRate: 1/16,
        strategy: 'inorder',
        actions: ['bash', 'heal:3', 'other', 'other']
    },
    'hochstetteri': {
        name: 'Hochstetteri',
        sprite: 23,
        battlesprite: 2,
        cash: 2,
        xp: 10,
        hp: 5,
        offense: 1,
        defense: 1,
        missRate: 1/16,
        strategy: 'inorder',
        actions: ['bash']
    },
    'pleurotus': {
        name: 'Pleurotus',
        sprite: 14,
        battlesprite: 3,
        cash: 2,
        xp: 10,
        hp: 5,
        offense: 1,
        defense: 1,
        missRate: 1/16,
        strategy: 'inorder',
        actions: ['bash', 'heal:3', 'other', 'other']
    }
}
