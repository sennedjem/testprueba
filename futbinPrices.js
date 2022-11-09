window.updateListRowsWithFutbinPrices = function(section, e, filterFunction=null){
  section.listRows.map(cell => {
    if(e.detail.response[cell.data.definitionId]){
      if(filterFunction){
        window.mostrarPrecioFutbinEnVista(e.detail.response[cell.data.definitionId].prices[window.getPlatformDgm()].LCPrice, cell, this, filterFunction)
      } else {
        window.mostrarPrecioFutbinEnVista(e.detail.response[cell.data.definitionId].prices[window.getPlatformDgm()].LCPrice, cell, this)  
      }
    }
    return cell
  })
}



window.getPlatformDgm = function(){
  var persona = services.Authentication.sessionUtas.user.getSelectedPersona()
  if(persona.isPC){
    return "pc"
  } else {
    return "ps"
  }
}
