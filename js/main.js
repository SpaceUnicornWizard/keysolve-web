import * as search from './search.mjs'
import * as drag from './drag.mjs'
import * as board from './board.mjs'
import * as disable from './disable.mjs'
import * as stats from './stats.mjs'
import * as settings from './settings.mjs'
import * as themes from './themes.mjs'

let base = {}

window.onload = async function() {
    search.init()
    drag.init()
    disable.init()
    stats.init()
    settings.init()
    themes.init()

    board.stagger()

    base = await (await fetch('percentiles.json')).json()
}

window.info = function() {
    const url = 'https://github.com/ClemenPine/keysolve-web'
    window.open(url, '_blank')
}

window.toggle = function() {
    const ngrams = document.getElementById('ngrams')
    const use = document.getElementById('use')

    if (ngrams.hasAttribute('hidden')) {
        ngrams.removeAttribute('hidden')
    } else {
        ngrams.setAttribute('hidden', 'true')
    }

    if (use.hasAttribute('hidden')) {
        use.removeAttribute('hidden')
    } else {
        use.setAttribute('hidden', 'true')
    }
}

window.stats = function() {
    const res = stats.analyze()

    for (const [stat, freq] of Object.entries(res)) {
        const cell = document.getElementById(stat)
        const perc = freq.toLocaleString(
            undefined, { style: 'percent', minimumFractionDigits:2 }
        )

        if (!(stat in base)) {
            continue
        }

        let color = ''
        for (let i=0; i < 5; i++) {
            if (freq > base[stat][i]) {
                color = `var(--color-${4-i})`
            }
        }

        cell.innerHTML = `${stat}: ${perc}`
        cell.style.background = color
    } 
}

window.mirror = function() {
    const grid = document.getElementById('grid')
    const keys = grid.children

    let letters = []
    for (const key of keys) {
        letters.push(key.innerHTML)
    }

    letters = letters.slice(0, total)

    for (let row=0; row < rows; row++) {
        for (let col=0; col < cs; col++) {
            const key = keys[(2-row)*cols + col]
            const letter = letters.pop()

            key.className = `cell center ${letter}`
            key.innerHTML = letter
        }
    }

    window.stats()
}

window.invert = function() {
    const grid = document.getElementById('grid')
    const keys = grid.children

    let letters = []
    for (const key of keys) {
        letters.push(key.innerHTML)
    }

    letters = letters.slice(0, total)

    for (let row=0; row < rows; row++) {
        for (let col=0; col < cols; col++) {
            const key = keys[(2-row)*cols + col]
            const letter = letters.shift()

            key.className = `cell center ${letter}`
            key.innerHTML = letter
        }
    }

    window.stats()
}

window.copy = function() {
    const matrix = document.getElementById('matrix')
    navigator.clipboard.writeText(matrix.value)
}

window.settings = function() {
    settings.open()
}

window.board = function() {
    switch (board.board) {
        case 'stagger':
            board.ortho()
            break
        case 'ortho':
            board.stagger()
            break
        }
}

window.heatmap = function() {
    const repeatmap = document.getElementById('repeatmap')

    if (repeatmap.disabled) {
        repeatmap.removeAttribute('disabled')
    } else {
        repeatmap.setAttribute('disabled', '')
    }
}