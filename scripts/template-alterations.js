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
  console.log('Probiha render:', path)
  if (path in FoundryCZ.templateDataAlterations) {
    FoundryCZ.templateDataAlterations[path](data)
  }
  return originalRenderTemplate(path, data)
}
