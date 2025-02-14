import React, { useState } from "react";
import { Box, Text, useApp } from "ink";
import ConfirmInput from "@skorfmann/ink-confirm-input";

interface ConfirmConfig {
  onApprove: () => any;
}

export const Confirm = ({ onApprove }: ConfirmConfig): React.ReactElement => {
  const [value, setValue] = useState("");
  const { exit } = useApp();

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold>Do you want to perform these actions?</Text>
      <Text> CDK for Terraform will perform the actions described above.</Text>
      <Text> 'yes', 'y', 'true', and 1 will be accepted to approve.</Text>

      <Box flexDirection="row" marginTop={1}>
        <Text bold> Enter a value:</Text>
        <ConfirmInput
          value={value}
          onChange={setValue}
          onSubmit={(value: boolean) => {
            if (value) {
              onApprove();
            } else {
              exit();
            }
          }}
        />
      </Box>
    </Box>
  );
};
