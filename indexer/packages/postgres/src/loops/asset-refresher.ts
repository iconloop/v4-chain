import { stats, delay, logger } from '@dydxprotocol-indexer/base';

import config from '../config';
import * as AssetTable from '../stores/asset-table';
import { AssetFromDatabase, AssetsMap } from '../types';

let idToAsset: AssetsMap = {};

/**
 * Refresh loop to cache the list of all assets from the database in-memory.
 */
export async function start(): Promise<void> {
  for (;;) {
    await updateAssets();
    await delay(config.ASSET_REFRESHER_INTERVAL_MS);
  }
}

/**
 * Updates in-memory map of assets.
 */
export async function updateAssets(): Promise<void> {
  const startTime: number = Date.now();
  const assets: AssetFromDatabase[] = await AssetTable.findAll(
    {},
    [],
    { readReplica: true },
  );

  const tmpIdToAsset: Record<string, AssetFromDatabase> = {};
  assets.forEach(
    (asset: AssetFromDatabase) => {
      tmpIdToAsset[asset.id] = asset;
    },
  );

  idToAsset = tmpIdToAsset;
  stats.timing(`${config.SERVICE_NAME}.loops.update_assets`, Date.now() - startTime);
}

/**
 * Gets the perpetual market for a given id.
 */
export function getAssetFromId(id: string): AssetFromDatabase {
  const asset: AssetFromDatabase | undefined = idToAsset[id];
  if (asset === undefined) {
    const message: string = `Unable to find asset with assetId: ${id}`;
    logger.error({
      at: 'asset-refresher#getAssetFromId',
      message,
    });
    throw new Error(message);
  }
  return asset;
}

export function getAssetsMap(): AssetsMap {
  return idToAsset;
}
