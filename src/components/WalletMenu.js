import React, { Fragment, useContext } from "react"
import AppContext from "../AppContext"
import { makeStyles } from "@material-ui/core/styles"
import { Chip, Fab, Icon } from "@material-ui/core"
import { AccountBalanceWalletSharp as AccountBalanceWalletIcon } from "@material-ui/icons"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { formatAddress } from "../helpers/formatting"
import copy from "copy-to-clipboard"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles(theme => ({
	fabIcon: {
		marginRight: theme.spacing(1)
	},
	chipRoot: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.text.main,
		fontWeight: theme.typography.fontWeightBold,
		fontSize: theme.typography.pxToRem(15),
		// To match medium size fab
		height: 40,
		borderRadius: 40 / 2
	},
	chipIcon: {
		marginLeft: 9,
		marginRight: 0,
		width: 26,
		height: 26
	}
}))

export const Wallet = () => {
	const { t } = useTranslation()
	const classes = useStyles()

	const { setConnectWallet, chosenWalletType, addSnack, account } = useContext(
		AppContext
	)

	return (
		<Fragment>
			{!chosenWalletType.name || !account ? (
				<Fab
					id="connect-wallet-btn-topbar"
					onClick={() => setConnectWallet(true)}
					variant="extended"
					color="secondary"
					size="medium"
					disabled={chosenWalletType.name && !account}
				>
					<AccountBalanceWalletIcon className={classes.fabIcon} />
					{t("common.connectWallet")}
				</Fab>
			) : (
				<Chip
					id="wallet-address-top-bar-copy"
					onClick={() => {
						copy(account)
						addSnack(t("messages.addrCopied", { account }), "success")
					}}
					clickable
					classes={{ root: classes.chipRoot, icon: classes.chipIcon }}
					icon={
						account ? (
							<Icon>
								<Jazzicon diameter={26} seed={jsNumberForAddress(account)} />
							</Icon>
						) : null
					}
					label={formatAddress(account)}
				/>
			)}
		</Fragment>
	)
}
