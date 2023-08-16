import * as SubaccountTable from '../../src/stores/subaccount-table';
import {
  defaultOrderGoodTilBlockTime,
  defaultOrderId,
  defaultPerpetualMarket,
  defaultSubaccount,
} from '../helpers/constants';
import { OrderFromDatabase } from '../../src';
import {
  IndexerOrder, IndexerOrder_ConditionType, IndexerOrder_Side, IndexerOrder_TimeInForce,
} from '@dydxprotocol-indexer/v4-protos';
import { ORDER_FLAG_LONG_TERM } from '@dydxprotocol-indexer/v4-proto-parser';
import Long from 'long';
import { convertToIndexerOrder } from '../../src/lib/order-translations';
import { clearData, migrate, teardown } from '../../src/helpers/db-helpers';

describe('orderTranslations', () => {
  beforeAll(async () => {
    await migrate();
  });

  afterEach(async () => {
    await clearData();
  });

  afterAll(async () => {
    await teardown();
  });

  describe('convertToIndexerOrder', () => {
    it('successfully converts to indexer order', async () => {
      await SubaccountTable.create(defaultSubaccount);
      const order: OrderFromDatabase = {
        ...defaultOrderGoodTilBlockTime,
        id: defaultOrderId,
      };
      const expectedOrder: IndexerOrder = {
        orderId: {
          subaccountId: {
            owner: defaultSubaccount.address,
            number: defaultSubaccount.subaccountNumber,
          },
          clientId: 2,
          clobPairId: 1,
          orderFlags: ORDER_FLAG_LONG_TERM,
        },
        side: IndexerOrder_Side.SIDE_BUY,
        quantums: Long.fromValue(250_000_000_000),  // 25 / 1e-10 = 250_000_000_000
        subticks: Long.fromValue(200_000_000),  // 20_000 * 1e-10 / 1e-6 / 1e-8 = 200_000_000
        goodTilBlockTime: 1674345600,  // 2023-01-22T00:00:00.000Z
        timeInForce: IndexerOrder_TimeInForce.TIME_IN_FORCE_FILL_OR_KILL,
        reduceOnly: false,
        clientMetadata: 0,
        conditionType: IndexerOrder_ConditionType.CONDITION_TYPE_UNSPECIFIED,
        conditionalOrderTriggerSubticks: Long.fromValue(0, true),
      };
      const indexerOrder: IndexerOrder = await convertToIndexerOrder(order, defaultPerpetualMarket);
      expect(indexerOrder).toEqual(expectedOrder);
    });
  });
});
