FoundryCZ.add('templates/sheets/macro-config.html', (data) => {
  data.data.name = 'Nové makro'
})

FoundryCZ.add('templates/app-window.html', (data) => {
  data.title = data.title?.firstDeclension()
})
