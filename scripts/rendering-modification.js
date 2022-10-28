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
 * Nahrazení renderovací funkce
 */
const originalRenderTemplate = this.renderTemplate
this.renderTemplate = async function (path, data) {
  if (path in FoundryCZ.templateDataAlterations) {
    console.log('FoundryCZ altering |', path)
    FoundryCZ.templateDataAlterations[path](data)
  }
  return originalRenderTemplate(path, data)
}
