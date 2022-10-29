class FoundryCZResolver {
  templateDataAlterations = {}

  /**
   * Přidá do seznamu k úpravě
   * @param {string} path cesta šablony
   * @param {function} modifier funkce pro úpravu dat
   */
  add(path, modifier) {
    this.templateDataAlterations[path] = modifier ? modifier : (data) => { console.log(data); return data }
  }

  remove(path) {
    delete this.templateDataAlterations[path]
  }
}

const FoundryCZ = new FoundryCZResolver()

/**
 * Nahrazení renderovacích funkcí
 */
const originalRenderTemplate = this.renderTemplate
this.renderTemplate = async function (path, data) {
  if (path in FoundryCZ.templateDataAlterations) {
    console.log('FoundryCZ altering |', path)
    FoundryCZ.templateDataAlterations[path](data)
  }
  return originalRenderTemplate(path, data)
}

const originalResolvePartial = Handlebars.VM.resolvePartial
Handlebars.VM.resolvePartial = function (partial, data, context) {
  if (context.name in FoundryCZ.templateDataAlterations) {
    console.log('FoundryCZ altering partial |', context.name)
    FoundryCZ.templateDataAlterations[context.name](data)
  }
  return originalResolvePartial(partial, data, context)
}

/**
 * Úprava okna aktéra
 */
Object.defineProperty(ActorSheet.prototype, 'title', {
  get: function () {
    return this.actor.isToken ? `[Žeton] ${this.actor.name}` : this.actor.name;
  }
})

PlaceablesLayer.prototype.deleteAll = async function () {
  const type = this.constructor.documentName;
  const i18nType = game.i18n.localize(`DOCUMENT.${type}`)
  if ( !game.user.isGM ) {
    throw new Error(`You do not have permission to delete ${type} objects from the Scene.`);
  }
  return Dialog.confirm({
    title: game.i18n.localize("CONTROLS.ClearAll"),
    content: `<p>${game.i18n.format("CONTROLS.ClearAllHint", {type: i18nType})}</p>`,
    yes: () => canvas.scene.deleteEmbeddedDocuments(type, [], {deleteAll: true})
  });
}
