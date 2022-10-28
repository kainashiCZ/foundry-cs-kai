class FoundryCZResolver {
  templateDataAlterations = {}

  add(path, modifier) {
    this.templateDataAlterations[path] = modifier ? modifier : (data) => { console.log(data); return data }
  }

  remove(path) {
    delete this.templateDataAlterations[path]
  }
}

const FoundryCZ = new FoundryCZResolver()

const originalRenderTemplate = window.renderTemplate
window.renderTemplate = async function (path, data) {
  if (path in FoundryCZ.templateDataAlterations) {
    console.log('FoundryCZ altering |', path)
    FoundryCZ.templateDataAlterations[path](data)
  }
  return originalRenderTemplate(path, data)
}
