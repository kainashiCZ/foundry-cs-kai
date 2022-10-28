console.log('FoundryCZ: Inicializace Foundry VTT cs-CZ modulu')

/**
 * Nahradí lokalizační metodu
 * Umožní pak lokalizační modifikátory, jako je 2. pád a změnu na lowercase
 * Locale string pak může vypadat {type|2p|lc}
 * Překlad by pak měl uvádět pády ve správném pořadí oddělené pomocí |, tedy 1. pád|2. pád||4. pád
 * @param {string} stringId
 * @param {object} data
 * @returns {string}
 */
 Localization.prototype.format = function (stringId, data = {}) {
  let str = this.localize(stringId)

  const fmt = /{[^}]+}/g
  var gender = 'male'
  str = str.replace(fmt, k => {
    const keyAndMods = k.slice(1, -1).split('|')
    const key = keyAndMods[0]
    const mods = keyAndMods.slice(1)

    if (!data[key]) {
      return
    }

    if (data[key] && String(data[key]).includes('z::')) {
      gender = 'female'
    } else if (data[key] && String(data[key]).includes('s::')) {
      gender = 'middle'
    }

    const declensions = String(data[key]).replace(/^\w::/, '').split('|')

    // Výchozí překlad je v prvním pádě
    let translation = declensions[0]

    if (!mods) {
      return translation
    }

    // skloňování
    const declensionMod = mods.find((val) => {
      return /^\dp$/.test(val)
    })

    if (declensionMod) {
      translation = declensions[parseInt(declensionMod) - 1] ?? declensions[0]
    }

    // převod na malé počáteční písmeno
    if (mods.includes('lc')) {
      translation = `${translation[0].toLocaleLowerCase()}${translation.slice(1)}`
    }

    return translation
  })

  return str.replace(/\[\[[^\]]+\]\]/g, s => {
    const genders = s.slice(2, -2).split('|')
    return (gender === 'male' ? genders[0] : gender === 'female' ? genders[1] : genders[2]) ?? genders[0]
  })
}

/**
 * Pořadová čísla
 * @returns {string}
 */
Number.prototype.ordinalString = function () {
  return `${this}.`
}

String.prototype.firstDeclension = function () {
  return this.replace(/^\w::/, '').split('|')[0]
}

/**
 * Nahrazení původního escapovaní Handlebars
 */
const originalEscapeExpression = Handlebars.Utils.escapeExpression
Handlebars.Utils.escapeExpression = function (string) {
  if (typeof string === 'string') {
    string = string.firstDeclension()
  }

  return originalEscapeExpression(string)
}

/**
 * Lokalizace tooltipů v sidebaru
 */
Hooks.once('ready', () => {
  const tooltipObserver = new MutationObserver(() => {
    if (game.tooltip.element?.parentElement.classList.contains('tabs')) {
      if (game.tooltip.tooltip.innerHTML.includes('|') || game.tooltip.tooltip.innerHTML.includes('::')) {
        game.tooltip.tooltip.innerHTML = game.tooltip.tooltip.innerHTML.firstDeclension()
        game.tooltip._setAnchor('DOWN')
      }
    }
  })
  tooltipObserver.observe(game.tooltip.tooltip, {
    childList: true
  })
})
