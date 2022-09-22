window.checkDefPrice = function(item,price){
    console.log('buscando def')
    console.log(item._metaData.id)
    window.checkingPrice = true
    var url = `${services.Authentication.sessionUtas.url}/ut/game/fifa22/transfermarket?num=21&start=0&type=player&rarityIds=${item.rareflag}&maskedDefId=${item._metaData.id}`
    if(price){
       url = url + '&maxb=' + price
    }
    fetch(url, {
        headers: {
        "X-UT-SID": services.Authentication.getUtasSession()["id"]
    }}).then(response => response.json())
    .catch(error => {alert('te puteo el sv'); restartVariables()})
    .then(data => {
        var count = data.auctionInfo.length
        var min = data.auctionInfo.length? arrayMin(data.auctionInfo) : null
        if(!Array.isArray(window.playersPrices[item._metaData.id])){
            window.playersPrices[item._metaData.id] = []
        }
        window.playersPrices[item._metaData.id] =  window.playersPrices[item._metaData.id].concat(data.auctionInfo)
        console.log(window.playersPrices[item._metaData.id])
        if(count==21){
            if(min.buyNowPrice == price){
                var minWithSubtractedPrice = substact(min)
                setTimeout(function(){ window.checkDefPrice(item,minWithSubtractedPrice.buyNowPrice)}, 50);
            } else {
                setTimeout(function(){ window.checkDefPrice(item,min.buyNowPrice)}, 50);
            }
        } else {
            if(window.playersPrices[item._metaData.id].length){
               window.playersPricesMin[item._metaData.id] = arrayMin(window.playersPrices[item._metaData.id])
            }
            processResults()
            restartVariables()
        }
    });
}

function restartVariables(){
    window.playersPrices = {}
    window.playersPricesMin = {}
    window.checkingPrice = false
}

function arrayMin(players) {
  return players.reduce(function (player1, player2) {
    return ( player1.buyNowPrice < player2.buyNowPrice ? player1 : player2 );
  });
}  

function sortPlayers(players){
    return players.sort(function(player1, player2){
        return player1.buyNowPrice - player2.buyNowPrice
    })
}

function substact(price){
  copyOfPrice = Object.assign({}, price);
  if(150<copyOfPrice.buyNowPrice<1100){
    copyOfPrice.buyNowPrice = copyOfPrice.buyNowPrice - 50
  } else if(1100<copyOfPrice.buyNowPrice<10250){
    copyOfPrice.buyNowPrice = copyOfPrice.buyNowPrice - 100    
  } else if(10250<copyOfPrice.buyNowPrice<50500){
    copyOfPrice.buyNowPrice = copyOfPrice.buyNowPrice - 250    
  } else if(50500<copyOfPrice.buyNowPrice<101000){
    copyOfPrice.buyNowPrice = copyOfPrice.buyNowPrice - 500    
  } else {
    copyOfPrice.buyNowPrice = copyOfPrice.buyNowPrice - 1000  
  }
  return copyOfPrice
}


function processResults(){
    UTItemEntityFactory.prototype.auctionFactory = new UTAuctionEntityFactory()
    var o = UTItemEntityFactory.prototype.generateItemsFromAuctionData(Object.values(window.playersPricesMin))
    var string = ''
    o.forEach(function(item){
        string = string  + `${item._staticData.firstName} ${item._staticData.lastName}  (${item.rating}) , ${window.playersPricesMin[item._metaData.id].buyNowPrice}`
        if(window.playersPrices[item._metaData.id].length>1){
            string = string + "," + sortPlayers(window.playersPrices[item._metaData.id])[1].buyNowPrice
        }
        if(window.playersPrices[item._metaData.id].length>2){
            string = string + "," + sortPlayers(window.playersPrices[item._metaData.id])[2].buyNowPrice
        }
        string = string + "\n"
    })
    services.Notification.queue([string, UINotificationType.POSITIVE])
}
