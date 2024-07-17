import { useMemo, useState } from "react";
import { OPAClient } from "@styra/opa";
import { AuthzProvider, useAuthz } from "@styra/opa-react";
import PixelGrid from "react-pixel-grid";
import {
  Code,
  Button,
  Page,
  Text,
  Toggle,
  Spacer,
  Slider,
  Fieldset,
  Card,
  Grid,
} from "@geist-ui/core";

export default function BatchDemo() {
  const [seed, setSeed] = useState(1);
  const [batch, setBatch] = useState(true);
  const [num, setNum] = useState(50 * 50);
  const [sliderNum, setSliderNum] = useState(50 * 50);
  const [opaClient] = useState(() => {
    const href = window.location.toString();
    const u = new URL(href); // TODO(sr): better way?!
    u.pathname = "";
    u.search = "";
    return new OPAClient(u.toString());
  });

  function toggle() {
    setBatch(!batch);
  }

  function reload() {
    setNum(sliderNum * sliderNum);
    setSeed(Math.random());
  }

  return (
    <AuthzProvider opaClient={opaClient} retry={3} batch={batch}>
      <Page>
        <Page.Header h1>
          <Text h1>Batch Demo</Text>
        </Page.Header>
        <Page.Content>
          <Grid.Container gap={2} height="200px">
            <Grid xs={6}>
              <Card width="100%">
                <Fieldset height="100%">
                  <Fieldset.Title>Batching</Fieldset.Title>
                  <Fieldset.Subtitle>
                    Use Batching for aggregate policy evaluations
                  </Fieldset.Subtitle>
                  <Fieldset.Footer>
                    <Toggle auto initialChecked onChange={toggle} />
                  </Fieldset.Footer>
                </Fieldset>
              </Card>
            </Grid>
            <Grid xs={6}>
              <Card width="100%">
                <Fieldset height="100%">
                  <Fieldset.Title>Grid Size</Fieldset.Title>
                  <Fieldset.Subtitle>
                    <Code>x^2</Code>: Number of policy evals
                  </Fieldset.Subtitle>
                  <Fieldset.Footer>
                    <Slider auto max={50} step={10} onChange={setSliderNum} />
                  </Fieldset.Footer>
                </Fieldset>
              </Card>
            </Grid>
            <Grid xs={6}>
              <Card width="100%">
                <Fieldset height="100%">
                  <Fieldset.Title>Reload</Fieldset.Title>
                  <Fieldset.Subtitle>
                    Re-evaluate the pixel grid below
                  </Fieldset.Subtitle>
                  <Fieldset.Footer>
                    <Button auto type="success" font="12px" onClick={reload}>
                      Reload
                    </Button>
                  </Fieldset.Footer>
                </Fieldset>
              </Card>
            </Grid>
          </Grid.Container>
          <Spacer h={3} />
          <DemoPixelGrid num={num} key={seed} />
        </Page.Content>
      </Page>
    </AuthzProvider>
  );
}

function DemoPixelGrid({ num }) {
  const data = useAuthz(
    Array.from(Array(num).keys()).map((i) => ({
      path: "batch/demo",
      input: { i },
      fromResult: (x) => (x ? "#90EF90" : "#FA6B84"),
    })),
  );

  const pixels = useMemo(
    () => data.map((res) => (res.isLoading ? "#FAFB92" : res.result)),
    [data],
  );

  return (
    <PixelGrid
      data={pixels}
      options={{
        size: 20,
        padding: 2,
        background: [0, 0.5, 1],
      }}
    />
  );
}
