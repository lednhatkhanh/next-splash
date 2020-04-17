import React from "react";

export const useIntersectionObserver = (element, callback) => {
  const callbackRef = React.useRef(callback);
  const [observer, setObserver] = React.useState(undefined);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const newObserver = new IntersectionObserver((entries) => {
        const [firstEntry] = entries;

        if (firstEntry.isIntersecting && callbackRef.current) {
          callbackRef.current();
        }
      });

      setObserver(newObserver);
    }
  }, []);

  React.useEffect(() => {
    if (element && observer) {
      observer.observe(element);
    }

    return () => {
      if (element && observer) {
        observer.unobserve(element);
      }
    };
  }, [element, observer]);
};
