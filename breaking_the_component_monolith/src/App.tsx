import { useState } from "react";

interface AppProps {
  // Four permutations
  businessName?: string;
  discountRate?: number;
}

function App({ businessName, discountRate }: AppProps) {
  // One branch
  const hasSpecialRate = ["Nandos", "McDonalds"].includes(
    businessName as string,
  );

  let businessRate: number | undefined = undefined;

  // One branch
  if (businessName) {
    // Three branches
    if (businessName === "Nandos") {
      businessRate = 10;
    } else if (businessName === "McDonalds") {
      businessRate = 15;
    } else {
      businessRate = 20;
    }
  }

  const finalRate =
    businessRate && discountRate // Two branches
      ? businessRate - (businessRate! * discountRate) / 100 // One branch
      : businessRate; // One branch

  const [revealOffer, setRevealOffer] = useState(false);
  const toggleOffer = () => setRevealOffer(!revealOffer);

  return (
    <>
      <h1>Business Name</h1>
      <div data-testId="card">{businessName}</div>
      <h2>Business Rate</h2>
      <div data-testId="card">{businessRate}</div>
      <button onClick={toggleOffer}>Reveal Offer</button>
      {revealOffer &&
        hasSpecialRate && ( // Two branches
          <div data-testId="offer">You have a special business offer!</div>
        )}
      <div>{finalRate}</div>
    </>
  );
}

export default App;
