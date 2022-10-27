console.log('Inicializace Foundry VTT cs-CZ modulu')

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
  let gender = 'male'

  const fmt = /{[^}]+}/g
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
    const genderes = s.slice(2, -3).split('|')
    return (gender === 'male' ? genderes[0] : gender === 'female' ? genderes[1] : genderes[2]) ?? genderes[0]
  })
}

Number.prototype.ordinalString = function () {
  return `${this}.`
}

function localize (value, options) {
  const data = options.hash
  const result = foundry.utils.isEmpty(data) ? game.i18n.localize(value) : game.i18n.format(value, data)
  return result.split('|')[0].replace(/^\w::/, '')
}

Handlebars.registerHelper({
  localize
})

Sidebar.prototype.getData = function (options) {
  const isGM = game.user.isGM

  function localize(str, opt) {
    return game.i18n.localize(str, opt).split('|')[0]
  }

  // Configure tabs
  const tabs = {
    chat: {
      tooltip: localize(ChatMessage.metadata.labelPlural),
      icon: CONFIG.ChatMessage.sidebarIcon,
      notification: "<i id=\"chat-notification\" class=\"notification-pip fas fa-exclamation-circle\"></i>"
    },
    combat: {
      tooltip: localize(Combat.metadata.labelPlural),
      icon: CONFIG.Combat.sidebarIcon
    },
    scenes: {
      tooltip: localize(Scene.metadata.labelPlural),
      icon: CONFIG.Scene.sidebarIcon
    },
    actors: {
      tooltip: localize(Actor.metadata.labelPlural),
      icon: CONFIG.Actor.sidebarIcon
    },
    items: {
      tooltip: localize(Item.metadata.labelPlural),
      icon: CONFIG.Item.sidebarIcon
    },
    journal: {
      tooltip: localize(JournalEntry.metadata.labelPlural),
      icon: CONFIG.JournalEntry.sidebarIcon
    },
    tables: {
      tooltip: localize(RollTable.metadata.labelPlural),
      icon: CONFIG.RollTable.sidebarIcon
    },
    cards: {
      tooltip: localize(Cards.metadata.labelPlural),
      icon: CONFIG.Cards.sidebarIcon
    },
    playlists: {
      tooltip: localize(Playlist.metadata.labelPlural),
      icon: CONFIG.Playlist.sidebarIcon
    },
    compendium: {
      tooltip: "SIDEBAR.TabCompendium",
      icon: "fas fa-atlas"
    },
    settings: {
      tooltip: "SIDEBAR.TabSettings",
      icon: "fas fa-cogs"
    }
  }
  if ( !isGM ) delete tabs.scenes

  // Display core or system update notification?
  if ( isGM && (game.data.coreUpdate.hasUpdate || game.data.systemUpdate.hasUpdate) ) {
    tabs.settings.notification = `<i class="notification-pip fas fa-exclamation-circle"></i>`
  }
  return {tabs}
}