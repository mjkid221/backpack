import { makeStyles, Button, Typography } from "@material-ui/core";
import { useBlockchainTokenAccount } from "../../../hooks/useBlockchainBalances";
import { RecentActivitySmall } from "./Network/RecentActivity";

const useStyles = makeStyles((theme: any) => ({
  tokenHeaderContainer: {
    marginBottom: "38px",
  },
  balanceContainer: {
    marginTop: "24px",
  },
  tokenHeaderButtonContainer: {
    width: "208px",
    display: "flex",
    justifyContent: "space-between",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "20px",
  },
  headerButton: {
    borderRadius: "12px",
    width: "100px",
    height: "40px",
    backgroundColor: theme.custom.colors.nav,
    "&:hover": {
      backgroundColor: theme.custom.colors.nav,
    },
  },
  headerButtonLabel: {
    color: theme.custom.colors.fontColor,
    fontSize: "14px",
    lineHeight: "24px",
    fontWeight: 500,
    textTransform: "none",
  },
  positivePercent: {
    color: theme.custom.colors.positive,
  },
  negativePercent: {
    color: theme.custom.colors.negative,
  },
  nativeBalanceLabel: {
    color: theme.custom.colors.secondary,
    fontSize: "20px",
    fontWeight: 500,
    textAlign: "center",
    lineHeight: "24px",
  },
  usdBalanceLabel: {
    color: theme.custom.colors.fontColor,
    fontWeight: 500,
    fontSize: "14px",
    textAlign: "center",
    marginTop: "6px",
    lineHeight: "24px",
  },
}));

export function Token({ blockchain, address }: any) {
  return (
    <div>
      <TokenHeader blockchain={blockchain} address={address} />
      <RecentActivitySmall address={address} />
    </div>
  );
}

function TokenHeader({ blockchain, address }: any) {
  const classes = useStyles();
  const token = useBlockchainTokenAccount(blockchain, address);
  const percentClass =
    token.recentPercentChange > 0
      ? classes.positivePercent
      : classes.negativePercent;
  return (
    <div className={classes.tokenHeaderContainer}>
      <div className={classes.balanceContainer}>
        <Typography className={classes.nativeBalanceLabel}>
          {token.nativeBalance.toLocaleString()} {token.ticker}
        </Typography>
        <Typography className={classes.usdBalanceLabel}>
          ${parseFloat(token.usdBalance.toFixed(2)).toLocaleString()}{" "}
          <span className={percentClass}>({token.recentPercentChange}%)</span>
        </Typography>
      </div>
      <div className={classes.tokenHeaderButtonContainer}>
        <Button
          disableElevation
          variant="contained"
          className={classes.headerButton}
          disableRipple
        >
          <Typography className={classes.headerButtonLabel}>Deposit</Typography>
        </Button>
        <Button
          disableElevation
          variant="contained"
          className={classes.headerButton}
          disableRipple
        >
          <Typography className={classes.headerButtonLabel}>Send</Typography>
        </Button>
      </div>
    </div>
  );
}
