import React, {useRef, useEffect} from 'react'
import styled from 'styled-components'

const StyledVideo = styled.video`
  height: 140%;
  width: 100%;
  align-items: stretch;
  align-content: stretch;
  z-index: 1
`;

export default function Video(props) {
  const ref = useRef();
  console.log(props);

  useEffect(() => {
      props?.peer?.on("stream", stream => {
          ref.current.srcObject = stream;
          console.log(ref);
      })
  }, [props]);

  return (
      <StyledVideo playsInline autoPlay ref={ref} />
  );
}
