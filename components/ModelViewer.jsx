import React, { useEffect, useState } from "react";

import '@google/model-viewer'
import { useWindowSize } from '../hooks/useWindowSize'
import { useDeviceInfo } from '../hooks/useDeviceInfo'



const ModelViewer = ({ src, nft, width = false, height = false }) => {

  const { width: innerWidth, height: innerHeight } = useWindowSize()
  const { isApple } = useDeviceInfo()

  const [isReady, setReady] = useState(false)
  const [srcIOS, setSrcIOS] = useState(null)


  const loaded = () => {
    setReady(true)
  }

  console.log({ nft })
  useEffect(() => {
    if (isApple && nft.meta.ios_model) {
      setSrcIOS(nft.meta.ios_model)
      console.log('IOS device...: ',{isApple, ios_model:nft.meta.ios_model})
    } else {
      console.log('Android device...')
      setSrcIOS(null)
    }
  }, [isApple])

  if (isApple && srcIOS) {
    return (
      <div style={{minHeight: 350 }}>
      <model-viewer
        style={{
          width:
          width >= innerWidth ? innerWidth
          : !width ? innerWidth
          : width,
          //margin: '1em 1em 1em 1em',
          height: height >= innerWidth ? innerHeight : !height ? innerHeight : height
        }}
        src={src}
        //ios-src={srcIOS}
        alt={nft.meta.name}
        skybox-image={nft.meta.bgImg}
        loading="eager" 
        reveal="auto"
        poster={nft.meta.image}
/*         ar
        ar-scale="fixed"  */
        autoplay
        camera-controls
        xr-enviroment
        auto-rotate camera-controls>
          <p style={{position: 'absolute', bottom: '0', right:'1.5rem', zIndex:99, textAlign:'center', fontSize:'1.2rem', fontFamily:'Subjectivity serif'}}>Working on iOS AR</p>
        </model-viewer>
      </div>)
  } else {
    return (
      <div style={{minHeight: 350 }}>
      <model-viewer
        style={{
          width:
          width >= innerWidth ? innerWidth
          : !width ? innerWidth
          : width,
          //margin: '1em 1em 1em 1em',
          height: height >= innerWidth ? innerHeight : !height ? innerHeight : height
        }}
        src={src} alt={nft.meta.name}
        skybox-image={nft.meta.bgImg}
        loading="eager" reveal="auto"
        poster={nft.meta.image}
        autoplay
        ar ar-modes="webxr scene-viewer quick-look"
        xr-enviroment
        auto-rotate camera-controls></model-viewer>
      </div>)
  }

  
}

export default ModelViewer