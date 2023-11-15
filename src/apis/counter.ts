import { Buffer } from 'buffer';
import { BigInteger } from '@cityofzion/neon-core/lib/u';
import { ensureWalletReady } from 'states/web3';
import { addressToScriptHash } from 'utils/convertors';
import { NetworkId } from 'utils/models';
import { invokeRead } from 'utils/web3';

export interface GetCounterValueParams {
  networkId: NetworkId;
  contractHash: string;
}

export async function getCounterValue(params: GetCounterValueParams): Promise<string> {
  const result = await invokeRead<[{ value: string }]>({
    networkId: params.networkId,
    scriptHash: params.contractHash,
    operation: 'getCounter',
  });
  return BigInteger.fromHex(
    Buffer.from(result[0].value, 'base64').toString('hex'),
    true,
  ).toString();
}

export interface IncreaseCounterValueParams {
  networkId: NetworkId;
  contractHash: string;
  address: string;
}

export async function increaseCounterValue(params: IncreaseCounterValueParams): Promise<string> {
  const { connector } = await ensureWalletReady({
    networkId: params.networkId,
    address: params.address,
  });
  const transactionHash = await connector.invoke({
    scriptHash: params.contractHash,
    operation: 'increment',
    args: [],
    signers: [
      {
        account: addressToScriptHash(params.address),
        scopes: 'CalledByEntry',
      },
    ],
  });
  return transactionHash;
}
