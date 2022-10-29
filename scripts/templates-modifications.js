/**
 * Okno pro vytváření makra
 */
FoundryCZ.add('templates/sheets/macro-config.html', (data) => {
  data.data.name = 'Nové makro'
})

/**
 * Úprava žetonu
 */
FoundryCZ.add('templates/scene/parts/token-vision.html', (data) => {
  data.gridUnits = data.gridUnits.replace('ft', 'st')
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
