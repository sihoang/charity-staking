// This provides dispatch helpers
// Some dispatch functions require multiple steps
// in preparation


import axios from 'axios';
import loadContract, { parseStakePayload } from './loadContract';
import {
  findTrstBalance,
  fetchAccountActivities,
} from './actions';

const { BN } = web3.utils;

export const dispatchAccountActivities = (store, account) => {
  loadContract('TimeLockedStaking').getPastEvents('Staked', {
    fromBlock: 0,
    toBlock: 'latest',
    filter: {
      user: account,
    },
  }, (err, events) => {
    const transformed = events.map((event) => {
      const {
        id, blockNumber, transactionHash, returnValues,
      } = event;
      const { amount, data } = returnValues;
      const { ein, lockedUntil } = parseStakePayload(data);
      return {
        id,
        ein,
        amount: new BN(amount).div(new BN(1e6)).toString(),
        lockedUntil,
        blockNumber,
        transactionHash,
      };
    });

    const populatedNPOPromises = transformed.map(async (record) => {
      const res = await axios.get(
        `${CMS_URL}/charities?search=${record.ein}`,
      );
      const npo = res.data && res.data.records && res.data.records[0];
      return {
        ...npo,
        ...record,
      };
    });

    Promise.all(populatedNPOPromises).then((completed) => {
      store.dispatch(fetchAccountActivities(completed));
    });
  });
};

export const dispatchTRSTBalance = (store, account) => {
  loadContract('TRST').methods.balanceOf(account).call()
    .then((trstBalance) => {
      store.dispatch(findTrstBalance(trstBalance));
    });
};
