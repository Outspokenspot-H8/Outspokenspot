import React, {useRef, useEffect} from 'react'
import styled from 'styled-components'

const StyledVideo = styled.video`
    height: 40%;
    width: 40%;
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
