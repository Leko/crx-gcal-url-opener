import { Alert, Button, Typography } from "@mui/material";
import { useI18n } from "../hooks/useI18n";
import googleSigninDarkNormal from "../images/btn_google_signin_dark_normal_web@2x.png";

type Props = {
  onSignIn: () => void;
};

export function UnauthorizedAlert(props: Props) {
  const { onSignIn } = props;
  const { t } = useI18n();

  return (
    <Alert color="warning">
      <Typography>{t("unAuthorized")}</Typography>
      <Button onClick={onSignIn} variant="text">
        <img
          src={chrome.runtime.getURL(googleSigninDarkNormal)}
          height="48"
          style={{ maxWidth: "100%", marginTop: 8 }}
        />
      </Button>
    </Alert>
  );
}
