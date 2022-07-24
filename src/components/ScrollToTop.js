import { useEffect, useState } from "react";
import { BsFillArrowUpCircleFill } from "react-icons/bs";

export default function ScrollToTop() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 50) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      {showButton && (
        <BsFillArrowUpCircleFill
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "30%",
            right: "2px",
            cursor: "pointer",
            color: "grey",
          }}
          size="30px"
        />
      )}
    </>
  );
}
