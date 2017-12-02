/* global window */
/* eslint quotes: "off" */

window.ENEMIES = {
    'perlatum': {
        name: 'Perlatum',
        sprite: 22,
        battlesprite: 0,
        hp: 5,
        strategy: 'random',
        actions: ['bash', 'heal:5', 'other', 'other']
    },
    'shiitake': {
        name: 'Shiitake',
        sprite: 24,
        battlesprite: 1,
        hp: 5,
        strategy: 'inorder',
        actions: ['bash', 'heal:3', 'other', 'other']
    },
    'hochstetteri': {
        name: 'Hochstetteri',
        sprite: 23,
        battlesprite: 2,
        hp: 5,
        strategy: 'inorder',
        actions: ['bash', 'heal:3', 'other', 'other']
    },
    'pleurotus': {
        name: 'Pleurotus',
        sprite: 14,
        battlesprite: 3,
        hp: 5,
        strategy: 'inorder',
        actions: ['bash', 'heal:3', 'other', 'other']
    }
}
