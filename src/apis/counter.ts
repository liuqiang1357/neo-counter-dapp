import { ensureWalletReady } from 'states/web3';
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
  return result[0].value;
}

export interface IncreaseCounterValueParams {
  networkId: NetworkId;
  contractHash: string;
}

export async function increaseCounterValue(params: IncreaseCounterValueParams): Promise<string> {
  const { connector } = await ensureWalletReady({ networkId: params.networkId });
  const transactionHash = await connector.invoke({
    scriptHash: params.contractHash,
    operation: 'increment',
  });
  return transactionHash;
}
