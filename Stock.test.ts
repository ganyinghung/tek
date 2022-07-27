
import StockFile from './StockFile';
import Stock from './Stock';
import { assert } from 'chai';
import sinon from 'sinon';

describe('Stock.getCurrentLevel', function() {

  it('can return current stock level correctly', async function() {

    sinon.stub(StockFile, 'readStock').returns([
      { sku: "AAA000000/00/00", stock: 10 },
      { sku: "AAA000000/00/01", stock: 20 }
    ]);

    sinon.stub(StockFile, 'readTransactions').returns([
      { sku: "AAA000000/00/00", type: "order", qty:2 },
      { sku: "AAA000000/00/01", type: "order", qty:2 },
      { sku: "AAA000000/00/01", type: "refund", qty:1 },
      { sku: "AAA000000/00/02", type: "refund", qty:1 }
    ]);

    const stockLevelOf00 = await Stock.getCurrentLevel("AAA000000/00/00");
    assert.deepEqual(stockLevelOf00, {
      sku: "AAA000000/00/00",
      qty: 8  // 10-2
    }, 'Stock level incorrect for stock with orders in transactions');

    const stockLevelOf01 = await Stock.getCurrentLevel("AAA000000/00/01");
    assert.deepEqual(stockLevelOf01, {
      sku: "AAA000000/00/01",
      qty: 19  // 20-2+1
    }, 'Stock level incorrect for stock with both orders and refunds in transactions');

    const stockLevelOf02 = await Stock.getCurrentLevel("AAA000000/00/02");
    assert.deepEqual(stockLevelOf02, {
      sku: "AAA000000/00/02",
      qty: 1  // 0+1
    }, 'Stock level incorrect for stock that only exists in transactions');

  });



})