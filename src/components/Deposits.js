import React, { Fragment, useContext, useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
	TableRow,
	TableCell,
	Box,
	Table,
	TableContainer,
	TableHead,
	TableBody,
	SvgIcon
} from "@material-ui/core"
import { DEPOSIT_POOLS } from "../helpers/constants"
import { formatADXPretty } from "../helpers/formatting"
import AppContext from "../AppContext"
import WithDialog from "./WithDialog"
import DepositForm from "./DepositForm"
import { AmountText } from "./cardCommon"
import { DEPOSIT_ACTION_TYPES } from "../actions"
import { ReactComponent as LoyaltyIcon } from "./../resources/loyalty-ic.svg"
import { ReactComponent as TomIcon } from "./../resources/tom-ic.svg"

import { useTranslation } from "react-i18next"

const iconByPoolId = poolId => {
	switch (poolId) {
		case "adex-loyalty-pool":
			return LoyaltyIcon
		case "adex-staking-pool":
			return TomIcon
		default:
			return null
	}
}

const DepositsDialog = WithDialog(DepositForm)

const useStyles = makeStyles(theme => {
	return {
		iconBox: {
			borderRadius: "100%",
			width: 42,
			height: 42,
			backgroundColor: theme.palette.common.white,
			color: theme.palette.background.default,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center"
		}
	}
})

const getStakingPool = ({
	t,
	stats,
	disabledDepositsMsg,
	disabledWithdrawsMsg
}) => {
	const { tomStakingV5PoolStats } = stats

	return {
		poolId: "adex-staking-pool",
		label: t("common.tomStakingPool"),
		balance: (
			<Fragment>
				<Box>
					<AmountText
						text={`${formatADXPretty(
							tomStakingV5PoolStats.balanceShares
						)} ${"shares"}`}
						fontSize={17}
					/>
				</Box>
				<Box>
					<AmountText
						text={`(=${formatADXPretty(
							tomStakingV5PoolStats.currentBalanceADX
						)} ${"ADX"})`}
						fontSize={17}
					/>
				</Box>
			</Fragment>
		),
		allTimeReward: (
			<AmountText
				text={`${formatADXPretty(
					tomStakingV5PoolStats.rewardWithOutstanding
				)} ${"ADX"}`}
				fontSize={17}
			/>
		),
		currentReward: (
			<AmountText
				text={`${formatADXPretty(
					tomStakingV5PoolStats.currentReward
				)} ${"ADX"}`}
				fontSize={17}
			/>
		),
		pendingToUnlockTotalMax: (
			<AmountText
				text={`${formatADXPretty(
					tomStakingV5PoolStats.leavesPendingToUnlockTotalMax
				)} ${"ADX"}`}
				fontSize={17}
			/>
		),
		readyToWithdrawTotalMax: (
			<AmountText
				text={`${formatADXPretty(
					tomStakingV5PoolStats.leavesReadyToWithdrawTotalMax
				)} ${"ADX"}`}
				fontSize={17}
			/>
		),
		actions: [
			<DepositsDialog
				id="staking-pool-tom-deposit-form"
				title={t("common.addNewDeposit")}
				btnLabel={t("common.deposit")}
				color="secondary"
				size="small"
				variant="contained"
				fullWidth
				disabled={!!disabledDepositsMsg}
				tooltipTitle={disabledDepositsMsg}
				depositPool={DEPOSIT_POOLS[1].id}
				actionType={DEPOSIT_ACTION_TYPES.deposit}
			/>,
			<DepositsDialog
				id="staking-pool-tom-leave-form"
				title={t("deposits.withdrawLoPo")}
				btnLabel={t("deposits.leave")}
				color="default"
				size="small"
				variant="contained"
				fullWidth
				disabled={!!disabledWithdrawsMsg}
				depositPool={DEPOSIT_POOLS[1].id}
				tooltipTitle={disabledWithdrawsMsg}
				actionType={DEPOSIT_ACTION_TYPES.unbondCommitment}
			/>,
			<DepositsDialog
				id="staking-pool-tom-withdraw-form"
				title={t("deposits.withdrawLoPo")}
				btnLabel={t("common.withdraw")}
				color="default"
				size="small"
				variant="contained"
				fullWidth
				disabled={!!disabledWithdrawsMsg}
				depositPool={DEPOSIT_POOLS[1].id}
				tooltipTitle={disabledWithdrawsMsg}
				actionType={DEPOSIT_ACTION_TYPES.withdraw}
				userUnbondCommitments={tomStakingV5PoolStats.userLeaves}
			/>
		]
	}
}

const getLoyaltyPoolDeposit = ({
	t,
	stats,
	disabledDepositsMsg,
	disabledWithdrawsMsg
}) => {
	const { loyaltyPoolStats } = stats
	return {
		poolId: "adex-loyalty-pool",
		label: t("common.loPo"),
		balance: (
			<Fragment>
				<Box>
					<AmountText
						text={`${formatADXPretty(
							loyaltyPoolStats.balanceLpToken
						)} ${"ADX-LOYALTY"}`}
						fontSize={17}
					/>
				</Box>
				<Box>
					<AmountText
						text={`(=${formatADXPretty(
							loyaltyPoolStats.balanceLpADX
						)} ${"ADX"})`}
						fontSize={17}
					/>
				</Box>
			</Fragment>
		),
		allTimeReward: loyaltyPoolStats.allTimeRewardADX ? (
			<AmountText
				text={`${formatADXPretty(loyaltyPoolStats.allTimeRewardADX)} ${"ADX"}`}
				fontSize={17}
			/>
		) : (
			t("common.unknown")
		),
		currentReward: t("common.NA"),
		pendingToUnlockTotalMax: t("common.NA"),
		readyToWithdrawTotalMax: t("common.NA"),
		actions: [
			<DepositsDialog
				id="loyalty-pool-deposit-form"
				title={t("common.addNewDeposit")}
				btnLabel={t("common.deposit")}
				color="secondary"
				size="small"
				variant="contained"
				fullWidth
				disabled={!!disabledDepositsMsg}
				tooltipTitle={disabledDepositsMsg}
				depositPool={DEPOSIT_POOLS[0].id}
			/>,
			<DepositsDialog
				id="loyalty-pool-withdraw-form"
				title={t("deposits.withdrawLoPo")}
				btnLabel={t("common.withdraw")}
				color="default"
				size="small"
				variant="contained"
				fullWidth
				disabled={!!disabledWithdrawsMsg}
				depositPool={DEPOSIT_POOLS[0].id}
				tooltipTitle={disabledWithdrawsMsg}
				withdraw
			/>
		]
	}
}

const updateDeposits = (deposits, newDeposit) => {
	const index = deposits.findIndex(x => x.poolId === newDeposit.poolId)
	const newDeposits = [...deposits]

	if (index > -1) {
		newDeposits[index] = newDeposit
	} else {
		newDeposits.push(newDeposit)
	}

	return newDeposits
}

export default function Deposits() {
	const { t } = useTranslation()
	const classes = useStyles()
	const [deposits, setDeposits] = useState([])
	const { stats, chosenWalletType } = useContext(AppContext)
	const { loyaltyPoolStats } = stats

	// TODO: UPDATE if more deposit pools
	const disableDepositsMsg = !chosenWalletType.name
		? t("common.connectWallet")
		: !loyaltyPoolStats.loaded
		? t("common.loadingData")
		: loyaltyPoolStats.poolTotalStaked.gte(loyaltyPoolStats.poolDepositsLimit)
		? t("deposits.depositsLimitReached")
		: ""

	useEffect(() => {
		const { loyaltyPoolStats, tomStakingV5PoolStats } = stats
		let loadedDeposits = [...deposits]
		if (loyaltyPoolStats.loaded) {
			// const disabledDepositsMsg = !chosenWalletType.name ?
			// 	'Connect wallet' :
			// 	(loyaltyPoolStats.poolTotalStaked.gte(loyaltyPoolStats.poolDepositsLimit) ?
			// 		'Pool deposits limit reached' : ''
			// 	)
			const disabledWithdrawsMsg = !chosenWalletType.name
				? t("common.connectWallet")
				: ""

			const loyaltyPoolDeposit = getLoyaltyPoolDeposit({
				t,
				stats,
				disabledDepositsMsg: disableDepositsMsg,
				disabledWithdrawsMsg
			})
			loadedDeposits = updateDeposits(loadedDeposits, loyaltyPoolDeposit)
		}

		if (tomStakingV5PoolStats.loaded) {
			// const disabledDepositsMsg = !chosenWalletType.name ?
			// 	'Connect wallet' :
			// 	(loyaltyPoolStats.poolTotalStaked.gte(loyaltyPoolStats.poolDepositsLimit) ?
			// 		'Pool deposits limit reached' : ''
			// 	)
			const disabledWithdrawsMsg = !chosenWalletType.name
				? t("common.connectWallet")
				: ""

			const stakingPoolDeposit = getStakingPool({
				t,
				stats,
				disabledDepositsMsg: disableDepositsMsg,
				disabledWithdrawsMsg
			})

			loadedDeposits = updateDeposits(loadedDeposits, stakingPoolDeposit)
		}

		setDeposits(loadedDeposits)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stats])

	const renderDepositRow = deposit => {
		const PoolIcon = iconByPoolId(deposit.poolId)
		return (
			<TableRow key={deposit.poolId}>
				<TableCell>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="flex-start"
					>
						{PoolIcon && (
							<Box mr={1}>
								<Box classes={{ root: classes.iconBox }}>
									<SvgIcon fontSize="large" color="inherit">
										<PoolIcon width="100%" height="100%" />
									</SvgIcon>
								</Box>
							</Box>
						)}
						<Box>{deposit.label}</Box>
					</Box>
				</TableCell>
				<TableCell align="right">{deposit.balance}</TableCell>
				<TableCell align="right">{deposit.allTimeReward}</TableCell>
				<TableCell align="right">{deposit.currentReward}</TableCell>
				<TableCell align="right">{deposit.pendingToUnlockTotalMax}</TableCell>
				<TableCell align="right">{deposit.readyToWithdrawTotalMax}</TableCell>
				<TableCell align="center">
					<Box
						display="flex"
						flexDirection="column"
						alignItems="stretch"
						justifyContent="center"
					>
						{deposit.actions.map((action, index) => (
							<Box key={index} my={0.25}>
								{action}
							</Box>
						))}
					</Box>
				</TableCell>
			</TableRow>
		)
	}

	return (
		<Box>
			{/* <Box>
				<DepositsDialog
					id="deposits-table-open-deposit-modal-btn"
					title="Add new deposit"
					btnLabel="New Deposit"
					color="secondary"
					size="large"
					variant="contained"
					disabled={!!disableDepositsMsg}
					tooltipTitle={disableDepositsMsg}
				/>
			</Box> */}
			<Box>
				<TableContainer xs={12}>
					<Table aria-label="Bonds table">
						<TableHead>
							<TableRow>
								<TableCell>{t("common.pool")}</TableCell>
								<TableCell align="right">{t("common.balance")}</TableCell>
								<TableCell align="right">
									{t("deposits.allTimeRewards")}
								</TableCell>
								<TableCell align="right">
									{t("deposits.currentRewards")}
								</TableCell>
								<TableCell align="right">
									{t("deposits.pendingToUnlockTotalMax")}
								</TableCell>
								<TableCell align="right">
									{t("deposits.readyToWithdrawTotalMax")}
								</TableCell>
								<TableCell align="right">{t("common.actions")}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>{[...(deposits || [])].map(renderDepositRow)}</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Box>
	)
}
