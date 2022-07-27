
import StockFile from './StockFile';

const Stock = {

  getCurrentLevel: async function(sku: string): Promise<{sku: string, qty: number}> {

    const stock: Array<{sku:string, stock:number}> = await StockFile.readStock()
    const transactions: Array<{sku: string, type: string, qty: number}> = await StockFile.readTransactions();
  
    var currentStockLevel: number = null;
    for (var i = 0; i < stock.length; i++) {
      if (stock[i].sku === sku) {
        currentStockLevel = stock[i].stock;
        break;
      }
    }
  
    for (var j = 0; j < transactions.length; j++) {
      if (transactions[j].sku === sku) {
        if (currentStockLevel === null) {
          // sku was not found in stock.json, but exists in transactions.json
          // we therefore initial currentStockLevel to 0
          currentStockLevel = 0;
        }
  
        if (transactions[j].type === 'order') {
          currentStockLevel = currentStockLevel - transactions[j].qty;
  
        } else if (transactions[j].type === 'refund') {
          currentStockLevel = currentStockLevel + transactions[j].qty;
  
        } else {
          throw('Invalid transaction type found in transactions.json');
  
        }
      }
    }
  
    if (currentStockLevel === null) {
      // sku not found in both stock.json and transactions.json
      throw('Invalid SKU');
  
    } else {
      return {sku: sku, qty: currentStockLevel};
  
    }
  }

};


export default Stock;
