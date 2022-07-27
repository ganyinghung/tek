
import { readFile } from 'fs';
import 'dotenv/config';

const StockFile = {

  readStock: async function(): Promise<Array<{sku: string, stock: number}>> {
    const stockJson: string = await readFile(process.env.FILE_STOCK);
    const stock: Array<{sku:string, stock:number}> = JSON.parse(stockJson);
  
    return stock;
  },

  readTransactions: async function(): Promise<Array<{sku: string, type: string, qty: number}>> {
    const transactionsJson: string = await readFile(process.env.FILE_TRANSACTIONS);
    const transactions: Array<{sku: string, type: string, qty: number}> = JSON.parse(transactionsJson);
  
    return transactions;
  }

};

export default StockFile;
