import { SubaccountId, SubaccountIdSDKType } from "../subaccounts/subaccount";
import * as _m0 from "protobufjs/minimal";
import { DeepPartial, Long } from "../../helpers";
/**
 * PerpetualLiquidationInfo holds information about a liquidation that occurred
 * for a position held by a subaccount.
 * Note this proto is defined to make it easier to hash
 * the metadata of a liquidation, and is never written to state.
 */

export interface PerpetualLiquidationInfo {
  /**
   * The id of the subaccount that got liquidated/deleveraged or was deleveraged
   * onto.
   */
  subaccountId?: SubaccountId;
  /** The id of the perpetual involved. */

  perpetualId: number;
}
/**
 * PerpetualLiquidationInfo holds information about a liquidation that occurred
 * for a position held by a subaccount.
 * Note this proto is defined to make it easier to hash
 * the metadata of a liquidation, and is never written to state.
 */

export interface PerpetualLiquidationInfoSDKType {
  /**
   * The id of the subaccount that got liquidated/deleveraged or was deleveraged
   * onto.
   */
  subaccount_id?: SubaccountIdSDKType;
  /** The id of the perpetual involved. */

  perpetual_id: number;
}
/**
 * SubaccountLiquidationInfo holds liquidation information per-subaccount in the
 * current block.
 */

export interface SubaccountLiquidationInfo {
  /**
   * An unsorted list of unique perpetual IDs that the subaccount has previously
   * liquidated.
   */
  perpetualsLiquidated: number[];
  /**
   * The notional value (in quote quantums, determined by the oracle price) of
   * all positions liquidated for this subaccount.
   */

  notionalLiquidated: Long;
  /**
   * The amount of funds that the insurance fund has lost
   * covering this subaccount.
   */

  quantumsInsuranceLost: Long;
}
/**
 * SubaccountLiquidationInfo holds liquidation information per-subaccount in the
 * current block.
 */

export interface SubaccountLiquidationInfoSDKType {
  /**
   * An unsorted list of unique perpetual IDs that the subaccount has previously
   * liquidated.
   */
  perpetuals_liquidated: number[];
  /**
   * The notional value (in quote quantums, determined by the oracle price) of
   * all positions liquidated for this subaccount.
   */

  notional_liquidated: Long;
  /**
   * The amount of funds that the insurance fund has lost
   * covering this subaccount.
   */

  quantums_insurance_lost: Long;
}

function createBasePerpetualLiquidationInfo(): PerpetualLiquidationInfo {
  return {
    subaccountId: undefined,
    perpetualId: 0
  };
}

export const PerpetualLiquidationInfo = {
  encode(message: PerpetualLiquidationInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.subaccountId !== undefined) {
      SubaccountId.encode(message.subaccountId, writer.uint32(10).fork()).ldelim();
    }

    if (message.perpetualId !== 0) {
      writer.uint32(16).uint32(message.perpetualId);
    }

    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PerpetualLiquidationInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePerpetualLiquidationInfo();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.subaccountId = SubaccountId.decode(reader, reader.uint32());
          break;

        case 2:
          message.perpetualId = reader.uint32();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromPartial(object: DeepPartial<PerpetualLiquidationInfo>): PerpetualLiquidationInfo {
    const message = createBasePerpetualLiquidationInfo();
    message.subaccountId = object.subaccountId !== undefined && object.subaccountId !== null ? SubaccountId.fromPartial(object.subaccountId) : undefined;
    message.perpetualId = object.perpetualId ?? 0;
    return message;
  }

};

function createBaseSubaccountLiquidationInfo(): SubaccountLiquidationInfo {
  return {
    perpetualsLiquidated: [],
    notionalLiquidated: Long.UZERO,
    quantumsInsuranceLost: Long.UZERO
  };
}

export const SubaccountLiquidationInfo = {
  encode(message: SubaccountLiquidationInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();

    for (const v of message.perpetualsLiquidated) {
      writer.uint32(v);
    }

    writer.ldelim();

    if (!message.notionalLiquidated.isZero()) {
      writer.uint32(16).uint64(message.notionalLiquidated);
    }

    if (!message.quantumsInsuranceLost.isZero()) {
      writer.uint32(24).uint64(message.quantumsInsuranceLost);
    }

    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubaccountLiquidationInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubaccountLiquidationInfo();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;

            while (reader.pos < end2) {
              message.perpetualsLiquidated.push(reader.uint32());
            }
          } else {
            message.perpetualsLiquidated.push(reader.uint32());
          }

          break;

        case 2:
          message.notionalLiquidated = (reader.uint64() as Long);
          break;

        case 3:
          message.quantumsInsuranceLost = (reader.uint64() as Long);
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromPartial(object: DeepPartial<SubaccountLiquidationInfo>): SubaccountLiquidationInfo {
    const message = createBaseSubaccountLiquidationInfo();
    message.perpetualsLiquidated = object.perpetualsLiquidated?.map(e => e) || [];
    message.notionalLiquidated = object.notionalLiquidated !== undefined && object.notionalLiquidated !== null ? Long.fromValue(object.notionalLiquidated) : Long.UZERO;
    message.quantumsInsuranceLost = object.quantumsInsuranceLost !== undefined && object.quantumsInsuranceLost !== null ? Long.fromValue(object.quantumsInsuranceLost) : Long.UZERO;
    return message;
  }

};