import { Container, Typography } from "@mui/material";
import { URL_PRIVACY_POLICY, PACKAGE_VERSION } from "../constants";
import { useI18n } from "../hooks/useI18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <Container component="footer">
      <Typography variant="body2">
        &copy; {t("author")} | {t("version", [PACKAGE_VERSION])} |{" "}
        <a href={URL_PRIVACY_POLICY} target="_blank" rel="noopener">
          {t("privacyPolicy")}
        </a>
      </Typography>
    </Container>
  );
}
