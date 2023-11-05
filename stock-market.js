/** @param {NS} ns */
export async function main(ns) {


  // Work in progress, this does nothing at the moment.

    var fees = 100000
    var stocks = ns.getSymbols()
    
    while (true) {
    
    // buy what ?
    for (i = 0; i < stocks.length; i++) {
    let sym = stocks[i]
    if (ns.getForecast(sym) > 0.5) {
        
    }
    let playerMoney = ns.getServerMoneyAvailable("home")
    const shares = Math.min(Math.floor(playerMoney / ns.stock.getAskPrice(newStock)), ns.stock.getMaxShares(newStock));
    ns.buyStock(sym, shares)
    }
    
    
    // sell what ?
    if (ns.getForecast(sym) < 0.3) {
      let symPortfolio = ns.stock.getPosition
      //sell
    ns.sellStock(sym, shares)
    
    }
    
    await ns.stock.nextUpdate() //loop again after update
    }
    
    // rank stocks based on forecast ?
    
    
/*     - Buy the stock with the highest number of upticks (If player has more than $10M in funds).
    If there is a tie between multiple stocks, pick the one with the highest estimated
    volatility (average of absolute values of % change over the last 10 ticks). Buy max shares.
    - Sell a stock if it has 4 or less upticks over the last 10 ticks. Sell max shares.
    - Swap a stock (sell current stock and buy new stock) if you own a stock, and there is
    another stock with at least double the estimated volatility of owned stock and at
    least 7 upticks over last 10 ticks. Buy and sell max # of shares. */
    
}