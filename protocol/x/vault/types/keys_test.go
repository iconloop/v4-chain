package types_test

import (
	"testing"

	"github.com/dydxprotocol/v4-chain/protocol/x/vault/types"
	"github.com/stretchr/testify/require"
)

func TestModuleKeys(t *testing.T) {
	require.Equal(t, "vault", types.ModuleName)
	require.Equal(t, "vault", types.StoreKey)
}

func TestStateKeys(t *testing.T) {
	require.Equal(t, "TotalShares", types.TotalSharesKey)
	require.Equal(t, "OwnerShares:", types.OwnerSharesKeyPrefix)
	require.Equal(t, "DefaultQuotingParams", types.DefaultQuotingParamsKey)
	require.Equal(t, "VaultParams:", types.VaultParamsKeyPrefix)
	require.Equal(t, "VaultAddress:", types.VaultAddressKeyPrefix)
	require.Equal(t, "MostRecentClientIds:", types.MostRecentClientIdsKeyPrefix)
}

func TestModuleAccountKeys(t *testing.T) {
	require.Equal(t, "megavault", types.MegavaultAccountName)
}
