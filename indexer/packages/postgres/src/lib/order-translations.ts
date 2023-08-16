import { logger } from '@dydxprotocol-indexer/base';
import { IndexerOrder, IndexerOrder_ConditionType, IndexerOrder_Side } from '@dydxprotocol-indexer/v4-protos';
import Long from 'long';

import * as OrderTable from '../stores/order-table';
import * as SubaccountTable from '../stores/subaccount-table';
import {
  OrderFromDatabase, OrderSide, PerpetualMarketFromDatabase, SubaccountFromDatabase,
} from '../types';
import { blockTimeFromIsoString } from './helpers';
import { humanToQuantums, priceToSubticks, tifToProtocolOrderTIF } from './protocol-translations';

/**
 * Converts an order from the database to an IndexerOrder proto.
 * This is used to resend open stateful orders to Vulcan during Indexer fast sync
 * to uncross the orderbook.
 *
 * @param order
 */
export async function convertToIndexerOrder(
  order: OrderFromDatabase,
  perpetualMarket: PerpetualMarketFromDatabase,
): Promise<IndexerOrder> {
  const subaccount: SubaccountFromDatabase | undefined = await SubaccountTable.findById(
    order.subaccountId,
  );
  if (!OrderTable.isLongTermOrConditionalOrder(order.orderFlags)) {
    logger.error({
      at: 'protocol-translations#convertToIndexerOrder',
      message: 'Order is not a long-term or conditional order',
      order,
    });
    throw new Error(`Order with flags ${order.orderFlags} is not a long-term or conditional order`);
  }
  if (!subaccount === undefined) {
    logger.error({
      at: 'protocol-translations#convertToIndexerOrder',
      message: 'Subaccount for order not found',
      order,
    });
    throw new Error(`Subaccount for order not found: ${order.subaccountId}`);
  }
  const indexerOrder: IndexerOrder = {
    orderId: {
      subaccountId: {
        owner: subaccount?.address!,
        number: subaccount?.subaccountNumber!,
      },
      clientId: Number(order.clientId),
      clobPairId: Number(order.clobPairId),
      orderFlags: Number(order.orderFlags),
    },
    side: order.side === OrderSide.BUY ? IndexerOrder_Side.SIDE_BUY : IndexerOrder_Side.SIDE_SELL,
    quantums: Long.fromString(humanToQuantums(
      order.size,
      perpetualMarket.atomicResolution,
    ).toFixed()),
    subticks: Long.fromString(priceToSubticks(
      order.price,
      perpetualMarket,
    )),
    goodTilBlockTime: blockTimeFromIsoString(order.goodTilBlockTime!),
    timeInForce: tifToProtocolOrderTIF(order.timeInForce),
    reduceOnly: order.reduceOnly,
    clientMetadata: Number(order.clientMetadata),
    // TODO(IND-319): Derive these fields from the `triggerPrice` of the order.
    conditionType: IndexerOrder_ConditionType.CONDITION_TYPE_UNSPECIFIED,
    conditionalOrderTriggerSubticks: Long.fromValue(0, true),
  };

  return indexerOrder;
}
