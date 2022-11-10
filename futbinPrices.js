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

const UTPaginatedItemListView_renderItems = UTPaginatedItemListView.prototype.renderItems
UTPaginatedItemListView.prototype.renderItems = function(e) {
  UTPaginatedItemListView_renderItems.call(this, e)
  setTimeout(function(){
    if(this.listRows.length && this.listRows[0].data.type =="player"){
      var ids = this.listRows.map(function(cell){return cell.data.definitionId})
      window.postMessage({'type':'get-players-prices-club','ids':ids})
    }
  }.bind(this),1000)
}

UTWatchListView.prototype._generate = function _generate() {
    if (!this._generated) {
        var e = document.createElement("div");
        e.classList.add("ut-watch-list-view"),
        this.__root = e,
        this._generated = !0
        setTimeout(function(){
            if(this.sections[2].listRows.length){
                var ids = this.sections[2].listRows.map(function(cell){return cell.data.definitionId})
                var idArrays = window.chunk(ids,30) 
                idArrays.forEach(function(idArray){
                    window.postMessage({'type':'get-players-prices-watchlist','ids':idArray})
                })
            }
        }.bind(this),2000)
    } 
}


const UTUnassignedItemsView_generate = UTUnassignedItemsView.prototype._generate
UTUnassignedItemsView.prototype._generate = function _generate() {
    UTUnassignedItemsView_generate.call(this)
    setTimeout(function(){
      for (let section = 0; section < this.sections.length; section++) {
          if(this.sections[section].listRows.length){
              var ids = this.sections[section].listRows.map(function(cell){return cell.data.definitionId})
              var idArrays = window.chunk(ids,30) 
              idArrays.forEach(function(idArray){
              window.postMessage({'type':'get-players-prices-unnasigned','ids':idArray})
              })
          }
      }    
    }.bind(this),2000)
}

const UTPaginatedItemListView_renderItems = UTPaginatedItemListView.prototype.renderItems
UTPaginatedItemListView.prototype.renderItems = function(e) {
  UTPaginatedItemListView_renderItems.call(this, e)
  setTimeout(function(){
    if(this.listRows.length && this.listRows[0].data.type =="player"){
      var ids = this.listRows.map(function(cell){return cell.data.definitionId})
      window.postMessage({'type':'get-players-prices-club','ids':ids})
    }
  }.bind(this),1000)
}


//backend.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 2. A page requested user data, respond with a copy of `user`
  if (message.type === 'get-players-prices' || message.type === 'get-players-prices-watchlist' || message.type == 'get-players-prices-transferlist') {
    fetch("https://www.futbin.com/23/playerPrices?player=0&rids="+message.ids, {
        'method': "GET"
        }).then(response => response.json())
        .then(data => sendResponse(data));
    return true   
  }
    
});


//background.js
window.addEventListener("message",function(event){
  if(event.data.type && event.data.type=='get-players-prices'){
    chrome.runtime.sendMessage({type:'get-players-prices',ids:event.data.ids}, (response) => {
      document.dispatchEvent(new CustomEvent('set-prices', {'detail': {
        'response': response,'packId':event.data.packId
      }}));
    });
  }
  if(event.data.type && event.data.type=='get-players-prices-watchlist'){
    chrome.runtime.sendMessage({type:'get-players-prices',ids:event.data.ids}, (response) => {
      document.dispatchEvent(new CustomEvent('set-prices-watchlist', {'detail': {
        'response': response
      }}));
    });
  }
  if(event.data.type && event.data.type=='get-players-prices-transferlist'){
    chrome.runtime.sendMessage({type:'get-players-prices',ids:event.data.ids}, (response) => {
      console.log(response)
      document.dispatchEvent(new CustomEvent('set-prices-transferlist', {'detail': {
        'response': response
      }}));
    });
  }
  if(event.data.type && event.data.type=='get-players-prices-unnasigned'){
    chrome.runtime.sendMessage({type:'get-players-prices',ids:event.data.ids}, (response) => {
      console.log(response)
      document.dispatchEvent(new CustomEvent('set-prices-unnasigned', {'detail': {
        'response': response
      }}));
    });
  }
  

})
