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
        offense: 3,
        defense: 2,
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
        xp: 1000,
        hp: 76,
        offense: 20,
        defense: 20,
        missRate: 1/16,
        strategy: 'inorder',
        actions: ['bash', 'bash', 'bash', 'heal:3']
    },
    'mushroom4': {
        name: 'Mushroom4',
        sprite: 25,
        battlesprite: 4,
        cash: 2,
        xp: 10,
        hp: 5,
        offense: 1,
        defense: 1,
        missRate: 1/16,
        strategy: 'inorder',
        actions: ['bash']
    },
    'mushroom5': {
        name: 'Mushroom5',
        sprite: 26,
        battlesprite: 5,
        cash: 2,
        xp: 10,
        hp: 5,
        offense: 1,
        defense: 1,
        missRate: 1/16,
        strategy: 'inorder',
        actions: ['bash']
    },
    'mushroom6': {
        name: 'Mushroom6',
        sprite: 27,
        battlesprite: 6,
        cash: 2,
        xp: 10,
        hp: 5,
        offense: 1,
        defense: 1,
        missRate: 1/16,
        strategy: 'inorder',
        actions: ['bash']
    },
    'mushroom7': {
        name: 'Mushroom7',
        sprite: 28,
        battlesprite: 7,
        cash: 2,
        xp: 10,
        hp: 5,
        offense: 1,
        defense: 1,
        missRate: 1/16,
        strategy: 'inorder',
        actions: ['bash']
    },
    'mushroom8': {
        name: 'Mushroom8',
        sprite: 29,
        battlesprite: 8,
        cash: 2,
        xp: 10,
        hp: 5,
        offense: 1,
        defense: 1,
        missRate: 1/16,
        strategy: 'inorder',
        actions: ['bash']
    },
    'mushroom9': {
        name: 'Mushroom9',
        sprite: 30,
        battlesprite: 9,
        cash: 2,
        xp: 10,
        hp: 5,
        offense: 1,
        defense: 1,
        missRate: 1/16,
        strategy: 'inorder',
        actions: ['bash']
    },
    'bully': {
        sprite: 2,
        battlesprite: 10,
        cash: 2,
        xp: 10,
        hp: 200,
        offense: 4,
        defense: 20,
        missRate: 1/16,
        strategy: 'inorder',
        actions: ['bash', 'bash', 'bash']
    }
}
