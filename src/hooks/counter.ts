import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { useSnapshot } from 'valtio';
import {
  getCounterValue,
  GetCounterValueParams,
  increaseCounterValue,
  IncreaseCounterValueParams,
} from 'apis/counter';
import { web3State } from 'states/web3';
import { waitForTransaction } from 'utils/web3';

export function useCounterValue(params: Omit<GetCounterValueParams, 'networkId'> | null) {
  const { networkId } = useSnapshot(web3State);

  return useQuery({
    queryKey: ['CounterValue', { networkId, ...params }],
    queryFn: async () => {
      invariant(params != null);
      return await getCounterValue({ networkId, ...params });
    },
    enabled: params != null,
  });
}

export function useIncreaseCounterValue() {
  const { networkId } = useSnapshot(web3State);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: Omit<IncreaseCounterValueParams, 'networkId'>) => {
      const transactionHash = await increaseCounterValue({ networkId, ...params });
      await waitForTransaction({ networkId, transactionHash });
      await queryClient.invalidateQueries({
        queryKey: ['CounterValue', { networkId, contractHash: params.contractHash }],
      });
    },
  });
}
