/**
 * Titulek okna
 */
FoundryCZ.add('templates/app-window.html', (data) => {
  data.title = data.title.replace('[Token]', '[Žeton]')
})

/**
 * Okno pro vytváření makra
 */
FoundryCZ.add('templates/sheets/macro-config.html', (data) => {
  data.data.name = 'Nové makro'
})

/**
 * Vytváření položek
 */
FoundryCZ.add('templates/sidebar/document-create.html', (data) => {
  if ('types' in data) {
    Object.keys(data.types).forEach(k => {
      data.types[k] = data.types[k].firstDeclension()
    })
  }
})
