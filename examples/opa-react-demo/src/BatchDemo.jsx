import { useMemo } from "react";
import { useAuthz } from "@styra/opa-react";
import PixelGrid from "react-pixel-grid";

export default function BatchDemo() {
  const data = useAuthz(
    Array.from(Array(50 * 50).keys()).map((i) => ({
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
    <main>
      <PixelGrid
        data={pixels}
        options={{
          size: 20,
          padding: 2,
          background: [0, 0.5, 1],
        }}
      />
    </main>
  );
}
