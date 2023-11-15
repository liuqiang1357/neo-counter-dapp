import { Input } from 'antd';
import { FC, useState } from 'react';
import { Button } from 'app/_shared/Button';
import { useCounterValue, useIncreaseCounterValue } from 'hooks/counter';
import { Networks } from './Networks';
import { Wallets } from './Wallets';

export const Home: FC = () => {
  const [contractHash, setContractHash] = useState('');

  const { data: counterValue } = useCounterValue(contractHash !== '' ? { contractHash } : null);

  const { mutateAsync: increase, isLoading: sending } = useIncreaseCounterValue();

  const handleIncrease = async () => {
    if (contractHash !== '') {
      await increase({ contractHash });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between px-[40px] py-[20px]">
        <h2>Home Page</h2>
        <div className="flex">
          <Wallets />
          <Networks className="ml-[10px]" />
        </div>
      </div>
      <div className="flex w-[600px] flex-col space-y-[20px] px-[40px]">
        <Input
          placeholder="Counter contract hash"
          value={contractHash}
          onChange={event => setContractHash(event.target.value)}
        />
        <div className="flex items-center">
          <div>Counter Value:</div>
          <div className="ml-[10px]">{counterValue}</div>
        </div>
        <Button className="self-start" type="primary" loading={sending} onClick={handleIncrease}>
          Increment
        </Button>
      </div>
    </div>
  );
};
