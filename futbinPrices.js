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


window.mostrarPrecioFutbinEnVista = function(price, cell, context, parameter_function = null){
  if(parameter_function){
    var filterValue = parameter_function()
  } else {
    var filterValue = true
  }  
  if(price){  
      console.log(cell)
      var elem = document.getElementById("#futbinPrice-"+cell.data.id);
      if(elem){
          elem.parentElement.removeChild(elem);
      }

      cell.data.futbinPrice = price
      newDiv = document.createElement( "div" );
      newDiv.classList.add('futbinPrice')
      newDiv.id = 'futbinPrice-' + cell.data.id
      newDiv.innerHTML = 'Futbin price: ' + cell.data.futbinPrice + ' (' + window.percentage(parseInt(cell.data.futbinPrice.replace(/,/g, ''), 10),95) + ' tax)'
      newDiv.style.color = 'coral'

      newDivGrid = document.createElement( "div" );
      newDivGrid.classList.add('futbinPriceGrid')
      newDivGrid.id = 'futbinPriceGrid-' + cell.data.id
      newDivGrid.style.display = 'none'
      newDivGrid.style['text-align'] = 'text-align: center'
      newDivGrid.style['background-color'] = '#ffa50082'

      priceGridDiv = document.createElement('div');
      priceGridDiv.classList.add('money')
      priceGridDiv.style.color = 'white'
      priceGridDiv.innerHTML = '' + cell.data.futbinPrice 

      newDivGrid.appendChild(priceGridDiv)


      context.minInput = new UTNumericInputSpinnerControl,
      cell.__entityContainer.childNodes[2].after(context.minInput.getRootElement())
      context.minInput.getRootElement().style.margin='5px'
      context.minInput.init()
      context.minInput.getRootElement().style.display = 'none'
      context.minInput.setValue(parseInt(cell.data.futbinPrice.replace(/,/g, ''), 10))
      context.minInput._currencyInput.decrease()
      context.maxInput = new UTNumericInputSpinnerControl,
      cell.__entityContainer.childNodes[2].after(context.maxInput.getRootElement())
      context.maxInput.getRootElement().style.margin='5px'
      context.maxInput.init()
      context.maxInput.getRootElement().style.display = 'none'
      context.maxInput.setValue(parseInt(cell.data.futbinPrice.replace(/,/g, ''), 10))
      cell.data.futbinBid = context.minInput.getValue()
      cell.data.futbinBuyNow = context.maxInput.getValue()
      if(window.onMarket()){
        cell.data.profit = window.percentage(parseInt(cell.data.futbinPrice.replace(/,/g, ''), 10),95) - cell.data._auction.buyNowPrice,95
        cell.data.profitPercentage = (window.percentage(parseInt(cell.data.futbinPrice.replace(/,/g, ''), 10),95)  / (cell.data._auction.buyNowPrice/100)) - 100 
        profitDiv = document.createElement( "div" );
        profitDiv.classList.add('futbinPrice')
        profitDiv.innerHTML = 'Profit: ' + cell.data.profit.toString() + ' (' + cell.data.profitPercentage.toFixed(2) + '%)'
        if(cell.data.profit>0){
          profitDiv.style.color = '#1bff00'
          cell.__root.style['background-color'] = '#064726'
        } 
        if(!$('#futbinPrice-'+cell.data.id).length && cell.data.profit>0){
          cell.__entityContainer.childNodes[2].after(profitDiv)
        }
      } else { 
        if(cell.data.lastSalePrice && filterValue){
            cell.data.profit = window.percentage(parseInt(cell.data.futbinPrice.replace(/,/g, ''), 10),95) - cell.data.lastSalePrice
            cell.data.profitPercentage = (window.percentage(parseInt(cell.data.futbinPrice.replace(/,/g, ''), 10),95)  / (cell.data.lastSalePrice/100)) - 100 
            profitDiv = document.createElement( "div" );
            profitDiv.classList.add('futbinPrice')
            profitDiv.innerHTML = 'Profit: ' + cell.data.profit.toString() + ' (' + cell.data.profitPercentage.toFixed(2) + '%)'
            if(cell.data.profit>0){
              profitDiv.style.color = '#1bff00'
              cell.__root.style['background-color'] = '#064726'
            } else {
              cell.__root.style['background-color'] = '#470608'
              profitDiv.style.color = '#ff0000' 
            }
            if(!$('#futbinPrice-'+cell.data.id).length){

              cell.__entityContainer.childNodes[2].after(profitDiv)
            }
        }
      }
      if(!$('#futbinPrice-'+cell.data.id).length){
        cell.__root.appendChild(newDivGrid)
        cell.__entityContainer.childNodes[2].after(newDiv)
      }
  }
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
