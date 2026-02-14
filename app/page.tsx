import BullockCartCanvas from "./_components/bullock-cart-canvas";
// 1. Delete the Header import line

export default function Home() {
  return (
    <>
      {/* 2. Remove the <Header /> tag from here */}
      <BullockCartCanvas />
    </>
  );
}