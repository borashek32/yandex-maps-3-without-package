// add custon images for mark's icons
// change icon's size depends on zoom
// add custom styles
// add circle around icons

'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import styles from './Maps.module.css';
import { coordinates } from './coordinates';
import { YMapDefaultSchemeLayerProps, YMapLocationRequest, YMapMarkerProps } from '@yandex/ymaps3-types';
import mapStyles from './customization.json';

const API_KEY = '93c14f3b-3a0a-4938-995e-cad28ae42e46';
const source = `https://api-maps.yandex.ru/3.0/?apikey=${API_KEY}&lang=ru_RU`;

export const Maps = () => {
  const mapRef = useRef(null);
  // save all mark's links
  const placemarksRef = useRef([]);
  const [ymapsLoaded, setYmapsLoaded] = useState(false);
  const [zoom, setZoom] = useState(14);
  const [iconSideSize, setIconSideSize] = useState(34);

  // prove icon size is changed depends on zoom
  console.log(zoom, iconSideSize)

  // calculate icon image size
  // depends on zoom, event 'boundschange'
  const countIconSize = (zoom: number) => {
    const baseSize = 30;
    // TODO: count zoom function
    const zoomFactor = 1 + (zoom - 12) * 0.1;
    const maxSize = 120;
    const newIconSideSize = Math.min(baseSize * zoomFactor, maxSize);
    setIconSideSize(newIconSideSize);
  };

  // change zoom and set it
  const onChangeZoom = (ref: any | null) => {
    ref?.events.add('boundschange', () => {
      const newZoom = ref.getZoom();
      setZoom(newZoom);
      countIconSize(newZoom);
    });
  };

  // initialize map
  useEffect(() => {
    async function initMap(): Promise<void> {
      try {
        await ymaps3.ready;

        const LOCATION: YMapLocationRequest = {
            center: [37.623082, 55.75254],
            zoom: 14,
        };
        const { YMap, YMapDefaultSchemeLayer, YMapControls, YMapMarker } = ymaps3;
        const divMap = document.getElementById('map');

        if (divMap) {
          const map = new YMap(divMap, {
              location: LOCATION,
          });
  
          // add custom styles from json file
          map.addChild(new YMapDefaultSchemeLayer({
            // @ts-expect-error
            customization: mapStyles as YMapDefaultSchemeLayerProps,
          }));

          // TODO: doesn't work, there is no zoom control on map
          // add zoom control
          const controls = new YMapControls({
            position: 'bottom left',
            orientation: 'vertical',
          });

          map.addChild(controls);

          // add placemarks
          coordinates.forEach((coord: YMapMarkerProps, index: number) => {
            const placemark = new YMapMarker({
              coordinates: coord.coordinates,
              source: coord.source,
            });
console.log(placemark)
            map.addChild(placemark);
          });
        }
      } catch(e) {
        console.log(e)
      }
  }
  
  initMap();
  }, [ymapsLoaded]);

  return (
    <>
      <Script
        src={source}
        onLoad={() => {
          // if (window.ymaps) {
            setYmapsLoaded(true);
          // } else {
          //   console.error('window.ymaps is not available');
          // }
        }}
        onError={() => console.error('Error loading Yandex Maps script')}
      />

      <h1 className={styles.mapHeader}>MAPS</h1>
      <div className={styles.mapWrapper}>
        <div id="map" className={styles.map}></div>
      </div>
    </>
  );
};
