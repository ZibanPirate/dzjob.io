import { FC } from "react";
import { Link } from "src/components/link";
import { Stack } from "src/components/stack";
import { Text } from "src/components/text";
import { usePageTitle } from "src/utils/hooks/page-title";
import { Icon } from "src/components/icon";
import { Input } from "src/components/input";
import { Button } from "src/components/button";
import { useSliceSelector } from "src/utils/state/selector";
import { getStateActions } from "src/state";
import { confirmLogin } from "./actions";
import { POST_PAGE_URL } from "src/utils/urls/common";

export const Page: FC = () => {
  usePageTitle("Please confirm your EMail to continue login");

  const { confirmation_code, confirmation_status } = useSliceSelector("confirmLoginPage");
  const { set } = getStateActions().confirmLoginPage;

  const disabledInputs = ["CONFIRMING", "CONFIRMED"].includes(confirmation_status);

  return (
    <Stack orientation="vertical" fullWidth align="center" maxWidth={600} margin="auto">
      {/* Header */}
      <Stack orientation="vertical" margin="1 0 0" stretch={true} align="start">
        <Link variant="v4" back={POST_PAGE_URL} to={"/"} vtName="back">
          <Icon variant="v4" name="back" /> Back
        </Link>
      </Stack>
      <Stack orientation="vertical" align="center" stretch gap="1" padding="3 1">
        <Icon variant="v1" name="success" vtName="login-icon" />
        <Text variant="v3">Confirmation Code sent</Text>

        <Text variant="v4" margin="1 0 2">
          Please check your email inbox and write down the code you received.
        </Text>
        <Input
          width="4em"
          disabled={disabledInputs}
          variant="v3"
          value={confirmation_code}
          setValue={(value) => set({ confirmation_code: value.toUpperCase() })}
          placeholder=""
          vtName="global-search"
        />
        <Stack orientation="vertical" align="center" stretch>
          {["CONFIRMING", "CONFIRMED"].includes(confirmation_status) ? (
            <Icon
              variant="v3"
              name={confirmation_status === "CONFIRMING" ? "loadingSpinner" : "success"}
              animation={confirmation_status === "CONFIRMING" ? "rotate" : undefined}
              margin="3 0"
            />
          ) : (
            <>
              <Text variant="v4" margin="1 0 2">
                {confirmation_status === "ERROR" ? (
                  "Something went wrong, please try again"
                ) : (
                  <br />
                )}
              </Text>
              <Stack orientation="horizontal" align="center" gap="1">
                <Button variant="v3" onClick={() => confirmLogin()} vtName="new-post">
                  Confirm
                </Button>
                <Text variant="v4">or</Text>
                <Link
                  to="#"
                  variant="v4"
                  onClick={() => alert("Stay updated at github.com/algeriastartupjobs")}
                >
                  Send code again
                </Link>
              </Stack>
            </>
          )}
        </Stack>
      </Stack>
      <Text variant="v4" margin="0 1 1">
        Source code is publicly available at&nbsp;
        <Link to="https://github.com/algeriastartupjobs/algeriastartupjobs.com" variant="v4">
          Github
        </Link>
      </Text>
    </Stack>
  );
};
