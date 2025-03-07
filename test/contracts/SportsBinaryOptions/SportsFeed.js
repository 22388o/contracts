'use strict';

const { artifacts, contract, web3 } = require('hardhat');
const { toBN } = web3.utils;

const { assert, addSnapshotBeforeRestoreAfterEach } = require('../../utils/common');

const { toBytes32 } = require('../../../index');

const {
	fastForward,
	toUnit,
	currentTime,
	multiplyDecimalRound,
	divideDecimalRound,
} = require('../../utils')();

contract('SportFeed', accounts => {
	const [first, owner] = accounts;

	describe('Test feed', () => {
		it('Parses result properly', async () => {

			let SportFeedContract = artifacts.require('TestSportFeed');
			let feed = await SportFeedContract.new(
				owner,
				'0x56dd6586db0d08c6ce7b2f2805af28616e082455',
				toBytes32('aa34467c0b074fb0888c9f42c449547f'),
				toUnit(1),
				'medals',
				'2016',
				'',
				''
			);
			await feed.setResult('0x5b22555341222c2243484e222c22474252225d00000000000000000000000000', {
				from: owner,
			});
			let stringResult = await feed.resultString();
			let plainResult = await feed.result();
			let firstPlace = await feed.firstPlace();
			let secondPlace = await feed.secondPlace();
			let thirdPlace = await feed.thirdPlace();

			assert.equal(await feed.isCompetitorAtPlace('USA', 1), true);
			assert.equal(await feed.isCompetitorAtPlace('CHN', 2), true);
			assert.equal(await feed.isCompetitorAtPlace('GBR', 3), true);

			assert.equal(await feed.isCompetitorAtPlace('GBR', 1), false);

			let feed2 = await SportFeedContract.new(
				owner,
				'0x56dd6586db0d08c6ce7b2f2805af28616e082455',
				toBytes32('aa34467c0b074fb0888c9f42c449547f'),
				toUnit(1),
				'medals',
				'2016',
				'',
				''
			);
			let SportFeedOracleInstanceContract = artifacts.require('SportFeedOracleInstance');

			await SportFeedOracleInstanceContract.link(await artifacts.require('Integers').new());

			let customOracle = await SportFeedOracleInstanceContract.new(
				owner,
				feed2.address,
				'USA',
				'1',
				'Olympics Medal Count'
			);

			assert.equal(await customOracle.getOutcome(), false);

			await feed2.setResult('0x5b22555341222c2243484e222c22474252225d00000000000000000000000000', {
				from: owner,
			});

			assert.equal(await customOracle.getOutcome(), true);
		});

		it('Parses result properly', async () => {
			let SportFeedContract = artifacts.require('TestSportFeed');
			let feed = await SportFeedContract.new(
				owner,
				'0x56dd6586db0d08c6ce7b2f2805af28616e082455',
				toBytes32('aa34467c0b074fb0888c9f42c449547f'),
				toUnit(1),
				'sports',
				'2016',
				'BK',
				'M'
			);
			await feed.setResult('0x5b22555341222c22535242222c22455350225d00000000000000000000000000', {
				from: owner,
			});
			let stringResult = await feed.resultString();
		});
	});
});
