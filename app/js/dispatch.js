// This provides dispatch helpers
// Some dispatch functions require multiple steps
// in preparation

import assert from 'assert';
import axios from 'axios';
import loadContract, { parseStakePayload } from './loadContract';
import {
  findTrstBalance,
  fetchAccountActivities,
} from './actions';

const { BN } = web3.utils;

export const dispatchAccountActivities = (store, account) => {
  // Get all the Staked events related to the current account
  loadContract('TimeLockedStaking').getPastEvents('Staked', {
    fromBlock: 0,
    toBlock: 'latest',
    filter: {
      user: account,
    },
  }, (err, events) => {
    // Massage the results
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

    // Call CMS to get NPO details
    const populatedNPOPromises = transformed.map(async (record) => {
      let res;
      try {
        // Users can pass in any EIN when they stake.
        // If ein is invalid or not found,
        // just show default name 'Not Found'
        assert(record.ein.length > 0, 'Invalid EIN.');
        res = await axios.get(
          `${CMS_URL}/charities?search=${record.ein}`,
        );
      } catch (e) {
        console.log(e);
      }

      const npo = res && res.data && res.data.records && res.data.records[0];
      return Object.assign({ name: 'Not Found' }, npo, record);
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
