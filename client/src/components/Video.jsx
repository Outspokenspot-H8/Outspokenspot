import React, {useRef, useEffect} from 'react'
import styled from 'styled-components'

const StyledVideo = styled.video`
  height: auto;
  position: absolute;
  top: 0;
  z-index: 1;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
`;

export default function Video(props) {
  const ref = useRef();
  
  useEffect(() => {
      props?.peer?.on("stream", stream => {
          ref.current.srcObject = stream;
      })
  }, [props]);

  return (
      <StyledVideo className="img-fluid" playsInline autoPlay ref={ref} />
  );
}
